const sidebar = document.querySelector("#sidebar");
const sidebarToggle = document.querySelector("#sidebarToggle");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector(".theme-switch__label");
const root = document.documentElement;
const searchInput = document.querySelector("#globalSearch");
const tooltip = document.querySelector("#chartTooltip");
const chartPoints = document.querySelectorAll(".chart-points circle");
const newRequestButton = document.querySelector("#newRequestButton");
const toast = document.querySelector("#toast");

const STORAGE_THEME_KEY = "kanrify-theme";
const STORAGE_SIDEBAR_KEY = "kanrify-sidebar-collapsed";

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_THEME_KEY, theme);

  const isDark = theme === "dark";
  themeLabel.textContent = isDark ? "Modo claro" : "Modo escuro";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ativar modo claro" : "Ativar modo escuro"
  );
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
}

function toggleSidebar() {
  const isCollapsed = sidebar.classList.toggle("sidebar--collapsed");

  localStorage.setItem(STORAGE_SIDEBAR_KEY, String(isCollapsed));
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute(
    "aria-label",
    isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"
  );
}

function initializeSidebar() {
  const isCollapsed = localStorage.getItem(STORAGE_SIDEBAR_KEY) === "true";

  if (isCollapsed && window.innerWidth > 760) {
    sidebar.classList.add("sidebar--collapsed");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.setAttribute("aria-label", "Expandir menu lateral");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast--visible");

  window.clearTimeout(showToast.timeout);

  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3200);
}

function setupKeyboardShortcut() {
  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

    if (isShortcut) {
      event.preventDefault();
      searchInput.focus();
    }

    if (event.key === "Escape") {
      sidebar.classList.remove("sidebar--mobile-open");
    }
  });
}

function setupChartTooltip() {
  chartPoints.forEach((point, index) => {
    point.addEventListener("mouseenter", () => {
      const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"];
      const values = ["R$ 32.800", "R$ 41.200", "R$ 45.900", "R$ 49.700", "R$ 53.100", "R$ 58.400", "R$ 60.200"];

      tooltip.innerHTML = `
        <strong>${months[index]}</strong>
        <span>Receita: ${values[index]}</span>
      `;

      tooltip.classList.add("chart-tooltip--visible");
    });

    point.addEventListener("mouseleave", () => {
      tooltip.classList.remove("chart-tooltip--visible");
    });
  });
}

initializeTheme();
initializeSidebar();
setupKeyboardShortcut();
setupChartTooltip();

themeToggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

sidebarToggle.addEventListener("click", toggleSidebar);

mobileMenuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar--mobile-open");
});

newRequestButton.addEventListener("click", () => {
  showToast("Área de criação de solicitações será aberta em breve.");
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim();

  if (query.length >= 3) {
    showToast(`Buscando por: "${query}"`);
  }
});

document.addEventListener("click", (event) => {
  const isMobile = window.innerWidth <= 760;
  const clickedOutsideSidebar = !sidebar.contains(event.target);
  const clickedMenuButton = mobileMenuToggle.contains(event.target);

  if (isMobile && clickedOutsideSidebar && !clickedMenuButton) {
    sidebar.classList.remove("sidebar--mobile-open");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    sidebar.classList.remove("sidebar--mobile-open");
  }
});