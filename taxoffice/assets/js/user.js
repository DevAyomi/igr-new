// DOM Elements
const $createUserModal = $("#createUserModal");
const $createUserBtn = $("#createUserBtn");
const $editUserModal = $("#editUserModal");

// Form Fields
const $userName = $("#userName");
const $userEmail = $("#userEmail");
const $userPhone = $("#userPhone");
const $office = $("#office");
const $revHead = $("#revHead");
const $users = $("#users");
const $payment = $("#payment");
const $report = $("#report");

// Selectize Initialization
const editMdaSelectize = $("#editUserModal #mda").selectize({
  placeholder: "Select a mda...",
});

const mdaSelectize = $("#mda").selectize({
  placeholder: "Select a mda...",
});

// Validation Function
function validateForm(formContext) {
  const fields = formContext.find("input[required], select[required]");
  let isValid = true;

  fields.each(function () {
    const value = $(this).val().trim();
    if (!value || value === "Select") {
      isValid = false;
      $(this).addClass("is-invalid");

      // Remove existing error message
      $(this).next(".invalid-feedback").remove();

      // Add error message
      $(this).after(`
        <div class="invalid-feedback">
          This field is required
        </div>
      `);
    } else {
      $(this).removeClass("is-invalid");
      $(this).next(".invalid-feedback").remove();
    }
  });

  // Email validation
  const $email = formContext.find("#userEmail");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test($email.val())) {
    isValid = false;
    $email.addClass("is-invalid");
    $email.next(".invalid-feedback").remove();
    $email.after(`
      <div class="invalid-feedback">
        Please enter a valid email address
      </div>
    `);
  }

  // Phone validation
  const $phone = formContext.find("#userPhone");
  const phoneRegex = /^[0-9]{10,14}$/;
  if (!phoneRegex.test($phone.val().replace(/\s+/g, ""))) {
    isValid = false;
    $phone.addClass("is-invalid");
    $phone.next(".invalid-feedback").remove();
    $phone.after(`
      <div class="invalid-feedback">
        Please enter a valid phone number
      </div>
    `);
  }

  return isValid;
}

// Map Access to Permissions
function mapAccessToPermissions(formContext) {
  const permissions = [];
  const $revHead = formContext.find("#revHead");
  const $users = formContext.find("#users");
  const $payment = formContext.find("#payment");
  const $report = formContext.find("#report");

  // Permission mapping logic
  const permissionMap = {
    revHead: { view: 1, edit: 2 },
    users: { view: 3, edit: 4 },
    payment: { view: 5, edit: 6 },
    report: { view: 7, edit: 8 },
  };

  // Helper function to add permissions
  const addPermissions = (field, permissionKey) => {
    if (field.val() === "full") {
      permissions.push(
        permissionMap[permissionKey].view,
        permissionMap[permissionKey].edit
      );
    } else if (field.val() === "view") {
      permissions.push(permissionMap[permissionKey].view);
    }
  };

  // Add permissions for each access level
  addPermissions($revHead, "revHead");
  addPermissions($users, "users");
  addPermissions($payment, "payment");
  addPermissions($report, "report");

  return permissions;
}

