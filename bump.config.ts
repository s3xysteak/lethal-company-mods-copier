import { defineConfig } from 'bumpp'
import tauri from 'tauri-version'

export default defineConfig({
  files: [
    /** default */
    'package.json',
    'package-lock.json',
    'jsr.json',
    'jsr.jsonc',
    'deno.json',
    'deno.jsonc',
    /** for tauri */
    'src-tauri/tauri.conf.json',
    'src-tauri/Cargo.toml',
    'src-tauri/Cargo.lock',
  ],
  execute: tauri(),
})
