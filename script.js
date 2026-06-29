/* ============================================================
   MG Reus Grup J.Ariza Aluminis — script.js
   ============================================================ */

const WHATSAPP_NUMBER = '34657625022';

/* --- Navbar: scroll effect + mobile toggle --- */
(function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
})();

/* --- Scroll animations (Intersection Observer) --- */
(function initReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-card').forEach(el => {
        observer.observe(el);
    });
})();

/* --- Counter animation for hero stats --- */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOut(progress) * target);
            el.textContent = value.toLocaleString('es-ES') + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();

/* --- Contact form → WhatsApp --- */
(function initForm() {
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    const fields = {
        fname:    { el: document.getElementById('fname'),    errEl: document.getElementById('fname-error'),    msg: 'Por favor, escribe tu nombre.' },
        fphone:   { el: document.getElementById('fphone'),   errEl: document.getElementById('fphone-error'),   msg: 'Por favor, escribe tu teléfono.' },
        fservice: { el: document.getElementById('fservice'), errEl: document.getElementById('fservice-error'), msg: 'Por favor, selecciona un servicio.' },
    };

    function validateField(key) {
        const f = fields[key];
        const valid = f.el.value.trim() !== '';
        f.el.classList.toggle('error', !valid);
        f.errEl.textContent = valid ? '' : f.msg;
        return valid;
    }

    Object.keys(fields).forEach(key => {
        fields[key].el.addEventListener('input', () => validateField(key));
        fields[key].el.addEventListener('change', () => validateField(key));
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const valid = Object.keys(fields).map(validateField).every(Boolean);
        if (!valid) return;

        const nombre   = document.getElementById('fname').value.trim();
        const telefono = document.getElementById('fphone').value.trim();
        const servicio = document.getElementById('fservice').value;
        const mensaje  = document.getElementById('fmessage').value.trim();

        let text = `Hola, me llamo *${nombre}* y me gustaría pedir un presupuesto.\n\n`;
        text += `📱 Teléfono: ${telefono}\n`;
        text += `🔧 Servicio: ${servicio}\n`;
        if (mensaje) text += `\n💬 Proyecto: ${mensaje}`;
        text += `\n\n_(Contacto desde la web mgreusaluminis.com)_`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

        submitBtn.textContent = '¡Abriendo WhatsApp...';
        submitBtn.disabled = true;

        window.open(url, '_blank', 'noopener,noreferrer');

        setTimeout(() => {
            submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Mensaje preparado!`;
            submitBtn.style.background = '#128C7E';
        }, 800);

        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.39 5.39 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Enviar consulta por WhatsApp`;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 4000);
    });
})();

/* --- Cookie consent banner --- */
(function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    if (localStorage.getItem('cookie_consent')) return;
    setTimeout(() => banner.classList.add('visible'), 900);

    document.getElementById('cookieAccept')?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'accepted');
        banner.classList.remove('visible');
    });
    document.getElementById('cookieDecline')?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'necessary');
        banner.classList.remove('visible');
    });
})();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* --- Active nav link on scroll --- */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;

    function setActive() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - navH - 40) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.style.color = (href === current) ? '#1e3a6b' : '';
            link.style.background = (href === current) ? 'rgba(30,58,107,0.08)' : '';
            link.style.fontWeight = (href === current) ? '600' : '';
        });
    }

    window.addEventListener('scroll', setActive, { passive: true });
})();
