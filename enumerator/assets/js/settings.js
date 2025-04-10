// Load the user data from the local storage
$("#loggedInUserName").text(enumUser?.fullname || "Guest");
$("#fullname").val(enumUser?.fullname || "Guest")
$("#email").val(enumUser?.email || "N/A");
$("#agent_id").val(enumUser?.agent_id || "N/A");

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
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
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
