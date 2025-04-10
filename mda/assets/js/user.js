// // DOM Elements
// const $createUserModal = $("#createUserModal");
// const $createUserBtn = $("#createUserBtn");

// // Form Fields
// const $userName = $("#userName");
// const $userEmail = $("#userEmail");
// const $userPhone = $("#userPhone");
// const $office = $("#office");
// const $revHead = $("#revHead");
// const $users = $("#users");
// const $payment = $("#payment");
// const $report = $("#report");

// // Validation function
// function validateForm() {
//   const fields = [
//     $userName,
//     $userEmail,
//     $userPhone,
//     $office,
//     $revHead,
//     $users,
//     $payment,
//     $report,
//   ];

//   let isValid = true;
//   let errors;

//   fields.forEach((field) => {
//     const value = field.val().trim();
//     if (!value) {
//       isValid = false;
//       field.addClass("is-invalid");
//       field.next(".invalid-feedback").remove();
//       field.after(`
//             <div class="invalid-feedback">
//               This field is required
//             </div>
//           `);
//     } else {
//       field.removeClass("is-invalid");
//       field.next(".invalid-feedback").remove();
//     }
//   });

//   // Email validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test($userEmail.val())) {
//     isValid = false;
//     $userEmail.addClass("is-invalid");
//     $userEmail.next(".invalid-feedback").remove();
//     $userEmail.after(`
//           <div class="invalid-feedback">
//             Please enter a valid email address
//           </div>
//         `);
//   }

//   // Phone number validation (adjust regex as needed)
//   const phoneRegex = /^[0-9]{10,14}$/;
//   if (!phoneRegex.test($userPhone.val().replace(/\s+/g, ""))) {
//     isValid = false;
//     $userPhone.addClass("is-invalid");
//     $userPhone.next(".invalid-feedback").remove();
//     $userPhone.after(`
//           <div class="invalid-feedback">
//             Please enter a valid phone number
//           </div>
//         `);
//   }

//   // Access Level Validations
//   const accessFields = [
//     { el: $revHead, name: "Revenue Head" },
//     { el: $users, name: "Users" },
//     { el: $payment, name: "Payment" },
//     { el: $report, name: "Report" },
//   ];

//   accessFields.forEach((field) => {
//     const value = field.el.val();
//     if (!value || value === "Select") {
//       isValid = false;
//       field.el.addClass("is-invalid");
//       errors.push(`Please select an access level for ${field.name}`);
//     } else {
//       field.el.removeClass("is-invalid");
//     }
//   });

//   return isValid;
// }

// // Map access levels to permission IDs
// function mapAccessToPermissions() {
//   const permissions = [];

//   // Revenue Head Permissions
//   if ($revHead.val() === "full") {
//     permissions.push(1, 2); // Assuming 1 is view, 2 is edit
//   } else if ($revHead.val() === "view") {
//     permissions.push(1);
//   }

//   // Users Permissions
//   if ($users.val() === "full") {
//     permissions.push(3, 4); // Assuming 3 is view, 4 is edit
//   } else if ($users.val() === "view") {
//     permissions.push(3);
//   }

//   // Payment Permissions
//   if ($payment.val() === "full") {
//     permissions.push(5, 6); // Assuming 5 is view, 6 is edit
//   } else if ($payment.val() === "view") {
//     permissions.push(5);
//   }

//   // Report Permissions
//   if ($report.val() === "full") {
//     permissions.push(7, 8); // Assuming 7 is view, 8 is edit
//   } else if ($report.val() === "view") {
//     permissions.push(7);
//   }

//   return permissions;
// }

// // Create user function
// function createMDAUser() {
//   // Validate form
//   if (!validateForm()) {
//     return;
//   }

//   // Show confirmation dialog
//   Swal.fire({
//     title: "Confirm User Creation",
//     text: "Are you sure you want to create this MDA user?",
//     html: `
//         <div class="user-details">
//           <div class="info-card">
//             <div class="info-item">
//               <i class="fas fa-user"></i>
//               <div>
//                 <label>Name</label>
//                 <span>${$userName.val()}</span>
//               </div>
//             </div>
//             <div class="info-item">
//               <i class="fas fa-envelope"></i>
//               <div>
//                 <label>Email</label>
//                 <span>${$userEmail.val()}</span>
//               </div>
//             </div>
//             <div class="info-item">
//               <i class="fas fa-phone"></i>
//               <div>
//                 <label>Phone</label>
//                 <span>${$userPhone.val()}</span>
//               </div>
//             </div>
//             <div class="info-item">
//               <i class="fas fa-building"></i>
//               <div>
//                 <label>Office</label>
//                 <span>${$office.val()}</span>
//               </div>
//             </div>
//           </div>

