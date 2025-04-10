const special_user_id = getParameterByName("id");
const payeId = getParameterByName("payerId");
let singleLinking = document.querySelector("#singleLinking");

if (singleLinking) {
  singleLinking.href = `create-staff.html?id=${special_user_id}&payerId=${payeId}`;
}

// let urlParams = new URLSearchParams(window.location.search);
// let user_id = urlParams.get("user_id");
// let business_name = urlParams.get("name");

// $("#business-name").html(business_name);
// function addStaff() {
//   const inputs = document.querySelectorAll(".enumInput");
//   let isValid = true;

//   inputs.forEach((input) => {
//     const errorMessage = input.nextElementSibling;

//     if (input.required && input.value.trim() === "") {
//       isValid = false;

//       input.style.border = "1px solid red";
//       if (errorMessage && errorMessage.tagName === "SMALL") {
//         errorMessage.classList.remove("d-none");
//         errorMessage.textContent = "This field is required.";
//       }

//       if (isValid) input.focus();
//     } else {
//       input.style.border = "";
//       if (errorMessage && errorMessage.tagName === "SMALL") {
//         errorMessage.classList.add("d-none");
//       }
//     }
//   });

//   if (isValid) {
//     $("#regBtn")
//       .prop("disabled", true)
//       .html(
//         `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...`
//       );

//     const authToken = localStorage.getItem("userSession");

//     let dataToSend = {
//       associated_special_user_id: parseInt(user_id),
//       payer_id: userData?.tax_number,
//     };
//     const inputs = document.querySelectorAll(".enumInput");
//     inputs.forEach((input) => {
//       if (input.dataset.number === "yes" && input.value !== "") {
//         dataToSend[input.dataset.name] = parseFloat(input.value);
//       } else if (input.value === "") {
//         dataToSend[input.dataset.name] = 0;
//         console.log(input.value);
//       } else {
//         dataToSend[input.dataset.name] = input.value;
//       }
//     });

//     // console.log(dataToSend);
//     $.ajax({
//       type: "POST",
//       url: `${HOST}/register-employee-with-salary`,
//       dataType: "json",
//       headers: {
//         Authorization: "Bearer " + authToken,
//       },
//       data: JSON.stringify(dataToSend),
//       success: function (response) {
//         $("#regBtn").prop("disabled", false).html(`Register`);

//         if (response.status === "success") {
//           Swal.fire({
//             title: "Success",
//             text: "Registered successfully!",
//             icon: "success",
//             showCancelButton: false,
//             confirmButtonColor: "#02A75A",
//             // cancelButtonColor: '#3085d6',
//             confirmButtonText: "Continue",
//           }).then((result) => {
//             window.location.reload();
//           });
//         } else {
//           $("#msg_box").html(
//             `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
//           );
//         }
//       },
//       error: function (request, error) {
//         $("#regBtn").prop("disabled", false).html(`Register`);
//         $("#msg_box").html(
//           `<p class="text-danger text-center mt-4 text-lg">${
//             request.responseJSON.message
//               ? request.responseJSON.message
//               : "Registration Failed"
//           }</p>`
//         );
//         console.error("Error registering user:", error);
//       },
//     });
//   }
// }

$(document).ready(function () {
  $("#bulkCreateModal").on("click", "#submitBulkCreate", function () {
    $("#submitBulkCreate").prop("disabled", true).text("Uploading...");
    const fileInput = $("#csv-file")[0];

    // Check if a file is selected
    if (fileInput.files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Oops",
        text: "Please select a CSV file to upload.",
        confirmButtonText: "Ok",
      });
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const csvData = event.target.result;
      console.log("CSV Data:", csvData); // Debug: Log raw CSV data

      const employees = parseCSV(csvData);
      console.log("Parsed Employees:", employees); // Debug: Log parsed data

      // Append special_user_id and payeId to each employee object
      const payload = employees.map((employee) => ({
        ...employee,
        associated_special_user_id: special_user_id,
        payer_id: payeId,
      }));

      console.log("Payload with appended fields:", payload); // Debug: Log final payload

      // Send data to API
      $.ajax({
        url: `${HOST}/register-multi-employee-with-salary`, // Replace with your API endpoint
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $("#submitBulkCreate").prop("disabled", true).text("Creating...");
        },
        success: function (response) {
          if (response.status === "success" && response.successful.length > 0) {
            Swal.fire({
              icon: "success",
              title: "Employees Added",
              text: "The employees have been successfully added.",
              confirmButtonText: "OK",
            }).then(() => {
              // Close modal
              $("#bulkCreateModal").modal("hide");
              // Optionally, refresh the page or update the UI
              // window.location.href = `payedetails.html?id=${special_user_id}&payerId=${payeId}`;
            });
            // Check for errors in the response
            if (response.unsuccessful && response.unsuccessful.length > 0) {
              showErrorModal(response);
            }
          } else {
            // Handle unexpected error response
            showErrorModal(response);
          }
        },
        error: function (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.responseJSON.message ||
              "Something went wrong. Please try again.",
            confirmButtonText: "OK",
          });
        },
        complete: function () {
          $("#submitBulkCreate").prop("disabled", false).text("Upload");
        },
      });
    };

    reader.readAsText(file);
  });

  function parseCSV(data) {
    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = parseCSVLine(lines[i]); // Use a helper function to handle quoted fields

      if (currentLine.length === headers.length) {
        headers.forEach((header, index) => {
          obj[header] = currentLine[index].trim(); // Trim each value
        });

        // Convert numeric fields to integers
        obj.basic_salary = parseInt(obj.basic_salary);
        obj.employee_taxnumber = parseInt(obj.employee_taxnumber);
        obj.housing = parseInt(obj.housing);
        obj.transport = parseInt(obj.transport);
        obj.utility = parseInt(obj.utility);
        obj.medical = parseInt(obj.medical);
        obj.entertainment = parseInt(obj.entertainment);
        obj.leaves = parseInt(obj.leaves);

        result.push(obj);
      }
    }

    return result;
  }

  // Helper function to handle quoted fields in CSV
  function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let currentField = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes; // Toggle inQuotes flag
      } else if (char === "," && !inQuotes) {
        result.push(currentField); // End of field
        currentField = "";
      } else {
        currentField += char; // Append character to current field
      }
    }

    // Push the last field
    result.push(currentField);
    return result;
  }

  function showErrorModal(response) {
    // Set the main error message
    $("#errorMessage").text(response.message || "An error occurred.");

    // Clear previous error list
    $("#errorList").empty();

    // Populate the error list
    if (response.unsuccessful && response.unsuccessful.length > 0) {
      response.unsuccessful.forEach((error) => {
        const listItem = `
          <div class="list-group-item list-group-item-action">
            <div>
              <p class="mb-1 text-xs text-danger">
              ${error.error}
              </p>
              
            </div>
          </div>
        `;
        $("#errorList").append(listItem);
      });
    }

    // Add instruction for reuploading
    const instructionMessage = `
      <ul class="text-sm">
          <li>Please correct the errors listed above and reupload the affected items.</li>
          <li>Ensure that the item codes and names are unique and follow the required format.</li>
      </ul>
    `;
    $("#errorList").append(instructionMessage);

    // Show the error modal
    $("#errorModal").modal("show");
  }
});