// Create MDA User Function
function createMDAUser() {
  // Validate form for create modal
  if (!validateForm($createUserModal)) {
    return;
  }

  // Show confirmation dialog
  Swal.fire({
    title: "Confirm User Creation",
    html: generateUserDetailsHTML($createUserModal),
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
        mda_id: $createUserModal.find("#mda").val(),
        name: $createUserModal.find("#userName").val().trim(),
        email: $createUserModal.find("#userEmail").val().trim(),
        phone: $createUserModal.find("#userPhone").val().trim(),
        password: generateTemporaryPassword(),
        office_name: $createUserModal.find("#office").val(),
        permissions: mapAccessToPermissions($createUserModal),
      };

      // Disable create button and show loading
      $createUserBtn
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
        );

      // AJAX call to create user
      $.ajax({
        type: "POST",
        url: `${HOST}/register-mda`,
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        success: function (response) {
          handleUserCreationResponse(response, userData, $createUserModal);
        },
        error: function (xhr, status, error) {
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
function generateUserDetailsHTML(formContext) {
  return `
    <div class="user-details">
      <div class="info-card">
        <div class="info-item">
          <i class="fas fa-user"></i>
          <div>
            <label>Name</label>
            <span>${formContext.find("#userName").val()}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <div>
            <label>Email</label>
            <span>${formContext.find("#userEmail").val()}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-phone"></i>
          <div>
            <label>Phone </label>
            <span>${formContext.find("#userPhone").val()}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-building"></i>
          <div>
            <label>Office</label>
            <span>${formContext.find("#office").val()}</span>
          </div>
        </div>
      </div>
      
      <div class="access-section">
        <h5><i class="fas fa-lock"></i> Access Levels</h5>
        <div class="access-grid">
          <div class="access-item ${
            formContext.find("#revHead").val() === "full" ? "active" : ""
          }">
            <i class="fas fa-chart-line"></i>
            <span>Revenue Head</span>
            <span class="status">${formContext.find("#revHead").val()}</span>
          </div>
          <div class="access-item ${
            formContext.find("#users").val() === "full" ? "active" : ""
          }">
            <i class="fas fa-users"></i>
            <span>Users</span>
            <span class="status">${formContext.find("#users").val()}</span>
          </div>
          <div class="access-item ${
            formContext.find("#payment").val() === "full" ? "active" : ""
          }">
            <i class="fas fa-credit-card"></i>
            <span>Payment</span>
            <span class="status">${formContext.find("#payment").val()}</span>
          </div>
          <div class="access-item ${
            formContext.find("#report").val() === "full" ? "active" : ""
          }">
            <i class="fas fa-file-alt"></i>
            <span>Report</span>
            <span class="status">${formContext.find("#report").val()}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateTemporaryPassword() {
  return "securepassword"; // Consider implementing a more secure password generation method
}

function handleUserCreationResponse(response, userData, formContext) {
  if (response.status === "success") {
    formContext.modal("hide");
    Swal.fire({
      title: "User  Created Successfully!",
      html: `
        <div class="text-start">
          <p>The MDA user has been created with the following details:</p>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p class="text-warning">Note: Please advise the user to change their password upon first login.</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      fetchMdaUsers();
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
    text: "An error occurred while creating the user",
    icon: "error",
    confirmButtonText: "Try Again",
  });
}

function resetCreateUserButton() {
  $createUserBtn.prop("disabled", false).html("Create User");
}

// Event Listeners
$createUserBtn.on("click", createMDAUser);
$("#editUserModal #editMdaUserBtn").on("click", updateMDAUser);

// Real-time validation
$("#createUserModal, #editUserModal")
  .find("input, select")
  .on("input change", function () {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").remove();
  });

// Fetch mda admin Users
function fetchMdaUsers() {
  if ($.fn.DataTable.isDataTable("#mdauser-table")) {
    $("#mdauser-table").DataTable().clear().destroy();
  }

  $("#mdauser-table").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        // search: data.search.value,
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/get-mda-users`,
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $("#mdauser-table tbody").html(`
            <tr class="loader-row">
              <td colspan="16" class="text-center">
                  <div class="loader">
                      <div class="rotating-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                      </div>
                  </div>
                  <span>Loading...</span>
              </td>
            </tr>
          `);
        },
        success: function (response) {
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.total || response.data.length,
              recordsFiltered: response.total || response.data.length,
              data: response.data,
            });
          } else {
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            $("#mdauser-table tbody").html(
              '<tr><td colspan="16" class="text-center">No users found.</td></tr>'
            );
          }
        },
        error: function (err) {
          console.error("Error fetching users:", err);
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
          $("#mdauser-table tbody").html(
            '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching MDA users.</td></tr>'
          );
        },
      });
    },
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Serial number
      { data: "name", defaultContent: "N/A" },
      { data: "email" },
      { data: "phone" },
      { data: "office_name" },
      {
        data: "created_at",
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <div>
              ${
                !hasPermission(36)
                  ? ""
                  : `
                <button class="btn btn-secondary btn-sm editMdaUser" 
                  data-bs-toggle="modal" data-bs-target="#editUserModal" 
                  data-id="${data}">
                  Edit
                </button>
              `
              }

              ${
                !hasPermission(36)
                  ? ""
                  : `
                <button class="btn btn-danger btn-sm deleteMdaUser" 
                  data-id="${data}">
                  Delete
                </button>
              `
              }
            <div>
          `;
        },
      },
    ],
  });
}

