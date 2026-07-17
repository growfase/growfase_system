const form = document.querySelector("#quoteForm");
const finishSelect = form.elements.finish;
const previewLinkOutput = document.querySelector("#previewLink");
const mbwayNumber = "+351 931 948 650";
const publicPreviewBase = "https://www.growfase.com/orcamento";

if (window.lucide) {
  window.lucide.createIcons();
}

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const finishTemplate = {
  standard: {
    label: "Couchê 300g fosco",
    title: "Cartão Essencial",
    deadline: "5 a 7 dias",
  },
  premium: {
    label: "Verniz localizado + laminação fosca",
    title: "Cartão Premium",
    deadline: "7 a 10 dias",
  },
  luxury: {
    label: "Papel especial 600g + hot stamping",
    title: "Cartão Luxo",
    deadline: "10 a 15 dias",
  },
};

const serviceTemplate = {
  design: { label: "Design personalizado" },
  print: { label: "Impressão inclusa" },
  delivery: { label: "Entrega local" },
  urgent: { label: "Prazo urgente" },
};

const requestedServiceTemplate = {
  businessCard: {
    title: "Cartão de visita",
    meta: "Design personalizado · Impressão · Arte final",
    primary: "Cartão Premium",
    primaryMeta: "500 unidades · Verniz localizado",
    secondary: "Arquivo final",
    secondaryMeta: "Pronto para gráfica",
  },
  adsManagement: {
    title: "Marketing",
    meta: "Design · Implementação · Comunicação · Marketing",
    primary: "Gestão de Anuncios",
    primaryMeta: "Meta Ads · Google Ads · Otimização",
    secondary: "Relatórios",
    secondaryMeta: "Acompanhamento e melhoria contínua",
  },
  landingPage: {
    title: "Landing Page",
    meta: "UX/UI · Copywriting · Desenvolvimento",
    primary: "Página de conversão",
    primaryMeta: "Estrutura estratégica · Responsiva",
    secondary: "Integrações",
    secondaryMeta: "Formulário · Tracking · Publicação",
  },
  institutionalWebsite: {
    title: "Website instituicional",
    meta: "Web design · Desenvolvimento · SEO técnico",
    primary: "Site institucional",
    primaryMeta: "Páginas essenciais · Responsivo",
    secondary: "Publicação",
    secondaryMeta: "Performance · Segurança · Base SEO",
  },
  socialMedia: {
    title: "Redes sociais",
    meta: "Estratégia · Design · Conteúdo",
    primary: "Posts e criativos",
    primaryMeta: "Instagram · Facebook · LinkedIn",
    secondary: "Calendário editorial",
    secondaryMeta: "Planeamento · Direção visual",
  },
};

const faqTemplate = {
  website: [
    {
      question: "Está incluído o registro de domínio e hospedagem?",
      answer: "Não. O serviço de registo de domínio e hospedagem fazemos a parte.",
    },
    {
      question: "Posso pedir alterações depois da entrega?",
      answer: "Sim! A proposta inclui 2 rodadas de revisão durante o desenvolvimento. Após a entrega, tens 30 dias de suporte para bugs e ajustes pequenos. Alterações adicionais de escopo ou novas funcionalidades podem ser orçadas separadamente.",
    },
    {
      question: "E se eu quiser adicionar novas secções/páginas depois?",
      answer: "Sem problema! Podemos avaliar e orçar o escopo adicional. O projeto pode ser evoluído com novas páginas, integrações ou serviços conforme a tua necessidade.",
    },
    {
      question: "Como fica a manutenção?",
      answer: "O site/app fica totalmente funcional e não precisa de manutenção obrigatória. Porém, se quiseres suporte contínuo, atualizações de conteúdo ou melhorias mensais, podemos criar um plano de manutenção.",
    },
    {
      question: "Quanto tempo demora até ficar pronto?",
      answer: "O prazo é de 7-15 dias úteis após confirmação do projeto e recebimento do sinal mínimo de 50%. O tempo pode variar se houver atrasos no fornecimento de materiais (textos, imagens, logo) ou aprovações da tua parte.",
    },
  ],
  designGeneral: [
    {
      question: "Está incluída a impressão?",
      answer: "Não. A impressão é feita à parte. A proposta inclui a criação do design e preparação dos ficheiros finais para produção.",
    },
    {
      question: "Posso pedir alterações depois da entrega?",
      answer: "Sim! A proposta inclui 2 rodadas de revisão durante o desenvolvimento. Alterações adicionais de escopo ou novas peças podem ser orçadas separadamente.",
    },
    {
      question: "Recebo os ficheiros finais?",
      answer: "Sim. Entregamos os ficheiros finais prontos para uso e produção. Arquivos editáveis podem ser incluídos se estiverem previstos na proposta.",
    },
    {
      question: "Posso pedir outros formatos depois?",
      answer: "Sim. Podemos adaptar a arte para outros formatos, variações ou materiais adicionais mediante novo orçamento.",
    },
    {
      question: "Quanto tempo demora até ficar pronto?",
      answer: "O prazo é de 7-15 dias úteis após confirmação do projeto e recebimento do sinal mínimo de 50%. O tempo pode variar conforme feedbacks e aprovações.",
    },
  ],
};

