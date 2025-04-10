const authToken = localStorage.getItem("userSession");
const userData = JSON.parse(localStorage.getItem("userData"));
if (!authToken) {
  window.location.href = "../signin.html";
}

$("#sidenav-main").html(`
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand m-0" href="dashboard.html">
        <img src="./assets/img/logo-ct-dark.png" width="26px" height="26px" class="navbar-brand-img h-100" alt="main_logo">
        <span class="ms-1 font-weight-bold">PAY-JIGAWA</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse  w-auto h-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="dashboard.html" class="nav-link dashboard-nav" aria-controls="dashboardsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-home text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Dashboard</span>
          </a>
          
       
        <li class="nav-item">
          <a href="mytaxes.html" class="nav-link tax-nav" aria-controls="pagesExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-coins text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">My Taxes</span>
          </a>

        </li>

        <li class="nav-item">
          <a href="invoice.html" class="nav-link invoice-nav" aria-controls="applicationsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-receipt text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Invoice</span>
          </a>
          
        </li>
        <li class="nav-item">
          <a href="payment-history.html" class="nav-link payment-nav" aria-controls="ecommerceExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-credit-card text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Payment History</span>
          </a>
        </li>

        ${userData?.tax_category === "formal"
    ? `
            <li class="nav-item">
          <a href="direct-assessment.html" class="nav-link informal-nav" aria-controls="ecommerceExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-user-tie text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Direct Assessment</span>
          </a>
        </li>
            `
    : ``
  }

        ${userData?.category == "individual"
    ? `
          <li class="nav-item">
            <a href="paye-manager.html" class="nav-link paye-nav" aria-controls="teamExamples" role="button" aria-expanded="false">
              <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
                <i class="fa fa-user-tie text-dark text-sm opacity-10"></i>
              </div>
              <span class="nav-link-text ms-1">PAYE Manager</span>
            </a>
          </li>
        `
    : `
            <li class="nav-item">
            <a href="corporate/paye-manager.html" class="nav-link paye-nav" aria-controls="teamExamples" role="button" aria-expanded="false">
              <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
                <i class="fa fa-user-tie text-dark text-sm opacity-10"></i>
              </div>
              <span class="nav-link-text ms-1">PAYE Manager</span>
            </a>
          </li>
            `
  }
        

        <li class="nav-item">
          <a href="e-service.html" class="nav-link service-nav" aria-controls="projectsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-globe text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">E-Service</span>
          </a>
          
        </li>
       
      </ul>
    </div>
    <div class="sidenav-footer mx-3 my-3 bottom-0 position-absolute">
      <button data-bs-toggle="modal"
        data-bs-target="#tax_calc_modal" class="btn btn-dark btn-sm w-100 mb-3">Calculate Tax</button>
      <button onclick="handleLogout()" class="btn btn-danger btn-sm w-100 mb-3">Logout</button>
    </div>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

    <div
          class="modal fade"
          id="tax_calc_modal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background: transparent; border: none;">
              <div class="modal-body">
                <div class="calculator-container d-flex">
                  <!-- Left sidebar with tabs -->
                  <div class="calculator-sidebar col-md-4">
                    <div class="calculator-header">Tax Calculator</div>

                    <ul class="calculator-tabs">
                      <li class="calculator-method active-method" id="paye-tab">
                        <a href="#paye"> <i class="fas fa-chess-king"></i> PAYE </a>
                      </li>
                      <li class="calculator-method" id="wht-tab">
                        <a href="#wht"> <i class="fas fa-chess-king"></i> WHT </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Main calculator area -->
                  <div class="calculator-main col-sm-12 col-md-8">
                    <div class="business-header">
                      <div class="business-logo">
                        <img src="./assets/img/logo-ct-dark.png" width="50" />
                      </div>
                      <button
                        type="button"
                        class="btn-close text-dark"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i class="fa-solid fa-x text-dark"></i>
                      </button>
                    </div>

                    <div class="calculator-mobile-sidebar">
                      <ul class="calculator-tabs">
                        <li class="calculator-method active-method" id="paye-tab">
                          <a href="#paye"> <i class="fas fa-chess-king"></i> PAYE </a>
                        </li>
                        <li class="calculator-method" id="wht-tab">
                          <a href="#wht"> <i class="fas fa-chess-king"></i> WHT </a>
                        </li>
                      </ul>
                    </div>

                    <!-- PAYE Calculator -->
                    <div id="paye" class="calculator-tab active">
                      <div class="calculator-form">
                        <div class="calculator-form-title">PAYE Calculator</div>

                        <form id="payeForm">
                          <div class="form-group">
                            <label for="payeMonthlyIncome">Annual Gross Income</label>
                            <input
                              type="number"
                              class="form-control"
                              id="payeMonthlyIncome"
                              required
                            />
                          </div>
                          <button type="submit" class="calculate-button">
                            Calculate PAYE
                          </button>
                        </form>
                        <div class="calcLoader" id="payeLoader" style="display: none"></div>
                        <div class="result" id="payeResult">
                          <div class="result-row">
                            <small>Transaction Amount:</small>
                            <span id="payeGrossIncome">₦0</span>
                          </div>
                          <button class="back-button" onclick="showForm('payeForm')">
                            Back to Form
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Withholding Tax Calculator -->
                    <div id="wht" class="calculator-tab">
                      <div class="calculator-form">
                        <div class="calculator-form-title">Withholding Tax Calculator</div>

                        <form id="whtForm">
                          <div class="form-group mb-2">
                            <label for="whtAmount">Transaction Amount</label>
                            <input
                              type="number"
                              class="form-control"
                              id="whtAmount"
                              required
                            />
                          </div>
                          <div class="form-group mb-2">
                            <label for="transaction_type">Transaction Type</label>
                            <select
                              name="transaction_type"
                              id="transaction_type"
                              class="form-select"
                            >
                              <option value="consultancy">Consultancy</option>
                              <option value="rent">Rent</option>
                              <option value="dividends">Dividends</option>
                              <option value="construction">Construction</option>
                              <option value="commissions">Commissions</option>
                              <option value="directors_fees">Directors Fees</option>
                            </select>
                          </div>
                          <div class="form-group mb-2">
                            <label for="recipient_type">Recipient Type</label>
                            <select
                              name="recipient_type"
                              id="recipient_type"
                              class="form-select"
                            >
                              <option value="individual">Individual</option>
                              <option value="company">Company</option>
                            </select>
                          </div>
                          <button type="submit" class="calculate-button">
                            Calculate WHT
                          </button>
                        </form>
                        <div class="calcLoader" id="whtLoader" style="display: none"></div>
                        <div class="result" id="whtResult">
                          <div class="result-row">
                            <small>Transaction Amount:</small>
                            <span id="whtGrossAmount">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>WHT Rate:</small>
                            <span id="whtTaxRate">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>WHT Due:</small>
                            <span id="whtTaxDue">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>Net Payment:</small>
                            <span id="whtNetAmount">₦0</span>
                          </div>
                          <button class="back-button" onclick="showForm('whtForm')">
                            Back to Form
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

`);

