const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;

loadEnv(path.join(root, ".env"));

const port = Number(process.env.PORT || 5178);
const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

function sendFile(res, status, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    "Content-Type": types[ext] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function safeJsonParse(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function supabaseRequest(pathname, options = {}) {
  if (!isSupabaseConfigured()) {
    const error = new Error("Supabase não está configurada. Adiciona SUPABASE_SERVICE_ROLE_KEY ao .env.");
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1${pathname}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = safeJsonParse(text);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.hint ||
      "Pedido à Supabase falhou. Confirma se a tabela quotes existe e se a service role key está correta.";
    const error = new Error(message);
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload;
}

function normalizeSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function quoteRowFromPayload(payload) {
  const slug = normalizeSlug(payload.slug || payload.clientName);
  if (!slug) {
    const error = new Error("Missing quote slug.");
    error.status = 400;
    throw error;
  }

  return {
    slug,
    client_name: payload.clientName || "Cliente",
    company_name: payload.companyName || "Growfase",
    currency: payload.currency || "EUR",
    total: Number(payload.total || 0),
    data: { ...payload, slug },
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      supabaseConfigured: isSupabaseConfigured(),
      supabaseUrl: supabaseUrl ? supabaseUrl.replace(/^https?:\/\//, "") : null,
    });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/quotes/")) {
    const slug = normalizeSlug(decodeURIComponent(url.pathname.replace("/api/quotes/", "")).trim());
    if (!slug) return sendJson(res, 400, { error: "Missing quote slug." });

    const rows = await supabaseRequest(`/quotes?slug=eq.${encodeURIComponent(slug)}&select=*`);
    if (!rows.length) return sendJson(res, 404, { error: "Quote not found." });

    return sendJson(res, 200, rows[0].data);
  }

  if (req.method === "POST" && url.pathname === "/api/quotes") {
    const payload = await readJson(req);
    const row = quoteRowFromPayload(payload);

    const rows = await supabaseRequest("/quotes?on_conflict=slug", {
      method: "POST",
      body: JSON.stringify(row),
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
    });

    return sendJson(res, 200, rows[0]?.data || payload);
  }

  return sendJson(res, 404, { error: "API route not found." });
}

function handleStatic(req, res, url) {
  const decodedPath = decodeURIComponent(url.pathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath);

  if (
    decodedPath === "/" ||
    decodedPath === "/index.html" ||
    decodedPath === "/admin/gerador_de_proposta" ||
    decodedPath.startsWith("/orcamento/")
  ) {
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
    sendFile(res, 200, filePath);
  });
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);

    try {
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }

      handleStatic(req, res, url);
    } catch (error) {
      sendJson(res, error.status || 500, {
        error: error.message || "Unexpected server error.",
        details: error.details,
      });
    }
  })
  .listen(port, () => {
    console.log(`Growfase quote server running at http://127.0.0.1:${port}`);
  });
