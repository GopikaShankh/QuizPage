let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let selectedCategory = null;
let correctAnswers = 0;
let incorrectAnswers = 0;
const totalQuestions = 10;
let timer;
let timeLeft = 15;

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

async function loadCategories() {
  const categoryContainer = document.getElementById("categories");

  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    const categories = data.trivia_categories;
console.log(categories);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "category-btn";
      button.textContent = category.name;
      button.onclick = () => selectCategory(category.id);
      categoryContainer.appendChild(button);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function selectCategory(categoryId) {
  selectedCategory = categoryId;
  fetchQuestions();
  showQuizScreen();
}

async function fetchQuestions() {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${totalQuestions}&difficulty=easy&category=${selectedCategory}&type=multiple`
    );
    const data = await response.json();
    questions = data.results;
    loadQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function showQuizScreen() {
  document.getElementById("category-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
}

function loadQuestion() {
  clearInterval(timer); // Stop previous timer
  const questionBox = document.getElementById("question-box");
  const answersContainer = document.getElementById("answers-container");
  const feedbackContainer = document.getElementById("feedback-container");

  questionBox.innerHTML = "";
  answersContainer.innerHTML = "";
  feedbackContainer.style.display = "none";

  const question = questions[currentQuestionIndex];
  questionBox.innerHTML = `<h2>${question.question}</h2>`;

  const options = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(options);

  const letters = ["A", "B", "C", "D"];
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerText = `${letters[index]}: ${option}`;
    button.onclick = () => checkAnswer(option, question.correct_answer);
    answersContainer.appendChild(button);
  });

  startTimer(); // Start the timer when the question loads
}

function checkAnswer(selectedAnswer, correctAnswer) {
  clearInterval(timer); // Stop the timer
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.style.display = "block";

  if (selectedAnswer === correctAnswer) {
    feedbackContainer.textContent = "Correct!";
    feedbackContainer.className = "correct";
    score++;
    correctAnswers++;
  } else {
    feedbackContainer.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
    feedbackContainer.className = "wrong";
    incorrectAnswers++;
  }

  disableAnswers(); // Disable buttons once an answer is selected

  setTimeout(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

function startTimer() {
  const timerElement = document.getElementById("timer");
  timeLeft = 15;
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      disableAnswers();
      showTimeoutFeedback();
      setTimeout(loadNextQuestion, 2000);
    }
  }, 1000);
}

function showTimeoutFeedback() {
  const question = questions[currentQuestionIndex];
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.style.display = "block";
  feedbackContainer.textContent = `Time's up! The correct answer was: ${question.correct_answer}`;
  feedbackContainer.className = "wrong";
  incorrectAnswers++;
}

function disableAnswers() {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));
}

function loadNextQuestion() {
  clearInterval(timer);
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.style.display = "none";

  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResults();
  }
}

function goBackToCategories() {
  currentQuestionIndex = 0;
  score = 0;
  questions = [];
  correctAnswers = 0;
  incorrectAnswers = 0;
  clearInterval(timer);

  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("category-container").style.display = "block";
  document.getElementById("result-container").style.display = "none";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showResults() {
  clearInterval(timer);
  document.getElementById("quiz-container").style.display = "none";
  document.body.style.backgroundImage = "url('https://file.pngbackground.com/uploads/preview/picsart-new-cb-dark-background-full-hd-download-11663733717vkp8bmqb8u.jpg')";

  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "block";

  document.getElementById("final-score").textContent = score;
  document.getElementById("total-questions").textContent = totalQuestions;
  document.getElementById("correct-answers").textContent = correctAnswers;
  document.getElementById("incorrect-answers").textContent = incorrectAnswers;

  const correctList = document.getElementById("correct-question-list");
  correctList.innerHTML = "";

  questions.forEach((question, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Q${index + 1}:</strong> ${question.question}<br><strong>Correct Answer:</strong> ${question.correct_answer}`;
    correctList.appendChild(li);
  });
}
