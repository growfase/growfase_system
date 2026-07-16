const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const separator = trimmed.indexOf("=");
      if (separator === -1) return;

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] == null) process.env[key] = value;
    });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  return { response, payload };
}

async function waitForServer(baseUrl) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      const { response } = await requestJson(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      await wait(120);
    }
  }

  throw new Error("Server did not become ready in time.");
}

async function cleanupQuote(slug) {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) return;

  await fetch(`${supabaseUrl}/rest/v1/quotes?slug=eq.${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
  });
}

(async () => {
  loadEnv(path.join(root, ".env"));
  assert.ok(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY is missing.");

  const port = String(5400 + Math.floor(Math.random() * 400));
  const baseUrl = `http://127.0.0.1:${port}`;
  const slug = `codex-server-flow-${Date.now()}`;
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: port },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(baseUrl);

    const admin = await fetch(`${baseUrl}/admin/gerador_de_proposta`);
    assert.equal(admin.status, 200);
    assert.match(await admin.text(), /Gerador de orçamento/);

    const state = {
      slug,
      clientName: "Codex Server Flow",
      companyName: "Growfase",
      proposalTitle: "Proposta\nTeste",
      requestedService: "businessCard",
      faqType: "designGeneral",
      quantity: "500",
      finish: "premium",
      notes: "Teste automatico",
      deadlineText: "7 a 15 dias úteis",
      previewBase: "https://www.growfase.com/orcamento",
      currency: "EUR",
      total: 855,
      pricing: { quoteValue: "855" },
      portfolio: {
        showWebsites: true,
        showSocial: true,
        showBusinessCards: true,
        socialUpra: true,
        socialAxiscore: true,
        socialGreenlife: true,
        socialErafisio: true,
      },
      services: ["design", "print", "delivery"],
    };

    const saved = await requestJson(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    assert.equal(saved.response.status, 200);
    assert.equal(saved.payload.slug, slug);
    assert.equal(saved.payload.total, 855);

    const loaded = await requestJson(`${baseUrl}/api/quotes/${slug}`);
    assert.equal(loaded.response.status, 200);
    assert.equal(loaded.payload.clientName, "Codex Server Flow");
    assert.equal(loaded.payload.requestedService, "businessCard");

    const publicPage = await fetch(`${baseUrl}/orcamento/${slug}`);
    assert.equal(publicPage.status, 200);
    assert.match(await publicPage.text(), /Growfase/);

    await cleanupQuote(slug);
    console.log(`Server quote flow verified for ${slug}.`);
  } finally {
    child.kill();
    await cleanupQuote(slug);
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
