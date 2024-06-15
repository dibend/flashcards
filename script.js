let flashcards = [];
let currentCategory = '';
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const files = ['comptia_a+_1101.json', 'comptia_a+_1102.json', 'network+.json', 'security+.json'];
    const select = document.getElementById('category-select');
    
    files.forEach(file => {
        const option = document.createElement('option');
        option.value = file;
        option.textContent = file.replace('.json', '');
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        currentCategory = select.value;
        currentIndex = 0;
        loadFlashcards(currentCategory);
    });

    // Load the first category by default
    if (files.length > 0) {
        currentCategory = files[0];
        loadFlashcards(currentCategory);
    }
});

function loadFlashcards(category) {
    fetch(`json/${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Access the array using the key matching the category
            flashcards = data[category.replace('.json', '')];
            if (!Array.isArray(flashcards) || flashcards.length === 0) {
                throw new Error('No flashcards found in the selected category');
            }
            displayFlashcard(currentIndex);
        })
        .catch(error => {
            console.error('Error loading flashcards:', error);
            alert('Error loading flashcards: ' + error.message);
        });
}

function displayFlashcard(index) {
    if (!flashcards[index]) {
        console.error('No flashcard available at index:', index);
        alert('No flashcard available at index: ' + index);
        return;
    }
    const flashcard = flashcards[index];
    document.getElementById('question').innerText = flashcard.question;
    document.getElementById('answer').innerText = '';
}

document.getElementById('show-answer').addEventListener('click', () => {
    const flashcard = flashcards[currentIndex];
    if (flashcard) {
        document.getElementById('answer').innerText = flashcard.answer;
    }
});

document.getElementById('next-flashcard').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % flashcards.length;
    displayFlashcard(currentIndex);
});

document.getElementById('read-question').addEventListener('click', () => {
    const questionText = document.getElementById('question').innerText;
    speakText(questionText);
});

document.getElementById('read-answer').addEventListener('click', () => {
    const answerText = document.getElementById('answer').innerText;
    speakText(answerText);
});

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}
