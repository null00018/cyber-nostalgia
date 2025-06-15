const fs = require("fs");

const files = fs.readdirSync(".").filter(f => /^post\d+\.html$/.test(f));

const posts = files.map(filename => {
  const html = fs.readFileSync(filename, "utf8");

  const titleMatch = html.match(/<h2[^>]*><a[^>]*>＞＞\s*(.*?)<\/a><\/h2>/);
  const dateMatch = html.match(/<p class="meta">(\d{8})<\/p>/);

  return {
    filename,
    title: titleMatch ? titleMatch[1] : "無題",
    date: dateMatch ? dateMatch[1] : "00000000"
  };
});

posts.sort((a, b) => b.date.localeCompare(a.date));

const listHtml = posts.map(post => `
  <li>
    <span class="title"><a href="${post.filename}" class="neon">＞＞ ${post.title}</a></span>
    <span class="meta">${post.date}</span>
  </li>`).join("\n");

const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>CYBER・NOSTALGIA</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1 class="title">＞＞ CYBER・NOSTALGIA</h1>
    <ul class="entry-list">
${listHtml}
    </ul>
  </div>
</body>
</html>`;

fs.writeFileSync("index.html", indexHtml);
