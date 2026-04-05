let rawSpeedBuffer = [];
let chartData = [];
let chartLabels = [];
let currentSpeed = 0;

async function getLiveData() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwZFF4Ip5Ic9L4kyISzQugrWHm07W38DGK_fUIJG-iPUrExEWZw0lejUeu5H7l1-g-NdQ/exec");
    const data = await res.json();

    console.log("Live Data:", data);

    currentSpeed = data.speed || 0;

    updateUI(data);

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

setInterval(getLiveData, 2000);

function updateUI(data) {

  const { lat, lng, speed, sat, alt, valid, time } = data;

  document.querySelector(".map-speed-value").innerText =
    speed ? speed + " km/h" : "--";

  document.querySelector(".speed .stat-number").innerText = speed ?? "--";

  document.querySelector(".rpm .stat-number").innerText = sat ?? "--";
  document.querySelector(".temp .stat-number").innerText = alt ?? "--";
  document.querySelector(".fuel .stat-number").innerText = valid ? 100 : 0;

  const now = new Date();
  document.querySelector(".status-time").innerText =
    now.toLocaleTimeString();

  document.querySelectorAll(".map-info-value")[0].innerText =
    lat ? lat.toFixed(4) : "--";

  document.querySelectorAll(".map-info-value")[1].innerText =
    lng ? lng.toFixed(4) : "--";

  rawSpeedBuffer.push(speed || 0);

  updateStatus(".speed", speed, 100);
  updateStatus(".temp", alt, 95);
  updateStatus(".fuel", valid ? 100 : 0, 20, true);

  updateVehiclePosition(lat, lng);
}

function updateStatus(selector, value, limit, reverse = false) {
  const card = document.querySelector(selector);

  card.classList.remove("stat-card--normal", "stat-card--warning", "stat-card--critical");

  if (reverse) {
    if (value < limit) {
      card.classList.add("stat-card--critical");
    } else if (value < limit + 20) {
      card.classList.add("stat-card--warning");
    } else {
      card.classList.add("stat-card--normal");
    }
  } else {
    if (value > limit) {
      card.classList.add("stat-card--critical");
    } else if (value > limit - 20) {
      card.classList.add("stat-card--warning");
    } else {
      card.classList.add("stat-card--normal");
    }
  }
}

const ctx = document.getElementById("speedChart");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartLabels,
    datasets: [
      {
        label: "Speed",
        data: chartData,
        tension: 0.3,
        fill: true,
      }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: { ticks: { maxTicksLimit: 6 } },
      y: { beginAtZero: true }
    }
  }
});

setInterval(() => {

  if (rawSpeedBuffer.length === 0) return;

  const avgSpeed =
    rawSpeedBuffer.reduce((a, b) => a + b, 0) / rawSpeedBuffer.length;

  chartData.push(Math.round(avgSpeed));
  chartLabels.push(new Date().toLocaleTimeString());

  rawSpeedBuffer = [];

  if (chartData.length > 20) { // keep last 20 points (~10 min)
    chartData.shift();
    chartLabels.shift();
  }

  chart.update();

}, 30000);

function updateVehiclePosition(lat, lng) {

  if (!lat || !lng) return;

  const marker = document.querySelector(".vehicle-marker");
  const map = document.querySelector(".map-container");

  const mapWidth = map.offsetWidth;
  const mapHeight = map.offsetHeight;

  // Normalize lat/lng into screen position
  // (simple demo mapping — we improve later)
  const x = ((lng % 1) * mapWidth);
  const y = ((lat % 1) * mapHeight);

  marker.style.left = x + "px";
  marker.style.top = y + "px";
}