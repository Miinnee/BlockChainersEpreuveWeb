// Gestion interactive de la page de réservation

// Variables globales
let selectedFormula = 'decouverte';
let formulaPrices = {
    decouverte: 25,
    premium: 45
};
let nbPersonnes = 0;

// Initialisation au chargement de la page"iorqdsfdqs
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandlers();
    initializePaymentModal();
    initializeAnimations();
    updatePriceSummary();
});

// Gestion des formules et calcul des prix
function initializeFormHandlers() {
    // Gestion du changement de formule
    const formulaInputs = document.querySelectorAll('input[name="formula"]');
    formulaInputs.forEach(input => {
        input.addEventListener('change', function() {
            selectedFormula = this.value;
            updatePriceSummary();
            
            // Animation de sélection
            const cards = document.querySelectorAll('.formula-card');
            cards.forEach(card => {
                card.style.transform = 'scale(1)';
            });
            this.closest('.formula-card').style.transform = 'scale(1.02)';
        });
    });

    // Gestion du nombre de personnes
    const nbPersonnesSelect = document.getElementById('nbPersonnes');
    if (nbPersonnesSelect) {
        nbPersonnesSelect.addEventListener('change', function() {
            nbPersonnes = parseInt(this.value) || 0;
            updatePriceSummary();
        });
    }

    // Validation en temps réel des champs
    initializeFieldValidation();

    // Gestion du formulaire principal
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
}

// Mise à jour du résumé des prix
function updatePriceSummary() {
    const formulaName = selectedFormula === 'decouverte' ? 'Découverte' : 'Premium';
    const unitPrice = formulaPrices[selectedFormula];
    const totalPrice = unitPrice * nbPersonnes;

    // Mise à jour des éléments
    updateElement('selectedFormula', formulaName);
    updateElement('unitPrice', `${unitPrice}€`);
    updateElement('nbPersonnesDisplay', nbPersonnes > 0 ? nbPersonnes : '-');
    updateElement('totalPrice', `${totalPrice}€`);

    // Animation du total
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.style.transform = 'scale(1.2)';
        totalElement.style.color = '#ffed4e';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
            totalElement.style.color = '#ffd700';
        }, 300);
    }
}

// Fonction utilitaire pour mettre à jour un élément
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Validation des champs en temps réel
function initializeFieldValidation() {
    // Validation email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value)) {
                this.style.borderColor = '#4CAF50';
                showFieldFeedback(this, 'valid');
            } else if (this.value.length > 0) {
                this.style.borderColor = '#ff6b6b';
                showFieldFeedback(this, 'invalid');
            } else {
                this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                hideFieldFeedback(this);
            }
        });
    });

    // Validation téléphone
    const telInputs = document.querySelectorAll('input[type="tel"]');
    telInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = '';
            
            // Formatage automatique
            for (let i = 0; i < value.length && i < 10; i++) {
                if (i % 2 === 0 && i > 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
            
            // Validation
            if (value.length === 10) {
                this.style.borderColor = '#4CAF50';
                showFieldFeedback(this, 'valid');
            } else if (value.length > 0) {
                this.style.borderColor = '#ff6b6b';
                showFieldFeedback(this, 'invalid');
            } else {
                this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                hideFieldFeedback(this);
            }
        });
    });

    // Validation date (pas de dates passées)
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Définir la date minimum à aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
        
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate >= today) {
                this.style.borderColor = '#4CAF50';
                showFieldFeedback(this, 'valid');
            } else {
                this.style.borderColor = '#ff6b6b';
                showFieldFeedback(this, 'invalid');
                showNotification('Veuillez sélectionner une date future', 'error');
            }
        });
    });

    // Validation des champs requis
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ff6b6b';
                showFieldFeedback(this, 'required');
            }
        });
    });
}

// Afficher le feedback visuel pour un champ
function showFieldFeedback(field, type) {
    // Supprimer le feedback existant
    hideFieldFeedback(field);
    
    const feedback = document.createElement('div');
    feedback.className = `field-feedback ${type}`;
    
    const messages = {
        valid: '✓ Valide',
        invalid: '✗ Format invalide',
        required: '✗ Champ requis'
    };
    
    feedback.textContent = messages[type] || '';
    field.parentElement.appendChild(feedback);
    
    // Animation d'apparition
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
    }, 10);
}

