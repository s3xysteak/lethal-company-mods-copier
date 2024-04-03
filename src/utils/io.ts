import {
  copyFile,
  exists,
  mkdir,
  readDir,
  remove,
  stat,
} from '@tauri-apps/plugin-fs'

export async function getFilesName(path = '.\\') {
  const res = await readDir(path)
  return res
    .map(item => item.name)
    .filter(item => item !== undefined || item !== null) as string[]
}

export async function isDirectory(path: string) {
  const res = await stat(path)
  return res.isDirectory
}

export async function copyFiles(from: string, dest: string) {
  const isDir = await isDirectory(from)
  const isExist = await exists(dest)

  if (isDir) {
    isExist && (await remove(dest, { recursive: true }))

    await mkdir(dest)
    const files = await readDir(from)

    for (const file of files) {
      if (file.isDirectory)
        await copyFiles(`${from}\\${file.name}`, `${dest}\\${file.name}`)
      else
        await copyFile(`${from}\\${file.name}`, `${dest}\\${file.name}`)
    }
  }
  else {
    isExist && (await remove(dest))
    await copyFile(from, dest)
  }
}
