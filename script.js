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
 // ========== EPIC GAME SYSTEM ==========
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game elements
  const scoreSpan = document.getElementById('gameScore');
  const livesSpan = document.getElementById('gameLives');
  const levelSpan = document.getElementById('gameLevel');
  const highScoreSpan = document.getElementById('highScore');
  const totalLevelsSpan = document.getElementById('totalLevels');
  const achievementToast = document.getElementById('achievementToast');
  const achievementText = document.getElementById('achievementText');

  // Game constants
  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 600;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Game state
  let gameActive = true;
  let paused = false;
  let score = 0;
  let lives = 3;
  let level = 1;
  let maxLevel = 20;
  let highScore = localStorage.getItem('spaceDefenderHighScore') || 0;
  let totalLevelsCompleted = localStorage.getItem('totalLevelsCompleted') || 0;
  let difficulty = 'normal';
  let frame = 0;
  let achievements = [];

  // Player
  const player = {
    x: CANVAS_WIDTH / 2 - 30,
    y: CANVAS_HEIGHT - 80,
    width: 60,
    height: 40,
    speed: 6,
    powerups: {
      rapidFire: false,
      spreadShot: false,
      shield: false
    },
    powerupTimers: {
      rapidFire: 0,
      spreadShot: 0,
      shield: 0
    }
  };

  // Bullets
  let bullets = [];
  const BULLET_SPEED = 8;
  let bulletCooldown = 0;
  const RAPID_COOLDOWN = 5;
  const NORMAL_COOLDOWN = 15;

  // Enemies
  let enemies = [];
  let enemyBullets = [];
  let enemySpeed = 1;
  let enemyDirection = 1;

  // Boss
  let boss = null;
  let bossActive = false;
  let bossPhase = 1;

  // Power-ups
  let powerUps = [];
  const POWERUP_TYPES = ['rapid', 'spread', 'shield', 'life', 'score'];

  // Particles
  let particles = [];

  // Achievements
  const ACHIEVEMENTS = {
    FIRST_BLOOD: { id: 'firstBlood', name: 'First Blood', desc: 'Destroy first enemy', icon: '🔰' },
    POWER_COLLECTOR: { id: 'powerCollector', name: 'Power Collector', desc: 'Collect 10 power-ups', icon: '⚡' },
    SURVIVOR: { id: 'survivor', name: 'Survivor', desc: 'Complete level 5', icon: '🛡️' },
    BOSS_SLAYER: { id: 'bossSlayer', name: 'Boss Slayer', desc: 'Defeat first boss', icon: '👑' },
    SHARPSHOOTER: { id: 'sharpshooter', name: 'Sharpshooter', desc: 'Score 5000 points', icon: '🎯' },
    INVINCIBLE: { id: 'invincible', name: 'Invincible', desc: 'Complete a level without damage', icon: '💪' }
  };

  // Difficulty multipliers
  const DIFFICULTY = {
    normal: { enemySpeed: 1, enemyCount: 1, spawnRate: 1 },
    hard: { enemySpeed: 1.5, enemyCount: 1.3, spawnRate: 1.2 },
    insane: { enemySpeed: 2, enemyCount: 1.6, spawnRate: 1.5 }
  };

  // Initialize level
  function initLevel() {
    enemies = [];
    enemyBullets = [];
    
    if (level % 5 === 0) {
      // Boss level
      initBoss();
    } else {
      // Regular level - more enemies as level increases
      const rows = Math.min(3 + Math.floor(level / 3), 6);
      const cols = Math.min(6 + Math.floor(level / 2), 10);
      const enemyTypes = ['normal', 'fast', 'tank'];
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let type = 'normal';
          if (row === 0) type = 'tank';
          else if (row === rows - 1) type = 'fast';
          
          enemies.push({
            x: 100 + col * 70,
            y: 50 + row * 50,
            width: 40,
            height: 30,
            alive: true,
            type: type,
            health: type === 'tank' ? 3 : 1,
            speed: type === 'fast' ? 1.5 : 1,
            shootCooldown: Math.floor(Math.random() * 100)
          });
        }
      }
    }
    
    // Reset enemy direction
    enemyDirection = 1;
    enemySpeed = DIFFICULTY[difficulty].enemySpeed;
    
    // Show level announcement
    showAchievement(`LEVEL ${level}`, level % 5 === 0 ? '⚠️ BOSS INCOMING ⚠️' : 'FIGHT!');
  }

  // Initialize boss
  function initBoss() {
    bossActive = true;
    bossPhase = 1;
    
    boss = {
      x: CANVAS_WIDTH / 2 - 100,
      y: 50,
      width: 200,
      height: 150,
      health: 50 * level,
      maxHealth: 50 * level,
      speed: 2,
      attackPattern: 1,
      patternTimer: 0,
      alive: true
    };
    
    showAchievement('BOSS BATTLE', `Level ${level} Boss`, 'warning');
  }

  // Show achievement/toast
  function showAchievement(title, message, type = 'normal') {
    achievementText.innerHTML = `${title}: ${message}`;
    achievementToast.classList.add('show');
    setTimeout(() => {
      achievementToast.classList.remove('show');
    }, 3000);
  }

  // Unlock achievement
  function unlockAchievement(achievementId) {
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      const ach = ACHIEVEMENTS[achievementId.toUpperCase()];
      if (ach) {
        showAchievement('🏆 ACHIEVEMENT', ach.name);
      }
    }
  }

  // Reset game
  function resetGame() {
    gameActive = true;
    paused = false;
    score = 0;
    lives = 3;
    level = 1;
    bullets = [];
    powerUps = [];
    particles = [];
    boss = null;
    bossActive = false;
    
    player.x = CANVAS_WIDTH / 2 - 30;
    player.powerups = { rapidFire: false, spreadShot: false, shield: false };
    player.powerupTimers = { rapidFire: 0, spreadShot: 0, shield: 0 };
    
    updateDisplay();
    initLevel();
  }

  // Update display
  function updateDisplay() {
    scoreSpan.textContent = String(score).padStart(4, '0');
    livesSpan.textContent = lives;
    levelSpan.textContent = level;
    
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('spaceDefenderHighScore', highScore);
    }
    highScoreSpan.textContent = String(highScore).padStart(4, '0');
    totalLevelsSpan.textContent = totalLevelsCompleted;
    
    // Update power-up UI
    document.getElementById('powerup1').classList.toggle('active', player.powerups.rapidFire);
    document.getElementById('powerup2').classList.toggle('active', player.powerups.spreadShot);
    document.getElementById('powerup3').classList.toggle('active', player.powerups.shield);
  }

  // Controls
  const keys = {};
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyP') {
      e.preventDefault();
      keys[e.code] = true;
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyP') {
      e.preventDefault();
      keys[e.code] = false;
    }
  });

  // Pause game
  document.getElementById('pauseBtn').addEventListener('click', () => {
    paused = !paused;
    document.getElementById('pauseBtn').innerHTML = paused ? 
      '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
  });

  // Difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      difficulty = btn.dataset.diff;
    });
  });

  // Restart button
  document.getElementById('restartBtn').addEventListener('click', resetGame);

  // Create particles
  function createParticles(x, y, color = '#00fff5', count = 8) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  }

  // Shoot bullet
  function shootBullet() {
    if (!gameActive || paused) return;
    
    if (player.powerups.spreadShot) {
      // Spread shot - 3 bullets
      bullets.push({ x: player.x + player.width/2 - 3, y: player.y, width: 6, height: 12, vx: -2 });
      bullets.push({ x: player.x + player.width/2 - 3, y: player.y, width: 6, height: 12, vx: 0 });
      bullets.push({ x: player.x + player.width/2 - 3, y: player.y, width: 6, height: 12, vx: 2 });
    } else {
      // Normal shot
      bullets.push({ x: player.x + player.width/2 - 3, y: player.y, width: 6, height: 12, vx: 0 });
    }
  }

  // Enemy shoot
  function enemyShoot(enemy) {
    if (Math.random() < 0.02 * DIFFICULTY[difficulty].spawnRate) {
      enemyBullets.push({
        x: enemy.x + enemy.width/2 - 3,
        y: enemy.y + enemy.height,
        width: 5,
        height: 10,
        speed: 4
      });
    }
  }

  // Update game
  function update() {
    if (!gameActive || paused) return;

    // Player movement
    if (keys['ArrowLeft'] && player.x > 5) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < CANVAS_WIDTH - player.width - 5) player.x += player.speed;

    // Shooting
    const cooldownMax = player.powerups.rapidFire ? RAPID_COOLDOWN : NORMAL_COOLDOWN;
    if (keys['Space'] && bulletCooldown <= 0) {
      shootBullet();
      bulletCooldown = cooldownMax;
    }
    if (bulletCooldown > 0) bulletCooldown--;

    // Update power-up timers
    Object.keys(player.powerupTimers).forEach(key => {
      if (player.powerupTimers[key] > 0) {
        player.powerupTimers[key]--;
        if (player.powerupTimers[key] <= 0) {
          player.powerups[key] = false;
        }
      }
    });

    // Move bullets
    bullets = bullets.filter(bullet => {
      bullet.y -= BULLET_SPEED;
      bullet.x += bullet.vx || 0;
      return bullet.y > -20 && bullet.x > -20 && bullet.x < CANVAS_WIDTH + 20;
    });

    // Move enemy bullets
    enemyBullets = enemyBullets.filter(bullet => {
      bullet.y += bullet.speed;
      return bullet.y < CANVAS_HEIGHT + 20;
    });

    // Check bullet-enemy collisions
    bullets.forEach((bullet, bulletIndex) => {
      if (bossActive && boss && boss.alive) {
        if (bullet.x < boss.x + boss.width &&
            bullet.x + bullet.width > boss.x &&
            bullet.y < boss.y + boss.height &&
            bullet.y + bullet.height > boss.y) {
          
          bullet.alive = false;
          boss.health -= 10;
          createParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#ff0000', 12);
          
          if (boss.health <= 0) {
            boss.alive = false;
            bossActive = false;
            score += 1000;
            createParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#ffd700', 30);
            unlockAchievement('bossSlayer');
            
            // Boss defeated - next level
            level++;
            totalLevelsCompleted++;
            localStorage.setItem('totalLevelsCompleted', totalLevelsCompleted);
            initLevel();
          }
          
          bullets.splice(bulletIndex, 1);
          return;
        }
      }

      enemies.forEach((enemy, enemyIndex) => {
        if (!enemy.alive) return;

        if (bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y) {
          
          bullet.alive = false;
          enemy.health--;
          
          createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff79c6');
          
          if (enemy.health <= 0) {
            enemy.alive = false;
            
            // Score based on enemy type
            let points = 10;
            if (enemy.type === 'tank') points = 30;
            if (enemy.type === 'fast') points = 20;
            score += points;
            
            // Achievements
            if (score >= 5000) unlockAchievement('sharpshooter');
            
            // Spawn power-up (10% chance)
            if (Math.random() < 0.1) {
              powerUps.push({
                x: enemy.x + enemy.width/2 - 15,
                y: enemy.y + enemy.height/2 - 15,
                width: 30,
                height: 30,
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

    // Move enemies (non-boss)
    if (!bossActive) {
      let edgeHit = false;
      enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        enemy.x += enemySpeed * enemyDirection * enemy.speed;
        enemy.shootCooldown--;
        
        if (enemy.shootCooldown <= 0) {
          enemyShoot(enemy);
          enemy.shootCooldown = 100;
        }
        
        if (enemy.x <= 20 || enemy.x >= CANVAS_WIDTH - enemy.width - 20) {
          edgeHit = true;
        }
      });

      if (edgeHit) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
          if (enemy.alive) enemy.y += 20;
        });
      }

      // Check if level complete
      if (enemies.every(e => !e.alive) && !bossActive) {
        level++;
        totalLevelsCompleted++;
        localStorage.setItem('totalLevelsCompleted', totalLevelsCompleted);
        
        if (level > maxLevel) {
          showAchievement('VICTORY!', 'You completed all levels!', 'epic');
          gameActive = false;
        } else {
          showAchievement('LEVEL COMPLETE', `Starting Level ${level}`);
          initLevel();
        }
      }
    } else {
      // Boss movement and attacks
      if (boss && boss.alive) {
        boss.patternTimer++;
        
        // Boss movement patterns
        switch(bossPhase) {
          case 1:
            boss.x += Math.sin(boss.patternTimer * 0.05) * 3;
            if (boss.patternTimer > 200) bossPhase = 2;
            break;
          case 2:
            boss.y += Math.sin(boss.patternTimer * 0.1) * 2;
            if (boss.patternTimer > 400) bossPhase = 3;
            break;
          case 3:
            // Circular pattern
            boss.x += Math.cos(boss.patternTimer * 0.03) * 4;
            boss.y += Math.sin(boss.patternTimer * 0.03) * 3;
            if (boss.patternTimer > 600) bossPhase = 1;
            break;
        }
        
        // Boss shooting
        if (boss.patternTimer % 30 === 0) {
          for (let i = 0; i < 5; i++) {
            enemyBullets.push({
              x: boss.x + boss.width/2 - 3,
              y: boss.y + boss.height,
              width: 8,
              height: 15,
              speed: 5,
              vx: (i - 2) * 2
            });
          }
        }
      }
    }

    // Move power-ups
    powerUps.forEach((powerUp, index) => {
      powerUp.y += 3;
      
      // Check collection
      if (powerUp.x < player.x + player.width &&
          powerUp.x + powerUp.width > player.x &&
          powerUp.y < player.y + player.height &&
          powerUp.y + powerUp.height > player.y) {
        
        // Apply power-up effect
        switch(powerUp.type) {
          case 'rapid':
            player.powerups.rapidFire = true;
            player.powerupTimers.rapidFire = 500;
            break;
          case 'spread':
            player.powerups.spreadShot = true;
            player.powerupTimers.spreadShot = 400;
            break;
          case 'shield':
            player.powerups.shield = true;
            player.powerupTimers.shield = 300;
            break;
          case 'life':
            lives++;
            createParticles(player.x + player.width/2, player.y, '#ffd700', 20);
            break;
          case 'score':
            score += 100;
            break;
        }
        
        createParticles(powerUp.x + 15, powerUp.y + 15, '#ffd700');
        powerUps.splice(index, 1);
        updateDisplay();
      }
      
      // Remove if off screen
      if (powerUp.y > CANVAS_HEIGHT) {
        powerUps.splice(index, 1);
      }
    });

    // Check player collision with enemies
    if (!player.powerups.shield) {
      enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
          
          lives--;
          createParticles(player.x + player.width/2, player.y + player.height/2, '#ff0000', 20);
          
          if (lives <= 0) {
            gameActive = false;
            showAchievement('GAME OVER', `Final Score: ${score}`);
          } else {
            // Respawn with brief invincibility
            player.powerups.shield = true;
            player.powerupTimers.shield = 100;
          }
          
          enemy.alive = false;
          updateDisplay();
        }
      });
    }

    // Check collision with enemy bullets
    if (!player.powerups.shield) {
      enemyBullets.forEach((bullet, index) => {
        if (player.x < bullet.x + bullet.width &&
            player.x + player.width > bullet.x &&
            player.y < bullet.y + bullet.height &&
            player.y + player.height > bullet.y) {
          
          lives--;
          createParticles(player.x + player.width/2, player.y + player.height/2, '#ff0000', 15);
          enemyBullets.splice(index, 1);
          
          if (lives <= 0) {
            gameActive = false;
            showAchievement('GAME OVER', `Final Score: ${score}`);
          } else {
            player.powerups.shield = true;
            player.powerupTimers.shield = 100;
          }
          
          updateDisplay();
        }
      });
    }

    // Update particles
    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      return p.life > 0;
    });
  }

  // Draw everything
  function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stars
    ctx.fillStyle = '#0a0c14';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 1, 1);
    }

    // Draw player
    ctx.shadowColor = '#00fff5';
    ctx.shadowBlur = 20;
    
    if (player.powerups.shield) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x + player.width/2, player.y + player.height/2, 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    
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

    // Draw enemy bullets
    ctx.fillStyle = '#ff79c6';
    enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
      if (!enemy.alive) return;
      
      // Color based on type
      if (enemy.type === 'tank') {
        ctx.fillStyle = '#ffb86c';
        ctx.shadowColor = '#ffb86c';
      } else if (enemy.type === 'fast') {
        ctx.fillStyle = '#8be9fd';
        ctx.shadowColor = '#8be9fd';
      } else {
        ctx.fillStyle = '#bd93f9';
        ctx.shadowColor = '#bd93f9';
      }
      
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Health bar for tanks
      if (enemy.health > 1) {
        ctx.fillStyle = '#50fa7b';
        ctx.fillRect(enemy.x, enemy.y - 5, enemy.width * (enemy.health / 3), 3);
      }
    });

    // Draw boss
    if (bossActive && boss && boss.alive) {
      ctx.fillStyle = '#ff5555';
      ctx.shadowColor = '#ff5555';
      ctx.shadowBlur = 30;
      ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
      
      // Boss health bar
      ctx.fillStyle = '#ffb86c';
      ctx.fillRect(boss.x, boss.y - 15, boss.width * (boss.health / boss.maxHealth), 8);
      
      // Boss warning if low health
      if (boss.health < boss.maxHealth * 0.3) {
        ctx.font = 'bold 24px Inter';
        ctx.fillStyle = '#ff5555';
        ctx.shadowBlur = 20;
        ctx.fillText('⚠️ ENRAGED ⚠️', boss.x + 20, boss.y - 30);
      }
    }

    // Draw power-ups
    powerUps.forEach(powerUp => {
      ctx.shadowBlur = 15;
      
      // Color based on type
      switch(powerUp.type) {
        case 'rapid': ctx.fillStyle = '#ffb86c'; break;
        case 'spread': ctx.fillStyle = '#ff79c6'; break;
        case 'shield': ctx.fillStyle = '#8be9fd'; break;
        case 'life': ctx.fillStyle = '#ff5555'; break;
        case 'score': ctx.fillStyle = '#f1fa8c'; break;
      }
      
      ctx.beginPath();
      ctx.arc(powerUp.x + 15, powerUp.y + 15, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Inter';
      ctx.shadowBlur = 0;
      ctx.fillText(powerUp.type[0].toUpperCase(), powerUp.x + 10, powerUp.y + 22);
    });

    // Draw particles
    particles.forEach(p => {
      ctx.shadowBlur = 10;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, p.size || 4, p.size || 4);
    });
    ctx.globalAlpha = 1;

    // Game over screen
    if (!gameActive) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#00fff5';
      ctx.font = 'bold 60px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      
      ctx.fillStyle = 'white';
      ctx.font = '30px Inter';
      ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 100);
    }

    // Pause screen
    if (paused && gameActive) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#00fff5';
      ctx.font = 'bold 50px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    }

    ctx.shadowBlur = 0;
  }

  // Game loop
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  // Start game
  resetGame();
  gameLoop();
})();