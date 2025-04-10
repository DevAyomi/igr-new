$("#loginBtn").on("click", (e) => {
  e.preventDefault();
  let emailAdd = document.querySelector("#emailAdd").value;
  let password = document.querySelector("#password").value;

  if (emailAdd === "" || password === "") {
    $("#msg").html(`
      <p class="text-danger text-center mt-4 text-lg">Please fill in all fields</p>
    `);

    return;
  }

  // $("#msg").html(`
  //   <div class="loader">
  //     <div class="rotating-dots">
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //     </div>
  //   </div>
  // `);

  $("#loginBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Login...'
    );

  const loginData = {
    email: emailAdd,
    password: password,
  };

  $.ajax({
    type: "POST",
    url: `${HOST}/taxpayer-login`,
    data: JSON.stringify(loginData),
    dataType: "json",
    success: function (data) {
      console.log(data);
      if (data.status === "error") {
        $("#msg").html(`
          <p class="text-danger bg-red-100 p-1 rounded text-center mt-4 text-lg">${data.message}</p>
        `);
        $("#loginBtn").removeClass("hidden");
      } else if (data.status === "success") {
        localStorage.setItem("userSession", data.token);
        fetchProfile(data.token);
      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg").html(`
        <p class="text-danger bg-red-100 p-1 rounded text-center mt-4 text-lg">Something went wrong try again !</p>
      `);
    },
    complete: function () {
      $("#loginBtn").prop("disabled", false).html("Log In");
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
      if (response.status === "success") {
        localStorage.setItem("userData", JSON.stringify(response.user));

        $("#msg").html(`
          <div class="alert alert-success text-center" role="alert">
            Login successful!
          </div>
        `);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "./users/dashboard.html";
        }, 1500);
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      $("#loginBtn").prop("disabled", false).html("Sign in");
    },
  });
}
