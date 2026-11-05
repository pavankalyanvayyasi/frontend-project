# Tech.Care – Healthcare Dashboard

## Project Overview

Tech.Care Healthcare Dashboard is a web-based frontend application designed to provide an organized and user-friendly interface for displaying patient healthcare information.

The dashboard presents patient profiles, diagnosis history, vital signs, and laboratory results in a structured visual format. It integrates external API data and uses charts to make healthcare information easier to understand.

## Features

- **Patient Management:** Displays a list of patient profiles.
- **Patient Information:** Shows individual patient details.
- **Diagnosis History:** Visualizes patient blood pressure history.
- **Vital Signs:** Displays respiratory rate, temperature, and heart rate.
- **Lab Results:** Provides access to laboratory information.
- **API Integration:** Fetches patient information from an external API.
- **Data Visualization:** Uses Chart.js for graphical representation.
- **User-Friendly Interface:** Provides a clean and organized dashboard layout.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- REST API
- Chart.js
- Git
- GitHub

## Project Structure

```text
frontend-project/
│
├── assets/
│   ├── data/
│   ├── icons/
│   ├── images/
│   └── dashboard-preview.png
│
├── css/
│   └── style.css
│
├── js/
│
├── index.html
│
└── README.md
```

## How to Run the Project

### Prerequisites

- Visual Studio Code
- Python installed on your system
- Web browser
- Internet connection

### Step 1: Clone the Repository

```bash
git clone https://github.com/pavankalyanvayyasi/frontend-project.git
```

### Step 2: Open the Project

Open the cloned project folder in Visual Studio Code.

### Step 3: Start the Local Server

Open the VS Code terminal and execute:

```bash
python -m http.server 5500
```

On Windows, you can also use:

```bash
py -m http.server 5500
```

### Step 4: Open in Browser

Open your browser and visit:

```text
http://localhost:5500/
```

The Tech.Care Healthcare Dashboard will open in your browser.

## API Integration

The application retrieves patient information from the provided Coalition Technologies API.

JavaScript is used to fetch and display the API response in the dashboard.

An active internet connection is required to retrieve API data and load Chart.js from its CDN.

## Project Objective

The objective of this project is to develop a healthcare dashboard using frontend technologies and external API integration to display patient information, diagnosis history, and healthcare statistics in an organized visual interface.