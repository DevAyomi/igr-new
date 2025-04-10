var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  var xx = document.getElementsByClassName("imgTabs");
  var theRounder = document.querySelectorAll(".theRounder div");

  xx[n].style.display = "block";
  x[n].style.display = "block";
  theRounder[currentTab].classList.add("active");

  // fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  var xx = document.getElementsByClassName("imgTabs");
  var theRounder = document.querySelectorAll(".theRounder div");

  x[currentTab].style.display = "none";
  xx[currentTab].style.display = "none";
  theRounder[currentTab].classList.remove("active");

  currentTab = currentTab + n;

  showTab(currentTab);
}
