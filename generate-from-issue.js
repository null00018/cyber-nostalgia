const fs = require('fs');
const yaml = require('js-yaml');

const issue = JSON.parse(fs.readFileSync('issue.json', 'utf8'));
const title = issue.title || 'Untitled';
const body = issue.body || '';

// フロントマター抽出
const match = body.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!match) {
  console.error("⛔ フロントマターが見つかりません。形式: ---\\ndate: YYYYMMDD\\n---");
  process.exit(1);
}

const metadata = yaml.load(match[1]);
const content = match[2].trim();
const date = metadata.date || new Date().toISOString().slice(0,10).replace(/-/g, '');

// 次のポスト番号
const files = fs.readdirSync('.');
const postFiles = files.filter(f => /^post\d+\.html$/.test(f));
const nextIndex = postFiles
  .map(f => parseInt(f.match(/^post(\d+)\.html$/)[1]))
  .reduce((max, num) => Math.max(max, num), 0) + 1;
const postNumber = String(nextIndex).padStart(2, '0');

// HTML生成
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
${content.replace(/\n/g, '<br>')}
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

fs.writeFileSync(`post${nextIndex}.html`, html);
console.log(`✅ post${nextIndex}.html を生成しました`);