// Fetch admin Users
function fetchAdminUsers() {
  if ($.fn.DataTable.isDataTable("#adminuser-table")) {
    $("#adminuser-table").DataTable().clear().destroy();
  }

  $("#adminuser-table").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        account_status: "activate",
        // role: "admin_support",
        search: data.search.value,
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/get-admin-users`,
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $("#adminuser-table tbody").html(`
            <tr class="loader-row">
              <td colspan="7" class="text-center">
                  <div class="loader">
                      <div class="rotating-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                      </div>
                  </div>
                  <span>Loading...</span>
              </td>
            </tr>
          `);
        },
        success: function (response) {
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.total || response.data.length,
              recordsFiltered: response.total || response.data.length,
              data: response.data,
            });
          } else {
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            $("#adminuser-table tbody").html(
              '<tr><td colspan="16" class="text-center">No users found.</td></tr>'
            );
          }
        },
        error: function (err) {
          console.error("Error fetching users:", err);
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
          $("#adminuser-table tbody").html(
            '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching MDA users.</td></tr>'
          );
        },
      });
    },
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Serial number
      { data: "fullname", defaultContent: "N/A" },
      { data: "email" },
      { data: "phone" },
      { data: "role" },
      {
        data: "date_created",
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: "admin_id",
        render: function (data, type, row) {
          return `
          <div>
            ${
              !hasPermission(36)
                ? ""
                : `
              <a href='manageusers.html?admin_id=${data}' class="btn btn-secondary btn-sm">
                Edit
              </a>
              `
            }
              ${
                !hasPermission(37)
                  ? ""
                  : `
                <button class="btn btn-danger btn-sm deleteAdminUser" 
                  data-id="${data}">
                  Delete
                </button>
              `
              }
            </div>
          `;
        },
      },
    ],
  });
}

$(document).ready(() => {
  if (!hasPermission(34)) {
    $("#adminuser-table tbody").html(`
      <tr class="loader-row">
        <td colspan="7" class="text-center">
          <p>You don't have access to view this data.</p>
        </td>
      </tr>
    `);

    $("#mdauser-table tbody").html(`
      <tr class="loader-row">
        <td colspan="7" class="text-center">
          <p>You don't have access to view this data.</p>
        </td>
      </tr>
    `);
  } else {
    fetchMdaUsers();
    fetchAdminUsers();
  }
});

// Update MDA User Function
function updateMDAUser() {
  // add loading state to the button
  $editUserModal
    .find("#editMdaUserBtn")
    .prop("disabled", true)
    .html("Updating...");
  // Validate form for edit modal
  if (!validateForm($editUserModal)) {
    return;
  }

  // Prepare user data
  const userData = {
    mda_user_id: $editUserModal.find("#userId").val(),
    mda_id: $editUserModal.find("#mda").val(),
    name: $editUserModal.find("#userName").val().trim(),
    email: $editUserModal.find("#userEmail").val().trim(),
    phone: $editUserModal.find("#userPhone").val().trim(),
    office_name: $editUserModal.find("#office").val().trim(),
    // permissions: mapAccessToPermissions($editUserModal),
  };

  // AJAX call to update user
  $.ajax({
    type: "PUT",
    url: `${HOST}/edit-mda-user`,
    data: JSON.stringify(userData),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      // disbale button
      $editUserModal
        .find("#editMdaUserBtn")
        .prop("disabled", false)
        .html("Save Changes");
      handleUserUpdateResponse(response);
    },
    error: function () {
      Swal.fire("Error", "An error occurred while updating the user", "error");
      $editUserModal
        .find("#editMdaUserBtn")
        .prop("disabled", false)
        .html("Save Changes");
    },
  });
}

// Fetch User Details
function fetchUserDetails(userId) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-mda-users?id=${userId}`,
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        const user = response.data[0];

        // Get the Selectize instance
        const $mdaSelect = $("#editUserModal #mda");
        const mdaSelectizeInstance = $mdaSelect[0].selectize;
        // Set the current user's MDA
        mdaSelectizeInstance.setValue(user.mda_id);

        // Populate other form fields
        $("#editUserModal #userId").val(user.id);
        $("#editUserModal #userName").val(user.name);
        $("#editUserModal #userEmail").val(user.email);
        $("#editUserModal #userPhone").val(user.phone);
        $("#editUserModal #office").val(user.office_name);

        // Set access levels
        // $("#editUserModal #revHead").val(
        //   user.permissions.includes(1) ? "full" : "view"
        // );
        // $("#editUserModal #users").val(
        //   user.permissions.includes(3) ? "full" : "view"
        // );
        // $("#editUserModal #payment").val(
        //   user.permissions.includes(5) ? "full" : "view"
        // );
        // $("#editUserModal #report").val(
        //   user.permissions.includes(7) ? "full" : "view"
        // );

        // Store user ID on the modal
        $("#editUserModal").data("id", userId);
      } else {
        Swal.fire("Error", "Failed to fetch user details", "error");
      }
    },
    error: function () {
      Swal.fire(
        "Error",
        "An error occurred while fetching user details",
        "error"
      );
    },
  });
}