let userName = userData?.fullname || "Guest";
let userRole = userData?.user_type || "Unknown";
let userTaxNumber = userData?.tax_number || "Unknown";
let userEmail = userData?.email || "Unknown";
let userTin = userData?.TIN || "Unknown";
let userId = userData?.user_id || "Unknown";
let userCategory = userData?.category || "Unknown";

$("#profileImage").append(`
  <div class="dropdown position-relative">
    <a
      href="#"
      class="nav-link text-white d-flex align-items-center text-white font-weight-bold"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <div class="border border-white border-2 rounded-circle">
        <img src="./assets/img/user.png" alt="Profile" width="40" class="object-fit-cover" />
      </div>
    </a>
    <ul class="dropdown-menu dropdown-menu-end" style="z-index: 9999; position: absolute;">
      <li class="px-3">
        <div class="d-flex flex-column">
          <span class="fw-bold loggedInUserName">${userName}</span>
          <span class="text-muted small text-truncate">Tax Payer</span>
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="settings.html"><i class="fa fa-gear me-2"></i>Settings</a></li>
      <li><a class="dropdown-item" onclick="openChat()" href="#"><i class="fa fa-circle-info me-2"></i>Contact Support</a></li>
      <li><a class="dropdown-item text-danger" onclick="handleLogout()"><i class="fa fa-sign-out me-2"></i>Logout</a></li>
    </ul>
  </div>
`);


// Add this function to handle logout
function handleLogout() {
  // Add your logout logic here
  localStorage.removeItem("userSession");
  localStorage.removeItem("userData");
  window.location.href = "../signin.html"; // Redirect to login page after logout
}

function showActiveNav(thenav) {
  let navLinks = document.querySelector(`.${thenav}`);
  if (navLinks) {
    navLinks.classList.add("active");
  }
}

function showBreadCrumb(thename) {
  $("#breadcrumb-container").append(`
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-2">
          <li class="breadcrumb-item text-sm">
            <a class="text-white" href="javascript:;">
              <i class="ni ni-box-2"></i>
            </a>
          </li>
          <li class="breadcrumb-item text-sm"><a class="opacity-5 text-white" href="./dashboard.html">User</a></li>
          <li class="breadcrumb-item text-sm text-white active">${thename}</li>
        </ol>
      </nav>
  `);
}

let currentYear = new Date().getFullYear();

$("#footer").html(`
  <div class="container-fluid">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-12 mb-lg-0 mb-4">
        <div class="copyright text-center text-sm text-muted text-lg-start">
          © 2021 - ${currentYear}, Primeguage Solutions Limited Portal. All rights reserved.
        </div>
      </div>
    </div>
  </div>  
`);

