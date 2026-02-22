// ============================================
// IMPROVED PORTFOLIO SCRIPT - DANI
// Features: theme toggle, typing, better game with power-ups!
// ============================================

(function() {
  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });

  // ---------- PROJECTS DATA (improved) ----------
 const projects = [
  {
    title: 'S&R Family and Friends – Cleaning Website',
    impact: 'Delivered a high-performance business website scoring 98–100 across Lighthouse metrics',
    problem: 'Local cleaning businesses often lack professional, secure, and high-converting websites to generate trust and inquiries',
    solution: 'Designed and developed a fully responsive, security-focused cleaning service website with interactive features including review system, dynamic pricing calculator, form validation, dark mode, and performance optimization',
    result: 'Achieved 100/100 desktop Lighthouse score, implemented enterprise-level front-end security features, and created a scalable foundation for future booking and customer portal integration',
    tech: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'EmailJS', 'GitHub Pages'],
    github: 'https://github.com/Dani1157/Cleaning-Web',
    live: 'https://dani1157.github.io/Cleaning-Web/'
  },
  {
    title: 'Terminal Battleship – Strategy Game in Python',
    impact: 'Developed a fully interactive terminal-based strategy game with dynamic board generation and win/loss logic handling',
    problem: 'Many beginner games lack structured game logic, input validation, and replayability in a terminal environment',
    solution: 'Engineered a Python-based Battleship game featuring randomized ship placement, bullet management system, real-time board tracking, and structured game state control',
    result: 'Delivered a replayable command-line game with robust input handling, win/lose conditions, and scalable architecture for future features like difficulty levels and multiplayer',
    tech: ['Python', 'Object-Oriented Programming', 'Git', 'GitHub', 'Heroku'],
    github: 'https://github.com/Dani1157/battleshipsgame1',
  },
  {
    title: 'Rock, Paper, Scissors – Interactive Web Game',
    impact: 'Built a fully interactive browser-based game with real-time score tracking and dynamic result rendering',
    problem: 'Simple browser games often lack structured logic, proper state management, and clear UX feedback for users',
    solution: 'Developed a two-page responsive web application using JavaScript to handle game logic, random AI move generation, score tracking, DOM manipulation, and restart functionality without page refresh',
    result: 'Delivered a smooth, user-friendly game experience with validated input handling, responsive design, and cross-browser compatibility deployed via GitHub Pages',
    tech: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Git', 'GitHub Pages'],
    github: 'Rock-Paper-Scissors-game',
    live: 'https://dani1157.github.io/Rock-Paper-Scissors-game/'
  }
];
 const projectsGrid = document.getElementById('projectsGrid');
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${project.title}</h3>
      <div class="project-impact">✨ ${project.impact}</div>
      <div class="project-details">
        <p><strong>Problem:</strong> ${project.problem}</p>
        <p><strong>Solution:</strong> ${project.solution}</p>
        <p><strong>Result:</strong> ${project.result}</p>
      </div>
      <div class="project-tech">
        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
      <div class="project-links">
        <a href="${project.github}" class="project-link"><i class="fab fa-github"></i> Code</a>
        <a href="${project.live}" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  // ----------  SPACE INVADERS GAME ----------
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreSpan = document.getElementById('gameScore');
  const livesSpan = document.getElementById('gameLives');

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Game state
  let gameActive = true;
  let score = 0;
  let lives = 3;
  let frame = 0;

  // Player
  const player = {
    x: CANVAS_WIDTH / 2 - 25,
    y: CANVAS_HEIGHT - 60,
    width: 50,
    height: 30,
    speed: 5
  };

  // Bullets
  let bullets = [];
  const BULLET_SPEED = 7;
  const BULLET_COOLDOWN = 15;
  let bulletCooldown = 0;

  // Enemies
  let enemies = [];
  const ENEMY_ROWS = 4;
  const ENEMY_COLS = 8;
  const ENEMY_WIDTH = 40;
  const ENEMY_HEIGHT = 30;
  let enemyDirection = 1;
  let enemySpeed = 1;

  // Power-ups
  let powerUps = [];
  const POWERUP_TYPES = ['spread', 'rapid', 'shield'];

  // Particles
  let particles = [];

  // Initialize enemies
  function initEnemies() {
    enemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        enemies.push({
          x: 100 + col * 70,
          y: 50 + row * 50,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          alive: true,
          type: row === 0 ? 'strong' : 'normal', // top row stronger
          health: row === 0 ? 2 : 1
        });
      }
    }
  }

  // Reset game
  function resetGame() {
    gameActive = true;
    score = 0;
    lives = 3;
    bullets = [];
    powerUps = [];
    particles = [];
    player.x = CANVAS_WIDTH / 2 - 25;
    enemyDirection = 1;
    enemySpeed = 1;
    updateDisplay();
    initEnemies();
  }

  // Update score and lives display
  function updateDisplay() {
    scoreSpan.textContent = String(score).padStart(4, '0');
    livesSpan.textContent = lives;
  }

  // Controls
  const keys = {};
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
      keys[e.code] = true;
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
      keys[e.code] = false;
    }
  });

  // Create particle effect
  function createParticles(x, y, color = '#00fff5') {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        color: color
      });
    }
  }

  // Shoot bullet
  function shootBullet() {
    if (!gameActive) return;
    
    bullets.push({
      x: player.x + player.width / 2 - 3,
      y: player.y,
      width: 6,
      height: 12,
      type: 'normal'
    });
  }

  // Game update
  function update() {
    if (!gameActive) return;

    // Player movement
    if (keys['ArrowLeft'] && player.x > 5) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < CANVAS_WIDTH - player.width - 5) player.x += player.speed;

    // Shooting
    if (keys['Space'] && bulletCooldown <= 0) {
      shootBullet();
      bulletCooldown = BULLET_COOLDOWN;
    }
    if (bulletCooldown > 0) bulletCooldown--;

    // Move bullets
    bullets = bullets.filter(bullet => {
      bullet.y -= BULLET_SPEED;
      return bullet.y > -20;
    });

    // Move enemies
    let edgeHit = false;
    enemies.forEach(enemy => {
      if (!enemy.alive) return;
      enemy.x += enemySpeed * enemyDirection;
      
      if (enemy.x <= 20 || enemy.x >= CANVAS_WIDTH - ENEMY_WIDTH - 20) {
        edgeHit = true;
      }
    });

    if (edgeHit) {
      enemyDirection *= -1;
      enemies.forEach(enemy => {
        if (enemy.alive) {
          enemy.y += 20;
          // Check if enemies reached bottom
          if (enemy.y + ENEMY_HEIGHT >= player.y) {
            gameActive = false;
          }
        }
      });
      enemySpeed += 0.2; // Speed up each time they turn
    }

    // Collision detection
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach(enemy => {
        if (!enemy.alive) return;

        if (bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y) {
          
          // Hit!
          bullet.alive = false;
          enemy.health--;
          
          createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
          
          if (enemy.health <= 0) {
            enemy.alive = false;
            score += enemy.type === 'strong' ? 30 : 10;
            
            // Chance to spawn power-up
            if (Math.random() < 0.2) {
              powerUps.push({
                x: enemy.x + enemy.width/2 - 10,
                y: enemy.y + enemy.height/2 - 10,
                width: 20,
                height: 20,
                type: POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
              });
            }
          }
          
          updateDisplay();
        }
      });
    });

    // Remove dead bullets
    bullets = bullets.filter(b => b.alive !== false);

    // Move power-ups
    powerUps.forEach((powerUp, index) => {
      powerUp.y += 3;
      
      // Check collection
      if (powerUp.x < player.x + player.width &&
          powerUp.x + powerUp.width > player.x &&
          powerUp.y < player.y + player.height &&
          powerUp.y + powerUp.height > player.y) {
        
        // Apply power-up effect
        score += 50;
        createParticles(player.x + player.width/2, player.y, '#ffd700');
        powerUps.splice(index, 1);
        updateDisplay();
      }
      
      // Remove if off screen
      if (powerUp.y > CANVAS_HEIGHT) {
        powerUps.splice(index, 1);
      }
    });

    // Update particles
    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      return p.life > 0;
    });

    // Check win condition
    if (enemies.every(e => !e.alive)) {
      // Victory! Spawn new wave
      initEnemies();
      enemySpeed = 1;
      score += 100;
    }
  }

  // Draw everything
  function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stars background
    ctx.fillStyle = '#0f0f17';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    for (let i = 0; i < 100; i++) {
      if (i % 2 === 0) continue; // lazy random
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 2, 2);
    }

    // Draw player
    ctx.shadowColor = '#00fff5';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#6c5ce7';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // Draw bullets
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00fff5';
    bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      if (enemy.type === 'strong') {
        ctx.fillStyle = '#ff79c6';
        ctx.shadowColor = '#ff79c6';
      } else {
        ctx.fillStyle = '#bd93f9';
        ctx.shadowColor = '#bd93f9';
      }
      
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Health indicator for strong enemies
      if (enemy.health > 1) {
        ctx.fillStyle = '#ffb86c';
        ctx.fillRect(enemy.x, enemy.y - 5, enemy.width * (enemy.health / 2), 3);
      }
    });

    // Draw power-ups
    powerUps.forEach(powerUp => {
      ctx.shadowBlur = 15;
      ctx.fillStyle = powerUp.type === 'spread' ? '#ffb86c' : 
                     powerUp.type === 'rapid' ? '#ff79c6' : '#8be9fd';
      ctx.beginPath();
      ctx.arc(powerUp.x + 10, powerUp.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.shadowBlur = 0;
      ctx.fillText(powerUp.type[0].toUpperCase(), powerUp.x + 7, powerUp.y + 15);
    });

    // Draw particles
    particles.forEach(p => {
      ctx.shadowBlur = 10;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Game over overlay
    if (!gameActive) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#00fff5';
      ctx.font = 'bold 40px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      
      ctx.fillStyle = 'white';
      ctx.font = '20px Inter';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
    }

    ctx.shadowBlur = 0;
  }

  // Game loop
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  // Restart button
  document.getElementById('restartBtn').addEventListener('click', resetGame);

  // Start game
  resetGame();
  gameLoop();
})();