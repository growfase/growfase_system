const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");

assert.match(appJs, /https:\/\/www\.growfase\.com\/orcamento/);
assert.match(indexHtml, /https:\/\/www\.growfase\.com\/orcamento\/luan-campos/);
assert.match(indexHtml, />Gerar link</);
assert.doesNotMatch(appJs, /https:\/\/growfase\.com\/orcamento/);
assert.doesNotMatch(indexHtml, /https:\/\/growfase\.com\/orcamento/);

const port = String(5300 + Math.floor(Math.random() * 500));
const child = spawn(process.execPath, ["server.js"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: port,
    SUPABASE_SERVICE_ROLE_KEY: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(pathname, options) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, options);
  const payload = await response.json();
  return { response, payload };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      const result = await request("/api/health");
      return result;
    } catch {
      await wait(120);
    }
  }

  throw new Error("Server did not become ready in time.");
}

(async () => {
  try {
    const health = await waitForServer();
    assert.equal(health.response.status, 200);
    assert.equal(health.payload.ok, true);
    assert.equal(health.payload.supabaseConfigured, false);

    const save = await request("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "cliente-teste",
        clientName: "Cliente Teste",
        companyName: "Growfase",
        currency: "EUR",
        total: 855,
      }),
    });

    assert.equal(save.response.status, 503);
    assert.match(save.payload.error, /SUPABASE_SERVICE_ROLE_KEY/);
  } finally {
    child.kill();
  }
})().catch((error) => {
  child.kill();
  console.error(error);
  process.exit(1);
});
