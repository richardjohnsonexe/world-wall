const canvas = document.getElementById('space-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const elements = [];

// Create stars
for (let i = 0; i < 200; i++) {
  elements.push({
    type: 'star',
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    speed: Math.random() * 0.5 + 0.1,
    color: `rgba(255, 255, 255, ${Math.random()})`
  });
}

// Create planets
const planetColors = ['#ff9999', '#99ccff', '#ffcc99', '#cc99ff', '#99ffcc'];
for (let i = 0; i < 5; i++) {
  elements.push({
    type: 'planet',
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 40 + 10,
    speed: Math.random() * 1 + 0.5,
    color: planetColors[Math.floor(Math.random() * planetColors.length)]
  });
}

// Create gas clouds
for (let i = 0; i < 3; i++) {
  elements.push({
    type: 'cloud',
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 300 + 100,
    speed: Math.random() * 0.2 + 0.05,
    color: `rgba(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 50 + 20)}, ${Math.floor(Math.random() * 150 + 100)}, 0.05)`
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < elements.length; i++) {
    let el = elements[i];

    // Move
    el.x -= el.speed;
    if (el.x + el.radius < 0) {
      el.x = canvas.width + el.radius;
      el.y = Math.random() * canvas.height;
    }

    // Draw
    if (el.type === 'star') {
      ctx.beginPath();
      ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
      ctx.fillStyle = el.color;
      ctx.fill();
    } else if (el.type === 'planet') {
      ctx.beginPath();
      ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
      ctx.fillStyle = el.color;
      ctx.fill();

      // shadow
      ctx.beginPath();
      ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(el.x - el.radius/3, el.y - el.radius/3, el.radius/4, el.x, el.y, el.radius);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fill();

    } else if (el.type === 'cloud') {
      ctx.beginPath();
      ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, el.radius);
      gradient.addColorStop(0, el.color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  requestAnimationFrame(animate);
}

animate();
