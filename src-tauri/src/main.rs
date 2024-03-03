// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn is_dir(path: &str) -> Result<bool, String> {
    if let Ok(metadata) = fs::metadata(path) {
        Ok(metadata.is_dir())
    } else {
        Err("is_dir throw a error. Invalid path or cannot find path.".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![is_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
