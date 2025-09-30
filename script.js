const quizData = {
    math: [
        {
            question: "What is 5 + 7?",
            choices: ["10", "11", "12", "13"],
            correct: 2
        },
        {
            question: "What is 9 * 3?",
            choices: ["27", "26", "23", "30"],
            correct: 0
        },
        {
            question: "What is the square root of 81?",
            choices: ["6", "7", "9", "8"],
            correct: 2
        }
    ],
    science: [
        {
            question: "What planet is known as the Red Planet?",
            choices: ["Earth", "Mars", "Jupiter", "Saturn"],
            correct: 1
        },
        {
            question: "What gas do plants absorb from the atmosphere?",
            choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
            correct: 1
        },
        {
            question: "What is H2O commonly known as?",
            choices: ["Salt", "Water", "Hydrogen", "Oxygen"],
            correct: 1
        }
    ],
    history: [
        {
            question: "Who was the first president of the United States?",
            choices: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"],
            correct: 0
        },
        {
            question: "In which year did World War II end?",
            choices: ["1945", "1939", "1950", "1942"],
            correct: 0
        },
        {
            question: "Which empire was ruled by Julius Caesar?",
            choices: ["Greek", "Roman", "Persian", "Egyptian"],
            correct: 1
        }
    ]
};

const categorySelection = document.getElementById('category-selection');
const categoriesDiv = document.getElementById('categories');
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

let currentCategory = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

function init() {
    Object.keys(quizData).forEach(category => {
        const btn = document.createElement('button');
        btn.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        btn.classList.add('category-btn');
        btn.addEventListener('click', () => startQuiz(category));
        categoriesDiv.appendChild(btn);
    });
}

function startQuiz(category) {
    currentCategory = category;
    currentQuestions = quizData[category];
    currentQuestionIndex = 0;
    score = 0;
    categorySelection.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    showQuestion();
    resetProgressBar();
}

function showQuestion() {
    clearFeedback();
    resetTimer();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;
    choicesEl.innerHTML = '';
    currentQuestion.choices.forEach((choice, index) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.innerText = choice;
        choiceBtn.classList.add('choice-btn');
        choiceBtn.addEventListener('click', () => selectAnswer(index));
        choicesEl.appendChild(choiceBtn);
    });
    nextBtn.classList.add('hidden');
    updateProgressBar();
    startTimer();
}

function selectAnswer(selectedIndex) {
    stopTimer();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const choiceButtons = choicesEl.querySelectorAll('button');
    if (selectedIndex === currentQuestion.correct) {
        score++;
        if(selectedIndex >= 0) {
            choiceButtons[selectedIndex].classList.add('correct');
        }
        showFeedback('Correct!');
    } else {
        if(selectedIndex >= 0) {
            choiceButtons[selectedIndex].classList.add('incorrect');
        }
        choiceButtons[currentQuestion.correct].classList.add('correct');
        showFeedback('Incorrect!');
    }
    disableAllChoices();
    nextBtn.classList.remove('hidden');
}

function disableAllChoices() {
    const choiceButtons = choicesEl.querySelectorAll('button');
    choiceButtons.forEach(button => {
        button.disabled = true;
    });
}

function showFeedback(message) {
    feedbackEl.innerText = message;
}

function clearFeedback() {
    feedbackEl.innerText = '';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreEl.innerText = `You scored ${score} out of ${currentQuestions.length}`;
}

function resetProgressBar() {
    progressBar.style.width = '0%';
}

function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = progressPercent + '%';
}

function startTimer() {
    timeLeft = 15;
    timerEl.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            selectAnswer(-1); // No selection, treat as incorrect
            nextBtn.classList.remove('hidden');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
}

function stopTimer() {
    clearInterval(timer);
}

nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', () => {
    categorySelection.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    quizContainer.classList.add('hidden');
    score = 0;
    currentQuestionIndex = 0;
    resetProgressBar();
});

init();
