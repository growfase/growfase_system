const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5178);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

function send(res, status, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    "Content-Type": types[ext] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, safePath);

    if (decodedPath === "/" || decodedPath.startsWith("/orcamento/")) {
      filePath = path.join(root, "index.html");
    }

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stat) => {
      if (error || !stat.isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      send(res, 200, filePath);
    });
  })
  .listen(port, () => {
    console.log(`Growfase quote server running at http://127.0.0.1:${port}`);
  });
