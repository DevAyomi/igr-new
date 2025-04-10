const urlParams = new URLSearchParams(window.location.search);
const adminId = urlParams.get('admin_id');

// if (adminUser.role === "super_admin") {
//   $("#passwordInputtt").html(`
//     <label class="form-label">Password</label>
//     <div class="formb d-flex align-items-center position-relative mb-2">
//       <input required type="password" id="userPassword"
//         class="form-control passwordInput updateInputs" data-name="password" placeholder="Password">
//       <i class="fas fa-eye-slash togglePassword position-absolute end-3 cursor-pointer"
//         style="top: 50%; transform: translateY(-50%)"></i>
//     </div>  
//   `)

//   let allTogglePass = document.querySelector(".togglePassword");
//   allTogglePass.addEventListener("click", function () {
//     const passwordInput = document.querySelector(".passwordInput");
//     const icon = this;

//     if (passwordInput.type === "password") {
//       passwordInput.type = "text";
//       icon.classList.remove("fa-eye-slash");
//       icon.classList.add("fa-eye");
//     } else {
//       passwordInput.type = "password";
//       icon.classList.remove("fa-eye");
//       icon.classList.add("fa-eye-slash");
//     }
//   });
// }

const $editUserBtn = $("#editUserBtn");
const $updatePermissionBtn = $("#editPermissionBtn")

function fetchAdminInfo() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-admin-users?limit=1000`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    beforeSend: function () {

    },
    success: function (response) {
      $("#loading").remove();
      $("#manageUser").removeClass("d-none");

      if (response.status === "success" && response.data.length > 0) {
        const users = response.data;
        const particularUser = users.filter(user => user.admin_id === parseInt(adminId));

        let allInputs = document.querySelectorAll('.updateInputs');
        allInputs.forEach(input => {
          input.value = particularUser[0][input.dataset.name];
        });

        if (!hasPermission(36)) {
          $('#editUserBtn').remove()
        }
      } else {
        $("#manageUser").html(`
          <div class="d-flex justify-content-center my-5">
            <p class="text-danger">User not found.</p>
          </div>  
        `);
      }
    },
    error: function (err) {
      $("#loading").remove();
      $("#manageUser").removeClass("d-none");
      $("#manageUser").html(`
        <div class="d-flex justify-content-center my-5">
          <p class="text-danger">Failed to fetch User Info.</p>
        </div>  
      `);
      console.error("Error fetching users:", err);
    },
  });
}

fetchAdminInfo()

function updateAdminInfo() {
  $editUserBtn
    .prop("disabled", true)
    .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`);
  $('#msg_box').html('')

  let dataToSend = {
    admin_id: adminId
  }
  let allInputs = document.querySelectorAll(".updateInputs")
  allInputs.forEach(inpt => {
    dataToSend[inpt.dataset.name] = inpt.value
  })
  $.ajax({
    type: "PUT",
    url: `${HOST}/update-admin-user`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $editUserBtn
        .prop("disabled", true)
        .html(`Edit`);
      $('#msg_box').html(`
          <div class="alert alert-success text-center alert-dismissible fade show" role="alert">
            <strong>Success!</strong> User Updated Successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `)

      setTimeout(() => {
        window.location.reload()
      }, 1000);

    },
    error: function (err) {
      $editUserBtn
        .prop("disabled", true)
        .html(`Edit`);

      $('#msg_box').html(`
          <div class="alert alert-danger text-center alert-dismissible fade show" role="alert">
            <strong>Ooops!</strong> Failed to Update User.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `)
      console.error("Error fetching users:", err);
    },
  });
}

function updateAdminPermission() {
  $updatePermissionBtn
    .prop("disabled", true)
    .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`);
  $('#msg_box').html('')

  let dataToSend = {
    admin_id: adminId,
    permissions: []
  }

  let allPermissionCheckbox = document.querySelectorAll('.permission-checkbox')

  allPermissionCheckbox.forEach((permissionCheck) => {
    if (permissionCheck.checked) {
      dataToSend.permissions.push(permissionCheck.dataset.id)
    }
  })

  $.ajax({
    type: "PUT",
    url: `${HOST}/update-admin-permissions`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $updatePermissionBtn
        .prop("disabled", true)
        .html(`Edit`);
      $('#msg_box2').html(`
          <div class="alert alert-success text-center alert-dismissible fade show" role="alert">
            <strong>Success!</strong> User Pemissions Updated Successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `)

      setTimeout(() => {
        window.location.reload()
      }, 1000);

    },
    error: function (err) {
      $updatePermissionBtn
        .prop("disabled", true)
        .html(`Edit`);

      $('#msg_box2').html(`
          <div class="alert alert-danger text-center alert-dismissible fade show" role="alert">
            <strong>Ooops!</strong> Failed to Update Use Permission.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `)
      console.error("Error fetching users:", err);
    },
  });
}

$editUserBtn.on('click', function () {
  updateAdminInfo()
})

$updatePermissionBtn.on('click', function () {
  updateAdminPermission()
})

async function getPermissions() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-permissions`, // Adjust the endpoint if necessary
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {

      let permissionsData = response.data

      if (response.status === "success") {

        getAdminPermissions(permissionsData)

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

async function getAdminPermissions(permissionsData) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-admin-permissions?admin_id=${adminId}`, // Adjust the endpoint if necessary
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      $('#allPermissionsContainer').html('')
      if (response.status === "success") {
        let adminPermissionData = response.data

        if (!hasPermission(36)) {
          $("#allPermissionsContainer").html(`<p class="text-center">You don't have access to update Roles</p>`)
          $('#editPermissionBtn').remove()
        } else {
          renderPermissions(permissionsData, adminPermissionData)
        }

      } else {
        $('#allPermissionsContainer').html(`
          <p class="text-lg text-center text-danger font-bold my-5">Failed to fetch Permissions</p> 
        `)
      }
    },
    error: function (error) {
      $('#allPermissionsContainer').html(`
        <p class="text-lg text-center text-danger font-bold my-5">Failed to fetch Permissions</p> 
      `)
    }
  });
}

function renderPermissions(permissionsData, adminPermissionData) {
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

  adminPermissionData.forEach(admnpermission => {
    let theCheckbox = document.querySelector(`.permission-checkbox[data-id='${admnpermission.permission_id}']`)
    let theCheckbox2 = document.querySelector(`.permission-toggle[data-id='${admnpermission.permission_id}']`)
    theCheckbox.click()
    theCheckbox2.click()
  })


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