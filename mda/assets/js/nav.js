$("#sidenav-main").html(`
  <div class="sidenav-header">    
      <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
        aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand m-0" href="./dashboard.html" target="_blank">
        <img src="./assets/img/logo.png" width="30px" height="30px" class="navbar-brand-img h-100"
          alt="main_logo">
        <span class="ms-1 font-weight-bold">PAY-JIGAWA</span>
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
        <li class="nav-item">
          <a class="nav-link revenue-nav" href="revenue.html" >
            <div class="icon icon-shape icon-sm text-center  me-2 d-flex align-items-center justify-content-center">
              <i class="ni ni-building text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Revenue Head</span>
          </a>
        </li>
        <li class="nav-item">
          <a data-bs-toggle="collapse" href="projects.html#dashboardsExamples" class="nav-link report-nav" aria-controls="dashboardsExamples" role="button" aria-expanded="false">
            <div class="icon icon-shape icon-sm text-center me-2 d-flex align-items-center justify-content-center">
              <i class="fa fa-chart-line text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Reports</span>
          </a>
          <div class="collapse " id="dashboardsExamples">
            <ul class="nav ms-4">
              <li class="nav-item ">
                <a class="nav-link" href="invoice.html">
                  <span class="sidenav-mini-icon"> L </span>
                  <span class="sidenav-normal"> Invoice Report </span>
                </a>
              </li>
              <li class="nav-item ">
                <a class="nav-link " href="collection.html">
                  <span class="sidenav-mini-icon"> D </span>
                  <span class="sidenav-normal"> Collection Report </span>
                </a>
              </li>
            </ul>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link demandnotice-nav" href="demandnotice.html" >
            <div class="icon icon-shape icon-sm text-center  me-2 d-flex align-items-center justify-content-center">
              <i class="ni ni-building text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">Demand Notice</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a class="nav-link user-nav" href="user.html" >
            <div class="icon icon-shape icon-sm text-center  me-2 d-flex align-items-center justify-content-center">
              <i class="fa fa-users text-dark text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">User Management</span>
          </a>
        </li>
      </ul>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
`);

const userName = "Mr Abubakar"; // Replace with actual user name
const userRole = "MDA"; // Replace with actual user email

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
          <span class="fw-bold loggedInUserName">Guest</span>
          <span class="text-muted small text-truncate loggedInUserRole">Unknown</span>
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="settings.html"><i class="fa fa-gear me-2"></i>Settings</a></li>
      <li><a class="dropdown-item text-danger" id="logoutBtn"><i class="fa fa-sign-out me-2"></i>Logout</a></li>
    </ul>
  </div>
`);

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
          <li class="breadcrumb-item text-sm"><a class="opacity-5 text-white" href="./dashboard.html">MDA</a></li>
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

if (
  localStorage.getItem("mdaSession") == null &&
  !window.location.pathname.includes("/mda/index.html") &&
  !window.location.pathname.includes("/mda/forgot-password.html") &&
  !window.location.pathname.includes("/mda/reset-password.html")
) {
  window.location.href = "./index.html";
}

// if (!SessionManager.isSessionActive()) {
//   // Session is invalid, redirect to login
//   window.location.href = "./index.html";
// }

// const authToken = "";
const SessionManager = {
  // Set session start time and last activity time
  startSession: function (token) {
    const sessionData = {
      token: token,
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
    };
    localStorage.setItem("mdaSession", JSON.stringify(sessionData));
  },

  // Update last activity time
  updateActivity: function () {
    const sessionData = this.getSessionData();
    if (sessionData) {
      sessionData.lastActivityTime = Date.now();
      localStorage.setItem("mdaSession", JSON.stringify(sessionData));
    }
  },

  // Get current session data
  getSessionData: function () {
    const sessionStr = localStorage.getItem("mdaSession");
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  // Check if session is active
  isSessionActive: function () {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;

    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
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
    localStorage.removeItem("mdaSession");
    localStorage.removeItem("mdaUser");

    // Redirect to login page
    window.location.href = "./index.html";
  },
};

// Global session monitoring setup
function setupSessionMonitoring() {
  // Track user activity
  const activityEvents = ["mousedown", "keydown", "scroll", "mousemove"];

  activityEvents.forEach((event) => {
    $(document).on(event, function () {
      SessionManager.updateActivity();
    });
  });

  // Check session on page load
  function checkSession() {
    // Skip session check on login page
    if (
      window.location.pathname.includes("index.html") ||
      window.location.pathname.endsWith("/")
    ) {
      return;
    }

    if (!SessionManager.isSessionActive()) {
      // Session is invalid, redirect to login
      window.location.href = "./index.html";
    }
  }

  // Check session periodically
  checkSession();
  setInterval(checkSession, 60000); // Check every minute
}

// Global ajax setup for adding token to requests
$.ajaxSetup({
  beforeSend: function (xhr) {
    const sessionData = SessionManager.getSessionData();
    if (sessionData && sessionData.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${sessionData.token}`);
    }
  },
});

// Initialize session monitoring when document is ready
$(document).ready(function () {
  // setupSessionMonitoring();

  // Logout button handler (if exists)
  $("#logoutBtn").on("click", function (e) {
    e.preventDefault();
    SessionManager.logout();
  });
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value;
}

const authToken = SessionManager.getSessionData().token;

function fetchProfile() {
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
        $(".loggedInUserName").html(response.user.fullname);
        $(".loggedInUserRole").html(response.user.user_type);
        localStorage.setItem("mdaUser", JSON.stringify(response.user));
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching profile:", error);
      // check if the error status is 401
      if (xhr.status === 401) {
        SessionManager.logout();
        localStorage.removeItem("mdaUser");
      }
    },
  });
}

fetchProfile();

const mdaUser = JSON.parse(localStorage.getItem("mdaUser"));

const mdaId = mdaUser.mda_id;
const userId = mdaUser.user_id;
