---
title: 永久免費啟用 Windows 的方法，一鍵啟用！
published: 2024-09-08
description: 我...我只是要給虛擬機用而已，自己的主機有乖乖買正版喔，微軟把拔高抬貴手
image: ""
tags: [CLI Tools, Windows]
category: Guides
draft: false
lang: zh_TW
---

## 前言

在 Github 上看到開源的啟用 Windows 工具，趕緊打開虛擬機試試，去掉討人厭的浮水印，這也是為了日後教學截圖品質的考量（被打。對不起了微軟把拔，但連虛擬機也用正版的話有點負擔不起 QwQ...

## 啟用 Windows

這個工具關聯到了 3 個 Github 儲存庫，不過最有關係的應該就是下面這個，但其實也不太重要，主要是進到[這個網站](https://massgrave.dev/)照著教學走就對了，下面附上圖文教學。

::github{repo="massgravel/massgrave.dev"}

1. 打開 `Powershell`，不是 `CMD` 要特別注意
2. 複製並貼上下面這行指令並執行

```bash
irm https://get.activated.win | iex
```

3. 接下來等它一下就會跳出這個介面
   ![](1.png)
4. 選擇你要啟用的方式，按下對應的按鍵，我這裡就選擇第一個，出現下面這個畫面就是成功囉
   ![](2.png)
5. 接下來按任何按鍵回到本來的頁面，之後按 <kbd>5</kbd> 確認一下啟用的狀態，確認啟用後按 <kbd>0</kbd> 關閉視窗
6. 重新啟動電腦應該就可以看到 Windows 已經啟用囉
   ![](3.png)
