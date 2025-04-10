const SessionManager = {
  // Set session start time and last activity time
  startSession: function (token) {
    const sessionData = {
      token: token,
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
    };
    localStorage.setItem("adminSession", JSON.stringify(sessionData));
  },

  // Update last activity time
  updateActivity: function () {
    const sessionData = this.getSessionData();
    if (sessionData) {
      sessionData.lastActivityTime = Date.now();
      localStorage.setItem("adminSession", JSON.stringify(sessionData));
    }
  },

  // Get current session data
  getSessionData: function () {
    const sessionStr = localStorage.getItem("adminSession");
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
    // Optional: Call backend logout endpoint
    $.ajax({
      type: "POST",
      url: `${HOST}/logout`,
      headers: {
        Authorization: `Bearer ${this.getSessionData()?.token}`,
      },
      complete: () => {
        // Clear local storage
        localStorage.removeItem("adminSession");

        // Redirect to login page
        window.location.href = "./index.html";
      },
    });
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
  setupSessionMonitoring();

  // Logout button handler (if exists)
  $("#logoutBtn").on("click", function (e) {
    e.preventDefault();
    SessionManager.logout();
  });
});
