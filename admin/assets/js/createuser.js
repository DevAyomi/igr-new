// DOM Elements
const $createUserBtn = $("#createUserBtn");

// Create Admin User Function
function createAdminUser() {
  if (!validateForm()) {
    Swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return; // Stop execution if validation fails
  }
  // Show confirmation dialog
  Swal.fire({
    title: "Confirm User Creation",
    text: "Do you want to create this user?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Yes, create user!",
    width: "440px",
    customClass: {
      popup: "custom-popup",
      title: "custom-title",
      htmlContainer: "custom-html",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Prepare user data
      const userData = {
        role: $("#userRole").val(), // Role is now Admin
        fullname: $("#userName").val().trim(),
        email: $("#userEmail").val().trim(),
        phone: $("#userPhone").val().trim(),
        password: $("#userPassword").val().trim(),
        img: "",
        verification_status: 2,
        permissions: [],
      };

      let allPermissionCheckbox = document.querySelectorAll('.permission-checkbox')

      allPermissionCheckbox.forEach((permissionCheck) => {
        if (permissionCheck.checked) {
          userData.permissions.push(permissionCheck.dataset.id)
        }
      })

      Swal.fire({
        title: "Creating...",
        text: "Please wait while the request is processed",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      // Disable create button and show loading
      $createUserBtn
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
        );

      // AJAX call to create user
      $.ajax({
        type: "POST",
        url: `${HOST}/register-admin`, // Adjust the endpoint if necessary
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        success: function (response) {
          handleUserCreationResponse(response, userData);
        },
        error: function (error) {
          handleUserCreationError(error);
        },
        complete: function () {
          resetCreateUserButton();
        },
      });
    }
  });
}

// Helper Functions
function validateForm() {
  // Basic validation logic (you can expand this)
  return (
    $("#userName").val() &&
    $("#userEmail").val() &&
    $("#userPhone").val() &&
    $("#userPassword").val() &&
    $("#userRole").val()
  );
}

function generateTemporaryPassword() {
  return "securepassword"; // Consider implementing a more secure password generation method
}

function handleUserCreationResponse(response, userData) {
  if (response.status === "success") {
    Swal.fire({
      title: "User Created Successfully!",
      html: `
                <div class="text-start">
                    <p>The admin user has been created with the following details:</p>
                    <p><strong>Name:</strong> ${userData.fullname}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <p class="text-warning">Note: Please advise the user to change their password upon first login.</p>
                </div>
            `,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // Optionally, refresh the user list or perform other actions
      window.location.href = "./user.html";
    });
  } else {
    Swal.fire({
      title: "Creation Failed",
      text: response.message || "Failed to create user",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
}

function handleUserCreationError(error) {
  console.error("Error creating user:", error);
  Swal.fire({
    title: "Error",
    text:
      error.responseJSON.message || "An error occurred while creating the user",
    icon: "error",
    confirmButtonText: "Try Again",
  });
}

function resetCreateUserButton() {
  $createUserBtn.prop("disabled", false).html("Create User");
}

// Event Listeners
$createUserBtn.on("click", createAdminUser);

// ROLES AND PERMISSION
async function getPermissions() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-permissions`, // Adjust the endpoint if necessary
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      $('#allPermissionsContainer').html('')
      let permissionsData = response.data

      if (response.status === "success") {
        renderPermissions(permissionsData)
      } else {
        $('#allPermissionsContainer').html(`
          <p class="text-lg text-center text-danger font-bold my-5">Failed to fetch Permissions</p> 
        `)
        console.log(response)
      }
    },
    error: function (error) {
      $('#allPermissionsContainer').html(`
        <p class="text-lg text-center text-danger font-bold my-5">Failed to fetch Permissions</p> 
      `)
      console.log('Failed to fetch Permissions', error)
    }
  });
}

getPermissions()

function renderPermissions(permissionsData) {
  const allPermissionsContainer = document.getElementById('allPermissionsContainer');

  allPermissionsContainer.innerHTML = '';

  let totalPermissions = 0;

  // Create category sections for "All" tab and individual category tabs
  for (const [category, permissions] of Object.entries(permissionsData)) {
    const categoryId = category.replace(/\s+/g, '').toLowerCase();
    totalPermissions += permissions.length;

    // Create category section in the "All" tab
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="category-title">${category}</div>
              <div class="form-check">
                  <input class="form-check-input category-checkbox" type="checkbox" id="category${categoryId}" 
                         data-category="${categoryId}">
                  <label class="form-check-label" for="category${categoryId}">
                      Select All
                  </label>
              </div>
          </div>
          <div class="row" id="allPermissionsList${categoryId}">
              ${permissions.map(permission => `
                  <div class="col-md-6 mb-2">
                      <div class="permission-item d-flex justify-content-between align-items-center">
                          <div class="form-check">
                              <input class="form-check-input permission-checkbox" type="checkbox" 
                                     id="allPermission${permission.id}" data-category="${categoryId}" 
                                     data-id="${permission.id}">
                              <label class="form-check-label" for="allPermission${permission.id}">
                                  ${permission.permission_name}
                              </label>
                          </div>
                          <div class="form-check form-switch permission-switch">
                              <input class="form-check-input permission-toggle" type="checkbox" 
                                     id="allToggle${permission.id}" data-category="${categoryId}" 
                                     data-id="${permission.id}">
                          </div>
                      </div>
                  </div>
              `).join('')}
          </div>
          
      `;
    allPermissionsContainer.appendChild(categorySection);


  }

  // Add event listeners for category checkboxes in the "All" tab
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const category = this.dataset.category;
      const isChecked = this.checked;

      // Update checkboxes in the "All" tab
      document.querySelectorAll(`#allPermissionsList${category} .permission-checkbox`).forEach(permissionCheckbox => {
        permissionCheckbox.checked = isChecked;
      });

      // Update toggles in the "All" tab
      document.querySelectorAll(`#allPermissionsList${category} .permission-toggle`).forEach(permissionToggle => {
        permissionToggle.checked = isChecked;
      });

      // Update the category checkbox in the individual tab
    });
  });


  // Sync checkboxes and toggles in the "All" tab
  document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const category = this.dataset.category;
      const id = this.dataset.id;
      const isChecked = this.checked;

      // Update the toggle in the "All" tab
      document.querySelector(`#allToggle${id}`).checked = isChecked;

    });
  });

  // Sync toggles and checkboxes in the "All" tab
  document.querySelectorAll('.permission-toggle').forEach(toggle => {
    toggle.addEventListener('change', function () {
      const category = this.dataset.category;
      const id = this.dataset.id;
      const isChecked = this.checked;

      // Update the checkbox in the "All" tab
      document.querySelector(`#allPermission${id}`).checked = isChecked;

    });
  });

}