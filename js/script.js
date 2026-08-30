/* ==========================================================================
   SCRIPT.JS — shared across every page
   First-visit loading screen, smooth page transitions, navbar scroll,
   mobile menu, scroll-reveal, active-nav-link highlighting.
   ========================================================================== */

// ========== LOADER (first open only) ==========
const progress = document.getElementById('progress');
const loader = document.getElementById('loader');
const SESSION_KEY = 'techzone_visited';

function startLoader() {
    if (!loader) return;
    let width = 0;
    if (progress) progress.style.width = '0%';
    loader.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    const loadingInterval = setInterval(() => {
        const remaining = 100 - width;
        const step = Math.max(1.5, remaining * 0.08) + Math.random() * 4;
        width += step;
        const pct = Math.min(100, Math.round(width));
        const percentEl = document.getElementById('loaderPercent');
        if (percentEl) percentEl.textContent = pct + '%';
        if (width >= 100) {
            width = 100;
            clearInterval(loadingInterval);
            if (progress) progress.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.style.overflow = 'auto';
                document.body.classList.add('page-ready');
                sessionStorage.setItem(SESSION_KEY, '1');
            }, 400);
        } else if (progress) {
            progress.style.width = width + '%';
        }
    }, 90);
}

function skipLoader() {
    if (loader) {
        loader.classList.add('hide');
        loader.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
    // Smooth enter animation for subsequent pages
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('page-ready');
        });
    });
}

// First visit in this browser tab/session → full loader
// Later page navigations → smooth transition only
if (sessionStorage.getItem(SESSION_KEY)) {
    skipLoader();
} else {
    document.body.style.overflow = 'hidden';
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLoader);
    } else {
        startLoader();
    }
}

// ========== SMOOTH PAGE TRANSITIONS ==========
// Fade out before navigating to internal pages
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, new tabs, downloads
    if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        link.target === '_blank' ||
        link.hasAttribute('download')
    ) {
        return;
    }

    // Same-page hash only
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (href === current || href === './' + current) return;

    e.preventDefault();
    document.body.classList.remove('page-ready');
    document.body.classList.add('page-exit');

    setTimeout(() => {
        window.location.href = href;
    }, 280);
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========== MOBILE MENU ==========
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

if (hamburger && mobileMenu && overlay) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        overlay.classList.add('show');
    });

    overlay.addEventListener('click', closeMenu);
}

function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// ========== SCROLL REVEAL ==========
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ========== ACTIVE NAV LINK ==========
(function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
})();
