const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const scrollProgress = document.getElementById('scroll-progress');
const cursorGlow = document.querySelector('.cursor-glow');
const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const playbookTabs = document.querySelectorAll('.playbook-tab');
const playbookPanels = document.querySelectorAll('.playbook-panel');
const fitOptions = document.querySelectorAll('.fit-option');
const fitResultCards = document.querySelectorAll('.fit-result-card');
const detailToggles = document.querySelectorAll('.detail-toggle');
const counterElements = document.querySelectorAll('.count-up');
const tiltCards = document.querySelectorAll('.tilt-card');
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

function updateScrollUI() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
}

function setMobileMenuState(isOpen) {
    navLinks.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));

    const bars = mobileToggle.querySelectorAll('.bar');
    if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

function activatePlaybook(tabKey) {
    playbookTabs.forEach((tab) => {
        const isActive = tab.dataset.playbook === tabKey;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    playbookPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tabKey);
    });
}

function activateFitCard(fitKey) {
    fitOptions.forEach((option) => {
        option.classList.toggle('active', option.dataset.fit === fitKey);
    });

    fitResultCards.forEach((card) => {
        card.classList.toggle('active', card.dataset.fitResult === fitKey);
    });
}

function setActiveNavLink() {
    const currentSection = Array.from(sections).find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 140 && rect.bottom >= 140;
    });

    navLinkItems.forEach((link) => {
        const isActive = currentSection && link.getAttribute('href') === `#${currentSection.id}`;
        link.classList.toggle('active-link', Boolean(isActive));
    });
}

function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = `${value}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            element.textContent = `${target}${suffix}`;
        }
    }

    requestAnimationFrame(tick);
}

window.addEventListener('scroll', () => {
    updateScrollUI();
    setActiveNavLink();
});

mobileToggle.addEventListener('click', () => {
    const isOpen = !navLinks.classList.contains('active');
    setMobileMenuState(isOpen);
});

navLinkItems.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            setMobileMenuState(false);
        }
    });
});

playbookTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        activatePlaybook(tab.dataset.playbook);
    });
});

fitOptions.forEach((option) => {
    option.addEventListener('click', () => {
        activateFitCard(option.dataset.fit);
    });
});

detailToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const targetPanel = document.getElementById(toggle.dataset.target);
        const isOpen = targetPanel.classList.contains('open');

        detailToggles.forEach((item) => {
            const panel = document.getElementById(item.dataset.target);
            panel.classList.remove('open');
            item.textContent = 'View highlights';
        });

        if (!isOpen) {
            targetPanel.classList.add('open');
            toggle.textContent = 'Hide highlights';
        }
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        if (entry.target.classList.contains('count-up') && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateCounter(entry.target);
        }
    });
}, {
    threshold: 0.18
});

counterElements.forEach((element) => {
    revealObserver.observe(element);
});

tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        if (window.innerWidth <= 768) {
            return;
        }

        const bounds = card.getBoundingClientRect();
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

if (cursorGlow) {
    document.addEventListener('mousemove', (event) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject Details:\n${message}`);

        formFeedback.textContent = 'Opening your email app so you can send the message directly.';
        window.location.href = `mailto:sritejaswini18@gmail.com?subject=${subject}&body=${body}`;
    });
}

document.getElementById('year').textContent = new Date().getFullYear();

updateScrollUI();
setActiveNavLink();
activatePlaybook('design');
activateFitCard('fln');

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
});

// Initialize Vanta.js 3D Background
if (window.VANTA) {
    window.VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x3dd9b4,
        backgroundColor: 0x07111f,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00
    });
}
