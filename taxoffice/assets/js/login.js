// Login Form Submission
$("#loginForm").on("submit", function (e) {
  e.preventDefault();

  // Get input values and trim whitespace
  let email = $("#email").val().trim();
  let password = $("#password").val().trim();

  // Clear previous messages
  $("#msg").html("");

  // Validate email and password
  let validationErrors = [];

  // Email validation
  if (email === "") {
    validationErrors.push("Email address is required");
  } else {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.push("Please enter a valid email address");
    }
  }

  // Password validation
  if (password === "") {
    validationErrors.push("Password is required");
  }

  // Check if there are any validation errors
  if (validationErrors.length > 0) {
    const errorMessages = validationErrors
      .map(
        (error) =>
          `<p class="text-danger bg-red-100 p-1 rounded text-center mt-2 text-sm">${error}</p>`
      )
      .join("");

    $("#msg").html(`
          <div class="validation-errors">
            ${errorMessages}
          </div>
        `);
    return;
  }

  // Disable login button to prevent multiple submissions
  $("#loginBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...'
    );

  // Prepare login data
  const loginData = {
    email: email,
    password: password,
  };

  // AJAX login request
  $.ajax({
    type: "POST",
    url: `${HOST}/tax-officer-login`,
    data: JSON.stringify(loginData),
    dataType: "json",
    success: function (response) {
      if (response.status === "error") {
        $("#msg").html(`
              <div class="alert alert-danger text-center" role="alert">
                ${response.message || "Login failed. Please try again."}
              </div>
            `);

        $("#loginBtn").prop("disabled", false).html("Sign in");
      } else if (response.status === "success") {
        // Start session management
        SessionManager.startSession(response.token);

        // Fetch profile after successful login
        fetchProfile(response.token);
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg").html(`
              <div class="alert alert-danger text-center" role="alert">
                Something went wrong try again
              </div>
            `);
      $("#loginBtn").prop("disabled", false).html("Sign in");
    },
  });
});

async function fetchProfile(authToken) {
  $.ajax({
    type: "GET",
    url: `${HOST}/profile`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    crossDomain: true,
    success: function (response) {
      console.log(response);
      if (response.status === "success") {
        localStorage.setItem("taxofficeUser", JSON.stringify(response.user));
        getAdminPermissions(response.user.user_id, authToken);
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      $("#loginBtn").prop("disabled", false).html("Sign in");
    },
  });
}

function getAdminPermissions(theid, authToken) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-admin-permissions?admin_id=${theid}`, // Adjust the endpoint if necessary
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        let adminPermissionData = response.data;
        localStorage.setItem(
          "taxofficePermissions",
          JSON.stringify(adminPermissionData)
        );

        $("#msg").html(`
          <div class="alert alert-success text-center" role="alert">
            Login successful!
          </div>
        `);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "./dashboard.html";
        }, 1000);
      } else {
        console.log("Failed to fetch roles & permission.");
      }
    },
    error: function (error) {
      console.log(error, "Failed to fetch roles & permission.");
    },
  });
}
