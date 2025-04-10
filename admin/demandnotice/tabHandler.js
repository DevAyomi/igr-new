var currentTab = 0;
var totalTabs = document.getElementsByClassName("form-tab").length;

// Initialize the first tab
showTab(currentTab);

function showTab(n) {
  // Hide all tabs
  var tabs = document.getElementsByClassName("form-tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }

  // Show the current tab
  tabs[n].style.display = "flex";
}

function nextPrev(n) {
  // Hide current tab
  var tabs = document.getElementsByClassName("form-tab");
  tabs[currentTab].style.display = "none";

  // Update current tab index
  currentTab += n;

  // Ensure we don't go out of bounds
  if (currentTab >= totalTabs) {
    currentTab = totalTabs - 1;
  }
  if (currentTab < 0) {
    currentTab = 0;
  }

  // Show the new tab
  showTab(currentTab);
}

function hideAllTabs() {
  var tabs = document.getElementsByClassName("form-tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
}
