# Lethal Company Mods Copier

[English](./README.md) | 简体中文

没有在 mac 与 linux 上测试。作为开发者，我猜这个程序只能在 Windows 上运行。

## :warning:注意事项

程序会对文件进行复制，因此你不应该运行可疑来源的程序。确保这个程序来源于本仓库的 release，这是唯一的官方途径。如果你是 mod 包的使用者，确保 mod 包来自你所信任的来源。

## 使用

- 在 release 中下载编译后的 exe 文件。
- 准备好你的 mod 包。
- 确保你已经安装好致命公司。
- 将编译后的文件放入 mod 包同一目录下，完成后的目录看起来应该像这样：

```
- Mod 包
  - _state
  - BepInEx
  - doorstop_config.ini
  - mods.yml
  - winhttp.dll
  - lethal-company-mods-copier.exe // 在这里！
```

- 运行`lethal-company-mods-copier.exe`，点击按钮等待完成，完成后可以直接关闭程序。

## 功能

这个程序会将同一目录下的 mod 文件与文件夹复制进致命公司的游戏目录，这适用于使用`r2modman`制作 mod 包后，给懒得装`r2modman`的小伙伴分发与方便安装。

## 技术栈介绍

使用`tauri`完成制作。
