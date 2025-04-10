const authToken = localStorage.getItem("userSession");
const userData = JSON.parse(localStorage.getItem("userData"));
if (!authToken) {
  window.location.href = "../signin.html";
}

$("#sidenav-main").html(`
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand m-0" href="../dashboard.html">
        <img src="./assets/img/logo-ct-dark.png" width="26px" height="26px" class="navbar-brand-img h-100" alt="main_logo">
        <span class="ms-1 font-weight-bold">PAY-kano</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse  w-auto h-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="../dashboard.html" class="nav-link dashboard-nav" aria-controls="dashboardsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-home text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Dashboard</span>
          </a>
          
       
        <li class="nav-item">
          <a href="../mytaxes.html" class="nav-link tax-nav" aria-controls="pagesExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-coins text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">My Taxes</span>
          </a>

        </li>

        <li class="nav-item">
          <a href="../invoice.html" class="nav-link invoice-nav" aria-controls="applicationsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-receipt text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Invoice</span>
          </a>
          
        </li>
        <li class="nav-item">
          <a href="../payment-history.html" class="nav-link payment-nav" aria-controls="ecommerceExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-credit-card text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Payment History</span>
          </a>
        </li>


          <li class="nav-item">
            <a href="./paye-manager.html" class="nav-link paye-nav" aria-controls="teamExamples" role="button" aria-expanded="false">
              <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
                <i class="fa fa-user-tie text-dark text-sm opacity-10"></i>
              </div>
              <span class="nav-link-text ms-1">PAYE Manager</span>
            </a>
          </li>

        <li class="nav-item">
          <a href="../e-service.html" class="nav-link service-nav" aria-controls="projectsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa fa-globe text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">E-Service</span>
          </a>
          
        </li>

        <div class="sidenav-footer mx-3 my-3 bottom-0 position-absolute">
          <button onclick="calculateTax()" class="btn btn-dark btn-sm w-100 mb-3">Calculate Tax</button>
          <button onclick="handleLogout()" class="btn btn-danger btn-sm w-100 mb-3">Logout</button>
        </div>
       
      </ul>
    </div>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
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
          <span class="text-muted small text-truncate loggedInUserRole">${userRole}</span>
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="../settings.html"><i class="fa fa-gear me-2"></i>Settings</a></li>
      <li><a class="dropdown-item text-danger" onclick="handleLogout()"><i class="fa fa-sign-out me-2"></i>Logout</a></li>
    </ul>
  </div>
`);

// Add this function to handle logout
function handleLogout() {
  // Add your logout logic here
  localStorage.removeItem("userSession");
  localStorage.removeItem("userData");
  window.location.href = "../../signin.html"; // Redirect to login page after logout
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
          <li class="breadcrumb-item text-sm"><a class="opacity-5 text-white" href="../dashboard.html">User</a></li>
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
      $(".loggedInUserName").html(data.user.fullname || userData.fullname);
      $(".loggedInUserRole").html(data.user.user_type || userData.user_type);
      localStorage.setItem("userData", JSON.stringify(data.user));
    },
    // redirect to login page when 401 is returned
    error: function (xhr, error) {
      console.log(error);
      // if (xhr.status === 401) {
      //   window.location.href = "../signin.html";
      // }
    },
  });
}
fetchProfile();

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

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value;
}

document.querySelectorAll(".numInput").forEach(function (input) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
});
