# 苏振坤个人学术网站

基于 [Astro](https://astro.build) 的静态网站。不需要服务器、数据库，也不需要备案。

## 本地预览

```bash
npm install      # 第一次运行
npm run dev      # 打开 http://localhost:4321 ，改文件会自动刷新
```

## 日常维护：只改这几个地方

| 想做的事 | 改哪里 |
|---|---|
| 姓名、职位、邮箱、Google Scholar/ORCID 链接、研究兴趣 | `src/data/site.ts` |
| 首页标语 | `src/data/site.ts` 中的 `tagline` / `taglineEn` |
| 首页各板块文案（代表作、关于我、联系） | `src/pages/index.astro` |
| 简介、教育经历 | `src/pages/about.astro` |
| **新增论文** | 在 `src/content/papers/` 复制一个 `.md` 文件改内容 |
| **新增随笔** | 在 `src/content/notes/` 新建 `.md` 文件 |
| 首页三个研究主题卡片 | `src/data/site.ts` 中的 `themes` |
| 个人照片 | 替换 `src/assets/photos/` 下同名文件（构建时自动压缩为 WebP） |
| 插图 | `src/assets/stock/`，来源署名在 `src/data/site.ts` 的 `credits` |
| 颜色、字体、圆角 | `src/styles/global.css` 顶部的变量 |
| 动画与交互 | `src/scripts/interactions.ts`（给元素加 `data-reveal` 即可滚动淡入） |

### 论文文件字段

```yaml
---
title: "论文标题"
titleEn: "English Title"          # 可选
authors: ["宁静波", "苏振坤"]      # 自己的名字会自动加粗
status: published                 # published 期刊论文 / working 工作论文 / thesis 学位论文
venue: "产业经济研究"
year: 2025
date: 2025-09-01                  # 用于排序
issue: "5"                        # 可选，还有 volume、pages
doi: "10.xxxx/xxxx"               # 可选
pdf: "/papers/xxx.pdf"            # 可选：把 PDF 放进 public/papers/
lang: zh                          # zh 用 GB/T 7714 引用格式，en 用 APA
keywords: ["关键词1", "关键词2"]
abstract: "摘要……"
---
```

每篇论文都会自动生成独立页面，包含 Google Scholar 可识别的 `citation_*` 元数据和一键复制的引用格式。

> 放 PDF 前请确认期刊的版权政策：多数期刊只允许公开作者接受稿（accepted manuscript），不允许公开出版社排版的终稿。

## 网址与更新

网站地址：**https://zhenkunsu989699-star.github.io**

修改内容后，在项目目录运行：

```bash
git add . && git commit -m "更新内容"
git push               # 保存源代码到 GitHub
npm run deploy         # 构建并发布网站，1～2 分钟后生效
```

`npm run deploy` 会把构建好的 `dist/` 推送到仓库的 `gh-pages` 分支，GitHub Pages 从该分支提供网站。

如需自定义域名（如 `zhenkunsu.com`），在仓库 Settings → Pages 里填写域名，在域名服务商处添加 CNAME 记录指向 `zhenkunsu989699-star.github.io`，并在 `public/` 下新建内容为该域名的 `CNAME` 文件。
