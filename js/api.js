
const API_URL =
  "https://fedskillstest.coalitiontechnologies.workers.dev";

async function loadPatientData() {
  try {
    const credentials = btoa("coalition:skills-test");

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const patients = await response.json();

    if (!Array.isArray(patients)) {
      throw new Error("Unexpected API response");
    }

    const jessica = patients.find(
      patient => patient.name === "Jessica Taylor"
    );

    if (!jessica) {
      throw new Error("Jessica Taylor not found");
    }

    document.dispatchEvent(
      new CustomEvent("patientLoaded", {
        detail: {
          patient: jessica,
          patients
        }
      })
    );

  } catch (error) {
    console.error("Patient API Error:", error);

    const patientList = document.getElementById("patientsList");

    if (patientList) {
      patientList.textContent = "Unable to load patients.";
    }
  }
}

document.addEventListener(
  "DOMContentLoaded",
  loadPatientData
);
