// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const attendeeList = document.getElementById("attendeeList");

//track attendence
let count = 0;
const maxCount = 50;
const storageKey = "attendanceData";
let attendees = [];

function loadSavedData() {
  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return null;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    console.error("Could not parse saved attendance data", error);
    return null;
  }
}

function saveData() {
  const teamCounts = {
    water: parseInt(document.getElementById("waterCount").textContent, 10),
    zero: parseInt(document.getElementById("zeroCount").textContent, 10),
    power: parseInt(document.getElementById("powerCount").textContent, 10)
  };

  const dataToSave = {
    count,
    teamCounts,
    attendees
  };

  localStorage.setItem(storageKey, JSON.stringify(dataToSave));
}

function updateProgress() {
  const percentage = Math.round((count / maxCount) * 100);
  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;
  progressLabel.textContent = `${count} / ${maxCount} attendees checked in`;
}

function restoreSavedData() {
  const savedData = loadSavedData();

  if (!savedData) {
    return;
  }

  count = savedData.count || 0;
  attendees = savedData.attendees || [];

  document.getElementById("waterCount").textContent = savedData.teamCounts?.water || 0;
  document.getElementById("zeroCount").textContent = savedData.teamCounts?.zero || 0;
  document.getElementById("powerCount").textContent = savedData.teamCounts?.power || 0;

  renderAttendeeList();
  updateProgress();
}

function renderAttendeeList() {
  if (!attendeeList) {
    return;
  }

  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    attendeeList.innerHTML = "<li>No attendees checked in yet.</li>";
    return;
  }

  attendees.forEach((attendee) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${attendee.name} <span class="team-badge">${attendee.teamName}</span>`;
    attendeeList.appendChild(listItem);
  });
}

restoreSavedData();

//handel form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

//increment count and check if it exceeds maxCount
  count++;
  console.log("Total check-ins: ", count);
  if (count > maxCount) {
    alert("Maximum attendance reached!");
    return;
  }
  //update attendance count and progress bar
  updateProgress();
  console.log(`Progress: ${Math.round((count / maxCount) * 100)}%`);

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent, 10) + 1;

  attendees.push({
    name,
    teamName,
    team
  });
  renderAttendeeList();
  saveData();

  const teamNames = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables"
  };

  const teamCounts = {
    water: parseInt(document.getElementById("waterCount").textContent, 10),
    zero: parseInt(document.getElementById("zeroCount").textContent, 10),
    power: parseInt(document.getElementById("powerCount").textContent, 10)
  };

  const winningTeamId = Object.keys(teamCounts).reduce((leader, current) => {
    return teamCounts[current] > teamCounts[leader] ? current : leader;
  });

  const winningTeamName = teamNames[winningTeamId];

  if (count === maxCount) {
    greeting.innerHTML = `🎉 Goal reached! <strong>${winningTeamName}</strong> is the winning team!`;
    greeting.className = "success-message";
    greeting.style.display = "block";
  } else {
    const message = `🎉 Welcome, ${name} from ${teamName}!`;
    greeting.textContent = message;
    greeting.className = "";
    greeting.style.display = "block";
    console.log(message);
  }

  form.reset(); 
})