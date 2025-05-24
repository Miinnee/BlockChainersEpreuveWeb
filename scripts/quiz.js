// Données du quiz
const quizData = [
    {
        image: "../../assets/img/Lyon_-_Basilique_de_Fourvière_by_night.JPG",
        question: "Quel est ce monument emblématique de Lyon?",
        options: [
            "Cathédrale Saint-Jean",
            "Basilique Notre-Dame de Fourvière",
            "Opéra de Lyon",
            "Hôtel de Ville"
        ],
        answer: "Basilique Notre-Dame de Fourvière"
    },
    {
        image: "../../assets/img/placeterreaux.jpg",
        question: "Quelle célèbre place lyonnaise est représentée ici?",
        options: [
            "Place Bellecour",
            "Place des Jacobins",
            "Place des Terreaux",
            "Place de la République"
        ],
        answer: "Place des Terreaux"
    },
    {
        image: "../../assets/img/teatre_romain_nuit.jpg",
        question: "Quel site historique voyez-vous ici?",
        options: [
            "Théâtres romains de Fourvière",
            "Amphithéâtre des Trois Gaules",
            "Arènes de Lyon",
            "Théâtre antique de Vienne"
        ],
        answer: "Théâtres romains de Fourvière"
    },
    {
        image: "../../assets/img/confluences.jpg",
        question: "Quel musée moderne est représenté sur cette image?",
        options: [
            "Musée des Beaux-Arts",
            "Musée des Confluences",
            "Musée Gadagne",
            "Musée Lumière"
        ],
        answer: "Musée des Confluences"
    },
    {
        image: "../../assets/img/vieux_lyon.jpg",
        question: "Quel quartier historique de Lyon est visible ici?",
        options: [
            "La Croix-Rousse",
            "Vieux Lyon",
            "Presqu'île",
            "La Part-Dieu"
        ],
        answer: "Vieux Lyon"
    }
];

// Éléments du DOM
const quizImage = document.getElementById('quiz-image');
const optionsContainer = document.getElementById('options-container');
const resultMessage = document.getElementById('result-message');
const nextBtn = document.getElementById('next-btn');
const quizProgress = document.getElementById('quiz-progress');
const quizHeader = document.getElementById('quiz-header');
const quizContent = document.getElementById('quiz-content');

// Variables d'état
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answerChecked = false;

// Charger la question
function loadQuestion() {
    const questionData = quizData[currentQuestion];
    quizImage.src = questionData.image;
    quizImage.alt = questionData.question;
    
    optionsContainer.innerHTML = '';
    questionData.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => {
            if (!answerChecked) {
                selectOption(optionElement, option);
            }
        });
        optionsContainer.appendChild(optionElement);
    });
    
    resultMessage.textContent = '';
    nextBtn.disabled = true;
    nextBtn.textContent = "Valider";
    quizProgress.textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
    answerChecked = false;
    selectedOption = null;
}

// Sélectionner une option
function selectOption(element, option) {
    // Réinitialiser la sélection précédente
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Sélectionner la nouvelle option
    element.classList.add('selected');
    selectedOption = option;
    nextBtn.disabled = false;
}

// Vérifier la réponse
function checkAnswer() {
    const questionData = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
        if (option.textContent === questionData.answer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption && selectedOption !== questionData.answer) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedOption === questionData.answer) {
        resultMessage.textContent = "Correct! Bravo!";
        resultMessage.style.color = "#28a745";
        score++;
    } else {
        resultMessage.textContent = `Incorrect. La bonne réponse était: ${questionData.answer}`;
        resultMessage.style.color = "#dc3545";
    }
    
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? "Voir les résultats" : "Question suivante";
    answerChecked = true;
}

// Afficher les résultats finaux
function showResults() {
    quizContent.innerHTML = `
        <div class="final-results">
            <h1>Quiz Terminé!</h1>
            <div class="final-score">Votre score: ${score}/${quizData.length}</div>
            <div class="final-message">
                ${score === quizData.length 
                    ? "Félicitations! Vous connaissez parfaitement Lyon!" 
                    : score >= quizData.length / 2 
                        ? "Bon score! Votre visite a été des plus efficaces." 
                        : "Continuez à explorer Lyon pour améliorer votre score!"}
            </div>
            <button class="restart-btn" id="restart-btn">
                Retourner a l'accueil
            </button>
        </div>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        // Redirection vers une page spécifique (remplacez par votre URL)
        window.location.href = "../../index.html";
    });
}

// Gérer le clic sur le bouton suivant
function handleNextButton() {
    if (!answerChecked) {
        checkAnswer();
    } else {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            showResults();
        }
    }
}

// Initialisation
nextBtn.addEventListener('click', handleNextButton);
loadQuestion();