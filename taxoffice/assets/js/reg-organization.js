let urlParamso = new URLSearchParams(window.location.search);
let categoryOfUrl = urlParamso.get("type");

function nextPage() {
  const inputs = document.querySelectorAll(".basicInfo .payeInput");
  let isValid = true;

  inputs.forEach((input) => {
    const errorMessage = input.nextElementSibling;

    if (input.required && input.value.trim() === "") {
      isValid = false;

      input.style.border = "1px solid red";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.remove("d-none");
        errorMessage.textContent = "This field is required.";
      }

      if (isValid) input.focus();
    } else {
      input.style.border = "";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.add("d-none");
      }
    }
  });

  if (isValid) {
    $("#nextPageID").click();
  }
}

function previewInfo() {
  const inputs = document.querySelectorAll(".contactInfo .payeInput");
  let isValid = true;

  inputs.forEach((input) => {
    const errorMessage = input.nextElementSibling;

    if (input.required && input.value.trim() === "") {
      isValid = false;

      input.style.border = "1px solid red";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.remove("d-none");
        errorMessage.textContent = "This field is required.";
      }

      if (isValid) input.focus();
    } else {
      input.style.border = "";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.add("d-none");
      }
    }
  });

  if (isValid) {
    const previewFields = document.querySelectorAll(".payeInput2");
    previewFields.forEach((field) => {
      const name = field.name;
      const matchingInput = document.querySelector(
        `.basicInfo [name="${name}"], .contactInfo [name="${name}"]`
      );
      if (matchingInput) {
        field.value = matchingInput.value;
      }
    });

    $("#nextClick2").click();
  }
}

function registerUser() {
  $("#regBtn")
    .prop("disabled", true)
    .html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...`
    );

  let dataToSend = {};
  const inputs = document.querySelectorAll(".payeInput");
  inputs.forEach((input) => {
    dataToSend[input.name] = input.value;
  });

  // console.log(dataToSend);
  $.ajax({
    type: "POST",
    url: `${HOST}/register-special-user`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    data: JSON.stringify(dataToSend),
    success: function (response) {
      $("#regBtn").prop("disabled", false).html(`Register`);

      if (response.status === "success") {
        Swal.fire({
          title: "Success",
          text: "Registered successfully!",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#CDA545",
          // cancelButtonColor: '#3085d6',
          confirmButtonText: "Go to PAYE manager",
        }).then((result) => {
          window.location.href = `./paye-management.html?type=${categoryOfUrl}`;
        });
      } else {
        $("#msg_box").html(
          `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
        );
      }
    },
    error: function (request, error) {
      $("#msg_box").html(
        `<p class="text-danger text-center mt-4 text-lg">${
          request.responseJSON.message
            ? request.responseJSON.message
            : "Registration Failed"
        }</p>`
      );
      console.error("Error registering user:", error);
    },
  });
}
