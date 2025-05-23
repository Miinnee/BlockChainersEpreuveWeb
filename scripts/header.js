// Script pour les interactions du header premium

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet de scroll sur le header
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Effet de parallaxe léger
        const parallaxOffset = currentScrollY * 0.1;
        header.style.transform = `translateY(${parallaxOffset}px)`;
        
        lastScrollY = currentScrollY;
    }
    
    // Optimisation avec requestAnimationFrame
    let ticking = false;
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Menu mobile
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
            
            // Animation staggerée des liens
            if (navMenu.classList.contains('mobile-open')) {
                navLinks.forEach((link, index) => {
                    link.style.animationDelay = `${index * 0.1}s`;
                    link.style.animation = 'fadeInUp 0.6s ease-out backwards';
                });
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('mobile-open');
                }
            });
        });
        
        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target) && navMenu.classList.contains('mobile-open')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('mobile-open');
            }
        });
    }
    
    // Effet de hover amélioré sur les liens
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Créer un effet de particules temporaire
            createParticleEffect(this);
        });
        
        link.addEventListener('mouseleave', function() {
            // Nettoyer les particules
            removeParticleEffect(this);
        });
    });
    
    // Fonction pour créer l'effet de particules
    function createParticleEffect(element) {
        const particles = [];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'nav-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--gold-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
                opacity: 0;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat ${0.8 + Math.random() * 0.4}s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Supprimer après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1200);
        }
        
        element._particles = particles;
    }
    
    // Fonction pour supprimer l'effet de particules
    function removeParticleEffect(element) {
        if (element._particles) {
            element._particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 200);
                }
            });
            element._particles = [];
        }
    }
    
    // Animation CSS pour les particules
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0);
            }
        }
        
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(particleStyle);
    
    // Gestion du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            mobileToggle?.classList.remove('active');
            navMenu?.classList.remove('mobile-open');
        }
    });
    
    // Indicateur de page active
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && linkPage.includes('#accueil')) ||
                (currentPage === 'reservation.html' && linkPage.includes('reservation')) ||
                (currentPage === 'login.html' && linkPage.includes('login'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // Smooth scroll pour les liens d'ancrage
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Effet de typing sur le logo au chargement
    const logoText = document.querySelector('.logo span');
    if (logoText) {
        const originalText = logoText.textContent;
        logoText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                logoText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Performance optimization: Utiliser Intersection Observer pour les animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observer les éléments qui ont besoin d'animation
        document.querySelectorAll('.nav-link').forEach(el => {
            observer.observe(el);
        });
    }
});

// Utilitaires pour l'intégration avec d'autres scripts
window.HeaderUtils = {
    showHeader: () => {
        document.querySelector('.header').style.transform = 'translateY(0)';
    },
    
    hideHeader: () => {
        document.querySelector('.header').style.transform = 'translateY(-100%)';
    },
    
    setActiveLink: (href) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
};