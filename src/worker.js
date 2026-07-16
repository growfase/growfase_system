function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function safeJsonParse(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function normalizeSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isSupabaseConfigured(env) {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    const error = new Error("Invalid JSON");
    error.status = 400;
    throw error;
  }
}

async function supabaseRequest(env, pathname, options = {}) {
  if (!isSupabaseConfigured(env)) {
    const error = new Error("Supabase nao esta configurada no Cloudflare Worker.");
    error.status = 503;
    throw error;
  }

  const supabaseUrl = env.SUPABASE_URL.replace(/\/+$/, "");
  const response = await fetch(`${supabaseUrl}/rest/v1${pathname}`, {
    ...options,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
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
      "Pedido a Supabase falhou. Confirma se a tabela quotes existe e se a service role key esta correta.";
    const error = new Error(message);
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  return payload;
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

async function handleApi(request, env, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      supabaseConfigured: isSupabaseConfigured(env),
      supabaseUrl: env.SUPABASE_URL ? env.SUPABASE_URL.replace(/^https?:\/\//, "") : null,
      runtime: "cloudflare-worker",
    });
  }

  if (request.method === "GET" && url.pathname.startsWith("/api/quotes/")) {
    const slug = normalizeSlug(decodeURIComponent(url.pathname.replace("/api/quotes/", "")).trim());
    if (!slug) return json({ error: "Missing quote slug." }, 400);

    const rows = await supabaseRequest(env, `/quotes?slug=eq.${encodeURIComponent(slug)}&select=*`);
    if (!rows.length) return json({ error: "Quote not found." }, 404);

    return json(rows[0].data);
  }

  if (request.method === "POST" && url.pathname === "/api/quotes") {
    const payload = await readJson(request);
    const row = quoteRowFromPayload(payload);

    const rows = await supabaseRequest(env, "/quotes?on_conflict=slug", {
      method: "POST",
      body: JSON.stringify(row),
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
    });

    return json(rows[0]?.data || payload);
  }

  return json({ error: "API route not found." }, 404);
}

function assetRequestForIndex(request) {
  const url = new URL(request.url);
  url.pathname = "/index.html";
  url.search = "";
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url);
      }

      if (
        url.pathname === "/" ||
        url.pathname === "/index.html" ||
        url.pathname === "/admin/gerador_de_proposta" ||
        url.pathname.startsWith("/orcamento/")
      ) {
        return env.ASSETS.fetch(assetRequestForIndex(request));
      }

      return env.ASSETS.fetch(request);
    } catch (error) {
      return json(
        {
          error: error.message || "Unexpected server error.",
          details: error.details,
        },
        error.status || 500,
      );
    }
  },
};
