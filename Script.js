function getMockData() {
  return {
    speed: Math.floor(Math.random() * 120),
    rpm: Math.floor(Math.random() * 6000),
    temp: Math.floor(Math.random() * 120),
    fuel: Math.floor(Math.random() * 100)
  };
}

setInterval(() => {
  const data = getMockData();

  document.getElementById("speed").innerText = `Speed: ${data.speed} km/h`;
  document.getElementById("rpm").innerText = `RPM: ${data.rpm}`;
  document.getElementById("temp").innerText = `Temp: ${data.temp} °C`;
  document.getElementById("fuel").innerText = `Fuel: ${data.fuel}%`;

}, 2000);