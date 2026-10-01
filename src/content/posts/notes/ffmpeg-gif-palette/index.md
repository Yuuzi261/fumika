---
title: 使用 FFmpeg 製作高品質 GIF，不再有噪點以及殘影！
published: 2025-04-19
updated: 2026-10-02
description: 以往在用 FFmpeg 轉換圖片或影片為 GIF 的時候，出來的品質總是很難讓我滿意，最近我終於找到原因還有方法了，原來爛的不是工具而是我自己（哭～
image: ""
tags: [CLI Tools, Image Processing]
category: Notes
draft: false
lang: zh_TW
---

# 前言

每次用 FFmpeg 轉換圖片或影片為 GIF 的時候，明明原始圖片或影片品質很高，但經過處理轉出來之後就直接慘掉，不單單是畫質死亡而已，而是多出了一堆不明的噪點或是殘影，但用很多線上的工具卻又可以比較好的轉換，沒道理啊，線上工具都可以了，我大 FFmpeg 哪有做不到的道理，說不定線上工具也是用 FFmpeg 咧！直到最近我才終於知道 FFmpeg 要轉換 GIF 的正確姿勢，原來是少用了調色板～總之就來紀錄一下吧！先上前後對比：

![](https://i.imgur.com/6dMl7Qd.gif)

差異非常明顯（左 - 未使用調色板 / 右 - 使用調色板，[圖源 - KuroTofu :3](https://x.com/Kuro_Tofu/status/1905739431258308845)）

:::note[2026-10-02 更新]
- 發現了可以一步到位的方法
- 補充沒有對圖片進行縮放的乾淨指令
- 優化了加入 Rembg 進階用法的範例
:::

# 為什麼要用調色板？

簡單來說，問題出在 GIF 格式只能使用最多 256 種顏色來顯示圖像（每個影格一個調色板）。而從圖片或影片轉換過來的原始素材，用的顏色肯定不只有這麼少。因此在轉換為 GIF 時，必須進行**色彩量化（Color Quantization）**，也就是從原始的豐富色彩中挑選出「最佳」的 256 種顏色來代表整個畫面。

不使用調色板時，FFmpeg 在處理色彩量化的時候可能會採用比較簡單或逐幀獨立的方式處理你的影像：

1. 簡易處理：為了彌補色彩不足使用**抖色（Dithering）技術**，簡單來說就是透過人眼的錯覺來表現沒有的顏色，就像 Minecraft 的地圖繪一樣，當這些雜點不夠精細就會變成像是噪點的樣子。
2. 逐幀獨立：如果是使用為了每個影格去最優化的逐幀獨立方式，雖然每一個影格拆開來看都更精緻，但組在一起就有可能出現**色彩閃爍（Color Flashing）**，或是類似的顏色在不同影格被量化到不同的調色板索引導致運動中物體邊緣不平滑的過渡造成的**時間不一致性（Temporal Inconsistency）**，也就是所謂的殘影。

所以我們需要透過 `palettegen` 和 `paletteuse` 來生成全域最佳化的調色板並套用到影片或GIF上！

# 影片/GIF 轉 GIF

## 生成調色板

首先透過 `palettegen` 來生成全域最佳化的調色板：

```bash
ffmpeg -i input.mp4 -vf "palettegen" palette.png
```

如果需要指定額外的濾鏡來調整尺寸或影格率（以降低檔案大小），可以參考如下範例：

```bash
ffmpeg -i input.mp4 -filter_complex "[0:v] fps=15,scale=320:-1:flags=lanczos,palettegen" palette.png
```

參數說明：

- `-i input.mp4`：指定要輸入的影片
- `-filter_complex`：使用複雜濾鏡來處理影像，讓我們後面可以接多個濾鏡來處理影像
- `[0:v]`：選擇第一個影像串流
- `fps=15`：設定影片的 FPS 為 15，一般 GIF 這個影格率就能有不錯的效果，自行取捨品質與檔案大小
- `scale=320:-1:flags=lanczos`：縮放到寬度 320，後面的 -1 表示高度自動按比例計算（若需保證高度為偶數亦可設為 -2），並使用 Lanczos 演算法，其他演算法可以參考下面表格
- `palettegen`：生成調色板

:::tip
如果最終輸出的 GIF 打算調低影格率（例如設定為 `fps=15`），**強烈建議在生成調色盤這一步就同步指定相同的 `fps`**！
- **加快處理速度**：對 30/60fps 等較高幀率的影片先抽幀，能大幅減少 `palettegen` 需要統計色彩直方圖的影格總數，處理速度會明顯加快。
- **提升色彩品質**：避免那些後續會被捨棄的影格雜色佔用 256 色調色盤寶貴的名額。
只有在最終 GIF 打算維持原始影格率、完全不抽幀時，此處才不需要指定 `fps`。
:::

| 演算法名稱 | 速度 | 畫質 | 說明/備註 |
| --------- | ---- | ---- | -------- |
| `fast_bilinear` | 最快   | 最低   | 結果模糊，僅在速度是唯一考量時使用           |
| `neighbor`      | 很快   | 最低   | 結果像素化、鋸齒感強，速度極致或特殊藝術效果 |
| `bilinear`      | 適中偏快| 中偏低 | 比 `fast_bilinear` 稍好，仍偏模糊             |
| `bicubic`       | 適中   | 中偏高 | 常用的預設值，速度與畫質平衡點不錯           |
| `area`          | 適中偏快| 中偏高 (縮小) | **推薦用於縮小**，能較好保留細節，放大效果差 |
| `lanczos`       | 慢     | 高     | 通用高品質選擇，結果通常較銳利                 |
| `sinc`          | 慢     | 高     | 與 `lanczos` 相似的高品質選擇，可能略有差異    |
| `spline`        | 慢     | 高     | 另一種高品質選擇，有其獨特視覺風格             |

:::note
選擇困難症就跟我選一樣的：`lanczos`，普遍效果很好
:::

## 套用調色板至 GIF 影像

生成完調色板後，就可以利用 `paletteuse` 來套用調色板：

```bash
ffmpeg -i input.mp4 -i palette.png -filter_complex "[0:v][1:v]paletteuse" output.gif
```

同樣，更多濾鏡的情況範例：

```bash
ffmpeg -i input.mp4 -i palette.png -filter_complex "[0:v]fps=15,scale=320:-1:flags=lanczos[v];[v][1:v]paletteuse" output.gif
```

記得 `-filter_complex` 後面的參數要和上面設定的一樣，`output.gif` 就會是調整好的 GIF 了！至於如果要單純調整 GIF 的大小的話也一樣，把指令中輸入影片的部分改成 GIF 就可以了！

## 一行搞定生成調色盤以及轉換格式

透過 `split` 將圖片流一分為二，一邊做調色盤，另一邊直接套用，就能一鍵完成轉換：

```bash
ffmpeg -i input.mp4 -filter_complex "[0:v]split[a][b];[a]palettegen[p];[b][p]paletteuse" output.gif
```

:::note
這裡稍微拆解一下運行的流程：
1. `[0:v]split[a][b]`：把輸入的影片 `[0:v]` 像分流器一樣複製成完全相同的兩份，分別命名為暫存標籤 `[a]` 和 `[b]`。
2. 把剛剛分流出來的 `[a]` 拿去生成調色盤，並把這個調色盤的結果命名為暫存標籤 `[p]`。
3. 把另一份乾淨的影片 `[b]` 與剛剛熱騰騰生成的調色盤 `[p]` 結合，丟給 paletteuse 處理，最後直接輸出成 `output.gif`。
:::

同樣，更多濾鏡的範例：

```bash
ffmpeg -i input.mp4 -filter_complex "[0:v]fps=15,scale=320:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" output.gif
```

---

# 進階用法：無法直接用於影片/GIF的複雜處理

如果你要對影片/GIF進行一些複雜的處理，而且處理的工具只能處理圖片，比如 [Rembg](https://github.com/danielgatis/rembg) 等工具，那我們可以透過將影片/GIF一張一張拆解成圖片，全部處理過後再轉回影片/GIF！由於 GIF 比較難搞，接下來我就以這張 GIF 為例來說明：

![](1.webp)
[🔗圖源 - 马德里斯基](https://www.bilibili.com/video/BV18NY26wECm/)

## 確認原始的影片/GIF影格率

為了避免組回來後速度跑掉，我們要先確認原本的影格率：

```bash
ffprobe -v error -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 input.gif
```

輸出結果如下：

```
100/3
```

這裡的 `avg_frame_rate` 是平均影格率，`100/3` 就是 100 個影格每 3 秒，先記下這個數字。

## 使用 FFmpeg 切割影片/GIF為圖片

先開一個資料夾放切出來的圖片：

```bash
mkdir frames
```

以上面的 GIF 為例，先切割出圖片：

- GIF：（禁用 CFR 同步，保留原始影格）
    ```bash
    # 現代 FFmpeg 推薦寫法（-vsync 已棄用，改用 -fps_mode）：
    ffmpeg -i input.gif -fps_mode passthrough frames/frame_%04d.png

    # 舊版 FFmpeg 寫法：
    ffmpeg -i input.gif -vsync 0 frames/frame_%04d.png
    ```

    :::note
    這裡加上 `-fps_mode passthrough`（或舊版的 `-vsync 0`）是為了避免 FFmpeg 強制將影格同步為固定幀率（CFR, Constant Frame Rate）而產生重複影格或丟幀，能以直通方式完整保留原始 GIF 的每一張影格。
    :::

- 影片：
    ```bash
    ffmpeg -i input.mp4 frames/frame_%04d.png
    ```

    :::tip
    如果影片/GIF很長，你可能要調整 `%04d` 這個部分，使得有更多的編號空間來當作圖片的檔名，比如 `%05d`。
    :::

## 對圖片進行複雜處理

接下來就能對圖片進行你想要的複雜處理了，我這裡就以 [Rembg](https://github.com/danielgatis/rembg) 為例，將所有圖片進行去背。

### 推薦方式：使用 Rembg 資料夾批次處理

Rembg 原生就提供了資料夾批次處理指令 `p`（Path），只需載入一次 AI 模型就能連續處理整包資料夾，避免逐張處理時每張圖都重新啟動 Python 與加載模型的巨大開銷（每處理一張圖片就要把 AI 模型丟到 GPU 一次會變得非常慢）：

```bash
rembg p -m isnet-anime frames processed_frames
```

:::tip
因為我是用 2D 動漫類型的 GIF，所以我偷偷選擇了 `isnet-anime` 模型來提升去背品質。然後如果你也想安裝 Rembg 來去背的話，你可以參考我以前的[教學](https://blog.yuuzi.cc/posts/guides/conda-rembg-gpu/)
:::

### 備用方案：使用腳本迴圈逐張處理

如果你使用的處理工具沒有內建資料夾批次功能，也可以透過各系統的腳本寫迴圈逐張處理：

Bash 腳本：
```bash
mkdir processed_frames
for f in frames/*.png; do
    rembg i -m isnet-anime "$f" "processed_frames/$(basename "$f")"
done
```

Batch 腳本：
```batch
mkdir processed_frames
for %%f in (frames\*.png) do (
    rembg i -m isnet-anime "%%f" "processed_frames\%%~nxf"
)
```

Powershell 腳本：
```powershell
New-Item -ItemType Directory -Force -Path processed_frames
Get-ChildItem frames\*.png | ForEach-Object {
    $outputFile = Join-Path processed_frames $_.Name
    rembg i -m isnet-anime $_.FullName $outputFile
}
```

## 生成調色板並組合回影片/GIF

到這一步就和前面差不多了，所以我就快速帶過，之前記下來的影格率現在用到了，記得在 `-framerate` 後面填上當初顯示的影格率：

```bash "100/3"
ffmpeg -framerate 100/3 -i processed_frames/frame_%04d.png -vf "palettegen=reserve_transparent=on" palette.png
```

因為我是做了去背的操作，所以我多了一個調色板的設定：`reserve_transparent=on`，將第一個顏色保留給透明度資訊<small>（在 FFmpeg 中此項預設即為開啟，此處顯式寫出方便理解）</small>。接下來將調色板套用並組回影片/GIF：

```bash "100/3"
ffmpeg -framerate 100/3 -i processed_frames/frame_%04d.png -i palette.png -filter_complex "[0:v][1:v] paletteuse=alpha_threshold=128" output.gif
```

這裡同樣因為我做了去背的操作，所以我在調色板加上了 `alpha_threshold=128`，將透明度資訊套用到調色板上（Alpha 值 < 128 的像素被視為完全透明；<small>FFmpeg 預設值也是 128，顯式寫出方便依需要微調透明度容差門檻）</small>。

同樣，一行搞定的版本：

```bash "100/3"
ffmpeg -framerate 100/3 -i processed_frames/frame_%04d.png -filter_complex "[0:v]split[a][b];[a]palettegen=reserve_transparent=on[p];[b][p]paletteuse=alpha_threshold=128" -r 100/3 output.gif
```

下面展示成品：

![](2.webp)

效果非常不錯！這就是完整的流程了，應該足夠詳細了吧！希望能幫助到被 FFmpeg 指令搞到頭昏眼花的人～