function fetchProfile() {
  $.ajax({
    type: "GET",
    url: `${HOST}/profile`,
    dataType: "json",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    success: function (data) {
      if (data.status == "success") {
        $(".loggedInUserName").html(data.user.fullname || userData.fullname);
        // $(".loggedInUserRole").html(data.user.user_type || userData.user_type);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } else {
        handleLogout();
      }
    },
    // redirect to login page when 401 is returned
    error: function (xhr, error) {
      console.log(error);
      if (xhr.status === 401 || xhr.responseText.includes("Expired token")) {
        handleLogout();
      }
    },
  });
}
// fetchProfile();

function getMonthInWordFromDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create a Date object from the input string
  const dateObject = new Date(dateString);

  // Get the month (returns a number from 0 to 11)
  const monthNumber = dateObject.getMonth();

  // Get the month name from the array using the month number
  const monthInWord = months[monthNumber];

  return monthInWord;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
document.head.appendChild(script);




function openChat() {
  if (Tawk_API) {
    // Show and open chat

    loginToTawk()
  }
}

var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/67c882ced32913191469291c/1iljjttt2";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();

async function loginToTawk() {
  const apiKey = "7d03c84d0c7e55f0d4b4f3e5dc835d8f11225f1c";

  function hashInBase64(userId) {
    var hash = CryptoJS.HmacSHA256(userId, apiKey);

    return CryptoJS.enc.Hex.stringify(hash);
  }

  // Ensure the widget is loaded before calling login
  if (typeof Tawk_API !== 'undefined' && Tawk_API.login) {
    Tawk_API.login({
      hash: hashInBase64(userData.tax_number),
      userId: userData.tax_number,
      // name: userData.fullname,
      // email: userData.email,
    }, function (error) {
      if (error) {
        console.error("Tawk.to login error:", error);
      } else {
        Tawk_API.showWidget();
        Tawk_API.maximize();
      }
    });
  } else {
    console.error("Tawk.to is not ready yet.");
  }
}

document.querySelectorAll(".numInput").forEach(function (input) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabs = document.querySelectorAll(".calculator-method");
  const tabContents = document.querySelectorAll(".calculator-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active-method"));

      // Add active class to clicked tab
      this.classList.add("active-method");

      // Get the target tab content
      const targetId = this.querySelector("a")
        .getAttribute("href")
        .substring(1);

      // Hide all tab contents
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show the target tab content
      document.getElementById(targetId).classList.add("active");
    });
  });

  // PAYE Calculator (API Integration)
  document.getElementById("payeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader("payeLoader", "payeForm", "payeResult");

    const annualGrossIncome =
      parseFloat(document.getElementById("payeMonthlyIncome").value) * 12;

    const payload = {
      annual_gross_income: annualGrossIncome,
    };

    fetch(`${HOST}/calculate-paye`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("payeGrossIncome").textContent = formatPrice(
          data.data.transaction_amount
        );
        showResult("payeLoader", "payeForm", "payeResult");
      })
      .catch((error) => {
        console.error("Error calculating PAYE:", error);
        alert("An error occurred while calculating PAYE. Please try again.");
        showForm("payeForm");
      });
  });

  // Withholding Tax Calculator (API Integration)
  document.getElementById("whtForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader("whtLoader", "whtForm", "whtResult");

    const amount = parseFloat(document.getElementById("whtAmount").value);
    const transaction_type = document.getElementById("transaction_type").value;

    const recipient_type = document.getElementById("recipient_type").value;

    const payload = {
      transaction_amount: amount,
      transaction_type,
      recipient_type,
    };

    fetch(`${HOST}/calculate-wht`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          document.getElementById("whtGrossAmount").textContent = formatPrice(
            data.data.transaction_amount
          );
          document.getElementById(
            "whtTaxRate"
          ).textContent = `${data.data.wht_rate.toFixed(2)}%`;
          document.getElementById("whtTaxDue").textContent = formatPrice(
            data.data.wht_due
          );
          document.getElementById("whtNetAmount").textContent = formatPrice(
            data.data.net_payment
          );
          showResult("whtLoader", "whtForm", "whtResult");
        } else {
          throw new Error("API returned an error status");
        }
      })
      .catch((error) => {
        console.error("Error calculating WHT:", error);
        alert("An error occurred while calculating WHT. Please try again.");
        showForm("whtForm");
      });
  });
});

function showLoader(loaderId, formId, resultId) {
  document.getElementById(loaderId).style.display = "block";
  document.getElementById(formId).style.display = "none";
  document.getElementById(resultId).style.display = "none";
}

function showResult(loaderId, formId, resultId) {
  document.getElementById(loaderId).style.display = "none";
  document.getElementById(resultId).style.display = "block";
}

function showForm(formId) {
  document.getElementById(formId).style.display = "block";
  document.getElementById(formId.replace("Form", "Result")).style.display =
    "none";
}

function formatPrice(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol", // Use symbol (₦) instead of code (NGN)
  }).format(amount);
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value;
}