// Delete User Function
function deleteUser(userId, endpoint) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // loading state sweetalert
      Swal.fire({
        title: "Deleting..",
        text: "Wait while we delete the user!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // AJAX call to delete user
      let dataToSend = {};

      if (endpoint === "deactivate-admin") {
        dataToSend["admin_id"] = userId;
      } else {
        dataToSend["mda_user_id"] = userId;
      }

      $.ajax({
        type: "DELETE",
        url: `${HOST}/${endpoint}`,
        data: JSON.stringify(dataToSend),
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        success: function (response) {
          if (response.status === "success") {
            Swal.fire("Deleted!", "User  has been deleted.", "success").then(
              () => {
                if (endpoint === "delete-mda-user") {
                  fetchMdaUsers();
                } else {
                  fetchAdminUsers();
                }
              }
            );
          } else {
            Swal.fire("Error", "Failed to delete user", "error");
          }
        },
        error: function (error) {
          Swal.fire(
            "Error",
            error.responseJSON.message ||
              "An error occurred while deleting the user",
            "error"
          );
        },
      });
    }
  });
}

// Fetch MDA Data
function fetchMdaData() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-mdas`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.mdas.length > 0) {
        const mdas = response.data.mdas;
        const mdaSelectizeInstance = mdaSelectize[0].selectize;

        // Clear existing options
        mdaSelectizeInstance.clearOptions();
        // Add a default placeholder option
        mdaSelectizeInstance.addOption({ value: "", text: "Select a mda..." });
        // Populate MDA options
        mdas.forEach((mda) => {
          mdaSelectizeInstance.addOption({ value: mda.id, text: mda.fullname });
        });
        // Refresh Selectize options
        mdaSelectizeInstance.refreshOptions(false);

        const editMdaSelectizeInstance = editMdaSelectize[0].selectize;

        // Clear existing options
        editMdaSelectizeInstance.clearOptions();
        // Add a default placeholder option
        editMdaSelectizeInstance.addOption({
          value: "",
          text: "Select a mda...",
        });
        // Populate MDA options
        mdas.forEach((mda) => {
          editMdaSelectizeInstance.addOption({
            value: mda.id,
            text: mda.fullname,
          });
        });
        // Refresh Selectize options
        editMdaSelectizeInstance.refreshOptions(false);
      } else {
        alert("No MDA data available.");
      }
    },
    error: function (err) {
      console.error("Error fetching MDA data:", err);
      alert("An error occurred while fetching the MDA data.");
    },
  });
}

fetchMdaData();

// Event listener for edit button
$(document).on("click", ".editMdaUser ", function () {
  const userId = $(this).data("id");
  fetchUserDetails(userId);
});

// Event listener for delete button
$(document).on("click", ".deleteMdaUser ", function () {
  const userId = $(this).data("id");
  deleteUser(userId, "delete-mda-user");
});

// Event listener for delete button
$(document).on("click", ".deleteAdminUser ", function () {
  const userId = $(this).data("id");
  deleteUser(userId, "deactivate-admin");
});

const taxOfficeSelectize = $("#taxOffice").selectize({
  create: false, // Disable creating new options
  sortField: "text", // Sort options by text
  placeholder: "Select a tax office...", // Default placeholder
});

function fetchTaxOffices() {
  $.ajax({
    url: `${HOST}/tax-offices`, // Replace with your API endpoint
    type: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        const taxOffices = response.data.tax_offices;
        populateTaxOfficeSelectize(taxOffices); // Populate the Selectize element
      } else {
        alert("Failed to fetch tax offices.");
      }
    },
    error: function () {
      alert("Failed to fetch tax offices.");
    },
  });
}

function populateTaxOfficeSelectize(taxOffices) {
  const taxOfficeSelectizeInstance = taxOfficeSelectize[0].selectize;

  // Clear existing options
  taxOfficeSelectizeInstance.clearOptions();

  // Populate tax office options
  taxOffices.forEach((office) => {
    taxOfficeSelectizeInstance.addOption({
      value: office.id,
      text: office.office_name,
    });
  });

  // Refresh Selectize options
  taxOfficeSelectizeInstance.refreshOptions(false);
}

// Call this function when the modal is opened
$("#createTaxOfficeUserModal").on("show.bs.modal", function () {
  fetchTaxOffices(); // Fetch tax offices and populate the Selectize element
});

$("#createTaxOfficeUserBtnSubmit").on("click", function () {
  const userData = {
    manager_name: $("#managerName").val().trim(),
    manager_contact_phone: $("#managerPhone").val().trim(),
    manager_contact_email: $("#managerEmail").val().trim(),
    position: $("#position").val().trim(),
    supervisor_id: userId, // Replace with the actual supervisor ID if needed
    tax_office_id: $("#taxOffice").val(),
    password: $("#password").val().trim(),
  };

  // Validation
  if (
    !userData.manager_name ||
    !userData.manager_contact_phone ||
    !userData.manager_contact_email ||
    !userData.position ||
    !userData.tax_office_id ||
    !userData.password
  ) {
    alert("All fields are required.");
    return;
  }

  $("#createTaxOfficeUserBtnSubmit")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );

  $.ajax({
    url: `${HOST}/create-manager-office`, // Replace with your API endpoint
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(userData),
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      $("#createTaxOfficeUserBtnSubmit")
        .prop("disabled", false)
        .html("Create User");
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Tax Officer Create",
          text: "Tax officer has been successfully created.",
        }).then(() => {
          $("#tax-office-user-table").DataTable().draw();
        });
        $("#createTaxOfficeUserModal").modal("hide");
        $("#tax-office-user-table").DataTable().draw();
      } else {
        console.error("Failed to create user: " + response.message);
      }
    },
    error: function () {
      console.error("Failed to create user.");
    },
  });
});

// function fetchTaxOfficeUsers() {
if ($.fn.DataTable.isDataTable("#tax-office-user-table")) {
  $("#tax-office-user-table").DataTable().clear().destroy();
}

$("#tax-office-user-table").DataTable({
  serverSide: true,
  paging: true,
  ordering: false,
  pageLength: 50,
  responsive: true,
  searchDelay: 500,
  pagingType: "simple_numbers",
  ajax: function (data, callback) {
    const pageNumber = Math.ceil(data.start / data.length) + 1;

    const filters = {
      page: pageNumber,
      limit: data.length,
    };

    $.ajax({
      type: "GET",
      url: `${HOST}/manager-offices`,
      data: filters,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      beforeSend: function () {
        $("#tax-office-user-table tbody").html(`
            <tr class="loader-row">
              <td colspan="7" class="text-center">
                  <div class="loader">
                      <div class="rotating-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                      </div>
                  </div>
                  <span>Loading...</span>
              </td>
            </tr>
          `);
      },
      success: function (response) {
        if (response.status === "success" && response.data.length > 0) {
          callback({
            draw: data.draw,
            recordsTotal: response.total || response.data.length,
            recordsFiltered: response.total || response.data.length,
            data: response.data,
          });
        } else {
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
          $("#tax-office-user-table tbody").html(
            '<tr><td colspan="7" class="text-center">No users found.</td></tr>'
          );
        }
      },
      error: function (err) {
        console.error("Error fetching users:", err);
        callback({
          draw: data.draw,
          recordsTotal: 0,
          recordsFiltered: 0,
          data: [],
        });
        $("#tax-office-user-table tbody").html(
          '<tr><td colspan="7" class="text-center text-danger">An error occurred while fetching tax office users.</td></tr>'
        );
      },
    });
  },
  columns: [
    { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Serial number
    { data: "manager_name", defaultContent: "N/A" },
    { data: "manager_contact_email" },
    { data: "manager_contact_phone" },
    { data: "tax_office_name" },
    {
      data: "created_at",
      render: (data) => new Date(data).toLocaleDateString(),
    },
    {
      data: "id",
      render: function (data, type, row) {
        return `
        <button class="btn btn-secondary btn-sm editTaxOfficeUser" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editTaxOfficeUserModal">
          Edit
        </button>
        ${
          row.status === "active"
            ? `<button class="btn btn-danger btn-sm" onclick="deleteTaxOfficeUser(${data})">
          Deactivate
        </button>`
            : `<button class="btn btn-primary btn-sm" onclick="deleteTaxOfficeUser(${data})">
          Activate
        </button>`
        }
        
      `;
      },
    },
  ],
});

function deleteTaxOfficeUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to change the status of this tax office user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const deleteButton = $(`button[onclick="deleteTaxOfficeUser(${id})"]`);
      deleteButton
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Changing...'
        );

      $.ajax({
        type: "POST",
        url: `${HOST}/toggle-manager-status`,
        contentType: "application/json",
        data: JSON.stringify({ id }),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        success: function (response) {
          if (response.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Status Changed",
              text: "The status of the tax office has been successfully changed.",
            }).then(() => {
              $("#tax-office-user-table").DataTable().draw();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Change Failed",
              text: response.message || "Failed to change status.",
            });
          }
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: xhr.responseJSON?.message || "Something went wrong.",
          });
        },
        complete: function () {
          deleteButton
            .prop("disabled", false)
            .html(
              deleteButton.hasClass("btn-danger") ? "Deactivate" : "Activate"
            );
        },
      });
    }
  });
}

$(document).on("click", ".editTaxOfficeUser", function () {
  const taxOfficeId = $(this).data("id");
  $("#editManagerId").val("");
  $("#editManagerName").val("");
  $("#editManagerPhone").val("");
  $("#editManagerEmail").val("");
  $("#editPosition").val("");

  // Fetch tax office details
  $.ajax({
    type: "GET",
    url: `${HOST}/manager-offices?id=${taxOfficeId}`,
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        const taxOffice = response.data[0];
        $("#editManagerId").val(taxOfficeId);
        $("#editManagerName").val(taxOffice.manager_name);
        $("#editManagerPhone").val(taxOffice.manager_contact_phone);
        $("#editManagerEmail").val(taxOffice.manager_contact_email);
        $("#editPosition").val(taxOffice.position);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch tax office details.",
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch tax office details.",
      });
    },
  });
});

$("#editTaxOfficeBtn").on("click", function () {
  const managerData = {
    id: $("#editManagerId").val(),
    manager_name: $("#editManagerName").val().trim(),
    manager_contact_phone: $("#editManagerPhone").val().trim(),
    manager_contact_email: $("#editManagerEmail").val().trim(),
    position: $("#editPosition").val().trim(),
  };

  // Validation
  if (
    !managerData.manager_name ||
    !managerData.manager_contact_phone ||
    !managerData.manager_contact_email ||
    !managerData.position
  ) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "All fields are required.",
    });
    return;
  }

  $("#editTaxOfficeBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/edit-manager-office`,
    contentType: "application/json",
    data: JSON.stringify(managerData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Tax Office Updated",
          text: "The tax office has been successfully updated.",
        }).then(() => {
          $("#editTaxOfficeUserModal").modal("hide");
          $("#tax-office-user-table").DataTable().draw();
          $("#editManagerId").val("");
          $("#editManagerName").val("");
          $("#editManagerPhone").val("");
          $("#editManagerEmail").val("");
          $("#editPosition").val("");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.message || "Failed to update tax office.",
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Something went wrong.",
      });
    },
    complete: function () {
      $("#editTaxOfficeBtn").prop("disabled", false).html("Save Changes");
    },
  });
});
