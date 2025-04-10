// Publit.io configuration
const publitio = new PublitioAPI(
  "b119y7fvv7B1SuXMlLqz",
  "f751fMs9Tr5f5vNm25gp6cAX9o23PleA"
); // Replace with your Publit.io credentials

// var quill;
// if (document.getElementById("postDescription")) {
//   quill = new Quill("#postDescription", {
//     theme: "snow", // Specify theme in configuration
//     placeholder: "Write your description here",
//   });
// }
async function uploadFiles() {
  const fileInput = document.getElementById("postImageUrl");
  const files = fileInput.files;

  // If no new files are selected, resolve with an empty array
  if (files.length === 0) {
    return [];
  }

  // Upload new files
  const uploadPromises = Array.from(files).map((file) => {
    return publitio.uploadFile(file, "file").then((response) => {
      return response.url_preview; // Publit.io file URL
    });
  });

  return Promise.all(uploadPromises);
}

document
  .getElementById("editPostBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // if (!validateFields()) return;

    $("#editPostBtn")
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
      );

    // Check for new image uploads
    uploadFiles()
      .then((uploadedUrls) => {
        // Fetch existing images if no new files were uploaded
        const existingImages =
          uploadedUrls.length > 0
            ? uploadedUrls
            : document.getElementById("postImageUrl").dataset.url.split(",");

        const postData = {
          title: document.getElementById("postTitle").value,
          description: document.getElementById("postDescription").value.trim(),
          images: existingImages,
          type: document.getElementById("postType").value,
        };

        const postId = document.getElementById("postId").value;
        $.ajax({
          url: `${HOST}/update-post?id=${postId}`,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(postData),
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
          success: function (data) {
            Swal.fire({
              icon: "success",
              title: "Post updated successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
            $("#editPostBtn").prop("disabled", false).html("Update Post");
            // Optionally, you can add code to update the UI with the new post
          },
          error: function (error) {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Failed to update post.",
              text: error.responseText,
            });
            $("#editPostBtn").prop("disabled", false).html("Update Post");
          },
        });
      })
      .catch((error) => {
        console.error("File upload error:", error);
        Swal.fire({
          icon: "error",
          title: "File upload error.",
          text: error.message,
        });
        $("#editPostBtn").prop("disabled", false).html("Update Post");
      });
  });

// Fetch post data and populate the form
const postId = getParameterByName("id");
const type = getParameterByName("type");
if (postId) {
  $.ajax({
    url: `${HOST}/get-post?id=${postId}&type=${type}`,
    type: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      const data = response.data;
      document.getElementById("postId").value = data.id;
      document.getElementById("postTitle").value = data.title;
      document.getElementById("postDescription").value = data.description;
      document.getElementById("postImageUrl").dataset.url =
        data.images.join(","); // Store existing images as a comma-separated string
      document.getElementById("postType").value = data.type;
      document.getElementById("postImage").src = data.images[0] || ""; // Set the first image URL

      if (data.type === "gallery" && data.images) {
        // Display existing images if any
        const imageContainer = document.createElement("div");
        data.images.forEach((imageUrl) => {
          const imgElement = document.createElement("img");
          imgElement.src = imageUrl;
          imgElement.style.width = "300px"; // Set a width for the preview
          imgElement.style.marginRight = "10px";
          imageContainer.appendChild(imgElement);
        });
        document.getElementById("editPostForm").appendChild(imageContainer);
      }
    },
    error: function (error) {
      console.error("Error fetching post:", error);
    },
  });
}
