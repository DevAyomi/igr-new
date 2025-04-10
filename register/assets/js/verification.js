document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  const phone = urlParams.get("phone");
  const taxNumber = urlParams.get("tax_number");
  const chooseMethodElement = document.getElementById("chooseMethod");
  const sendCodeBtn = document.getElementById("sendCodeBtn");

  // Default method and contact
  let selectedMethod = email ? "email" : phone ? "phone" : "tax_number";
  let contactValue =
    selectedMethod === "email"
      ? email
      : selectedMethod === "phone"
      ? phone
      : taxNumber;

  // Display contact information
  if (contactValue) {
    chooseMethodElement.textContent = contactValue;
  } else {
    chooseMethodElement.textContent = "No valid contact provided";
  }

  // Handle method selection
  const methodInputs = document.querySelectorAll(
    "input[name='verifyCategory']"
  );
  methodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      selectedMethod = input.value;
      contactValue =
        selectedMethod === "email"
          ? email
          : selectedMethod === "phone"
          ? phone
          : taxNumber;
      chooseMethodElement.textContent = contactValue || "Contact not available";
      sendCodeBtn.disabled = selectedMethod === "";
    });
  });

  // Initially disable the sendCodeBtn if no contact value is available
  // sendCodeBtn.disabled = !selectedMethod;

  // Function to check verification status
  async function checkVerificationStatus() {
    if (!contactValue) {
      throw new Error("No contact information available for verification.");
    }

    const endpoint = `${HOST}/noauth-check-taxpayer-verification?${selectedMethod}=${contactValue}`;

    try {
      const response = await $.ajax({
        url: endpoint,
        method: "GET",
      });
      return response;
    } catch (xhr) {
      const errorMessage =
        xhr.responseJSON?.message ||
        "An error occurred during verification check.";
      throw new Error(errorMessage);
    }
  }

  // Function to send OTP
  async function sendOTP() {
    if (!contactValue) {
      throw new Error("No contact information available for OTP.");
    }

    const payload = {
      method: selectedMethod,
      contact: contactValue,
      email: contactValue,
    };

    try {
      const response = await $.ajax({
        url: `${HOST}/noauth-regenerate-verification-code`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
      });
      return response;
    } catch (xhr) {
      const errorMessage =
        xhr.responseJSON?.message || "An error occurred while sending the OTP.";
      throw new Error(errorMessage);
    }
  }

  sendCodeBtn.addEventListener("click", async () => {
    sendCodeBtn.innerHTML = `<i class="custom-spinner"></i> Checking...`;
    sendCodeBtn.disabled = true;

    try {
      const verificationResponse = await checkVerificationStatus();

      if (verificationResponse.data.verification_status === "verified") {
        Swal.fire(
          "Info",
          `Your account is already verified with ${selectedMethod}: ${contactValue}`,
          "info"
        );
        return;
      }

      // If not verified, proceed to send OTP
      await sendOTP();
      nextPrev(1);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      sendCodeBtn.innerHTML = `Continue`;
      sendCodeBtn.disabled = false;
    }
  });

  // Handle "Resend Code" button
  const resendBtn = document.getElementById("resendBtn");
  const resendCounter = document.getElementById("resendCounter");

  resendBtn.addEventListener("click", async () => {
    resendBtn.innerHTML = `<i class="custom-spinner"></i> Resending...`;
    resendBtn.disabled = true;

    try {
      await sendOTP();

      // Start countdown for resend button
      let countdown = 60;
      resendCounter.textContent = `Resend in 01:00`;
      resendCounter.classList.remove("hidden");
      resendBtn.classList.add("hidden");

      const interval = setInterval(() => {
        countdown--;
        const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
        const seconds = String(countdown % 60).padStart(2, "0");
        resendCounter.textContent = `Resend in ${minutes}:${seconds}`;

        if (countdown <= 0) {
          clearInterval(interval);
          resendCounter.classList.add("hidden");
          resendBtn.classList.remove("hidden");
          resendBtn.innerHTML = `Resend`;
          resendBtn.disabled = false;
        }
      }, 1000);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      resendBtn.innerHTML = `Resend`;
      resendBtn.disabled = false;
    }
  });

  // Handle "Verify Code" button
  const verifyBtn = document.querySelector("#verifyBtn");
  const codeInputElement = document.getElementById("code");

  // Enable/disable the verify button based on input
  codeInputElement.addEventListener("input", () => {
    verifyBtn.disabled = !codeInputElement.value.trim();
  });

  verifyBtn.addEventListener("click", async () => {
    const codeInput = codeInputElement.value.trim();

    // Prepare payload with dynamic key based on selectedMethod
    const payload = {
      verification_code: codeInput,
      [selectedMethod]: contactValue, // Dynamic key based on selected method
    };

    verifyBtn.innerHTML = `<i class="custom-spinner"></i> Verify...`;
    verifyBtn.disabled = true;

    try {
      const response = await $.ajax({
        url: `${HOST}/noauth-verify-taxpayer`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
      });

      // Check if the response status indicates success
      if (response.status === "success") {
        // Adjust this based on your API response
        Swal.fire({
          title: "Success",
          text: "Your account has been verified successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "../signin.html";
          }
        });
      } else {
        // If the status is not success, show an error
        Swal.fire(
          "Error",
          response.message || "Something went wrong during verification.",
          "error"
        );
      }
    } catch (xhr) {
      // Handle any errors from the API request
      const errorMessage =
        xhr.responseJSON?.message || "Invalid verification code.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      verifyBtn.innerHTML = `Verify`;
      verifyBtn.disabled = false;
    }
  });
});
