const assert = require("assert");
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

function slugify(value) {
  return (value || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cliente";
}

async function supabaseRequest(pathname, options = {}) {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  assert.ok(supabaseUrl, "SUPABASE_URL is missing.");
  assert.ok(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY is missing.");

  const response = await fetch(`${supabaseUrl}/rest/v1${pathname}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || payload?.hint || `Supabase request failed with ${response.status}.`;
    throw new Error(`${message}\n${JSON.stringify(payload, null, 2)}`);
  }

  return payload;
}

(async () => {
  loadEnv(path.join(root, ".env"));

  const slug = slugify(`codex-integracao-${Date.now()}`);
  const quote = {
    slug,
    client_name: "Codex Integração",
    company_name: "Growfase",
    currency: "EUR",
    total: 855,
    data: {
      slug,
      clientName: "Codex Integração",
      companyName: "Growfase",
      currency: "EUR",
      total: 855,
      requestedService: "businessCard",
    },
  };

  const rows = await supabaseRequest("/quotes?on_conflict=slug", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].slug, slug);
  assert.equal(rows[0].data.clientName, "Codex Integração");

  const fetched = await supabaseRequest(`/quotes?slug=eq.${encodeURIComponent(slug)}&select=slug,data,total`);
  assert.equal(fetched.length, 1);
  assert.equal(fetched[0].slug, slug);
  assert.equal(Number(fetched[0].total), 855);

  await supabaseRequest(`/quotes?slug=eq.${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });

  console.log(`Supabase quotes integration verified for ${slug}.`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
