import { Command } from '@tauri-apps/api/shell'
import {
  readTextFile,
  readDir,
  copyFile,
  createDir,
  exists,
  removeDir,
  removeFile
} from '@tauri-apps/api/fs'
import { parse } from '@node-steam/vdf'
import { invoke } from '@tauri-apps/api/tauri'

export async function isDirectory(path: string) {
  const res = await invoke('is_dir', { path })
  return res as boolean | string
}

export async function copyFiles(from: string, dest: string) {
  const isDir = await isDirectory(from)
  const isExist = await exists(dest)
  if (isDir) {
    isExist && (await removeDir(dest, { recursive: true }))

    await createDir(dest)
    const files = await readDir(from)

    for (const file of files) {
      if (file.children) {
        await copyFiles(file.path, dest + '\\' + file.name)
      } else {
        await copyFile(file.path, dest + '\\' + file.name)
      }
    }
  } else {
    isExist && (await removeFile(dest))
    await copyFile(from, dest)
  }
}

export function command(cmd: string) {
  return new Promise<string[]>(resolve => {
    const result: string[] = []

    const command = new Command('powershell', cmd.split(' '))
    command.stdout.on('data', res => {
      result.push(res)
    })
    command.on('close', () => {
      resolve(result)
    })

    command.spawn()
  })
}

export async function getSteamDirectory() {
  const steamInstallDirectoryQuery =
    'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"'

  const res = await command(steamInstallDirectoryQuery)
  const InstallPath = res.find(item => item.startsWith('InstallPath'))

  if (InstallPath === undefined)
    throw new Error('Failed to get the Steam directory')

  return InstallPath && InstallPath.slice(InstallPath.indexOf(':') + 1).trim()
}

interface LibraryFoldersItem {
  path: string
  apps: Record<string, number>
  [key: string]: any
}
type LibraryFolders = Record<string, LibraryFoldersItem>

interface AppManifest {
  name: string
  installdir: string
  [key: string]: any
}

export async function getGamePath(gameCode: string) {
  const steamPath = await getSteamDirectory()

  const getGameBasePath = async () => {
    const contents = await readTextFile(
      steamPath + '\\steamapps\\libraryfolders.vdf'
    )

    let path = ''
    Object.values(parse(contents)['libraryfolders'] as LibraryFolders).some(
      item => {
        if (!Object.keys(item.apps).includes(gameCode)) return false
        path = item.path.replace(/\\\\/g, '\\')
        return true
      }
    )

    return path
  }
  const basePath = await getGameBasePath()

  const getInstallDir = async () => {
    const contents = await readTextFile(
      basePath + `\\steamapps\\appmanifest_${gameCode}.acf`
    )

    const appManifest: AppManifest = parse(contents)['AppState']
    return appManifest.installdir
  }
  const installDir = await getInstallDir()

  return basePath + '\\steamapps\\common\\' + installDir
}

export async function getCurrentDirFilesNameList() {
  const res = await readDir('.\\')
  return res
    .map(item => item.name)
    .filter(item => item !== undefined || item !== null) as string[]
}