//           <div class="access-section">
//             <h5><i class="fas fa-lock"></i> Access Levels</h5>
//             <div class="access-grid">
//               <div class="access-item ${
//                 $revHead.val() === "Yes" ? "active" : ""
//               }">
//                 <i class="fas fa-chart-line"></i>
//                 <span>Revenue Head</span>
//                 <span class="status">${$revHead.val()}</span>
//               </div>
//               <div class="access-item ${
//                 $users.val() === "Yes" ? "active" : ""
//               }">
//                 <i class="fas fa-users"></i>
//                 <span>Users</span>
//                 <span class="status">${$users.val()}</span>
//               </div>
//               <div class="access-item ${
//                 $payment.val() === "Yes" ? "active" : ""
//               }">
//                 <i class="fas fa-credit-card"></i>
//                 <span>Payment</span>
//                 <span class="status">${$payment.val()}</span>
//               </div>
//               <div class="access-item ${
//                 $report.val() === "Yes" ? "active" : ""
//               }">
//                 <i class="fas fa-file-alt"></i>
//                 <span>Report</span>
//                 <span class="status">${$report.val()}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       `,
//     icon: "question",
//     showCancelButton: true,
//     confirmButtonColor: "#02a75a",
//     cancelButtonColor: "#dc3545",
//     confirmButtonText: "Yes, create user!",
//     width: "440px",
//     customClass: {
//       popup: "custom-popup",
//       title: "custom-title",
//       htmlContainer: "custom-html",
//       confirmButton: "custom-confirm-button",
//       cancelButton: "custom-cancel-button",
//       icon: "custom-icon",
//     },
//   }).then((result) => {
//     if (result.isConfirmed) {
//       // Prepare user data
//       const userData = {
//         mda_id: mdaId, // Assuming you have the current MDA ID
//         name: $userName.val().trim(),
//         email: $userEmail.val().trim(),
//         phone: $userPhone.val().trim(),
//         password: "securepassword",
//         office_name: $office.val(),
//         permissions: mapAccessToPermissions(),
//       };

//       $createUserBtn
//         .prop("disabled", true)
//         .html(
//           '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
//         );

//       // Show loading state
//       // Swal.fire({
//       //   title: "Creating User...",
//       //   text: "Please wait while the user is being created",
//       //   didOpen: () => {
//       //     Swal.showLoading();
//       //   },
//       // });

//       // AJAX call to create user
//       $.ajax({
//         type: "POST",
//         url: `${HOST}/register-mda`,
//         data: JSON.stringify(userData),
//         contentType: "application/json",
//         headers: {
//           Authorization: "Bearer " + authToken,
//         },
//         success: function (response) {
//           if (response.status === "success") {
//             // Close modal
//             $createUserModal.modal("hide");

//             // Show success alert
//             Swal.fire({
//               title: "User Created Successfully!",
//               html: `
//                   <div class="text-start">
//                     <p>The MDA user has been created with the following details:</p>
//                     <p><strong>Name:</strong> ${userData.name}</p>
//                     <p><strong>Email:</strong> ${userData.email}</p>
//                     <p class="text-warning">Note: Please advise the user to change their password upon first login.</p>
//                   </div>
//                 `,
//               icon: "success",
//               confirmButtonText: "OK",
//             }).then(() => {
//               // Optionally, refresh user list or update UI
//               fetchMDAUsers();
//             });
//           } else {
//             // Show error alert
//             Swal.fire({
//               title: "Creation Failed",
//               text: response.message || "Failed to create user",
//               icon: "error",
//               confirmButtonText: "Try Again",
//             });
//           }
//         },
//         error: function (xhr, status, error) {
//           console.error("Error creating user:", error);

//           // Show error alert
//           Swal.fire({
//             title: "Error",
//             text: "An error occurred while creating the user",
//             icon: "error",
//             confirmButtonText: "Try Again",
//           });
//         },
//         complete: function () {
//           $createUserBtn.prop("disabled", false).html("Create User");
//           Swal.closeLoading();
//         },
//       });
//     }
//   });
// }

