$("#sidenav-main").html(`
  <div class="sidenav-header">    


      <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
        aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand m-0" href="./dashboard.html" target="_blank">
        <img src="./assets/img/logo.png" width="30px" height="30px" class="navbar-brand-img h-100"
          alt="main_logo">
        <span class="ms-1 font-weight-bold">Jigawa IGR</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0">
    <div class="collapse navbar-collapse  w-auto h-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav"> 

        <li class="nav-item">
          <a class="nav-link dashboard-nav" href="dashboard.html" >
            <div class="icon icon-shape icon-sm text-center  me-2 d-flex align-items-center justify-content-center">
              <i class="ni ni-shop text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Dashboard</span>
          </a>
        </li>

        <!-- <li class="nav-item">
          <a href="enumeration.html" class="nav-link enumeration-nav" aria-controls="pagesExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-ungroup text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Enumeration</span>
          </a>

        </li> -->

        <li class="nav-item">
          <a href="taxpayer.html" class="nav-link taxpayer-nav" aria-controls="applicationsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-ui-04 text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Tax Payers</span>
          </a>
          
        </li>
        
        <li class="nav-item">
          <a href="settings.html" class="nav-link setting-nav" aria-controls="projectsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-building text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Settings</span>
          </a>
          
        </li>

      </ul>
    </div>
 
`);


const enumUser = JSON.parse(localStorage.getItem("enumeratorUser"));

let userName = enumUser?.fullname || "Guest";
let userRole = enumUser?.user_type || "Unknown";
let userTaxNumber = enumUser?.tax_number || "Unknown";
let userEmail = enumUser?.email || "Unknown";
let userId = enumUser?.user_id || "Unknown";

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
          <span class="text-muted small text-truncate">Enumerator</span>
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="settings.html"><i class="fa fa-gear me-2"></i>Settings</a></li>
      <li><a class="dropdown-item text-danger" id="logoutBtn" onclick="handleLogout()"><i class="fa fa-sign-out me-2"></i>Logout</a></li>
    </ul>
  </div>
`);

function showActiveNav(thenav) {
  let navLinks = document.querySelector(`.${thenav}`);
  if (navLinks) {
    navLinks.classList.add("active");
  }
}

function handleLogout() {
  // Add your logout logic here
  localStorage.removeItem("enumeratorUser");
  window.location.href = "./index.html"; // Redirect to login page after logout
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
          <li class="breadcrumb-item text-sm"><a class="opacity-5 text-white" href="./dashboard.html">Admin</a></li>
          <li class="breadcrumb-item text-sm text-white active">${thename}</li>
        </ol>
      </nav>
  `);

}

let currentYear = new Date().getFullYear();

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value;
}

$("#footer").html(`
  <div class="container-fluid">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="copyright text-center text-sm text-muted text-lg-start">
          © 2021 - ${currentYear}, Primeguage Solutions Limited Portal. All rights reserved.
        </div>
      </div>
      <div class="col-lg-6">
        
      </div>
    </div>
  </div>  
`);


const SessionManager = {
  // Set session start time and last activity time
  startSession: function (token) {
    const sessionData = {
      token: token,
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
    };
    localStorage.setItem("enumeratorSession", JSON.stringify(sessionData));
  },

  // Update last activity time
  updateActivity: function () {
    const sessionData = this.getSessionData();
    if (sessionData) {
      sessionData.lastActivityTime = Date.now();
      localStorage.setItem("enumeratorSession", JSON.stringify(sessionData));
    }
  },

  // Get current session data
  getSessionData: function () {
    const sessionStr = localStorage.getItem("enumeratorSession");
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  // Check if session is active
  isSessionActive: function () {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;

    const IDLE_TIMEOUT = 10 * 60 * 3000; // 10 minutes
    const MAX_SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - sessionData.lastActivityTime;
    const sessionDuration = currentTime - sessionData.loginTime;

    // Check for idle timeout or max session duration
    if (
      timeSinceLastActivity > IDLE_TIMEOUT ||
      sessionDuration > MAX_SESSION_DURATION
    ) {
      this.logout();
      return false;
    }

    return true;
  },

  // Logout function
  logout: function () {
    // Clear local storage
    localStorage.removeItem("enumeratorSession");
    localStorage.removeItem("enumeratorUser");

    // Redirect to login page
    window.location.href = "./index.html";
  },
};

// Global ajax setup for adding token to requests
$.ajaxSetup({
  beforeSend: function (xhr) {
    const sessionData = SessionManager.getSessionData();
    if (sessionData && sessionData.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${sessionData.token}`);
    }
  },
});

const authToken = SessionManager.getSessionData().token;

