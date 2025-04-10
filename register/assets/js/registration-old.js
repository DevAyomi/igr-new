//hide password//

// const passwordToggle = document.getElementById('password-toggle');
// const passwordIcon = document.getElementById('password-icon');
// const passwordInput = document.getElementById('password');

// const confirmPasswordToggle = document.getElementById('confirm-password-toggle');
// const confirmPasswordIcon = document.getElementById('confirm-password-icon');
// const confirmPasswordInput = document.getElementById('confirmPassword');

// const passwordFeedback = document.getElementById('password-feedback');
// const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');

// passwordToggle.addEventListener('click', () => {
//   if (passwordInput.type === 'password') {
//     passwordInput.type = 'text';
//     passwordIcon.classList.remove('fa-eye');
//     passwordIcon.classList.add('fa-eye-slash');
//   } else {
//     passwordInput.type = 'password';
//     passwordIcon.classList.remove('fa-eye-slash');
//     passwordIcon.classList.add('fa-eye');
//   }
// });

// confirmPasswordToggle.addEventListener('click', () => {
//   if (confirmPasswordInput.type === 'password') {
//     confirmPasswordInput.type = 'text';
//     confirmPasswordIcon.classList.remove('fa-eye');
//     confirmPasswordIcon.classList.add('fa-eye-slash');
//   } else {
//     confirmPasswordInput.type = 'password';
//     confirmPasswordIcon.classList.remove('fa-eye-slash');
//     confirmPasswordIcon.classList.add('fa-eye');
//   }
// });

// passwordInput.addEventListener('input', () => {
//   if (passwordInput.value.length < 8) {
//     passwordFeedback.classList.add('d-block');
//     passwordInput.classList.add('is-invalid');
//   } else {
//     passwordFeedback.classList.remove('d-block');
//     passwordInput.classList.remove('is-invalid');
//   }
// });

// confirmPasswordInput.addEventListener('input', () => {
//   if (confirmPasswordInput.value !== passwordInput.value) {
//     confirmPasswordFeedback.classList.add('d-block');
//     confirmPasswordInput.classList.add('is-invalid');
//   } else {
//     confirmPasswordFeedback.classList.remove('d-block');
//     confirmPasswordInput.classList.remove('is-invalid');
//   }
// });

///end////

let pageUrl = new URL(window.location.href);
let createdby = pageUrl.searchParams.get("createdby");

