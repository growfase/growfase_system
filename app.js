const form = document.querySelector("#quoteForm");
const finishSelect = form.elements.finish;
const previewLinkOutput = document.querySelector("#previewLink");

if (window.lucide) {
  window.lucide.createIcons();
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const finishMap = {
  standard: {
    label: "Couchê 300g fosco",
    title: "Cartão Essencial",
    unit: 0.62,
    base: 160,
    deadline: "5 a 7 dias",
  },
  premium: {
    label: "Verniz localizado + laminação fosca",
    title: "Cartão Premium",
    unit: 0.84,
    base: 220,
    deadline: "7 a 10 dias",
  },
  luxury: {
    label: "Papel especial 600g + hot stamping",
    title: "Cartão Luxo",
    unit: 1.48,
    base: 360,
    deadline: "10 a 15 dias",
  },
};

const serviceMap = {
  design: { label: "Design personalizado", value: 180 },
  print: { label: "Impressão inclusa", value: 0 },
  delivery: { label: "Entrega local", value: 35 },
  urgent: { label: "Prazo urgente", value: 120 },
};

const addonMap = {
  rounded: { label: "Cantos arredondados", value: 90 },
  hotStamp: { label: "Hot stamping dourado", value: 180 },
  qrCode: { label: "QR Code personalizado", value: 0 },
  openFile: { label: "Arquivo aberto editável", value: 120 },
};

function getCheckedServices(data) {
  return Object.entries(serviceMap)
    .filter(([key]) => data.get(key) === "on")
    .map(([key, service]) => ({ key, ...service }));
}

function getCheckedAddons(data) {
  return Object.entries(addonMap)
    .filter(([key]) => data.get(key) === "on")
    .map(([key, addon]) => ({ key, ...addon }));
}

function calculateQuote(data) {
  const quantity = Number(data.get("quantity"));
  const finish = finishMap[data.get("finish")];
  const services = getCheckedServices(data);
  const addons = getCheckedAddons(data);
  const serviceTotal = services.reduce((sum, service) => sum + service.value, 0);
  const addonTotal = addons.reduce((sum, addon) => sum + addon.value, 0);
  const production = finish.base + quantity * finish.unit;
  const total = production + serviceTotal + addonTotal;

  return {
    quantity,
    finish,
    services,
    addons,
    total,
    urgent: data.get("urgent") === "on",
  };
}

function calculateTotalForFinish(finishKey, quantity, services, addons) {
  const finish = finishMap[finishKey];
  const serviceTotal = services.reduce((sum, service) => sum + service.value, 0);
  const addonTotal = addons.reduce((sum, addon) => sum + addon.value, 0);
  return finish.base + quantity * finish.unit + serviceTotal + addonTotal;
}

function setText(id, value) {
  const element = document.querySelector(id);
  if (element) element.textContent = value;
}

function slugify(value) {
  return (value || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cliente";
}

function encodeQuoteState(state) {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeQuoteState(payload) {
  if (!payload) return null;
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function getFormState() {
  const data = new FormData(form);
  return {
    clientName: data.get("clientName") || "",
    companyName: data.get("companyName") || "",
    quantity: data.get("quantity") || "500",
    finish: data.get("finish") || "premium",
    notes: data.get("notes") || "",
    previewBase: data.get("previewBase") || "https://growfase.com/orcamento",
    services: Object.keys(serviceMap).filter((key) => data.get(key) === "on"),
    addons: Object.keys(addonMap).filter((key) => data.get(key) === "on"),
  };
}

function applyQuoteState(state) {
  if (!state) return;
  form.elements.clientName.value = state.clientName || "Cliente";
  form.elements.companyName.value = state.companyName || "Growfase";
  form.elements.quantity.value = state.quantity || "500";
  form.elements.finish.value = state.finish || "premium";
  form.elements.notes.value = state.notes || "";
  form.elements.previewBase.value = state.previewBase || "https://growfase.com/orcamento";

  Object.keys(serviceMap).forEach((key) => {
    form.elements[key].checked = (state.services || []).includes(key);
  });
  Object.keys(addonMap).forEach((key) => {
    form.elements[key].checked = (state.addons || []).includes(key);
  });
}

function getPreviewUrl(state, baseOverride) {
  const slug = slugify(state.clientName);
  const base = (baseOverride || state.previewBase || "https://growfase.com/orcamento").replace(/\/+$/, "");
  return `${base}/${slug}?q=${encodeQuoteState(state)}`;
}

function getLocalPreviewUrl(state) {
  return `${window.location.origin}/orcamento/${slugify(state.clientName)}?q=${encodeQuoteState(state)}`;
}

function renderIncludedList(services, addons, finishLabel) {
  const list = document.querySelector("#includedList");
  list.innerHTML = "";

  [
    ...services.map((service) => service.label),
    ...addons.map((addon) => addon.label),
    finishLabel,
    "Arquivo fechado para gráfica",
    "Até 2 rodadas de ajustes",
  ].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function updateProposal() {
  const data = new FormData(form);
  const state = getFormState();
  const quote = calculateQuote(data);
  const clientName = data.get("clientName").trim() || "Cliente";
  const companyName = data.get("companyName").trim() || "Empresa";
  const notes = data.get("notes").trim();
  const quantityLabel = `${quote.quantity.toLocaleString("pt-BR")} unidades`;
  const totalLabel = currency.format(quote.total);

  setText("#builderTotal", totalLabel);
  setText("#proposalTotal", totalLabel);
  setText("#priceHeroTotal", totalLabel);
  setText("#clientIntro", clientName);
  setText("#heroClient", clientName);
  setText("#profileName", clientName);
  setText("#proposalNotes", notes || "Proposta preparada para criação e produção do material.");
  setText("#summaryQty", quantityLabel);
  setText("#summaryFinish", quote.finish.label);
  setText("#planTitle", quote.finish.title);
  setText("#deadline", quote.urgent ? "3 a 5 dias" : quote.finish.deadline);
  setText("#interestClient", clientName);
  setText("#interestSummary", `${quantityLabel} · ${quote.finish.title}`);
  setText("#priceHeroSummary", `${quantityLabel} · ${quote.finish.title}`);

  Object.keys(finishMap).forEach((finishKey) => {
    const price = calculateTotalForFinish(finishKey, quote.quantity, quote.services, quote.addons);
    setText(`#${finishKey}Price`, currency.format(price));
  });

  document.querySelectorAll(".package-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.package === data.get("finish"));
  });

  document.querySelectorAll(".addon-row").forEach((row) => {
    row.classList.toggle("is-selected", data.get(row.dataset.addon) === "on");
  });

  renderIncludedList(quote.services, quote.addons, quote.finish.label);
  previewLinkOutput.value = getPreviewUrl(state);
  previewLinkOutput.textContent = getPreviewUrl(state);
}

form.addEventListener("input", updateProposal);
form.addEventListener("change", updateProposal);

document.querySelectorAll(".package-card").forEach((card) => {
  card.addEventListener("click", () => {
    finishSelect.value = card.dataset.package;
    updateProposal();
  });
});

document.querySelector("#printQuote").addEventListener("click", () => {
  window.print();
});

document.querySelector("#openPreview").addEventListener("click", () => {
  window.open(getLocalPreviewUrl(getFormState()), "_blank");
});

document.querySelector("#copyPreview").addEventListener("click", async () => {
  const link = getPreviewUrl(getFormState());
  const label = document.querySelector("#copyPreview .button-label");
  try {
    await navigator.clipboard.writeText(link);
    label.textContent = "Link copiado";
    setTimeout(() => {
      label.textContent = "Copiar link";
    }, 1600);
  } catch {
    previewLinkOutput.focus?.();
  }
});

document.querySelector("#resetQuote").addEventListener("click", () => {
  form.reset();
  updateProposal();
});

document.querySelectorAll(".mobile-mode-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.view = button.dataset.view;
    document.querySelectorAll(".mobile-mode-switch button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
  });
});

const urlParams = new URLSearchParams(window.location.search);
const quoteFromUrl = decodeQuoteState(urlParams.get("q"));
if (quoteFromUrl) {
  applyQuoteState(quoteFromUrl);
  if (window.location.pathname.includes("/orcamento/")) {
    document.body.classList.add("public-preview");
    document.body.dataset.view = "preview";
    document.title = `Orçamento | ${quoteFromUrl.clientName || "Cliente"}`;
  }
}

updateProposal();
