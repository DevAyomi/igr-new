// Publit.io configuration
const publitio = new PublitioAPI(
  "b119y7fvv7B1SuXMlLqz",
  "f751fMs9Tr5f5vNm25gp6cAX9o23PleA"
); // Replace with your Publit.io credentials

// var quill;
// if (document.getElementById("postDescription")) {
//   quill = new Quill("#postDescription", {
//     theme: "snow", // Specify theme in configuration
//     placeholder: "Write your descrition here",
//   });
// }

if (hasPermission(38) && !hasPermission((39))) { //Create New Post - Gallery Only
  $('#postType').html(`
    <option value="gallery">Gallery</option>
    <option value="library">Library</option>
  `)
} else if (hasPermission(39) && !hasPermission((38))) { // Create New Post - News Only
  $('#postType').html(`
    <option value="news">News</option>
    <option value="library">Library</option>
  `)
} else if(!hasPermission(38) && !hasPermission((39))) {
  $('.cmsCreateBody').html(noAccessHTML)
}


async function uploadFiles() {
  const fileInput = document.querySelector('input[type="file"]');
  const files = fileInput.files;
  const uploadPromises = Array.from(files).map((file) => {
    return publitio.uploadFile(file, "file").then((response) => {
      return response.url_preview; // Publit.io file URL
    });
  });
  return Promise.all(uploadPromises);
}

function validateFields() {
  const title = document.getElementById("postTitle").value;
  const description = document.getElementById("postDescription").value;
  const fileInput = document.querySelector('input[type="file"]');
  const type = document.getElementById("postType").value;

  if (!title || !description || !fileInput.files.length || !type) {
    Swal.fire({
      icon: "warning",
      title: "Please fill in all fields.",
    });
    return false;
  }
  return true;
}

document
  .getElementById("createPostBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (!validateFields()) return;

    $("#createPostBtn")
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
      );

    uploadFiles()
      .then((uploadedUrls) => {
        const postData = {
          title: document.getElementById("postTitle").value,
          description: document.getElementById("postDescription").value,
          images: uploadedUrls.length > 0 ? uploadedUrls : [], // Assuming only one file is uploaded
          type: document.getElementById("postType").value,
        };

        $.ajax({
          url: `${HOST}/create-post`,
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(postData),
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
          success: function (data) {
            Swal.fire({
              icon: "success",
              title: "Post created successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
            $("#createPostBtn").prop("disabled", false).html("Create Post");
            window.location.href = "cms.html"; // Redirect to CMS page
          },
          error: function (error) {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Failed to create post.",
              text: "Something went wrong. Please try again.",
            });
            $("#createPostBtn").prop("disabled", false).html("Create Post");
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
        $("#createPostBtn").prop("disabled", false).html("Create Post");
      });
  });
