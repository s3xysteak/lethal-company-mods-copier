import {
  copyFile,
  exists,
  mkdir,
  readDir,
  remove,
  stat,
} from '@tauri-apps/plugin-fs'
import { join } from 'pathe'

export async function getFilesName(path = './') {
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

  let counts = 0

  if (isDir) {
    isExist && (await remove(dest, { recursive: true }))

    await mkdir(dest)
    const files = await readDir(from)

    for (const file of files) {
      if (file.isDirectory) {
        const { counts: v } = await copyFiles(join(from, file.name), join(dest, file.name))
        counts += v
      }
      else {
        await copyFile(join(from, file.name), join(dest, file.name))
        counts++
      }
    }
  }
  else {
    isExist && (await remove(dest))

    await copyFile(from, dest)
    counts++
  }

  return {
    counts,
  }
}