// Masquer le feedback d'un champ
function hideFieldFeedback(field) {
    const existingFeedback = field.parentElement.querySelector('.field-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

// Gestion de la soumission du formulaire
function handleReservationSubmit(e) {
    e.preventDefault();
    
    // Vérifier que tous les champs sont valides
    const form = e.target;
    const isValid = form.checkValidity();
    
    if (!isValid) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (nbPersonnes === 0) {
        showNotification('Veuillez sélectionner le nombre de personnes', 'error');
        document.getElementById('nbPersonnes').focus();
        return;
    }
    
    // Afficher le modal de paiement
    showPaymentModal();
}

// Gestion du modal de paiement
function initializePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close-modal');
    const paymentForm = document.querySelector('.payment-form');
    
    if (!modal || !closeBtn || !paymentForm) return;
    
    // Fermer le modal
    closeBtn.addEventListener('click', hidePaymentModal);
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hidePaymentModal();
        }
    });
    
    // Gestion du formulaire de paiement
    paymentForm.addEventListener('submit', handlePayment);
    
    // Formatage automatique du numéro de carte
    const cardInput = paymentForm.querySelector('input[placeholder*="1234"]');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length && i < 16; i++) {
                if (i % 4 === 0 && i > 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Formatage de la date d'expiration
    const expiryInput = paymentForm.querySelector('input[placeholder="MM/AA"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Limite CVV à 3 chiffres
    const cvvInput = paymentForm.querySelector('input[placeholder="123"]');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

// Afficher le modal de paiement
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    // Mettre à jour le total dans le modal
    const totalPrice = formulaPrices[selectedFormula] * nbPersonnes;
    updateElement('modalTotal', `${totalPrice}€`);
    
    // Afficher le modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Focus sur le premier champ
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }
}

// Masquer le modal de paiement
function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Gestion du paiement
function handlePayment(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Animation du bouton
    submitBtn.disabled = true;
    submitBtn.textContent = 'Traitement en cours...';
    submitBtn.style.background = 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)';
    
    // Simuler le traitement du paiement
    setTimeout(() => {
        hidePaymentModal();
        showPaymentSuccess();
        
        // Réinitialiser le formulaire
        document.getElementById('reservationForm').reset();
        nbPersonnes = 0;
        updatePriceSummary();
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
    }, 2000);
}

// Afficher le message de succès
function showPaymentSuccess() {
    const successModal = document.getElementById('paymentSuccess');
    if (!successModal) return;
    
    successModal.style.display = 'flex';
    
    // Animation de confettis
    createConfetti();
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        hidePaymentSuccess();
    }, 5000);
    
    // Bouton de fermeture
    const closeBtn = successModal.querySelector('.close-success-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', hidePaymentSuccess, { once: true });
    }
}

// Masquer le message de succès
function hidePaymentSuccess() {
    const successModal = document.getElementById('paymentSuccess');
    if (!successModal) return;
    
    successModal.style.opacity = '0';
    setTimeout(() => {
        successModal.style.display = 'none';
        successModal.style.opacity = '1';
    }, 300);
}

// Créer des confettis pour célébrer
function createConfetti() {
    const colors = ['#ffd700', '#ffed4e', '#ff8800', '#fff'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            z-index: 1002;
        `;
        
        document.body.appendChild(confetti);
        
        // Animation de chute
        const duration = 3000 + Math.random() * 2000;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${horizontalMovement}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Nettoyer après l'animation
        setTimeout(() => confetti.remove(), duration);
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const styles = {
        info: { background: '#3498db', icon: 'ℹ' },
        success: { background: '#4CAF50', icon: '✓' },
        error: { background: '#f44336', icon: '✗' },
        warning: { background: '#ff9800', icon: '⚠' }
    };
    
    const style = styles[type] || styles.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${style.background};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-size: 1rem;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `<span style="margin-right: 10px; font-size: 1.2em;">${style.icon}</span> ${message}`;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations supplémentaires
function initializeAnimations() {
    // Animation de parallaxe sur le fond
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        const background = document.querySelector('.page-background');
        
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
    
    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les éléments
    document.querySelectorAll('.formula-card, .form-group, .price-summary').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Animation des lumières flottantes
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, index) => {
        const delay = index * 1000 + Math.random() * 1000;
        const duration = 6000 + Math.random() * 2000;
        
        light.style.animationDelay = `${delay}ms`;
        light.style.animationDuration = `${duration}ms`;
    });
}

// Ajout des styles pour les animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .field-feedback {
        position: absolute;
        bottom: -25px;
        left: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .field-feedback.valid {
        color: #4CAF50;
    }
    
    .field-feedback.invalid {
        color: #ff6b6b;
    }
    
    .field-feedback.required {
        color: #ff9800;
    }
    
    .form-field {
        position: relative;
        margin-bottom: 30px;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);