document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.getElementById("gallery-container");
  const filterButtons = document.querySelectorAll(".filter-button");
  const modal = document.querySelector(".modal");
  const modalImg = modal.querySelector("img");
  const closeModal = document.querySelector(".close-modal");
  const emptyState = document.getElementById("empty-state");
  emptyState.style.display = "block";

  function createGalleryItems(items) {
    galleryContainer.innerHTML = "";
    if (items.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      items.forEach((item) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `
          <img src="${item.image}" alt="${item.title}" />
          <div class="item-overlay">
            <h3>${item.title}</h3>
          </div>
        `;
        galleryContainer.appendChild(galleryItem);

        galleryItem.addEventListener("click", () => {
          modalImg.src = item.image;
          modal.style.display = "block";
        });
      });
    }
  }

  fetch(`${HOST}/noauth-get-all-posts?type=gallery`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const galleryItems = data.data.map((item) => ({
          image: item.images[0],
          title: item.title,
          category: item.category || "all",
        }));
        createGalleryItems(galleryItems);

        filterButtons.forEach((button) => {
          button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            const filteredItems =
              filter === "all"
                ? galleryItems
                : galleryItems.filter((item) => item.category === filter);

            createGalleryItems(filteredItems);
          });
        });
      }
    })
    .catch((error) => console.error("Error fetching gallery data:", error));

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
