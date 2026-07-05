const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Projects/ecommerce/frontend/src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('text-brand-secondary')) {
    content = content.replace(/text-brand-secondary/g, 'text-brand-primary');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(srcDir);
console.log("Replaced text-brand-secondary globally.");
