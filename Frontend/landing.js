const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navButtons = document.getElementById('nav-buttons');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navButtons.classList.toggle('active');
});

    const searchInput = document.getElementById('searchInput');
const plantCards = document.querySelectorAll('.plant-card');
const sliderTracks = document.querySelectorAll('.slider-track'); // Both sliders
const sliders = document.querySelectorAll('.slider');  // The entire slider divs
const filteredResults = document.getElementById('filteredResults');

searchInput.addEventListener('input', function () {
const searchValue = searchInput.value.toLowerCase().trim();
filteredResults.innerHTML = "";  // Clear previous results

if (searchValue === "") {
// Reset view
sliders.forEach(slider => slider.style.display = 'block'); // Show sliders
sliderTracks.forEach(track => track.classList.remove('paused'));
filteredResults.style.display = 'none'; // Hide filtered results
} else {
// Hide sliders and pause animation
sliders.forEach(slider => slider.style.display = 'none');
sliderTracks.forEach(track => track.classList.add('paused'));

// Filter matching plants
let matchFound = false;
plantCards.forEach(card => {
  const plantName = card.querySelector('p').textContent.toLowerCase();
  if (plantName.includes(searchValue)) {
    matchFound = true;
    const clone = card.cloneNode(true);
    filteredResults.appendChild(clone);
  }
});

// Show filtered results or 'No results' message
filteredResults.style.display = 'flex';
if (!matchFound) {
  filteredResults.innerHTML = '<p>No results found</p>';
}
}
});
////////////////////////////////////////////


// Tulsi Modal Logic
const tulsiCard = document.querySelector('.plant-card img[alt="Tulsi"]').parentElement;
const tulsiModal = document.getElementById('tulsiModal');
const closeTulsiModal = document.getElementById('closeTulsiModal');

tulsiCard.addEventListener('click', () => {
tulsiModal.style.display = 'block';
});

closeTulsiModal.addEventListener('click', () => {
tulsiModal.style.display = 'none';
});

// Close modal if user clicks outside the modal content
window.addEventListener('click', (event) => {
if (event.target === tulsiModal) {
tulsiModal.style.display = 'none';
}
});