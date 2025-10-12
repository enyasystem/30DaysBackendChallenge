use std::collections::BTreeMap;
use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use crate::crypto::{encrypt_blob, decrypt_blob};
use crate::models::Entry;

#[derive(Serialize, Deserialize, Default)]
pub struct Vault {
    pub entries: BTreeMap<String, Entry>,
}

impl Vault {
    pub fn new() -> Self { Self { entries: BTreeMap::new() } }

    pub fn data_path() -> PathBuf {
        let mut p = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("."));
        p.push("pwm");
        fs::create_dir_all(&p).ok();
        p.push("vault.json.enc");
        p
    }

    pub fn save_encrypted(&self, password: &str) -> Result<(), String> {
        let j = serde_json::to_vec(self).map_err(|e| e.to_string())?;
        let payload = encrypt_blob(password, &j)?;
        fs::write(Self::data_path(), payload.as_bytes()).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn load_encrypted(password: &str) -> Result<Self, String> {
        let path = Self::data_path();
        if !path.exists() {
            return Ok(Self::new());
        }
        let payload = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let plain = decrypt_blob(password, &payload)?;
        let v: Vault = serde_json::from_slice(&plain).map_err(|e| e.to_string())?;
        Ok(v)
    }
}
