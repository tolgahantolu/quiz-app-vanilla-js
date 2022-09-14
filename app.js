(function () {
  const baseUrl =
    "https://opentdb.com/api.php?amount=5&category=18&type=multiple";

  // *SELECTING ELEMENTS
  const quizContainer = document.querySelector(".quiz__container");
  const quizScore = document.querySelector(".quiz__scoreBoard .quiz__score");
  const quizAnswerNumber = document.querySelector(".quiz__answerNum");
  const quizForm = document.querySelector(".quiz__form");
  const quizQuestion = document.querySelector(".quiz__question");
  const quizOptions = document.querySelector(".quiz__options");
  const quizButtons = document.querySelector(".quiz__buttons");

  // *GLOBAL VARIABLES
  let question, answer;
  let options = [];
  let score = 0;
  let answeredQuestions = 0;

  // *EVENT LISTENERS
  window.addEventListener("DOMContentLoaded", quizApp);
  quizForm.addEventListener("submit", formSubmitHandler);

  // *FUNCTIONS

  // fetch questions function ---------------------
  async function fetchQuestions() {
    const response = await fetch(baseUrl);

    const data = await response.json();

    //console.log(data.results);
    return data.results;
  }

  // base quiz app function ---------------------
  async function quizApp() {
    // fetching questions
    const data = await fetchQuestions();

    question = data[0].question;
    //console.log(question);
    options = [];
    answer = data[0].correct_answer;

    data[0].incorrect_answers.map((option) => {
      return options.push(option);
    });

    // !The correct answer is added to the options array with a	 random index number.
    options.splice(Math.trunc(Math.random() * options.length + 1), 0, answer);

    //console.log(options, answer);

    generateHTMLTemplate(question, options);
  }

  // create question html template function ---------------------
  function generateHTMLTemplate(question, options) {
    quizOptions.innerHTML = "";
    quizQuestion.innerText = question;

    options.map((option, index) => {
      const optionHTML = `
		<div class="quiz__option">
		<input type="radio" id="option${index + 1}" value="${option}" name="quiz">
		<label for="option${index + 1}">${option}</label>
		</div>
		`;

      quizOptions.insertAdjacentHTML("beforeend", optionHTML);
    });
  }

  // form submit handler function ---------------------
  function formSubmitHandler(e) {
    e.preventDefault();

    if (e.target.quiz.value) {
      checkSubmittedQuiz(e.target.quiz.value); // !check the submitted quiz

      // remove the submit button
      e.target.querySelector("button").style.display = "none";

      // add the next and
      generateButtons();
    } else {
      return;
    }
  }
  // check the submitted quiz
  function checkSubmittedQuiz(selectedQuiz) {
    answeredQuestions++;

    if (selectedQuiz === answer) {
      score++;
    }

    // update score UI
    quizScore.innerText = score;
    quizAnswerNumber.innerText = answeredQuestions;

    // add a new class to the correct answer
    quizForm.quiz.forEach((input) => {
      if (input.value === answer) {
        input.parentElement.classList.add("correct");
      }
    });
  }

  // generate buttons function ---------------------
  function generateButtons() {
    //finish btn
    const finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish";
    finishBtn.setAttribute("type", "button");
    finishBtn.classList.add("quiz__finish");
    quizButtons.appendChild(finishBtn);

    //next btn
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.setAttribute("type", "button");
    nextBtn.classList.add("quiz__next");
    quizButtons.appendChild(nextBtn);

    //  finish button click event listener
    finishBtn.addEventListener("click", finishQuiz);

    //  next button click event listener
    nextBtn.addEventListener("click", nextQuestion);
  }

  // next question function ---------------------
  function nextQuestion() {
    const finishBtn = document.querySelector(".quiz__finish");
    const nextBtn = document.querySelector(".quiz__next");

    // !Remove the next/finish button and show submit button. Then create a new question
    quizButtons.removeChild(finishBtn);
    quizButtons.removeChild(nextBtn);
    quizButtons.querySelector('button[type="submit"]').style.display = "block";
    quizApp(); // create a new question
  }

  // finish quiz function ---------------------
  function finishQuiz() {
    const finishBtn = document.querySelector(".quiz__finish");
    const nextBtn = document.querySelector(".quiz__next");

    // !Remove the next/finish button and show submit button.
    quizButtons.removeChild(finishBtn);
    quizButtons.removeChild(nextBtn);
    quizButtons.querySelector('button[type="submit"]').style.display = "block";

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    overlay.innerHTML = `
		<div class="overlay__result">
			${score}/${answeredQuestions}
		</div> 
		<button type="button" class="overlay__button">Start New Quiz</button>
	`;
    quizContainer.append(overlay);

    //  new quiz button event listener
    //prettier-ignore
    overlay.querySelector(".overlay__button").addEventListener("click", () => {
      quizContainer.removeChild(overlay);
      startNewQuiz();
    });
  }
  // start a new quiz function
  function startNewQuiz(e) {
    score = 0;
    answeredQuestions = 0;
    quizScore.innerText = 0;
    quizAnswerNumber.innerText = 0;

    // create a new quiz
    quizApp();
  }
})();