$(document).ready(function () {
  $('input[name="slector_categs"]').on("change", function () {
    if ($(this).val() === "Individual") {
      $("#firstSurname").html(`
        <input type="text" name="first_name" class="form-control regInputs required" minlength="2"
          placeholder="First Name*" required>

        <input type="text" name="surname" class="form-control regInputs required" minlength="2"
          placeholder="Last Name*" required>
      `);
    } else if ($(this).val() === "Corporate") {
      $("#firstSurname").html(`
        <input type="text" name="first_name" class="form-control regInputs required" minlength="2"
          placeholder="Name Of Organization*" required>

          <input type="text" name="surname" class="form-control d-none regInputs" minlength="2"
          placeholder="Last Name*" required>
      `);
    }
  });

  let businessSection = `
    <div class="form-inner-area">
        <input type="text" name="phone" placeholder="Business Name*">
      </div>

      <div class="language-select mt-3">
        <label class="form-label">Type Of Business*</label>
        <select name="business_type" class="regInputs  required" required>
          <option value="" selected="">
            -Select the type of the business--
          </option>
          <option value="Commercial">Commercial</option>
          <option value="Pool">Pool betting</option>
          <option value="Education">Education</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Mining">Mining</option>
          <option value="Services">Services</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Housing">Housing/real estate/lands</option>
          <option value="Transporting">Transporting</option>
          <option value="Legal">Legal</option>
          <option value="General">General</option>
        </select>

        <div class="mt-2">
          <label class="form-label">No of Employees*</label>
          <select class="form-select required regInputs" name="number_of_staff" required="">
            <option value=""></option>
            <option value="1-9">1-9</option>
            <option value="10-29">10-29</option>
            <option value="30-50">30-50</option>
          </select>
        </div>

        <div class="mt-2">
          <label class="form-label">Annual Revenue Return In Naira*</label>
          <select name="annual_revenue" class="form-select required regInputs" required>
            <option value=""></option>
            <option value="1-100,000">1-100,000</option>
            <option value="100,001 - 499,999">100,001 - 499,999</option>
            <option value="500,000 and above">500,000 and above</option>
          </select>
        </div>

        <div class="mt-2">
          <label class="form-label">Value of business/assets In naira*</label>
          <select class="form-select required regInputs" name="value_business" required="">
            <option value=""></option>
            <option value="1 - 500,000">1 - 500,000</option>
            <option value="500,001 - 999,999">500,001 - 999,999</option>
            <option value="1,000,000 and above">
              1,000,000 and above
            </option>
          </select>
        </div>
    </div>
  `;

  const $businessOwnerDropdown = $('select[name="business_own"]');

  $businessOwnerDropdown.on("change", function () {
    if ($(this).val() === "2") {
      // No
      $("#business_section").html(``);
    } else {
      // Yes
      $("#business_section").html(businessSection);
    }
  });

  const idTypeOption = $('select[name="id_type"]');
  $(".idNumberCont").hide();

  idTypeOption.on("change", function () {
    if ($(this).val() === "") {
      // No
      $("#idNumberCont").html("");
    } else if ($(this).val() === "BVN") {
      $("#idNumberCont").html(`
        <label for="idNumber" class="form-label">ID Number*</label>
        <div class="form-inner-area">
          <input type="text" name="bvn" class="regInputs required" placeholder="Input BVN number">
        </div>
      `);
    } else if ($(this).val() === "National ID") {
      $("#idNumberCont").html(`
        <label for="idNumber" class="form-label">ID Number*</label>
        <div class="form-inner-area">
          <input type="text" name="nin" class="regInputs required" placeholder="Input NIN number">
        </div>
      `);
    }
  });
});

async function registerUser() {
  try {
    $("#registerUserBtn").addClass("d-none");
    $("#msg_box").html(loaderHTML);

    const allInputs = document.querySelectorAll(".regInputs");

    let selected_category = $('input[name="slector_categs"]:checked').val();

    let obj = {
      verification_status: 1,
      tin_status: 1,
      surname: "",
      category: selected_category,
      created_by: createdby === "admin" ? "admin" : "self",
    };

    allInputs.forEach((allInput) => {
      if (allInput.name === "email") {
        obj[allInput.name] = allInput.value.trim();
      } else {
        obj[allInput.name] = allInput.value;
      }
    });

    $.ajax({
      type: "POST",
      url: `${HOST}/register-taxpayer`,
      data: JSON.stringify(obj),
      dataType: "json",
      success: function (data) {
        console.log(data);
        $("#registerUserBtn").removeClass("d-none");

        if (data.status === "success") {
          // console.log("Registration successful:", data);

          $("#tax_payer_id").html(data.tax_number);

          let emailentered = $(".emailentered").val();
          let phonenumber = $(".phoneentered").val();

          $("#verifyNowBtn").attr(
            "href",
            `./verification.html?email=${emailentered}&phone=${phonenumber}&tax_id=${data.tax_number}`
          );

          if (createdby === "admin") {
            $("#verifyBtns").html(`<a href="../admin/taxpayer.html" class="btn btn-primary">Go to Taxpayer</a>`)
          } else {
            $("#verifyBtns").html(`     
              <ul>
                <li>
                  <a href="../index.html">
                    <span title="Verify Later">Verify Later</span>
                  </a>
                </li>

                <li>
                  <a href="../verification.html" id="verifyNowBtn">
                    <span title="Verify Now">Verify Now</i>
                    </span>
                  </a>
                </li>
              </ul>
            `)
          }
          $("#theNextAfterClick").click();
        } else {
          $("#msg_box").html(
            `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
          );
        }
      },
      error: function (request, error) {
        $("#registerUserBtn").removeClass("d-none");
        $("#msg_box").html(
          `<p class="text-danger text-center mt-4 text-lg">${request.responseJSON.message
            ? request.responseJSON.message
            : "Registration Failed"
          }</p>`
        );
        console.log(request);
      },
    });
  } catch (error) { }
}
