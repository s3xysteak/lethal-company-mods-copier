// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::os::windows::process::CommandExt;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn powershell(command: &str) -> Result<String, String> {
  let output = Command::new("powershell")
      .creation_flags(0x08000000) 
      .args(&["-Command", command])
      .output();
  
  match output {
      Ok(output) => return Ok(String::from_utf8_lossy(&output.stdout).to_string()),
      Err(e) => return Err(e.to_string())
  };
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, powershell])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
