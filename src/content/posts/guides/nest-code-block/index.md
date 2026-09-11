---
title: 教你如何在 Markdown 中用 Code Blocks 語法包住 Code Blocks 語法（套娃）
published: 2025-08-31
description: 不要問我為什麼要做這種事，剛好有人在問特殊的 Code Blocks 配置，我才好奇有沒有辦法可以這樣展示
image: ''
tags: [Markdown, Github]
category: 'Guides'
draft: false 
lang: zh_TW
---

## 前言

事情是這樣的，我無聊在逛 [Fuwari](https://github.com/saicaca/fuwari) 的 [issue](https://github.com/saicaca/fuwari/issues/613)，剛好看到有人在問 Fuwari 的 Code Blocks 有沒有辦法不摺疊程式碼（當超過一行的時候），以前 Fuwari 跟 GitHub 一樣太長的話就會讓 Code Blocks 區塊可以左右滾動，不過近期更新後預設就變成會摺疊程式碼了，但依然保留了方法回到原本的不摺疊，這個時候我就要展示給提問者看語法怎麼打對吧？但 GitHub 也支援 Markdown 語法，如果我直接打出來會被解析成 Code Blocks 區塊，對方就看不到語法了，那怎麼辦？多包一層可行嗎？答案是可以，但不是直接包。

## 直接包會怎麼樣？

如果直接在 Code Blocks 區塊外面再包 Code Blocks 區塊，他們不會 1-4 配對然後框住 2-3，通常會出現這種狀況：

### 內部 Code Blocks 無指定語言

如果內部沒有指定語言的話，一般會被解析成兩個空的 Code Blocks 區塊

```
```
print('Ciallo～(∠・ω< )⌒☆')
```
```

### 內部 Code Blocks 有指定語言

這種情況 GitHub 和 Fuwari（本 Blog 模板） 有著相似的行為，因為第二組語法失效的緣故會 1-3 配對，然後第四組成為孤兒，變成沒有包起來的 Code Blocks 區塊

```
```py
print('Ciallo～(∠・ω< )⌒☆')
```
```
我必須補上第五組來完成 Code Blocks 不然我之後打的內容都會被算在 Code Blocks 區塊裡了 <-- 像這樣
```

我在上面提到的 issue 中遇到的狀況就是第二種，因為我要展示特殊的 Code Blocks 語法所以會在第二組上添加額外的資訊，導致出現上面第二種的狀況，那到底怎麼在 Code Blocks 區塊內展示 Code Blocks 語法呢？

## 解法

在這之前我還是得說每個 Markdown 解析不一定一樣，許多服務也有很多自定義的擴充、閹割語法，但我現在要講的方法應該是個通解，雖然不一定 100% 有效，但至少大部分應該都會支援（吧？

總之要在 Code Blocks 中玩套娃的方法就是：

**「 用更多的點包起來 」**

沒錯，你只要在外層用 4 個點來表示 Code Blocks，那 GitHub 就會知道要把 1-4 配對，而不是 1-2 配對或 1-3 配對（找最近的），就像這樣：

````
```py
print('Ciallo～(∠・ω< )⌒☆')
```
````

成功包起來了，同理要再套一層就要變成 5 個點：

`````
````
```py
print('Ciallo～(∠・ω< )⌒☆')
```
````
`````

恭喜你學會 Markdown 版的俄羅斯娃娃了ww，我是今天才知道這件事，可能算是一種已知用火吧，如果你也跟我一樣遇到了這種奇葩問題，那麼希望這篇文章能解答你的疑惑！
