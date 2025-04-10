// let USERINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));
const urlParams = new URLSearchParams(window.location.search);

let myParam = urlParams.get('category');
let userTypo = urlParams.get('user');

if (myParam == "individual") {
  myParam = 2;
} else if (myParam == "corporate") {
  myParam = 1;
} else if (myParam == "state") {
  myParam = 3;
} else {
  myParam = 4;
}


let theIDD
let selectedValue = "";

document.addEventListener('DOMContentLoaded', (event) => {
  const inputField = document.getElementById('phon');

  inputField.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
      if (value.length > 11) {
          value = value.slice(0, 11); // Restrict to 11 digits
      }
      e.target.value = value;
  });

  inputField.addEventListener('blur', function(e) {
      if (e.target.value.length !== 11) {
          alert('Phone number must be exactly 11 digits.');
      }
  });
});


function continueReg() {
  let allInputs = document.querySelectorAll(".enumInput")
  let radioInputs = document.querySelectorAll(".radiInpu");

  // check for empty fileds

  for (var i = 0; i < radioInputs.length; i++) {
    if (radioInputs[i].checked) {
      selectedValue = radioInputs[i].value;
      break; // Exit the loop once a selected radio input is found
    }
  }

  if (selectedValue !== "") {
    for (let i = 0; i < allInputs.length; i++) {
      const inpt = allInputs[i];

      if (inpt.required && inpt.value === "") {
        alert("Please fill all required fields")
        inpt.scrollIntoView()
        break;
      }

      if (i === allInputs.length - 1) {
        if (selectedValue === "1") {
          nextPrev(1)
        } else {
          nextPrev(1)
          previewPage()
        }

      }
    }
  } else {
    alert("Please select your business status");
  }

}

function continueReg2() {
  let allInputs = document.querySelectorAll(".enumInputB")


  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      previewPage()
    }
  }
}

function previewPage() {
  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")

  allInputs.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  allInputsB.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInputB2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  nextPrev(1)
}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let EnumData = {
    "endpoint": "createPayerAccount",
    "data": {
      "img": "assets/img/userprofile.png",
      "business_type": "",
      "annual_revenue": "",
      "value_business": "",
      "numberofstaff": "",
      "password": "",
      "rep_firstname": "",
      "rep_surname": "",
      "rep_email": "",
      "rep_phone": "",
      "rep_position": "",
      "rep_state": "",
      "rep_state": "",
      "rep_lga": "",
      "rep_address": "",
      "industry": "",
      "category": myParam,
      "business_own": selectedValue
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  // let allInputsB = document.querySelectorAll(".enumInputB")
  let businessNums = document.querySelectorAll(".businessNums")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  businessNums.forEach((busines, ii) => {
    let the_inputs = busines.querySelectorAll(".enumInputB")

    the_inputs.forEach((inputt, i) => {

      if (ii === businessNums.length - 1) {

        EnumData.data[inputt.dataset.name] += inputt.value
      } else {
        EnumData.data[inputt.dataset.name] += inputt.value + `~`
      }

    })

  })

  // console.log(EnumData)

  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      // console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#theButton").removeClass("hidden")

      } else {
        if (userTypo === "admin") {
          nextPrev(1)
        } else {
          $("#msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
          // $("#theButton").removeClass("hidden")
          setTimeout(() => {
            window.location.href = `verification.html?id=${data.id}&email=${EnumData.data.email}&phone=${EnumData.data.phone}`
          }, 2000);
        }

      }

      // if (data.status === 1) {
      //   // $("#theButton").addClass("hidden")
      //   if (data.id) {
      //     theIDD = data.id
      //   }

      //   nextPrev(1)
      // } else {
      //   $("#theButton").removeClass("hidden")
      //   $("#msg_box").html(`
      //     <p class="text-warning text-center text-lg">${data.message}</p>
      //   `)
      // }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  }
  sendToDB()

}

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < 8; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function emailVerifcation() {
  $("#sendMailBtnCont").addClass("hidden")
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?sendEmailEnum&id=${theIDD}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">Email sent successfully !</p>
        </div>
      `)
      nextPrev(3)
    },
    error: function (request, error) {
      console.log(error)
      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try SMS verification!</p>
        </div>
      `)
    }
  });
}

function phoneVerifcation() {
  $("#sendMailBtnCont").addClass("hidden")
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsVerifyEnum&id=${theIDD}&num=1`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">message sent successfully !</p>
        </div>
      `)
      nextPrev(1)
      startTimer()
    },
    error: function (request, error) {
      console.log(error)
      $("#sendMailBtnCont").removeClass("hidden")
      $("#msg_box2").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try SMS verification!</p>
        </div>
      `)
    }
  });
}

function resend() {
  $("#resCont").addClass("hidden")
  $("#msg_box3").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsVerifyEnum&id=${theIDD}&num=6`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      $("#resCont").removeClass("hidden")
      $("#msg_box3").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-success">message sent successfully !</p>
        </div>
      `)
      startTimer()
    },
    error: function (request, error) {
      console.log(error)
      $("#resCont").removeClass("hidden")
      $("#msg_box3").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-warning">Something went wrong, try email verification!</p>
        </div>
      `)
    }
  });
}


