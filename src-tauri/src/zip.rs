use std::{fs::File, path::Path};
use zip::ZipArchive;

#[tauri::command]
pub fn unzip(zip_path: &str, dest_dir: &str) -> Result<(), String> {
    let zip_file = File::open(zip_path).map_err(|err| err.to_string())?;

    ZipArchive::new(zip_file)
        .map_err(|err| err.to_string())?
        .extract(Path::new(dest_dir))
        .map_err(|err| err.to_string())?;

    Ok(())
}
