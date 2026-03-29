let speed = 60;
let temp = 75;
let fuel = 80;

let rawSpeedBuffer = [];
let chartData = [];
let chartLabels = [];

function getMockData() {

  // smooth speed
  speed += Math.random() * 10 - 5;
  speed = Math.max(0, Math.min(120, speed));

  // realistic temperature behavior
  temp += (speed / 100) * 2;        // increases with speed
  temp -= Math.random() * 1.5;      // natural cooling
  temp = Math.max(70, Math.min(110, temp));
    
  // realistic fuel consumption
  fuel -= speed * 0.002; // consumption rate
  fuel = Math.max(0, fuel);

  return {
    speed: Math.round(speed),
    rpm: Math.round(speed * 50),
    temp: Math.round(temp),
    fuel: Math.round(fuel),
    lat: 11.6643,
    lng: 78.1460,
    time: new Date().toLocaleTimeString()
  };
}

function updateUI(data) {

  // Update values
  document.querySelector(".speed .stat-number").innerText = data.speed;
  document.querySelector(".rpm .stat-number").innerText = data.rpm;
  document.querySelector(".temp .stat-number").innerText = data.temp;
  document.querySelector(".fuel .stat-number").innerText = data.fuel;

  // Update time
  document.querySelector(".status-time").innerText = data.time;

  // Update map speed
  document.querySelector(".map-speed-value").innerText = data.speed + " km/h";

  // Update GPS text
  document.querySelectorAll(".map-info-value")[0].innerText = data.lat.toFixed(4);
  document.querySelectorAll(".map-info-value")[1].innerText = data.lng.toFixed(4);

  rawSpeedBuffer.push(data.speed);

  // Update status colors
  updateStatus(".speed", data.speed, 100);
  updateStatus(".temp", data.temp, 95);
  updateStatus(".fuel", data.fuel, 20, true);
}

function updateChart() {
  chart.data.labels = chartLabels;
  chart.data.datasets[0].data = chartData;
  chart.update();
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
      x: {
        ticks: {
          maxTicksLimit: 6
        }
      },
      y: {
        beginAtZero: true
      }
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

  // Keep only last 60 points (30 mins)
  if (chartData.length > 60) {
    chartData.shift();
    chartLabels.shift();
  }

  updateChart();

}, 30000);

// Run simulation
setInterval(() => {
  const data = getMockData();
  updateUI(data);
}, 2000);