use argon2::Argon2;
use rand::rngs::OsRng;
use rand::RngCore;
use aes_gcm::{Aes256Gcm, Nonce};
use aes_gcm::aead::{Aead, KeyInit};
use base64::{engine::general_purpose, Engine as _};
use serde_json;

pub fn derive_key(password: &str, salt: &[u8], out: &mut [u8]) -> Result<(), String> {
    let argon2 = Argon2::default();
    // use argon2 to produce a key
    argon2.hash_password_into(password.as_bytes(), salt, out)
        .map_err(|e| format!("argon2 error: {}", e))?;
    Ok(())
}

pub fn encrypt_blob(password: &str, plaintext: &[u8]) -> Result<String, String> {
    // generate salt and nonce
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);
    let mut key = [0u8; 32];
    derive_key(password, &salt, &mut key)?;

    let cipher = Aes256Gcm::new_from_slice(&key).map_err(|e| format!("cipher init: {:?}", e))?;
    let mut nonce = [0u8; 12];
    OsRng.fill_bytes(&mut nonce);
    let ciphertext = cipher.encrypt(Nonce::from_slice(&nonce), plaintext)
        .map_err(|e| format!("encrypt error: {}", e))?;

    let payload = serde_json::json!({
        "salt": general_purpose::STANDARD.encode(&salt),
        "nonce": general_purpose::STANDARD.encode(&nonce),
        "ciphertext": general_purpose::STANDARD.encode(&ciphertext),
    });
    Ok(payload.to_string())
}

pub fn decrypt_blob(password: &str, payload: &str) -> Result<Vec<u8>, String> {
    let v: serde_json::Value = serde_json::from_str(payload).map_err(|e| format!("json: {}", e))?;
    let salt_b64 = v.get("salt").and_then(|s| s.as_str()).ok_or("missing salt")?;
    let nonce_b64 = v.get("nonce").and_then(|s| s.as_str()).ok_or("missing nonce")?;
    let ct_b64 = v.get("ciphertext").and_then(|s| s.as_str()).ok_or("missing ciphertext")?;

    let salt = general_purpose::STANDARD.decode(salt_b64).map_err(|e| format!("b64: {}", e))?;
    let nonce = general_purpose::STANDARD.decode(nonce_b64).map_err(|e| format!("b64: {}", e))?;
    let ciphertext = general_purpose::STANDARD.decode(ct_b64).map_err(|e| format!("b64: {}", e))?;

    let mut key = [0u8; 32];
    derive_key(password, &salt, &mut key)?;
    let cipher = Aes256Gcm::new_from_slice(&key).map_err(|e| format!("cipher init: {:?}", e))?;
    let plaintext = cipher.decrypt(Nonce::from_slice(&nonce), ciphertext.as_ref())
        .map_err(|e| format!("decrypt error: {}", e))?;
    Ok(plaintext)
}
