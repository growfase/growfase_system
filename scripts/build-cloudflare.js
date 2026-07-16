const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const entries = ["index.html", "app.js", "styles.css", "assets"];

function copyRecursive(source, target) {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of entries) {
  copyRecursive(path.join(root, entry), path.join(dist, entry));
}

fs.writeFileSync(path.join(dist, ".assetsignore"), ["**/.git", "**/node_modules", "**/.DS_Store", ""].join("\n"));
console.log(`Cloudflare assets built in ${dist}`);
