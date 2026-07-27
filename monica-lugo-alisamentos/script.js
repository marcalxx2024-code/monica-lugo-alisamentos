const resetInitialScrollPosition = () => {
  if (window.location.hash) {
    return;
  }

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previousScrollBehavior;
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

resetInitialScrollPosition();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    resetInitialScrollPosition();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-button");
  const menu = document.querySelector(".main-nav");
  const toast = document.querySelector("#toast");

  const closeMenu = () => {
    menu?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    const label = menuButton?.querySelector(".sr-only");
    if (label) label.textContent = "Abrir menu";
  };

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  };

  const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

  const buildWhatsAppUrl = (message = siteData.whatsappMessage) => {
    const phone = normalizePhone(siteData?.links?.whatsappNumber);

    if (!phone) {
      return "";
    }

    const encodedMessage = encodeURIComponent(message || "");
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const configureWhatsAppLink = (link, message) => {
    if (!link) return;

    const whatsappUrl = buildWhatsAppUrl(message);

    if (whatsappUrl) {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-disabled");
      return;
    }

    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("O número do WhatsApp será adicionado em breve.");
    });
  };

  const configureWhatsAppLinks = () => {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      configureWhatsAppLink(link, siteData.whatsappMessage);
    });

    document.querySelectorAll("[data-service-whatsapp]").forEach((link) => {
      const service = siteData.services[Number(link.dataset.serviceIndex)];
      configureWhatsAppLink(link, service?.whatsappMessage);
    });
  };

  const configureMapsLink = () => {
    const mapsLink = document.querySelector("#quick-maps");

    if (!mapsLink) return;

    if (siteData.links.googleMaps) {
      mapsLink.href = siteData.links.googleMaps;
      mapsLink.target = "_blank";
      mapsLink.rel = "noopener noreferrer";
      mapsLink.removeAttribute("aria-disabled");
      mapsLink.classList.remove("is-disabled");
      mapsLink.querySelector("small").textContent = "Abrir no Google Maps";
      return;
    }

    mapsLink.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Não foi possível abrir o mapa no momento.");
    });
  };

  const renderServices = () => {
    const grid = document.querySelector("#services-grid");

    if (!grid) return;

    grid.innerHTML = siteData.services
      .map(
        (service, index) => `
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">${service.icon}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="#" data-service-whatsapp data-service-index="${index}" aria-label="Consultar ${service.title} pelo WhatsApp">Consultar pelo WhatsApp</a>
          </article>
        `
      )
      .join("");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.querySelector(".sr-only").textContent = isOpen ? "Fechar menu" : "Abrir menu";

    if (isOpen) {
      menu?.querySelector("a")?.focus();
    }
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) {
      closeMenu();
      menuButton?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (menu?.classList.contains("is-open") && !menu.contains(event.target) && !menuButton?.contains(event.target)) {
      closeMenu();
    }
  });

  document.querySelector("#current-year").textContent = new Date().getFullYear();

  const mobileWhatsapp = document.querySelector("#mobile-whatsapp");
  const contactSection = document.querySelector(".contact-section");
  const footer = document.querySelector(".footer");

  if (mobileWhatsapp && "IntersectionObserver" in window) {
    const protectedSections = [contactSection, footer].filter(Boolean);
    const visibleSections = new Set();
    const contextObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target);
          } else {
            visibleSections.delete(entry.target);
          }
        });

        mobileWhatsapp.classList.toggle("is-context-near", visibleSections.size > 0);
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0 }
    );

    protectedSections.forEach((section) => contextObserver.observe(section));
  }

  renderServices();
  configureWhatsAppLinks();
  configureMapsLink();
});
