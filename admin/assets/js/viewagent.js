document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const agentId = urlParams.get("agent_id");

  if (agentId) {
    fetchAgentDetails(agentId);
  }

  function fetchAgentDetails(agentId) {
    $.ajax({
      type: "GET",
      url: `${HOST}/get-enumerator-admins?agent_id=${agentId}`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      success: function (response) {
        if (response.status === "success") {
          const agent = response.data[0];
          $("#agentId").text(agent.agent_id);
          $("#agentFullName").text(agent.fullname);
          $("#agentName").val(agent.fullname);
          $("#agentEmail").val(agent.email);
          $("#agentPhone").val(agent.phone);
          $("#repSelectState").val(agent.state);
          $("#repSelectLGA").val(agent.lga);
          $("#agentAddress").val(agent.address);
          $("#agentPhoto").attr("src", agent.photo || "./assets/img/user.png");
        } else {
          alert(response.message || "Failed to fetch agent details.");
        }
      },
      error: function (err) {
        console.error("Error fetching agent details:", err);
      },
    });
  }
});
