// Load the user data from the local storage
$("#loggedInUserName").text(mdaUser.fullname);
$("#loggedInUserRole").text(mdaUser.user_type);
$("#email").val(mdaUser.email);
$("#taxNumber").val(mdaUser.tax_number);
$("#tin").val(mdaUser.TIN);
$("#category").val(mdaUser.category);
$("#exp").val(mdaUser.exp);
$("#iat").val(mdaUser.iat);
$("#iss").val(mdaUser.iss);
$("#userId").val(mdaUser.user_id);

if (mdaUser.category === "Individual") {
  $("#orgName").html(`
    <div class="col-6">
      <label class="form-label">First Name</label>
      <div class="input-group">
        <input id="firstName" disabled name="firstName" class="form-control" type="text" placeholder="First Name"
          required="required" />
      </div>
    </div>
    <div class="col-6">
      <label class="form-label">Last Name</label>
      <div class="input-group">
        <input id="lastName" disabled name="lastName" class="form-control" type="text" placeholder="Last Name"
          required="required" />
      </div>
    </div>
  `);
  $("#firstName").val(mdaUser.first_name);
  $("#lastName").val(mdaUser.surname);
} else {
  $("#orgName").html(`
    <div class="col-12">
      <label class="form-label">Organisation Name</label>
      <div class="input-group">
        <input id="firstName" disabled name="firstName" class="form-control" type="text" placeholder="First Name"
          required="required" />
      </div>
    </div>
  `);

  $("#firstName").val(mdaUser.first_name + " " + mdaUser.surname);
}

$("#changePasswordBtn").on("click", function () {
  var currentPassword = $("#currentPassword").val();
  var newPassword = $("#newPassword").val();
  var confirmPassword = $("#confirmPassword").val();

  if (!currentPassword || !newPassword || !confirmPassword) {
    $("#msg")
      .html("<p class='text-danger'>All fields are required.</p>")
      .show();
    return;
  }

  if (newPassword !== confirmPassword) {
    $("#msg").html("<p class='text-danger'>Passwords do not match.</p>").show();
    return;
  }

  if (newPassword.length < 6) {
    $("#msg")
      .html(
        "<p class='text-danger'>Password must be at least 6 characters long.</p>"
      )
      .show();
    return;
  }

  $(this).prop("disabled", true).text("Updating...");

  $.ajax({
    url: "/api/change-password",
    method: "POST",
    data: {
      current_password: currentPassword,
      new_password: newPassword,
    },
    success: function (response) {
      $("#msg")
        .html("<p class='text-success'>Password updated successfully.</p>")
        .show();
      $("#changePasswordBtn").prop("disabled", false).text("Update password");
    },
    error: function (xhr) {
      $("#msg")
        .html("<p class='text-danger'>An error occurred. Please try again.</p>")
        .show();
      $("#changePasswordBtn").prop("disabled", false).text("Update password");
    },
  });
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