function startTimer() {
  var button = document.getElementById("resend");
  button.disabled = true;
  button.classList.add("disabled")

  var timeLeft = 60;
  var timer = setInterval(function () {
    document.getElementById("countdown").innerHTML = "resend in: " + timeLeft + "s";
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      button.disabled = false;
      button.classList.remove("disabled")
      document.getElementById("countdown").innerHTML = "";
    }
  }, 1000);
}

function verifyAccounttt() {
  let codee = document.querySelector("#codeee").value
  $("#theVerifyy").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  $.ajax({
    type: "GET",
    url: `${HOST}?smsUpdateAccountEnum&id=${theIDD}&code=${codee}`,
    dataType: 'json',
    // data: StringedData,
    success: function (data) {

      if (data.status === 1) {
        $("#theVerifyy").removeClass("hidden")
        $("#msg_boxx").html(`
          <div class="flex justify-center items-center mt-4">
            <p class="text-success">${data.message}</p>
          </div>
        `)
        nextPrev(1)
      } else {
        $("#theVerifyy").removeClass("hidden")
        $("#msg_boxx").html(`
          <div class="flex justify-center items-center mt-4">
            <p class="text-warning">${data.message}!</p>
          </div>
        `)
      }

    },
    error: function (request, error) {
      console.log(error)
      $("#theVerifyy").removeClass("hidden")
      $("#msg_boxx").html(`
        <div class="flex justify-center items-center mt-4">
          <p class="text-danger">Failed to Activate Account</p>
        </div>
      `)
    }
  });
}

// activateAcountEnum

let businessTypes = ``

async function fetchBusiness() {
  try {
    const response = await fetch(`${HOST}/?getPresumptiveTax`)
    const data = await response.json()

    // console.log(data)

    if (data.status === 1) {

      data.message.forEach(busness => {
        businessTypes += `
          <option value="${busness.business_type}">${busness.business_type}</option>
        `

        $("#busiType").append(`
          <option value="${busness.business_type}">${busness.business_type}</option>
        `)
      })
    }

  } catch (error) {
    console.log(error)
  }
}

fetchBusiness()

function addBusiness() {
  $("#businessCnt").append(`
    <div class="businessNums mt-3">


      <div class="flex justify-end">
        <button onclick="deleteBusiness(this)">
          <iconify-icon icon="ic:round-delete"></iconify-icon>
        </button>
      </div>

      <div class="form-group mb-3">
        <label for="">Industry*</label>
        <select class="form-select enumInputB" data-name="industry" required>
          <option value="">Select</option>
          <option value="Mining">Mining</option>
          <option value="Commerce">Commerce</option>
          <option value="Banking">Banking</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Engineering">Engineering</option>
          <option value="Construction">Construction</option>
          <option value="Government Institution">Government Institution</option>
          <option value="NGO">NGO</option>
          <option value="Religious Institutions">Religious Institutions</option>
          <option value="General Merchandise">General Merchandise</option>
          <option value="General Contractor">General Contractor</option>
          <option value="Private Schools"> Private Schools</option>
          <option value="Public Schools">Public Schools</option>
          <option value="Hospitals">Hospitals</option>
        </select>
      </div>

      <div class="flex gap-3 md:flex-row flex-col mb-3">

        <div class="form-group md:w-6/12">
          <label for="">Type of Business*</label>
          <select class="form-select enumInputB" id="busiType" data-name="business_type" required>
            ${businessTypes}
          </select>
        </div>

        <div class="form-group md:w-6/12">
          <label for="">No of Employees*</label>
          <select class="form-select enumInputB" data-name="numberofstaff" required>
            <option value=""></option>
            <option value="1-9">1-9</option>
            <option value="10-29">10-29</option>
            <option value="30-50">30-50</option>
          </select>
        </div>

      </div>

      <div class="flex gap-3 md:flex-row flex-col mb-3">

        <div class="form-group md:w-6/12">
          <label for="">Annual Revenue return in naira*</label>
          <select class="form-select enumInputB" data-name="revenue_return" required>
            <option value=""></option>
            <option value="1-100,000">1-100,000</option>
            <option value="100,001 - 499,999">100,001 - 499,999</option>
            <option value="500,000 and above">500,000 and above</option>
          </select>
        </div>

        <div class="form-group md:w-6/12">
          <label for="">Value of business/assets In naira*</label>
          <select class="form-select enumInputB" data-name="valuation" required>
            <option value=""></option>
            <option value="1 - 500,000">1 - 500,000</option>
            <option value="500,001 - 999,999">500,001 - 999,999</option>
            <option value="1,000,000 and above">1,000,000 and above</option>
          </select>
        </div>

      </div>

      <hr>
    </div>

    
  `)
}

function deleteBusiness(e) {
  let parentss = e.parentElement.parentElement
  parentss.remove()

}