// // Function to update user
// function updateMDAUser() {
//   const userId = $("#editUserModal").data("id");

//   // Validate form
//   // if (!validateForm()) {
//   //   return;
//   // }

//   // Prepare user data
//   const userData = {
//     mda_user_id: userId,
//     name: $userName.val().trim(),
//     email: $userEmail.val().trim(),
//     phone: $userPhone.val().trim(),
//     // password: "newsecurepassword456", // Optionally, you can add a field for password
//     office_name: $office.val(),
//     permissions: mapAccessToPermissions(),
//   };

//   // AJAX call to update user
//   $.ajax({
//     type: "PUT",
//     url: `${HOST}/edit-mda-user`,
//     data: JSON.stringify(userData),
//     contentType: "application/json",
//     headers: {
//       Authorization: "Bearer " + authToken,
//     },
//     success: function (response) {
//       if (response.status === "success") {
//         // Close modal
//         $("#editUserModal").modal("hide");

//         // Show success alert
//         Swal.fire("User Updated Successfully!", "", "success").then(() => {
//           fetchMdaUsers();
//         });
//       } else {
//         Swal.fire(
//           "Error",
//           response.message || "Failed to update user",
//           "error"
//         );
//       }
//     },
//     error: function () {
//       Swal.fire("Error", "An error occurred while updating the user", "error");
//     },
//   });
// }

// // Event listener for save changes button
// $("#editUserModal .btn-primary").on("click", updateMDAUser);

// // Event Listeners
// $createUserBtn.on("click", createMDAUser);

// // Optional: Real-time validation
// $createUserModal.find("input, select").on("input change", function () {
//   $(this).removeClass("is-invalid");
//   $(this).next(".invalid-feedback").remove();
// });

// function fetchMdaUsers() {
//   const $tbody = $("#user-table tbody");
//   const loaderRow = `
//         <tr class="loader-row">
//           <td colspan="16" class="text-center">
//               <div class="loader">
//                   <div class="rotating-dots">
//                       <div></div>
//                       <div></div>
//                       <div></div>
//                       <div></div>
//                   </div>
//               </div>
//               <span>Loading...</span>
//           </td>
//         </tr>
//       `;

//   // Show loader
//   $tbody.html(loaderRow);

//   $.ajax({
//     type: "GET",
//     url: `${HOST}/get-mda-users?mda_id=${mdaId}`,
//     dataType: "json",
//     headers: {
//       Authorization: "Bearer " + authToken,
//       "Content-Type": "application/json",
//     },
//     crossDomain: true,
//     success: function (response) {
//       if (response.status === "success" && response.data.length > 0) {
//         const users = response.data;
//         $tbody.empty(); // Clear the loader and existing rows

//         users.forEach((user, index) => {
//           const row = `
//                 <tr>
//                   <td>${index + 1}</td>

//                   <td>${user.name || "N/A"}</td>
//             <td>${user.email}</td>
//             <td>${user.phone}</td>
//             <td>${user.office_name}</td>
//                   <td>${new Date(user.created_at).toLocaleDateString()}</td>
//                   <td>
//                       <button class="btn btn-secondary btn-sm editMdaUser" data-bs-toggle="modal"
//                       data-bs-target="#editUserModal"  data-id=${
//                         user.id
//                       }>Edit</button>
//                       <button class="btn btn-danger btn-sm deleteMdaUser" data-id=${
//                         user.id
//                       }>Delete</button>
//                   </td>
//                 </tr>
//               `;
//           $tbody.append(row);
//         });
//       } else {
//         $tbody.html(
//           '<tr><td colspan="16" class="text-center">No users found.</td></tr>'
//         );
//       }
//     },
//     error: function (err) {
//       console.error("Error fetching payments:", err);
//       $tbody.html(
//         '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching mda users.</td></tr>'
//       );
//     },
//   });
// }

// fetchMdaUsers();

// // Event listener for edit button
// $(document).on("click", ".editMdaUser", function () {
//   const userId = $(this).data("id");
//   // Fetch user details and populate the edit form
//   fetchUserDetails(userId);
// });

// // Event listener for delete button
// $(document).on("click", ".deleteMdaUser", function () {
//   const userId = $(this).data("id");
//   deleteUser(userId);
// });

