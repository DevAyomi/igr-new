document.addEventListener("DOMContentLoaded", function () {

  fetch(`${HOST}/noauth-get-all-posts?type=library`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        data.data.forEach(element => {
          $("#library-container").append(`
            <div
              class="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-200 document-card"
              data-category="instructions">
              <div class="bg-gray-100 p-6 flex justify-center">
                <i class="fa fa-file-pdf text-[#00A75A] text-5xl"></i>
              </div>
              <div class="p-6 flex-grow">
                <span
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-2">Instructions</span>
                <h3 class="text-lg font-semibold mb-2">${element.title}</h3>
                <p class="text-sm text-gray-500 mb-4">${element.description}</p>
                <div class="flex items-center text-xs text-gray-500">
                  <i class='bx bx-calendar mr-1'></i>
                  <span class="mr-3">Added: ${formatDate(new Date(element.created_at))}</span>
                  <span></span>
                </div>
              </div>
              <div class="p-6 pt-0 border-t flex justify-between items-center">

                <div class="flex gap-2 mt-4">
                  <button onclick="previewLink('${element.images[0]}')" class="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50">
                    <i class='bx bx-show mr-1'></i>
                    <span class="hidden md:inline">Preview</span>
                  </button>
                  <button onclick="downloadLink('${element.images[0]}')" class="px-3 py-1 bg-[#00A75A] text-white rounded-md text-sm flex items-center hover:bg-[#00A75A]">
                    <i class='bx bx-download mr-1'></i>
                    <span class="hidden md:inline">Download</span>
                  </button>
                </div>
              </div>
            </div>
          `)
        });
      } else {
        $("#empty-state").removeClass('d-none')
      }
    })
    .catch((error) => {
      $("#empty-state").removeClass('d-none')
      console.error("Error fetching gallery data:", error)

    });


});


function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function previewLink(urlLink) {
  window.open(urlLink, "_blank");
}

function downloadLink(urlLink) {
  const anchor = document.createElement("a");
  anchor.href = urlLink;
  anchor.setAttribute("download", ""); // Forces download
  anchor.setAttribute("target", "_blank"); // Ensures compatibility
  anchor.setAttribute("rel", "noopener noreferrer");

  // Handling CORS issues (if applicable)
  fetch(urlLink)
    .then(response => response.blob())
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      anchor.href = objectURL;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectURL);
    })
    .catch(error => console.error("Download failed:", error));
}