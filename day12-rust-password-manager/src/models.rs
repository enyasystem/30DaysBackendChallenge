use serde::{Deserialize, Serialize};
use chrono::{Utc};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Entry {
    pub name: String,
    pub username: Option<String>,
    pub password: String,
    pub notes: Option<String>,
    pub created_at: String,
}

impl Entry {
    pub fn new(name: &str, username: Option<&str>, password: &str, notes: Option<&str>) -> Self {
        Self {
            name: name.to_string(),
            username: username.map(|s| s.to_string()),
            password: password.to_string(),
            notes: notes.map(|s| s.to_string()),
            created_at: Utc::now().to_rfc3339(),
        }
    }
}
