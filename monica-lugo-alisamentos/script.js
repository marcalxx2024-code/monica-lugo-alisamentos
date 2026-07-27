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

  const normalizePhone = (value) => value.replace(/\D/g, "");

  const buildWhatsAppUrl = () => {
    const phone = normalizePhone(siteData.links.whatsappNumber || "");

    if (!phone) {
      return "";
    }

    const message = encodeURIComponent(siteData.whatsappMessage);
    return `https://wa.me/${phone}?text=${message}`;
  };

  const configureWhatsAppLinks = () => {
    const links = [
      document.querySelector("#cta-whatsapp"),
      document.querySelector("#quick-whatsapp"),
      document.querySelector("#contact-whatsapp"),
      document.querySelector("#mobile-whatsapp")
    ];

    const whatsappUrl = buildWhatsAppUrl();

    links.forEach((link) => {
      if (!link) return;

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
      mapsLink.querySelector("small").textContent = "Abrir mapa";
      return;
    }

    mapsLink.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("A localização será adicionada em breve.");
    });
  };

  const renderServices = () => {
    const grid = document.querySelector("#services-grid");

    if (!grid) return;

    grid.innerHTML = siteData.services
      .map(
        (service) => `
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">${service.icon}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="#contato" aria-label="Saber mais sobre ${service.title}">Saber mais →</a>
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
  const footer = document.querySelector(".footer");

  if (mobileWhatsapp && footer && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        mobileWhatsapp.classList.toggle("is-footer-near", entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    footerObserver.observe(footer);
  }

  renderServices();
  configureWhatsAppLinks();
  configureMapsLink();
});
