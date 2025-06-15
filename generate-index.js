const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const templatePath = 'index.html';
const outputPath = 'index.html';
const postFiles = fs.readdirSync('.').filter(f => /^post\d+\.html$/.test(f));

let listItems = [];

postFiles.sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)[0]);
  const numB = parseInt(b.match(/\d+/)[0]);
  return numB - numA; // 新しい順
}).forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const dom = new JSDOM(content);
  const doc = dom.window.document;

  const titleEl = doc.querySelector('h2.title a');
  const dateEl = doc.querySelector('.meta');
  if (!titleEl || !dateEl) return;

  const title = titleEl.textContent.trim();
  const date = dateEl.textContent.trim();

  listItems.push(`
              <li>
                <span class="title"><a href="${file}" class="neon">${title}</a></span>
                <span class="meta">${date}</span>
              </li>`);
});

const originalHtml = fs.readFileSync(templatePath, 'utf-8');

const updatedHtml = originalHtml.replace(
  /<ul class="entry-list">[\s\S]*?<\/ul>/,
  `<ul class="entry-list">\n${listItems.join('\n')}\n            </ul>`
);

fs.writeFileSync(outputPath, updatedHtml, 'utf-8');
console.log("✅ index.html updated");
