import { readTextFile } from '@tauri-apps/plugin-fs'
import { parse } from '@node-steam/vdf'
import { invoke } from '@tauri-apps/api/core'

export async function powershell(cmd: string) {
  return invoke<string>('powershell', { command: cmd })
}

export async function getSteamDirectory() {
  const steamInstallDirectoryQuery
    = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"'

  try {
    const res = await powershell(steamInstallDirectoryQuery)
    let index = res.indexOf('InstallPath')
    if (index !== -1)
      index = res.indexOf(':', index) + 1
    else
      throw new Error('Steam not found')

    const startIndex = index
    const endIndex = res.indexOf('\r\n', index)
    const InstallPath = res.substring(startIndex, endIndex).trim()

    return InstallPath
  }
  catch (e) {
    throw new Error(`Failed to get the Steam directory${String(e)}`)
  }
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
      `${steamPath}\\steamapps\\libraryfolders.vdf`,
    )

    let path = ''
    Object.values(parse(contents).libraryfolders as LibraryFolders).some(
      (item) => {
        if (!Object.keys(item.apps).includes(gameCode))
          return false
        path = item.path.replace(/\\\\/g, '\\')
        return true
      },
    )

    return path
  }
  const basePath = await getGameBasePath()

  const getInstallDir = async () => {
    const contents = await readTextFile(
      `${basePath}\\steamapps\\appmanifest_${gameCode}.acf`,
    )

    const appManifest: AppManifest = parse(contents).AppState
    return appManifest.installdir
  }
  const installDir = await getInstallDir()

  return `${basePath}\\steamapps\\common\\${installDir}`
}