const portfolioKeys = ["showWebsites", "showSocial", "showBusinessCards", "socialUpra", "socialAxiscore", "socialGreenlife", "socialErafisio"];

function money(value, options = {}) {
  const label = currency.format(Number(value || 0));
  return options.plus && Number(value || 0) > 0 ? `+${label}` : label;
}

function numberFrom(data, field, fallback = 0) {
  const value = Number(data.get(field));
  return Number.isFinite(value) ? value : fallback;
}

function getCheckedServices(data) {
  return Object.entries(serviceTemplate)
    .filter(([key]) => data.get(key) === "on")
    .map(([key, service]) => ({ key, ...service }));
}

function calculateQuote(data) {
  const quantity = Number(data.get("quantity"));
  const finish = finishTemplate[data.get("finish")] || finishTemplate.premium;
  const services = getCheckedServices(data);
  const total = numberFrom(data, "quoteValue", 0);

  return {
    quantity,
    finish,
    services,
    total,
    urgent: data.get("urgent") === "on",
  };
}

function setText(id, value) {
  const element = document.querySelector(id);
  if (element) element.textContent = value;
}

function setMultilineText(id, value) {
  const element = document.querySelector(id);
  if (!element) return;

  const lines = (value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  element.innerHTML = "";
  (lines.length ? lines : ["Proposta", "Identidade", "visual e", "Redes", "Sociais"]).forEach((line) => {
    const span = document.createElement("span");
    span.textContent = line;
    element.appendChild(span);
  });
}

function setDeadline(value) {
  const normalized = (value || "7 a 15 dias úteis").trim();
  const suffixMatch = normalized.match(/\s+(úteis|uteis)$/i);

  setText("#deadlineMain", suffixMatch ? normalized.slice(0, suffixMatch.index).trim() : normalized);
  setText("#deadlineSuffix", suffixMatch ? suffixMatch[1] : "");
}

function slugify(value) {
  return (value || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cliente";
}

function selectedPortfolio(data) {
  return Object.fromEntries(portfolioKeys.map((key) => [key, data.get(key) === "on"]));
}

function getPricingState(data) {
  return {
    quoteValue: data.get("quoteValue"),
  };
}

function getFormState() {
  const data = new FormData(form);
  const quote = calculateQuote(data);
  const clientName = data.get("clientName") || "";

  return {
    slug: slugify(clientName),
    clientName,
    companyName: data.get("companyName") || "",
    proposalTitle: data.get("proposalTitle") || "Proposta\nIdentidade\nvisual e\nRedes\nSociais",
    requestedService: data.get("requestedService") || "businessCard",
    faqType: data.get("faqType") || "designGeneral",
    quantity: data.get("quantity") || "500",
    finish: data.get("finish") || "premium",
    notes: data.get("notes") || "",
    deadlineText: data.get("deadlineText") || "7 a 15 dias úteis",
    previewBase: publicPreviewBase,
    currency: "EUR",
    total: Number(quote.total.toFixed(2)),
    pricing: getPricingState(data),
    portfolio: selectedPortfolio(data),
    services: Object.keys(serviceTemplate).filter((key) => data.get(key) === "on"),
  };
}

function applyQuoteState(state) {
  if (!state) return;
  form.elements.clientName.value = state.clientName || "Cliente";
  form.elements.companyName.value = state.companyName || "Growfase";
  form.elements.proposalTitle.value = state.proposalTitle || "Proposta\nIdentidade\nvisual e\nRedes\nSociais";
  form.elements.requestedService.value = state.requestedService || "businessCard";
  form.elements.faqType.value = state.faqType || "designGeneral";
  form.elements.quantity.value = state.quantity || "500";
  form.elements.finish.value = state.finish || "premium";
  form.elements.notes.value = state.notes || "";
  form.elements.deadlineText.value = state.deadlineText || "7 a 15 dias úteis";
  form.elements.previewBase.value = publicPreviewBase;

  Object.entries(state.pricing || {}).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });

  if (state.pricing?.quoteValue == null && state.total != null) {
    form.elements.quoteValue.value = state.total;
  }

  Object.keys(serviceTemplate).forEach((key) => {
    form.elements[key].checked = (state.services || []).includes(key);
  });

  portfolioKeys.forEach((key) => {
    if (form.elements[key]) form.elements[key].checked = state.portfolio?.[key] !== false;
  });
}

