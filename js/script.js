
let bloodPressureChart = null;

document.addEventListener("patientLoaded", event => {
  const { patient, patients } = event.detail;

  renderPatientList(patients);
  renderProfile(patient);
  renderVitals(patient);
  renderPressureSummary(patient);
  renderDiagnosticList(patient);
  renderLabResults(patient);
  renderBloodPressureChart(patient);

  console.log("Dashboard loaded:", patient.name);
});

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value ?? "—";
  }
}

function formatDate(value) {
  if (!value) return "—";

  // API date is typically MM/DD/YYYY.
  // Parse it directly to avoid timezone-related date changes.
  const match = String(value).match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
  );

  if (match) {
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  }

  // Handle ISO date strings without shifting the calendar day.
  const isoMatch = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (isoMatch) {
    const date = new Date(Date.UTC(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    ));

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  }

  return String(value);
}

// PATIENT LIST — Jessica Taylor first
function renderPatientList(patients) {
  const container = document.getElementById("patientsList");

  if (!container) return;

  container.replaceChildren();

  const sortedPatients = [...(patients || [])].sort((a, b) => {
    if (a.name === "Jessica Taylor") return -1;
    if (b.name === "Jessica Taylor") return 1;
    return 0;
  });

  sortedPatients.forEach(patient => {
    const item = document.createElement("div");
    item.className = "patient-item";

    if (patient.name === "Jessica Taylor") {
      item.classList.add("active");
    }

    const image = document.createElement("img");
    image.src = patient.profile_picture || "";
    image.alt = "";

    const info = document.createElement("div");
    info.className = "patient-info";

    const name = document.createElement("strong");
    name.textContent = patient.name || "Unknown";

    const details = document.createElement("span");
    details.textContent =
      `${patient.gender || "—"}, ${patient.age ?? "—"}`;

    info.append(name, details);

    const more = document.createElement("span");
    more.className = "patient-more";
    more.textContent = "⋯";
    more.setAttribute("aria-hidden", "true");

    item.append(image, info, more);
    container.appendChild(item);
  });
}

// JESSICA TAYLOR PROFILE
function renderProfile(patient) {
  setText("profileName", patient.name);
  setText("patientDob", formatDate(patient.date_of_birth));
  setText("patientGender", patient.gender);
  setText("patientPhone", patient.phone_number);
  setText("patientEmergency", patient.emergency_contact);
  setText("patientInsurance", patient.insurance_type);

  const image = document.getElementById("profileImage");

  if (image && patient.profile_picture) {
    image.src = patient.profile_picture;
    image.alt = patient.name;
    image.hidden = false;
  }
}

// VITAL SIGNS
function renderVitals(patient) {
  const latest = patient.diagnosis_history?.[0];

  if (!latest) return;

  const readings = [
    latest.respiratory_rate,
    latest.temperature,
    latest.heart_rate
  ];

  const cards = document.querySelectorAll(".vital-card");

  cards.forEach((card, index) => {
    const reading = readings[index];

    if (!reading) return;

    const value = card.querySelector(".vital-value strong");
    const status = card.querySelector(".vital-status");

    if (value) {
      value.textContent = reading.value ?? "—";
    }

    if (status) {
      status.textContent = reading.levels || "—";
    }
  });
}

// BLOOD PRESSURE SUMMARY
function renderPressureSummary(patient) {
  const pressure =
    patient.diagnosis_history?.[0]?.blood_pressure;

  setText(
    "systolicValue",
    pressure?.systolic?.value
  );

  setText(
    "diastolicValue",
    pressure?.diastolic?.value
  );

  setText(
    "systolicLevel",
    pressure?.systolic?.levels
  );

  setText(
    "diastolicLevel",
    pressure?.diastolic?.levels
  );
}

// DIAGNOSTIC LIST
function renderDiagnosticList(patient) {
  const tbody = document.querySelector(
    ".diagnostic-list tbody"
  );

  if (!tbody) return;

  tbody.replaceChildren();

  (patient.diagnostic_list || []).forEach(diagnosis => {
    const row = document.createElement("tr");

    [
      diagnosis.name,
      diagnosis.description,
      diagnosis.status
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value || "—";
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

// LAB RESULTS
function renderLabResults(patient) {
  const container = document.getElementById("labResultsList");

  if (!container) return;

  container.replaceChildren();

  (patient.lab_results || []).forEach(result => {
    const row = document.createElement("div");
    row.className = "lab-item";

    const name = document.createElement("span");
    name.textContent = result;

    const icon = document.createElement("span");
    icon.textContent = "↓";
    icon.setAttribute("aria-hidden", "true");

    row.append(name, icon);
    container.appendChild(row);
  });
}

// SIX-MONTH BLOOD PRESSURE CHART
function renderBloodPressureChart(patient) {
  const canvas = document.getElementById(
    "bloodPressureChart"
  );

  if (!canvas || typeof Chart === "undefined") {
    console.error("Chart.js or chart canvas missing");
    return;
  }

  if (bloodPressureChart) {
    bloodPressureChart.destroy();
    bloodPressureChart = null;
  }

  const history = (patient.diagnosis_history || [])
    .slice(0, 6)
    .reverse();

  const labels = history.map(item =>
    `${item.month.slice(0, 3)} ${item.year}`
  );

  const systolic = history.map(item =>
    item.blood_pressure?.systolic?.value ?? null
  );

  const diastolic = history.map(item =>
    item.blood_pressure?.diastolic?.value ?? null
  );

  bloodPressureChart = new Chart(canvas, {
    type: "line",

    data: {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#E66BC6",
          backgroundColor: "#E66BC6",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#E66BC6",
          tension: 0.4
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#7E6CAB",
          backgroundColor: "#7E6CAB",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#7E6CAB",
          tension: 0.4
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        y: {
          min: 60,
          max: 180,
          ticks: {
            stepSize: 20
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}
