import { Command } from '@tauri-apps/plugin-shell'
import { readTextFile } from '@tauri-apps/plugin-fs'
import { parse } from '@node-steam/vdf'

export function command(cmd: string) {
  return new Promise<string[]>((resolve) => {
    const result: string[] = []

    const command = Command.create('powershell', cmd.split(' '))
    command.stdout.on('data', (res) => {
      result.push(res)
    })
    command.on('close', () => {
      resolve(result)
    })

    command.spawn()
  })
}

export async function getSteamDirectory() {
  const steamInstallDirectoryQuery
    = 'Get-ItemProperty -Path HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam -Name "InstallPath"'

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
