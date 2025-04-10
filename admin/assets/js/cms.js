$(document).ready(function () {
  function fetchPosts() {
    const loaderRow = `
          <div class="loader">
              <div class="rotating-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
          </div>
    `;

    const newsContainer = $("#pills-one .containerPost");
    const galleryContainer = $("#pills-two .containerPost");
    const libraryContainer = $("#pills-three .containerPost");

    // Show loader in both containers
    newsContainer.html(loaderRow);
    galleryContainer.html(loaderRow);

    const url = `${HOST}/get-all-posts`;

    $.ajax({
      url: url,
      type: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.status === "success") {
          const posts = response.data;
          // Clear containers
          newsContainer.empty();
          galleryContainer.empty();
          libraryContainer.empty();

          posts.forEach((post) => {
            const postHtml = `
              <div class="card border border-[#DFDFDF] mt-3 p-3">
                <h6 class="text-black mt-3">${post.title}</h6>
                <p class="text-gray-600" style="font-size: 14px;">${post.description}</p>
                <div class="d-flex align-items-center gx-2 mt-3" style="color: #000;">
                  <p><iconify-icon icon="uil:calender"></iconify-icon> ${post.created_at}</p>
                </div>
                <div class="d-flex justify-content-end">
                  ${!hasPermission(41) ? '' : `
                    <div>
                      <a class="btn btn-secondary" href="./edit-cms.html?id=${post.id}&type=${post.type}">Edit</a>
                      <button class="btn btn-danger" data-id="${post.id}">Delete</button>
                    </div>
                  `}                  
                </div>
              </div>
            `;

            if (post.type === "news") {
              newsContainer.append(postHtml);
            } else if (post.type === "gallery") {
              galleryContainer.append(postHtml);
            } else if (post.type === "library") {
              libraryContainer.append(postHtml)
            }
          });
        } else {
          console.error("Error fetching posts:", response.message);
        }
      },
      error: function (error) {
        console.error("Error fetching posts:", error);
      },
    });
  }

  // Fetch posts on page load
  fetchPosts();

  // Handle delete button click
  $(document).on("click", ".btn-danger", function () {
    const postId = $(this).data("id");
    $.ajax({
      url: `${HOST}/delete-post?id=${postId}`,
      type: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Post deleted successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchPosts(); // Refresh posts
      },
      error: function (error) {
        console.error("Error deleting post:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to delete post.",
          text: error.responseText,
        });
      },
    });
  });
});
