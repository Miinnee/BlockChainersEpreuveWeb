document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Animation du bouton
    const btn = document.querySelector('.btn-reserve');
    const originalText = btn.textContent;
    
    btn.textContent = 'Réservation en cours...';
    btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    setTimeout(() => {
        btn.textContent = 'Réservation confirmée !';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
        }, 2000);
    }, 1500);
});

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

// Animation d'apparition
window.addEventListener('load', () => {
    const card = document.querySelector('.reservation-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.8s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
});