const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

http
  .createServer((req, res) => {
    const urlPath = req.url.split("?")[0];
    if (urlPath === "/health") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, service: "across-webapp", status: "healthy" }));
      return;
    }
    const normalizedPath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.join(root, path.normalize(normalizedPath));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`Across preview running at http://localhost:${port}`);
  });
