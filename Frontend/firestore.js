import { fetchPlants, searchPlants } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const plantContainer = document.getElementById("plantContainer");
    const searchInput = document.getElementById("searchInput");
    const modal = document.getElementById("plantModal");
    const closeModalBtn = document.getElementById("closeModal");

    try {
        let plants = await fetchPlants(); // Fetch all plants initially

        // Function to display plants
        function displayPlants(filteredPlants) {
            plantContainer.innerHTML = ""; // Clear previous content

            if (filteredPlants.length === 0) {
                plantContainer.innerHTML = "<p>No plants found</p>"; // Show message if no plants match
                return;
            }

            filteredPlants.forEach((plant) => {
                const card = document.createElement("div");
                card.classList.add("plant-card");
                card.innerHTML = `
                    <img src="${plant.img || 'placeholder.jpg'}" alt="${plant.name}">
                    <h3>${plant.name}</h3>
                `;
                card.addEventListener("click", () => openPlantModal(plant));
                plantContainer.appendChild(card);
            });
        }

        // Initial display of all plants
        displayPlants(plants);

        // Search function (filters by Name or Diseases)
        searchInput.addEventListener("input", async () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query === "") {
                displayPlants(plants); // Show all plants if search is empty
            } else {
                const filteredPlants = await searchPlants(query);
                displayPlants(filteredPlants);
            }
        });

    } catch (error) {
        console.error("Error loading plants:", error);
        plantContainer.innerHTML = "<p>Failed to load plants. Please try again later.</p>";
    }

    // Function to open plant modal
    function openPlantModal(plant) {
        document.getElementById("modalImg").src = plant.img || "placeholder.jpg";
        document.getElementById("modalName").textContent = plant.name || "Unknown";
        document.getElementById("modalDesc").textContent = plant.desc || "No description available.";
        document.getElementById("modalDiseases").textContent = plant.diseases || "No diseases associated.";
        document.getElementById("modalUsage").textContent = plant.usage || "No usage information.";
        document.getElementById("modalLocation").textContent = plant.location || "No location provided.";

        modal.style.display = "block";
    }

    // Close modal event
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal if clicked outside content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