// Function to fetch user details and populate the edit form
function fetchUserDetails(userId) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-mda-users?mda_id=${mdaId}&id=${userId}`,
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        const user = response.data[0];
        $("#editUserModal #userName").val(user.name);
        $("#editUserModal #userEmail").val(user.email);
        $("#editUserModal #userPhone").val(user.phone);
        $("#editUserModal #office").val(user.office_name);
        $("#editUserModal #revHead").val(
          user.permissions.includes(1) ? "full" : "view"
        );
        $("#editUserModal #users").val(
          user.permissions.includes(3) ? "full" : "view"
        );
        $("#editUserModal #payment").val(
          user.permissions.includes(5) ? "full" : "view"
        );
        $("#editUserModal #report").val(
          user.permissions.includes(7) ? "full" : "view"
        );
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

// function deleteUser(userId) {
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#02a75a",
//     cancelButtonColor: "#dc3545",
//     confirmButtonText: "Yes, delete it!",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       $.ajax({
//         type: "DELETE",
//         url: `${HOST}/delete-mda-user`,
//         data: JSON.stringify({ mda_user_id: userId }),
//         contentType: "application/json",
//         headers: {
//           Authorization: "Bearer " + authToken,
//         },
//         success: function (response) {
//           if (response.status === "success") {
//             Swal.fire("Deleted!", "User has been deleted.", "success").then(
//               () => {
//                 fetchMdaUsers();
//               }
//             );
//           } else {
//             Swal.fire("Error", "Failed to delete user", "error");
//           }
//         },
//         error: function () {
//           Swal.fire(
//             "Error",
//             "An error occurred while deleting the user",
//             "error"
//           );
//         },
//       });
//     }
//   });
// }

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

// Validation Function
function validateForm(formContext) {
  const fields = formContext.find("input[required], select[required]");
  let isValid = true;
  let errors = [];

  fields.each(function () {
    const value = $(this).val().trim();
    if (!value || value === "Select") {
      isValid = false;
      $(this).addClass("is-invalid");
      $(this).next(".invalid-feedback").remove();
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

  // Phone number validation
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

// Map Access Levels to Permissions
function mapAccessToPermissions(formContext) {
  const permissions = [];
  const accessFields = [
    { el: formContext.find("#revHead"), baseId: 1 },
    { el: formContext.find("#users"), baseId: 3 },
    { el: formContext.find("#payment"), baseId: 5 },
    { el: formContext.find("#report"), baseId: 7 },
  ];

  accessFields.forEach((field) => {
    if (field.el.val() === "full") {
      permissions.push(field.baseId, field.baseId + 1);
    } else if (field.el.val() === "view") {
      permissions.push(field.baseId);
    }
  });

  return permissions;
}

$(document).ready(function () {

  if ($.fn.DataTable.isDataTable('#user-table')) {
    $('#user-table').DataTable().clear().destroy();
  }

  table = $("#user-table").DataTable({
    // processing: true,
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        // search: data.search.value,
        // Add any additional filters
        mda_id: mdaId,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-mda-users`,
        type: 'GET',
        data: filters,
        headers: {
          Authorization: "Bearer " + authToken,
        },
        dataType: "json",
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#user-table tbody").html(`
          <tr class="loader-row">
            <td colspan="11" class="text-center">
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
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.pagination.total_records, // Total records in your database
            recordsFiltered: response.pagination.total_records, // Filtered records count
            data: response.data, // The actual data array from your API
          });

        },
        error: function () {
          $("#user-table tbody").html(`
            <tr>
              <td colspan="8" class="text-center">
                Failed to Fetch Data
              </td>
            </tr>
          `);
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Serial number
        },
      },
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
            <button class="btn btn-secondary btn-sm editMdaUser" data-bs-toggle="modal" data-bs-target="#editUserModal"  data-id=${data}>Edit</button>
            <button class="btn btn-danger btn-sm deleteMdaUser" data-id=${data}>Delete</button>
          `;
        },
      },
    ],
  });


  $("#applyFilter").on("click", function (e) {
    $("#user-table").DataTable().draw(); // Redraw the table with new filters
    $("#filterInvoiceModal").modal("hide")
  });

  // Optional: Clear filters
  $("#clear-filters").on("click", function () {
    $("#revenue_head, #status, #start_date, #end_date").val("");
    $("#user-table").DataTable().draw();
  });
});

function fetchMdaUsers() {
  const $tbody = $("#user-table tbody");
  const loaderRow = `
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
      `;

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-mda-users?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const users = response.data;
        $tbody.empty(); // Clear the loader and existing rows

        users.forEach((user, index) => {
          const row = `
                <tr>
                  <td>${index + 1}</td>

                  <td>${user.name || "N/A"}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.office_name}</td>
                  <td>${new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                      <button class="btn btn-secondary btn-sm editMdaUser" data-bs-toggle="modal"
                      data-bs-target="#editUserModal"  data-id=${user.id
            }>Edit</button>
                      <button class="btn btn-danger btn-sm deleteMdaUser" data-id=${user.id
            }>Delete</button>
                  </td>
                </tr>
              `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="16" class="text-center">No users found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching payments:", err);
      $tbody.html(
        '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching mda users.</td></tr>'
      );
    },
  });
}

// Create MDA User Function
function createMDAUser() {
  // Validate form
  if (!validateForm($createUserModal)) {
    return;
  }

  // Prepare user data
  const userData = {
    mda_id: $createUserModal.find("#mda").val(),
    name: $userName.val().trim(),
    email: $userEmail.val().trim(),
    phone: $userPhone.val().trim(),
    password: generateTemporaryPassword(),
    office_name: $office.val(),
    permissions: mapAccessToPermissions($createUserModal),
  };

  // Confirmation Dialog
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
          handleUserCreationResponse(response, userData);
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

// Update MDA User Function
function updateMDAUser() {
  // Validate form
  if (!validateForm($editUserModal)) {
    return;
  }

  const userId = $editUserModal.data("id");

  // Prepare user data
  const userData = {
    mda_user_id: userId,
    mda_id: $editUserModal.find("#mda").val(),
    name: $editUserModal.find("#userName").val().trim(),
    email: $editUserModal.find("#userEmail").val().trim(),
    phone: $editUserModal.find("#userPhone").val().trim(),
    office_name: $editUserModal.find("#office").val(),
    permissions: mapAccessToPermissions($editUserModal),
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
      handleUserUpdateResponse(response);
    },
    error: function () {
      Swal.fire("Error", "An error occurred while updating the user", "error");
    },
  });
}

// Helper Functions
function generateTemporaryPassword() {
  return "temp" + Math.random().toString(36).substring(7);
}

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
            <label>Phone</label>
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
        <h5><i class="fas fa-lock"></i> Access Levels</h5> <div class="access-grid">
          <div class="access-item ${formContext.find("#revHead").val() === "full" ? "active" : ""
    }">
            <i class="fas fa-chart-line"></i>
            <span>Revenue Head</span>
            <span class="status">${formContext.find("#revHead").val()}</span>
          </div>
          <div class="access-item ${formContext.find("#users").val() === "full" ? "active" : ""
    }">
            <i class="fas fa-users"></i>
            <span>Users</span>
            <span class="status">${formContext.find("#users").val()}</span>
          </div>
          <div class="access-item ${formContext.find("#payment").val() === "full" ? "active" : ""
    }">
            <i class="fas fa-credit-card"></i>
            <span>Payment</span>
            <span class="status">${formContext.find("#payment").val()}</span>
          </div>
          <div class="access-item ${formContext.find("#report").val() === "full" ? "active" : ""
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

function handleUserCreationResponse(response, userData) {
  if (response.status === "success") {
    $createUserModal.modal("hide");
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
      window.location.reload()
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
$("#editUser Modal .btn-primary").on("click", updateMDAUser);

// Fetch MDA Users
// fetchMdaUsers();

// Event listener for edit button
$(document).on("click", ".editMdaUser ", function () {
  const userId = $(this).data("id");
  fetchUserDetails(userId);
});

// Event listener for delete button
$(document).on("click", ".deleteMdaUser ", function () {
  const userId = $(this).data("id");
  deleteUser(userId);
});

// Function to delete user
function deleteUser(userId) {
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
      Swal.fire({
        title: "Deleting..",
        text: "Wait while we delete the user!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      $.ajax({
        type: "DELETE",
        url: `${HOST}/delete-mda-user`,
        data: JSON.stringify({ mda_user_id: userId }),
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        success: function (response) {
          if (response.status === "success") {
            Swal.fire("Deleted!", "User  has been deleted.", "success").then(
              () => {
                window.location.reload()
              }
            );
          } else {
            Swal.fire("Error", "Failed to delete user", "error");
          }
        },
        error: function () {
          Swal.fire(
            "Error",
            "An error occurred while deleting the user",
            "error"
          );
        },
      });
    }
  });
}
