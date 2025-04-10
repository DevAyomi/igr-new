document.addEventListener("DOMContentLoaded", function () {
  fetchNews();

  function fetchNews() {
    fetch(`${HOST}/noauth-get-all-posts?type=news`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          displayNews(data.data);
        }
      })
      .catch((error) => console.error("Error fetching news:", error));
  }

  function displayNews(newsItems) {
    const newsContainer = document.getElementById("news-container");
    const emptyState = document.getElementById("empty-state");
    if (newsItems.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
      newsItems.forEach((news) => {
        const newsElement = document.createElement("a");
        newsElement.href = "#";
        newsElement.dataset.bsToggle = "modal";
        newsElement.dataset.bsTarget = "#newsModal";
        newsElement.dataset.title = news.title;
        newsElement.dataset.description = news.description;
        newsElement.dataset.image = news.images[0];
        newsElement.innerHTML = `
          <div class="group overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="relative overflow-hidden">
              <img src="${news.images[0]}" alt="${news.title}" class="object-cover transition-transform duration-300 group-hover:scale-110">
            </div>
            <div class="p-2">
              <p class="text-[#737373] text-xs line-clamp-2 text-wrap truncate">${news.description}</p>
            </div>
            <div class="bgPrimary h-[1px]"></div>
            <div class="p-2 pt-0 mt-2">
              <div class="flex justify-between items-center font-medium">
                <p class="fontBold textSecondary2 text-sm line-clamp-1 text-wrap truncate">${news.title}</p>
                <i class="fa fa-arrow-right textSecondary2 text-sm"></i>
              </div>
            </div>
          </div>
        `;
        newsContainer.appendChild(newsElement);
      });

      document
        .querySelectorAll('[data-bs-toggle="modal"]')
        .forEach((element) => {
          element.addEventListener("click", function () {
            const title = this.dataset.title;
            const description = this.dataset.description;
            const image = this.dataset.image;
            document.getElementById("newsModalLabel").textContent = title;
            document.getElementById("newsModalDescription").textContent =
              description;
            document.getElementById("newsModalImage").src = image;
          });
        });
    }
  }
});
