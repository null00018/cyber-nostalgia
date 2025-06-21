const fs = require('fs');
const path = require('path');

// --- ペイロード読み込み ---
const payload = JSON.parse(fs.readFileSync('payload.json', 'utf8'));

const { title, date, body } = payload;
if (!title || !date || !body) {
  console.error("⛔ title, date, body がすべて必要です");
  process.exit(1);
}

// --- 次の post 番号を取得 ---
const files = fs.readdirSync('.');
const postFiles = files.filter(f => /^post\d+\.html$/.test(f));
const nextIndex = postFiles
  .map(f => parseInt(f.match(/^post(\d+)\.html$/)[1]))
  .reduce((max, num) => Math.max(max, num), 0) + 1;
const postNumber = String(nextIndex).padStart(2, '0');

// --- HTML生成 ---
const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Loading...</title>
  <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Press+Start+2P&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div class="container">
    <article>
      <h2 class="title"><a class="neon" href="#">＞＞ #${postNumber} ${title}</a></h2>
      <p class="meta">${date}</p>
      <div class="article-body">
${body.replace(/\n/g, '\n<br>')}
      </div>
      <p class="neon"><a href="index.html">←START</a></p>
    </article>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const heading = document.querySelector("h2.title");
      if (heading) {
        const cleanTitle = heading.textContent.replace(/^＞＞\\s*/, '').trim();
        document.title = cleanTitle;
      }
    });
  </script>
</body>
</html>`;

// --- ファイル保存 ---
const filename = `post${nextIndex}.html`;
fs.writeFileSync(filename, html);
console.log(`✅ Generated ${filename}`);
