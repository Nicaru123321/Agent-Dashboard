function computeConversion(crm, traffic) {
  return traffic > 0 ? ((crm / traffic) * 100).toFixed(1) : "0.0";
}

function showDashboard(id) {
  document.querySelectorAll('.dashboard').forEach(section => {
    section.classList.remove('visible');
    section.classList.add('hidden');
  });
  const target = document.getElementById(id);
  target.classList.remove('hidden');
  setTimeout(() => target.classList.add('visible'), 50);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".saveBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".agent-card");
      const type = card.dataset.type; // daily or weekly
      const agentName = card.querySelector("h2").textContent.trim();

      const traffic = parseFloat(card.querySelector("span[id*='traffic']").textContent.trim()) || 0;
      const volume = parseFloat(card.querySelector("span[id*='volume']").textContent.trim()) || 0;
      const crm = parseFloat(card.querySelector("span[id*='crm']").textContent.trim()) || 0;
      const conversions = computeConversion(crm, traffic);

      const historyTable = card.querySelector(".history tbody");
      const newRow = document.createElement("tr");

      if (type === "daily") {
        let date = new Date().toLocaleString();
        const dateInput = card.querySelector("#agentA-date");
        if (dateInput && dateInput.value) {
          date = new Date(dateInput.value).toLocaleDateString();
        }
        newRow.innerHTML = `
          <td>${date}</td>
          <td>${traffic}</td>
          <td>${volume}</td>
          <td>${crm}</td>
          <td>${conversions}%</td>
        `;
      } else {
        const fromDate = card.querySelector("#weeklyA-from").value || "";
        const thruDate = card.querySelector("#weeklyA-thru").value || "";
        newRow.innerHTML = `
          <td>${fromDate}</td>
          <td>${thruDate}</td>
          <td>${traffic}</td>
          <td>${volume}</td>
          <td>${crm}</td>
          <td>${conversions}%</td>
        `;
      }

      historyTable.appendChild(newRow);
      alert(`${agentName}'s entry saved! Conversion: ${conversions}%`);
    });
  });

  // Export per-agent
  document.querySelectorAll(".exportBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".agent-card");
      const agentName = card.querySelector("h2").textContent.trim();
      const rows = card.querySelectorAll(".history tr");

      let csvContent = "data:text/csv;charset=utf-8,";
      const headers = Array.from(card.querySelectorAll(".history th")).map(th => th.textContent).join(",");
      csvContent += headers + "\n";

      rows.forEach((row, index) => {
        if (index === 0) return;
        const cols = row.querySelectorAll("td");
        const rowData = Array.from(cols).map(td => td.textContent).join(",");
        csvContent += rowData + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = `${agentName}_history.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  // Export all agents combined
  const exportAllBtn = document.getElementById("exportAll");
  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      let csvContent = "data:text/csv;charset=utf-8,Agent,";
      const headers = Array.from(document.querySelector(".history th")).map(th => th.textContent).join(",");
      csvContent += headers + "\n";

      document.querySelectorAll(".agent-card").forEach(card => {
        const agentName = card.querySelector("h2").textContent.trim();
        const rows = card.querySelectorAll(".history tr");
        rows.forEach((row, index) => {
          if (index === 0) return;
          const cols = row.querySelectorAll("td");
          const rowData = Array.from(cols).map(td => td.textContent).join(",");
          csvContent += agentName + "," + rowData + "\n";
        });
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = `All_Agents_History.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});
