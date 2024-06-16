let flashcards = [];
let currentCategory = '';
let currentIndex = 0;
let intervalId;
let isLooping = false;
let isPlaying = false;
let autoShuffle = false;

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

    // Toggle dark mode
    document.getElementById('toggle-dark-mode').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Handle background color change
    document.getElementById('bg-color-picker').addEventListener('input', (event) => {
        document.body.style.backgroundColor = event.target.value;
    });

    // Handle text color change
    document.getElementById('text-color-picker').addEventListener('input', (event) => {
        document.body.style.color = event.target.value;
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach(card => {
            card.style.color = event.target.value;
        });
    });

    // Play button
    document.getElementById('play').addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            intervalId = setInterval(() => {
                displayFlashcard(currentIndex);
                speakText(flashcards[currentIndex].question);
                setTimeout(() => speakText(flashcards[currentIndex].answer), 3000);
                currentIndex = (currentIndex + 1) % flashcards.length;
                if (currentIndex === 0) {
                    if (autoShuffle) {
                        shuffleArray(flashcards);
                    }
                    if (!isLooping) {
                        clearInterval(intervalId);
                        isPlaying = false;
                    }
                }
            }, 6000); // Adjust the interval as needed
        }
    });

    // Pause button
    document.getElementById('pause').addEventListener('click', () => {
        isPlaying = false;
        clearInterval(intervalId);
    });

    // Loop button
    document.getElementById('toggle-loop').addEventListener('click', () => {
        isLooping = !isLooping;
        document.getElementById('toggle-loop').classList.toggle('active');
    });

    // Auto shuffle button
    document.getElementById('toggle-auto-shuffle').addEventListener('click', () => {
        autoShuffle = !autoShuffle;
        document.getElementById('toggle-auto-shuffle').classList.toggle('active');
    });

    // Shuffle button
    document.getElementById('shuffle-flashcards').addEventListener('click', () => {
        shuffleArray(flashcards);
        currentIndex = 0;
        displayFlashcard(currentIndex);
    });
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}