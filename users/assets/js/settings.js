// Load the user data from the local storage
$("#loggedInUserName").text(userData.fullname);
// $("#loggedInUserRole").text(userData.user_type);
$("#email").val(userData.email);
$("#taxNumber").val(userData.tax_number);
$("#tin").val(userData.TIN);
$("#category").val(capitalizeWords(userData.category));
$("#exp").val(userData.exp);
$("#iat").val(userData.iat);
$("#iss").val(userData.iss);
$("#userId").val(userData.user_id);

async function fetchUserData(taxNumber) {
  try {
    const response = await fetch(
      `${HOST}/get-taxpayers?tax_number=${taxNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();
    const data = res.data[0]; // Assuming we want the first user data

    if (response.ok) {
      // Populate the fields with the fetched data
      $("#firstName").val(data.first_name);
      $("#lastName").val(data.surname);
      $("#email").val(data.email);
      $("#taxNumber").val(data.tax_number);
      $("#tin").val(data.tin_status); // Assuming TIN is stored in tin_status
      $("#category").val(data.category);
      $("#phonenumber").val(data.phone);
      $("#businesstype").val(data.presumptive); // Assuming presumptive is the business type
      $("#state").val(data.state);
      $("#lga").val(data.lga);
      $("#address").val(data.address);
      $("#employmentStatus").val(data.employment_status);
      $("#numberOfStaff").val(data.number_of_staff);

      let allInputs = document.querySelectorAll(".updateInputs")
      allInputs.forEach((allInpt) => {
        if (allInpt.name === 'state') {
          allInpt.value = data[allInpt.name]

          const jigawaLGAs = getStateLGAs(data[allInpt.name]);
          $('#repSelectLGA').html('')
          jigawaLGAs.forEach((opt, ii) => {
            $("#repSelectLGA").append(`<option value="${opt}">${opt}</option>`)
          });
        } else {
          allInpt.value = data[allInpt.name]
        }

      })

    } else {
      console.error("Failed to fetch user data:", res.message);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

$("#updateProfileBtn").on("click", function () {
  $("#updateProfileBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm"></span> Updating...'
    );

  let thedataToSend = {
    tax_number: userData.tax_number
  };

  let allInputs = document.querySelectorAll('.updateInputs')
  allInputs.forEach((inputo) => {
    if (inputo.disabled === true) {

    } else {
      thedataToSend[inputo.name] = inputo.value
    }
  })

  console.log(thedataToSend)
  $.ajax({
    type: "POST",
    url: `${HOST}/taxpayer-update-profile`,
    dataType: "json",
    data: JSON.stringify(thedataToSend),
    crossDomain: true,
    success: function (response) {
      $("#updateProfileBtn")
        .prop("disabled", false)
        .html("Change Password");
      if (response.status === "success") {
        Swal.fire({
          title: "Success",
          icon: "success",
          html: `<p>Your Profile has been updated successfully.</p>`,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        });
      } else {
        $("#msg_box").html(`
          <div class="alert alert-danger text-center" role="alert">${response.message
            ? response.message
            : "An Error occurred while updating your profile"
          }</div>
        `);
      }
    },
    error: function (err) {
      console.error("Error fetching TCC:", err);
      $("#updateProfileBtn")
        .prop("disabled", false)
        .html("Update");
      $("#msg_box").html(`
              <div class="alert alert-danger text-center" role="alert">${err.responseJSON.message
          ? err.responseJSON.message
          : "An Error occurred while updating your profile"
        }</div>
            `);
    },
  });

});



// Call the function with the user's tax number
fetchUserData(userData.tax_number);

$("#changePasswordBtn").on("click", function () {
  $("#changePasswordBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm"></span> Resetting...'
    );

  let thedataToSend = {
    email: userData.email,
  };

  Swal.fire({
    title: "Are you sure?",
    text: "You are about to change your password",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Change",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: `${HOST}/taxpayer-forgot-password`,
        dataType: "json",
        data: JSON.stringify(thedataToSend),
        crossDomain: true,
        success: function (response) {
          $("#changePasswordBtn")
            .prop("disabled", false)
            .html("Change Password");
          if (response.status === "success") {
            Swal.fire({
              title: "Success",
              icon: "success",
              html: `
                  <p>An Email has been sent to your  Email Address.</p>
                  <p>Follow the instruction in your Email to set up your new password.</p>
                `,
            });
          } else {
            $("#msg").html(`
              <div class="alert alert-warning text-center" role="alert">Your Email Address was not found in our database</div>
            `);
          }
        },
        error: function (err) {
          console.error("Error fetching TCC:", err);
          $("#changePasswordBtn")
            .prop("disabled", false)
            .html("Change Password");
          $("#msg").html(`
              <div class="alert alert-danger text-center" role="alert">${err.responseJSON.message
              ? err.responseJSON.message
              : "An Error occurred while resetting your password"
            }</div>
            `);
        },
      });
    }
  });
  $("#changePasswordBtn").prop("disabled", false).html("Change Password");
});

$("#logoutBtn").on("click", function () {
  // confirm before logging out with sweetalert
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to log out.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out",
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout();
    }
  });
});