function getPreviewUrl(state, baseOverride) {
  const base = (baseOverride || state.previewBase || publicPreviewBase).replace(/\/+$/, "");
  return `${base}/${state.slug || slugify(state.clientName)}`;
}

function renderIncludedList(services, finishLabel) {
  const list = document.querySelector("#includedList");
  if (!list) return;
  list.innerHTML = "";

  [
    ...services.map((service) => service.label),
    finishLabel,
    "Arquivo fechado para gráfica",
    "Até 2 rodadas de ajustes",
  ].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function updatePortfolio(data) {
  document.querySelectorAll('[data-portfolio="websites"]').forEach((element) => {
    element.hidden = data.get("showWebsites") !== "on";
  });

  document.querySelectorAll('[data-portfolio="social"]').forEach((element) => {
    element.hidden = data.get("showSocial") !== "on";
  });

  document.querySelectorAll('[data-portfolio="businessCards"]').forEach((element) => {
    element.hidden = data.get("showBusinessCards") !== "on";
  });

  const socialMap = {
    upra: "socialUpra",
    axiscore: "socialAxiscore",
    greenlife: "socialGreenlife",
    erafisio: "socialErafisio",
  };

  document.querySelectorAll("[data-social-work]").forEach((element) => {
    const field = socialMap[element.dataset.socialWork];
    element.hidden = data.get("showSocial") !== "on" || data.get(field) !== "on";
  });
}

function updateRequestedService(data, quote) {
  const selectedService = requestedServiceTemplate[data.get("requestedService")] || requestedServiceTemplate.businessCard;

  setText("#budgetServiceTitle", selectedService.title);
  setText("#requestedServiceTitle", selectedService.title);
  setText("#requestedServiceMeta", selectedService.meta);
  setText("#requestedServicePrimary", selectedService.primary);
  setText(
    "#requestedServicePrimaryMeta",
    data.get("requestedService") === "businessCard" ? `${quote.quantity.toLocaleString("pt-PT")} unidades · ${quote.finish.label}` : selectedService.primaryMeta,
  );
  setText("#requestedServiceSecondary", selectedService.secondary);
  setText("#requestedServiceSecondaryMeta", selectedService.secondaryMeta);
}

function updateFaq(data) {
  const faqItems = faqTemplate[data.get("faqType")] || faqTemplate.designGeneral;

  document.querySelectorAll("[data-faq-card]").forEach((card, index) => {
    const item = faqItems[index];
    if (!item) return;
    card.querySelector("h3").textContent = item.question;
    card.querySelector("p").textContent = item.answer;
  });
}

function updateProposal() {
  const data = new FormData(form);
  const state = getFormState();
  const quote = calculateQuote(data);
  const clientName = data.get("clientName").trim() || "Cliente";
  const companyName = data.get("companyName").trim() || "Empresa";
  const proposalTitle = data.get("proposalTitle").trim() || "Proposta\nIdentidade\nvisual e\nRedes\nSociais";
  const notes = data.get("notes").trim();
  const deadlineText = data.get("deadlineText").trim() || "7 a 15 dias úteis";
  const quantityLabel = `${quote.quantity.toLocaleString("pt-PT")} unidades`;
  const totalLabel = money(quote.total);

  setText("#builderTotal", totalLabel);
  setText("#proposalTotal", totalLabel);
  setText("#priceHeroTotal", totalLabel);
  setText("#clientIntro", clientName);
  setText("#heroClient", clientName);
  setText("#heroCompany", companyName);
  setMultilineText("#proposalTitle", proposalTitle);
  setText("#proposalNotes", notes || "Proposta preparada para criação e produção do material.");
  setText("#summaryQty", quantityLabel);
  setText("#planTitle", quote.finish.title);
  setDeadline(deadlineText);
  setText("#priceHeroSummary", `${quantityLabel} · ${quote.finish.title}`);
  setText("#paymentFull", totalLabel);
  setText("#paymentHalfFirst", money(quote.total / 2));
  setText("#paymentHalfSecond", money(quote.total / 2));

  Object.keys(finishTemplate).forEach((finishKey) => {
    setText(`#${finishKey}Price`, money(quote.total));
  });

  document.querySelectorAll(".package-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.package === data.get("finish"));
  });

  updatePortfolio(data);
  updateRequestedService(data, quote);
  updateFaq(data);
  renderIncludedList(quote.services, quote.finish.label);
  previewLinkOutput.value = getPreviewUrl(state);
  previewLinkOutput.textContent = getPreviewUrl(state);
}

