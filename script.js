// ============================
// El Progreso — script.js
// ============================

document.addEventListener('DOMContentLoaded', () => {

  /* -------- Menú de navegación móvil -------- */
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('nav ul');
  const headerNav = document.querySelector('header.nav');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('open');
      hamburger.classList.toggle('is-open');
      if (headerNav) {
        headerNav.classList.toggle('menu-open');
      }
    });

    // Cierra el menú al hacer clic en un enlace (útil en móvil)
    navList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        navList.classList.remove('open');
        hamburger.classList.remove('is-open');
        if (headerNav) {
          headerNav.classList.remove('menu-open');
        }
      });
    });
  }

  /* -------- Navbar Scroll y Sección Activa (Pill Indicator) -------- */
  const header = document.querySelector('header.nav');
  const nav = document.querySelector('header.nav nav');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('nav ul li');
  
  // Crear indicador de píldora dinámicamente si no existe
  let navIndicator = null;
  if (nav && navItems.length > 0) {
    navIndicator = document.createElement('div');
    navIndicator.className = 'nav-indicator';
    nav.appendChild(navIndicator);
  }

  const updateIndicator = (activeItem) => {
    if (!navIndicator) return;
    const rect = activeItem.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    
    // Posicionamiento de la píldora detrás del elemento
    navIndicator.style.width = `${rect.width}px`;
    navIndicator.style.height = `${rect.height}px`;
    navIndicator.style.left = `${rect.left - navRect.left}px`;
    navIndicator.style.top = `${rect.top - navRect.top}px`;
  };

  /* -------- Parallax del Hero con requestAnimationFrame (fluido) -------- */
  let lastScrollY = window.scrollY;
  let rafId = null;

  const updateParallax = () => {
    const heroBg = document.getElementById('hero-zoom-bg');
    const heroText = document.querySelector('.hero-text-cinematic');
    const scrollY = lastScrollY;

    if (heroBg && scrollY <= window.innerHeight) {
      const scaleValue = 1 + (scrollY / window.innerHeight) * 0.15;
      heroBg.style.transform = `scale(${scaleValue})`;

      if (heroText) {
        const textTranslate = scrollY * 0.35;
        const textOpacity = 1 - (scrollY / (window.innerHeight * 0.7));
        heroText.style.transform = `translateY(${textTranslate}px)`;
        heroText.style.opacity = Math.max(0, textOpacity);
      }
    }

    rafId = null;
  };

  const handleScrollAndNav = () => {
    lastScrollY = window.scrollY;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
    
    // Toglear clase al hacer scroll para encoger navbar
    if (header) {
      if (lastScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Resaltar sección activa
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (lastScrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      if (item.dataset.section === currentId) {
        if (!item.classList.contains('active')) {
          navItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        }
        updateIndicator(item);
      }
    });
  };

  window.addEventListener('scroll', handleScrollAndNav);
  
  // Ejecutar una vez al inicio
  setTimeout(handleScrollAndNav, 200);
  
  // Recalcular indicador al cambiar de tamaño la ventana
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('nav ul li.active');
    if (activeItem) updateIndicator(activeItem);
  });

  /* -------- Lógica de Productos Interactiva (Showcase) -------- */
  const productsData = {
    leche: {
      imagePath: "images/Leche.webp",
      title: "Leche fresca",
      description: "Producida diariamente a partir de ganado seleccionado y alimentado en pastizales naturales, siguiendo procesos cuidadosos para conservar su frescura y calidad.",
      price: "RD$70 / galón",
      features: [
        "Producción diaria",
        "Control sanitario",
        "Manejo responsable del ganado"
      ]
    },
    queso: {
      imagePath: "images/Queso.webp",
      title: "Queso artesanal",
      description: "Elaborado localmente con métodos tradicionales para asegurar un sabor y textura excepcionales, conservando la esencia de la leche pura de nuestra finca.",
      price: "RD$350 / kg",
      features: [
        "Elaboración tradicional",
        "Ingredientes 100% naturales",
        "Maduración controlada"
      ]
    },
    yogur: {
      imagePath: "images/Yogur.webp",
      title: "Yogur",
      description: "Yogur natural fresco, libre de conservantes artificiales y procesado artesanalmente para mantener todas sus propiedades y bacterias benéficas.",
      price: "RD$120 / litro",
      features: [
        "Sin aditivos químicos",
        "Fermentación natural",
        "Sabores de frutas locales"
      ]
    },
    ganado: {
      imagePath: "images/Ganado.webp",
      title: "Ganado",
      description: "Ejemplares de excelente genética, seleccionados y criados bajo rigurosos protocolos sanitarios para garantizar el mejor desempeño reproductivo en el trópico.",
      price: "Precio a consultar",
      features: [
        "Trazabilidad genealógica",
        "Adaptabilidad al clima local",
        "Certificación sanitaria"
      ]
    },
    carne: {
      imagePath: "images/Carne.webp",
      title: "Carne premium",
      description: "Cortes bovinos de alta calidad provenientes de animales alimentados exclusivamente en pastizales verdes, garantizando suavidad, jugosidad y gran sabor.",
      price: "RD$280 / lb",
      features: [
        "Alimentación en pastoreo",
        "Madurado óptimo",
        "Trazabilidad garantizada"
      ]
    }
  };

  const productItems = document.querySelectorAll('.product-selector-item');
  const activeImageEl = document.getElementById('active-product-image-el');
  const activeTitle = document.getElementById('active-product-title');
  const activeDescription = document.getElementById('active-product-description');
  const activePrice = document.getElementById('active-product-price');
  const activeFeatures = document.getElementById('active-product-features');
  
  const infoBlock = document.querySelector('.product-showcase-info');
  const visualBlock = document.querySelector('.product-showcase-visual');

  if (productItems.length > 0 && activeTitle) {
    const productKeys = Object.keys(productsData);
    let currentIdx = 0;
    let autoplayInterval = null;
    let isTransitioning = false;

    const switchProduct = (key, isManual = false) => {
      if (isTransitioning) return;
      
      const data = productsData[key];
      const targetItem = document.querySelector(`.product-selector-item[data-product="${key}"]`);
      if (!data || !targetItem) return;

      isTransitioning = true;
      currentIdx = productKeys.indexOf(key);

      productItems.forEach(i => i.classList.remove('active'));
      targetItem.classList.add('active');

      if (infoBlock) infoBlock.classList.add('fade-out');
      if (activeImageEl) activeImageEl.classList.add('slide-left');

      // Pre-cargar imagen para evitar flash al aparecer
      const preloadImg = new Image();
      let readyToShow = false;
      let minElapsed = false;

      const showContent = () => {
        if (!readyToShow || !minElapsed) return;

        if (activeImageEl) {
          activeImageEl.src = data.imagePath;
          activeImageEl.alt = data.title;
        }
        activeTitle.textContent = data.title;
        activeDescription.textContent = data.description;
        if (activePrice) activePrice.textContent = data.price;

        if (activeFeatures) {
          activeFeatures.innerHTML = '';
          data.features.forEach(f => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.className = 'bullet';
            li.appendChild(span);
            li.appendChild(document.createTextNode(f));
            activeFeatures.appendChild(li);
          });
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (infoBlock) infoBlock.classList.remove('fade-out');
            if (activeImageEl) activeImageEl.classList.remove('slide-left');
            setTimeout(() => { isTransitioning = false; }, 550);
          });
        });
      };

      preloadImg.onload = () => { readyToShow = true; showContent(); };
      preloadImg.onerror = () => { readyToShow = true; showContent(); };
      preloadImg.src = data.imagePath;

      // Tiempo mínimo para la transición de salida (500ms slide + buffer)
      setTimeout(() => { minElapsed = true; showContent(); }, 500);

      if (isManual) resetAutoplay();
    };

    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        const nextIdx = (currentIdx + 1) % productKeys.length;
        switchProduct(productKeys[nextIdx], false);
      }, 25000); // Cambiar cada 25 segundos
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Registrar clicks manuales
    productItems.forEach(item => {
      item.addEventListener('click', () => {
        const key = item.dataset.product;
        if (item.classList.contains('active') || isTransitioning) return;
        switchProduct(key, true);
      });
    });

    // Iniciar rotación automática al cargar
    startAutoplay();
  }

  /* -------- Carrusel de Servicios Premium (Infinito y Tilt 3D) -------- */
  const servicesTrack = document.querySelector('.services-carousel-track');
  const servicesPrevBtn = document.querySelector('.carousel-btn.prev-btn');
  const servicesNextBtn = document.querySelector('.carousel-btn.next-btn');

  if (servicesTrack && servicesPrevBtn && servicesNextBtn) {
    const originalCards = Array.from(servicesTrack.children);
    const originalCount = originalCards.length;
    const cardsToShow = 3; // Mostrar 3 tarjetas a la vez

    if (originalCount > 0) {
      // 1. Clonación dinámica para el bucle infinito
      // Clonar las primeras 3 y agregarlas al final
      const clonesEnd = originalCards.slice(0, cardsToShow).map(card => card.cloneNode(true));
      clonesEnd.forEach(clone => {
        clone.classList.add('clone');
        servicesTrack.appendChild(clone);
      });

      // Clonar las últimas 3 y agregarlas al inicio (en orden reverso para mantener secuencia)
      const clonesStart = originalCards.slice(-cardsToShow).map(card => card.cloneNode(true));
      clonesStart.reverse().forEach(clone => {
        clone.classList.add('clone');
        servicesTrack.insertBefore(clone, servicesTrack.firstChild);
      });

      let cardWidth = 0;
      let startOffset = 0;
      let totalOriginalWidth = 0;
      let isScrolling = false;
      let loopTimeout = null;

      // Calcular dimensiones estáticas del carrusel con bypass de transformación para máxima precisión
      const calculateDimensions = () => {
        const firstCard = servicesTrack.firstElementChild;
        if (firstCard) {
          const prevTransform = firstCard.style.transform;
          firstCard.style.transform = 'none';
          cardWidth = firstCard.getBoundingClientRect().width + 24;
          firstCard.style.transform = prevTransform;
        } else {
          cardWidth = 300;
        }
        startOffset = cardWidth * cardsToShow;
        totalOriginalWidth = originalCount * cardWidth;
      };

      // Inicializar posición de scroll omitiendo las 3 clonadas del inicio
      const initScrollPosition = () => {
        calculateDimensions();
        servicesTrack.scrollLeft = startOffset;
        update3dCurvature();
      };

      // Función de cálculo para curvatura 3D cilíndrica interactiva
      const update3dCurvature = () => {
        const viewportCenter = servicesTrack.scrollLeft + (servicesTrack.clientWidth / 2);
        const cards = servicesTrack.querySelectorAll('.service-card');
        
        cards.forEach(card => {
          const cardCenter = card.offsetLeft + (card.clientWidth / 2);
          const distance = cardCenter - viewportCenter;
          const normalizedDistance = distance / cardWidth; // Usar cardWidth persistente
          
          if (Math.abs(normalizedDistance) < 2.2) {
            // Curva cilíndrica 3D
            const rotation = normalizedDistance * -16; // Rotación en Y hacia el centro
            const translateZ = Math.abs(normalizedDistance) * -80; // Hundimiento en profundidad Z
            const translateY = Math.abs(normalizedDistance) * 18; // Caída vertical (arco parabólico)
            const scale = 1.04 - (Math.abs(normalizedDistance) * 0.08); // Escala progresiva
            
            card.style.transform = `perspective(1000px) rotateY(${rotation}deg) translateZ(${translateZ}px) translateY(${translateY}px) scale(${scale})`;
            card.style.opacity = 1 - (Math.min(Math.abs(normalizedDistance), 1.5) * 0.25); // Difuminado
            card.style.zIndex = Math.round(100 - Math.abs(distance));
          } else {
            card.style.transform = 'perspective(1000px) rotateY(0deg) translateZ(-120px) translateY(24px) scale(0.88)';
            card.style.opacity = '0.4';
          }
        });
      };

      // Esperar a que se renderice el layout para fijar la posición inicial
      setTimeout(initScrollPosition, 100);
      window.addEventListener('resize', () => {
        calculateDimensions();
        update3dCurvature();
      });

      // Comprobar y saltar silenciosamente si se cruzan los límites
      const checkBoundaryLoop = () => {
        // Si se pasa hacia la derecha del bloque original (hacia los clones del final)
        if (servicesTrack.scrollLeft >= startOffset + totalOriginalWidth - 4) {
          servicesTrack.scrollLeft = servicesTrack.scrollLeft - totalOriginalWidth;
        }
        // Si se pasa hacia la izquierda del bloque original (hacia los clones del inicio)
        else if (servicesTrack.scrollLeft <= startOffset - cardWidth - 4) {
          servicesTrack.scrollLeft = servicesTrack.scrollLeft + totalOriginalWidth;
        }
      };

      // Animación de deslizamiento ultra suave (EaseOutQuart - 650ms)
      const smoothScrollTo = (targetScrollLeft) => {
        if (isScrolling) return;
        isScrolling = true;

        const start = servicesTrack.scrollLeft;
        const change = targetScrollLeft - start;
        const duration = 650;
        let startTime = null;

        const easeOutQuart = (t) => 1 - (--t) * t * t * t;

        const animateScroll = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          servicesTrack.scrollLeft = start + change * easeOutQuart(progress);
          update3dCurvature();

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            isScrolling = false;
            // Salto silencioso si se cruzó algún límite
            checkBoundaryLoop();
            update3dCurvature();
          }
        };

        requestAnimationFrame(animateScroll);
      };

      servicesPrevBtn.addEventListener('click', () => {
        const target = servicesTrack.scrollLeft - cardWidth;
        smoothScrollTo(target);
      });

      servicesNextBtn.addEventListener('click', () => {
        const target = servicesTrack.scrollLeft + cardWidth;
        smoothScrollTo(target);
      });

      // Manejar saltos en scroll táctil manual en móvil/tablet
      servicesTrack.addEventListener('scroll', () => {
        update3dCurvature();
        if (!isScrolling) {
          if (loopTimeout) clearTimeout(loopTimeout);
          loopTimeout = setTimeout(() => {
            checkBoundaryLoop();
            update3dCurvature();
          }, 50);
        }
      });

      // 2. Efecto 3D Tilt en todas las tarjetas (incluyendo clones)
      const allCards = servicesTrack.querySelectorAll('.service-card');
      const carouselContainer = document.querySelector('.services-carousel-container');
      
      allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          if (carouselContainer) carouselContainer.classList.add('carousel-hovered');
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const w = rect.width;
          const h = rect.height;

          // Inclinación máxima de 12 grados
          const rotateX = ((y / h) - 0.5) * -12;
          const rotateY = ((x / w) - 0.5) * 12;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;

          // Sombras dinámicas físicas que siguen la inclinación
          const shadowX = ((x / w) - 0.5) * -16;
          const shadowY = ((y / h) - 0.5) * -16;
          card.style.boxShadow = `${shadowX}px ${shadowY + 12}px 28px rgba(74, 124, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.boxShadow = 'var(--shadow-premium)';
          if (carouselContainer) carouselContainer.classList.remove('carousel-hovered');
          update3dCurvature(); // Restaurar curvatura 3D calculada
        });
      });
    }
  }

  /* -------- Formulario de contacto (simulado) -------- */
  const form = document.querySelector('.contact-form');
  const successMsg = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = form.querySelector('input[type="text"]').value.trim();
      const correo = form.querySelector('input[type="email"]').value.trim();
      const mensaje = form.querySelector('textarea').value.trim();

      if (!nombre || !correo || !mensaje) {
        alert('Por favor completa todos los campos antes de enviar.');
        return;
      }

      // Simulación de envío (no hay backend real)
      console.log('Formulario enviado (simulado):', { nombre, correo, mensaje });

      if (successMsg) {
        successMsg.textContent = `¡Gracias, ${nombre}! Hemos recibido tu mensaje y te contactaremos pronto.`;
        successMsg.classList.add('show');
      }

      form.reset();
    });
  }

  /* -------- Lightbox de galería -------- */
  const galleryFrames = document.querySelectorAll('.gallery-grid .frame');
  const overlay = document.querySelector('.lightbox-overlay');
  const lightboxBox = document.querySelector('.lightbox-box');

  if (overlay && lightboxBox) {
    galleryFrames.forEach(frame => {
      frame.style.cursor = 'pointer';
      frame.addEventListener('click', () => {
        lightboxBox.textContent = frame.textContent;
        overlay.classList.add('show');
      });
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
        overlay.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay.classList.remove('show');
    });
  }

  /* -------- Smooth scroll con easing personalizado -------- */
  document.querySelectorAll('[data-target]').forEach(el => {
    el.addEventListener('click', function (e) {
      const targetId = this.dataset.target;
      if (!targetId) return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = 90;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1200;
      let start = null;

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    });
  });

  /* -------- Sistema de Luciérnagas / Partículas de Fondo -------- */
  const initParticles = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.45';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = 25; // Rendimiento óptimo

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height * 0.1;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = -(Math.random() * 0.35 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.004 + 0.001;
        this.color = Math.random() > 0.5 ? '200, 155, 60' : '74, 124, 42'; // Oro o Verde
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.y < 0 || this.x < 0 || this.x > width) {
          this.reset();
          this.y = height;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, 0.3)`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
      particles[i].y = Math.random() * height;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    animate();
  };

  initParticles();

  /* -------- Efecto 3D Tilt Interactivo en Tarjetas -------- */
  const init3dTilt = () => {
    const targetCards = document.querySelectorAll('.service-card, .product-card, .stat-card, .frame, .team-card, .philosophy-card');
    const activeFrame = document.querySelector('.active-product-frame');
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;

    targetCards.forEach(card => {
      const isActiveFrame = card.classList.contains('active-product-frame');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * -6;

        if (isActiveFrame) {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
          card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  };

  init3dTilt();

  /* -------- Animación de Entrada en Scroll (Scroll Reveal & Stagger) -------- */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Stagger grid layouts
    const staggerGrids = document.querySelectorAll('.services-grid, .products-grid, .stats-block, .gallery-grid, .about-media, .history-row, .philosophy-grid, .team-grid');
    staggerGrids.forEach(grid => {
      const children = grid.children;
      Array.from(children).forEach((child, index) => {
        child.classList.add('reveal-up');
        child.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(child);
      });
    });
  };

  initScrollReveal();

  /* -------- Acordeón de Misión, Visión y Valores (Filosofía) -------- */
  const initPhilosophyAccordion = () => {
    const philosophyCards = document.querySelectorAll('.philosophy-card');
    philosophyCards.forEach(card => {
      const header = card.querySelector('.philosophy-header');
      const content = card.querySelector('.philosophy-content');
      
      if (header && content) {
        header.addEventListener('click', () => {
          const isActive = card.classList.contains('active');
          
          // Cerrar todos los demás
          philosophyCards.forEach(c => {
            c.classList.remove('active');
            const otherContent = c.querySelector('.philosophy-content');
            if (otherContent) {
              otherContent.style.maxHeight = null;
            }
          });
          
          // Alternar el actual
          if (!isActive) {
            card.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            card.classList.remove('active');
            content.style.maxHeight = null;
          }
        });
      }
    });
  };

  initPhilosophyAccordion();

});