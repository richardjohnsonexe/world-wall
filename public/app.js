document.addEventListener('DOMContentLoaded', () => {
  const muralContainer = document.getElementById('mural-container');

  // Fetch artworks and populate mural
  async function loadArtworks() {
    try {
      const response = await fetch('/api/artworks');
      if (!response.ok) throw new Error('Failed to fetch artworks');

      const artworks = await response.json();

      // Clear existing content
      muralContainer.innerHTML = '';

      artworks.forEach(artwork => {
        const slot = document.createElement('div');
        slot.className = 'artwork-slot';

        const img = document.createElement('img');
        img.src = artwork.image_data;
        img.alt = `Artwork by ${artwork.username}`;

        const author = document.createElement('div');
        author.className = 'artwork-author';
        author.textContent = artwork.username;

        slot.appendChild(img);
        slot.appendChild(author);
        muralContainer.appendChild(slot);
      });
    } catch (error) {
      console.error('Error loading artworks:', error);
    }
  }

  // Authentication & State
  let currentUser = null;
  let authToken = null;

  const loggedOutView = document.getElementById('logged-out-view');
  const loggedInView = document.getElementById('loggedInView'); // typo fix below
  const loggedInViewEl = document.getElementById('logged-in-view');
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const userGreeting = document.getElementById('user-greeting');

  // Drawing Elements
  const drawingOverlay = document.getElementById('drawing-overlay');
  const canvas = document.getElementById('drawing-canvas');
  const ctx = canvas.getContext('2d');
  const colorPicker = document.getElementById('color-picker');
  const brushSize = document.getElementById('brush-size');

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Initialize Canvas
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function updateAuthUI() {
    if (currentUser) {
      loggedOutView.style.display = 'none';
      loggedInViewEl.style.display = 'block';
      userGreeting.textContent = `Welcome, ${currentUser.username}`;
    } else {
      loggedOutView.style.display = 'block';
      loggedInViewEl.style.display = 'none';
      usernameInput.value = '';
      passwordInput.value = '';
    }
  }

  // Auth Handlers
  document.getElementById('register-btn').addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (!username || !password) return alert('Enter username and password');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        alert('Registered! Please login.');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (e) { console.error(e); }
  });

  document.getElementById('login-btn').addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (!username || !password) return alert('Enter username and password');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        authToken = data.token;
        updateAuthUI();
      } else {
        alert('Login failed');
      }
    } catch (e) { console.error(e); }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    authToken = null;
    updateAuthUI();
  });

  // Drawing Handlers
  document.getElementById('decorate-btn').addEventListener('click', () => {
    drawingOverlay.style.display = 'flex';
    // Reset canvas for new drawing
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    drawingOverlay.style.display = 'none';
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  function draw(e) {
    if (!isDrawing) return;

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
  });
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);

  // Save Artwork
  document.getElementById('save-lock-btn').addEventListener('click', async () => {
    if (!currentUser || !authToken) return alert('You must be logged in');

    // Extract image data as base64 string
    const imageData = canvas.toDataURL('image/png');

    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ image_data: imageData })
      });

      if (res.ok) {
        drawingOverlay.style.display = 'none'; // Lock by hiding UI
        loadArtworks(); // Reload mural to append new artwork
      } else {
        alert('Failed to save artwork');
      }
    } catch (e) {
      console.error('Error saving artwork:', e);
    }
  });

  // Momentum Scrolling Carousel
  const main = document.querySelector('main');
  let isDragging = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let momentumID;
  let lastMouseX;

  muralContainer.style.cursor = 'grab';

  muralContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    muralContainer.style.cursor = 'grabbing';
    startX = e.pageX - main.offsetLeft;
    scrollLeft = main.scrollLeft;
    cancelAnimationFrame(momentumID);
  });

  muralContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    muralContainer.style.cursor = 'grab';
  });

  muralContainer.addEventListener('mouseup', () => {
    isDragging = false;
    muralContainer.style.cursor = 'grab';
    beginMomentum();
  });

  muralContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - main.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    main.scrollLeft = scrollLeft - walk;

    velocity = e.pageX - (lastMouseX || e.pageX);
    lastMouseX = e.pageX;
  });

  function beginMomentum() {
    velocity *= 0.95; // friction
    main.scrollLeft -= velocity;
    if (Math.abs(velocity) > 0.5) {
      momentumID = requestAnimationFrame(beginMomentum);
    }
  }

  // Load artworks on startup
  loadArtworks();
  updateAuthUI();
});