async function saveQuote() {
  const state = getFormState();
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Não foi possível guardar o orçamento.");
  return payload;
}

async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("input");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

async function loadQuoteFromDatabase(slug) {
  const response = await fetch(`/api/quotes/${encodeURIComponent(slug)}`);
  if (!response.ok) return null;
  return response.json();
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

document.querySelector("#openPreview").addEventListener("click", async () => {
  const label = document.querySelector("#openPreview .button-label");
  label.textContent = "A guardar";
  try {
    const saved = await saveQuote();
    const link = getPreviewUrl(saved);
    previewLinkOutput.value = link;
    previewLinkOutput.textContent = link;
    window.open(link, "_blank");
  } catch (error) {
    alert(error.message);
  } finally {
    label.textContent = "Abrir link";
  }
});

document.querySelector("#copyPreview").addEventListener("click", async () => {
  const label = document.querySelector("#copyPreview .button-label");
  label.textContent = "A guardar";
  try {
    const saved = await saveQuote();
    const link = getPreviewUrl(saved);
    await copyToClipboard(link);
    previewLinkOutput.value = link;
    previewLinkOutput.textContent = link;
    label.textContent = "Link copiado";
    setTimeout(() => {
      label.textContent = "Gerar link";
    }, 1600);
  } catch (error) {
    label.textContent = "Gerar link";
    alert(error.message);
  }
});

document.querySelector("#copyMbway").addEventListener("click", async () => {
  const label = document.querySelector("#copyMbway .button-label");

  try {
    await copyToClipboard(mbwayNumber);
    label.textContent = "Número copiado";
    setTimeout(() => {
      label.textContent = "Copiar número";
    }, 1600);
  } catch {
    alert("Não foi possível copiar o número MB WAY.");
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

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

async function finishPublicLoader(startedAt) {
  const elapsed = Date.now() - startedAt;
  await wait(Math.max(0, 3000 - elapsed));
  document.body.classList.remove("public-loading");
  document.body.classList.add("public-loaded");
}

async function init() {
  const publicLoadStartedAt = Date.now();
  let isPublicQuote = false;

  if (window.location.pathname.includes("/orcamento/")) {
    isPublicQuote = true;
    document.body.classList.add("public-preview", "public-loading");
    document.body.dataset.view = "preview";

    const slug = decodeURIComponent(window.location.pathname.split("/").filter(Boolean).pop() || "");
    const quote = await loadQuoteFromDatabase(slug);
    if (quote) {
      applyQuoteState(quote);
      document.title = `Orçamento | ${quote.clientName || "Cliente"}`;
    }
  }

  updateProposal();

  if (isPublicQuote) {
    await finishPublicLoader(publicLoadStartedAt);
  }
}

init();
