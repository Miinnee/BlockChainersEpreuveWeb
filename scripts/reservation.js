document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Animation du bouton
    const btn = document.querySelector('.btn-reserve');
    const originalText = btn.textContent;
    
    // Phase 1: En cours
    btn.textContent = 'Réservation en cours...';
    btn.style.background = 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)';
    btn.style.boxShadow = '0 10px 25px rgba(255, 170, 0, 0.3)';
    
    setTimeout(() => {
        // Phase 2: Confirmée
        btn.textContent = '✓ Réservation confirmée !';
        btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        btn.style.boxShadow = '0 10px 25px rgba(76, 175, 80, 0.3)';
        
        // Ajout d'une animation de particules
        createParticles(btn);
        
        setTimeout(() => {
            // Retour à l'état initial
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            btn.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.3)';
        }, 2000);
    }, 1500);
});

// Fonction pour créer des particules dorées
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#ffd700';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.boxShadow = '0 0 6px #ffd700';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        // Animation de la particule
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const lifetime = 1000 + Math.random() * 1000;
        
        let opacity = 1;
        let x = 0;
        let y = 0;
        
        const animateParticle = () => {
            x += Math.cos(angle) * velocity;
            y += Math.sin(angle) * velocity;
            opacity -= 1 / (lifetime / 16);
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animateParticle);
    }
}

// Effet de parallaxe sur le fond
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    const background = document.querySelector('.background');
    
    if (background) {
        background.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Animation d'apparition au chargement
window.addEventListener('load', () => {
    const card = document.querySelector('.reservation-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    // Animation des lumières flottantes
    animateFloatingLights();
});

// Animation continue des lumières flottantes
function animateFloatingLights() {
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, index) => {
        // Randomiser légèrement les animations
        const delay = index * 1000 + Math.random() * 1000;
        const duration = 6000 + Math.random() * 2000;
        
        light.style.animationDelay = `${delay}ms`;
        light.style.animationDuration = `${duration}ms`;
    });
}

// Effet hover sur les inputs
document.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Validation en temps réel
document.querySelectorAll('.form-input[type="email"]').forEach(input => {
    input.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            this.style.borderColor = '#4CAF50';
        } else if (this.value.length > 0) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
    });
});

// Formatage automatique du téléphone
document.querySelectorAll('.form-input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length && i < 10; i++) {
            if (i % 2 === 0 && i > 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });
});