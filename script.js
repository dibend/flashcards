let flashcards = {};
let currentCategory = "comptia_a+_1101";
let currentIndex = 0;

fetch('flashcards.json')
    .then(response => response.json())
    .then(data => {
        flashcards = data;
        displayFlashcard(currentCategory, currentIndex);
    })
    .catch(error => console.error('Error loading flashcards:', error));

function displayFlashcard(category, index) {
    const flashcard = flashcards[category][index];
    document.getElementById('question').innerText = flashcard.question;
    document.getElementById('answer').innerText = '';
}

document.getElementById('show-answer').addEventListener('click', () => {
    const flashcard = flashcards[currentCategory][currentIndex];
    document.getElementById('answer').innerText = flashcard.answer;
});

document.getElementById('next-flashcard').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % flashcards[currentCategory].length;
    displayFlashcard(currentCategory, currentIndex);
});

document.getElementById('category-select').addEventListener('change', (event) => {
    currentCategory = event.target.value;
    currentIndex = 0;
    displayFlashcard(currentCategory, currentIndex);
});
