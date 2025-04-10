function hasPermission(permissionId) {
  const permissions = JSON.parse(localStorage.getItem("adminPermissions")) || [];
  return permissions.find(perm => perm.permission_id === permissionId);
}

let noAccessHTML = `
  <div class="d-flex align-items-center justify-content-center flex-column h-100">
    <div class="d-flex justify-content-center">
      <img src="./assets/img/road-barrier.png" width='200' alt="" />
    </div>
    <p class="text-center">You don't have access to this page!</p>
  </div>
`

document.addEventListener("DOMContentLoaded", function () {
  // DASHBOARD ACCESS
  $('#dashboard-container').removeClass('d-none')
  $('#etccmanagemetCont').removeClass('d-none')
  $('#enumDashboard').removeClass('d-none')
  $('#crtNewUserCont').removeClass('d-none')

  if (!hasPermission(1)) {
    $('#dashboard-container').css('height', '70vh')
    $('#dashboard-container').html(noAccessHTML)
  }


  // MDA ACCESS
  if (!hasPermission(8)) { // Create MDA
    $('#mda-actions').removeClass('d-none')
    $('.createMdaBtn').remove()
    $('.bulkMdaBtn').remove()
  }

  if (hasPermission(10)) { // Create Revenue Head
    $('#createRevHeadsCont').removeClass('d-none')
  }

  if (hasPermission(11)) { // Update Revenue Head
    $('#acceptPaymentContainer').removeClass('d-none')
  }


  // ETCC MANAGEMENT ACCESS
  const has47 = hasPermission(47); // First Reviewer
  const has48 = hasPermission(48); // Second Reviewer
  const has49 = hasPermission(49); // Third Reviewer

  const noAccess = !has47 && !has48 && !has49;

  if (noAccess) {
    $('#etccmanagemetCont').css('height', '70vh').html(noAccessHTML);
  } else {
    // Remove tabs based on permission
    if (!has47) $('.firstReviewerTab').remove();
    if (!has48) $('.secondReviewerTab').remove();
    if (!has49) $('.thirdReviewerTab').remove();
    $('.directorReviewerTab').remove(); // Always removed

    // Activate the correct tab
    if (has48) {
      $('.secondReviewerTab .nav-link').addClass('active');
      $('.etccmanagemetCont #pills-one').removeClass('active show');
      $('.etccmanagemetCont #pills-two').addClass('active show');
    } else if (has49) {
      $('.thirdReviewerTab .nav-link').addClass('active');
      $('.etccmanagemetCont #pills-one').removeClass('active show');
      $('.etccmanagemetCont #pills-three').addClass('active show');
    }
  }

  // INVOICE AND PAYMENT REPORT
  const permissions = {
    viewInvoiceList: hasPermission(14), // View Invoice List
    generateInvoiceReport: !hasPermission(15), // Generate Invoice Report
    viewCollectionList: hasPermission(17), // Generate Collection Report
  };

  if (permissions.viewInvoiceList) $('#reportBtns-container').removeClass('d-none');
  if (permissions.generateInvoiceReport) $('.generateInvReport').remove();
  if (permissions.viewCollectionList) $('#reportBtns2-container').removeClass('d-none');
  if (permissions.generateInvoiceReport) $('.generateInvReport2').remove();

  // TAX PAYER LIST
  const taxPayerPermissions = {
    activateTaxPayer: hasPermission(22),
    downloadTaxReport: hasPermission(24)
  }

  if (taxPayerPermissions.activateTaxPayer) $("#createTaxP").removeClass('d-none')
  if (taxPayerPermissions.downloadTaxReport) $("#dwnlReport").removeClass('d-none')

  // Enumeration Permissions

  const enumeratorPermission = {
    accessDashboard: hasPermission(29),
    downloadTaxReport: hasPermission(24),
    createFieldAgent: hasPermission(25),
    updateDetails: hasPermission(27)
  }

  if (!hasPermission(29)) {// Access Enumeration Dashboard
    $('#enumDashboard').html(noAccessHTML)
  } else {
    if (enumeratorPermission.createFieldAgent) {
      $('#createFieldAgent').removeClass('d-none')
    }
    if (enumeratorPermission.updateDetails) {
      $('#saveChangesEnum').removeClass('d-none')
    }
  }

  // CMS ROLES & PERMISSION
  const CMSPermission = {
    createNewGallery: hasPermission(38),
    createNewNews: hasPermission(39),
    manageGallery: hasPermission(40),
    manageNews: hasPermission(41)
  }

  if (CMSPermission.createNewGallery && CMSPermission.createNewNews) {
    $('#createPostCms').removeClass('d-none')
  }

  // PAYE ROLES & PERMISSION
  if (hasPermission(50)) {
    $('#payeViewContainer').removeClass('d-none')
    $('#payedwnBtn').removeClass('d-none')
    $('.payeregtn').removeClass('d-none')
  }

  // Tax Manager Permissions.
  if (hasPermission(53)) { // No Access to Tax Manager
    $('#presumptive-tax-container').html(noAccessHTML)
    $('#presumptive-tax-container').css('height', '70vh')
  } else if (!hasPermission(53) && !hasPermission(52)) {
    $('#presumptive-tax-container').html(noAccessHTML)
    $('#presumptive-tax-container').css('height', '70vh')

  }


  // user mmanagement permissions
  if (hasPermission(35)) {
    $("#crtmdaAdmnBtn").removeClass('d-none')
    $("#crtAdmnBtn").removeClass('d-none')
  }

  if (!hasPermission(35)) {
    $('#crtNewUserCont').css('height', '50vh')
    $("#crtNewUserCont").html(noAccessHTML)
  }

  // Analytics roles & permission
  if (hasPermission(2)) {// revenueCollection-analysis
    $("#revenueCollection-analysis").removeClass('d-none')
  }

  if (hasPermission(3)) {// invoicingAnalytics
    $("#invoicingAnalytics").removeClass('d-none')
  }

  if (hasPermission(4)) {// taxpayer-analytics
    $("#taxpayer-analytics").removeClass('d-none')
  }
  
  


});
