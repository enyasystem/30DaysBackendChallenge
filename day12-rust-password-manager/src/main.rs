mod crypto;
mod vault;
mod models;

use clap::{Parser, Subcommand};
use rpassword::read_password;
use std::process;
use crate::vault::Vault;
use crate::models::Entry;

#[derive(Parser)]
#[command(name = "pwm")]
#[command(about = "Simple password manager demo", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Init,
    Add { name: String, username: Option<String>, password: Option<String>, notes: Option<String> },
    Get { name: String },
    List,
    Rm { name: String },
}

fn prompt_password(prompt: &str) -> String {
    println!("{}", prompt);
    read_password().unwrap_or_default()
}

fn main() {
    let cli = Cli::parse();
    match &cli.command {
        Commands::Init => {
            let pw = prompt_password("Set master password:");
            let v = Vault::new();
            if let Err(e) = v.save_encrypted(&pw) {
                eprintln!("error: {}", e);
                process::exit(1);
            }
            println!("vault initialized at {}", Vault::data_path().display());
        }
        Commands::Add { name, username, password, notes } => {
            let pw = prompt_password("Master password:");
            match Vault::load_encrypted(&pw) {
                Ok(mut v) => {
                    let entry_password = match password {
                        Some(p) => p.clone(),
                        None => { println!("Enter entry password:"); read_password().unwrap_or_default() }
                    };
                    let e = Entry::new(&name, username.as_deref(), &entry_password, notes.as_deref());
                    v.entries.insert(name.clone(), e);
                    if let Err(e) = v.save_encrypted(&pw) { eprintln!("error: {}", e); process::exit(1); }
                    println!("added {}", name);
                }
                Err(e) => { eprintln!("error: {}", e); process::exit(1); }
            }
        }
        Commands::Get { name } => {
            let pw = prompt_password("Master password:");
            match Vault::load_encrypted(&pw) {
                Ok(v) => {
                    if let Some(e) = v.entries.get(name.as_str()) {
                        println!("{}", serde_json::to_string_pretty(e).unwrap());
                    } else { eprintln!("not found"); process::exit(2); }
                }
                Err(e) => { eprintln!("error: {}", e); process::exit(1); }
            }
        }
        Commands::List => {
            let pw = prompt_password("Master password:");
            match Vault::load_encrypted(&pw) {
                Ok(v) => {
                    for (k, _v) in &v.entries { println!("{}", k); }
                }
                Err(e) => { eprintln!("error: {}", e); process::exit(1); }
            }
        }
        Commands::Rm { name } => {
            let pw = prompt_password("Master password:");
            match Vault::load_encrypted(&pw) {
                Ok(mut v) => {
                    if v.entries.remove(name.as_str()).is_some() {
                        if let Err(e) = v.save_encrypted(&pw) {
                            eprintln!("error: {}", e);
                            process::exit(1);
                        }
                        println!("removed {}", name);
                    } else {
                        eprintln!("not found");
                        process::exit(2);
                    }
                }
                Err(e) => {
                    eprintln!("error: {}", e);
                    process::exit(1);
                }
            }
        }
    }
}