import { useRef, useEffect, useState } from 'react';
import classes from './MarioGame.module.css';

function MarioGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const animationRef = useRef(null);

  // Game state refs
  const gameRef = useRef({
    player: {
      x: 100,
      y: 0,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
      direction: 1, // 1 for right, -1 for left
      animation: 0
    },
    platforms: [],
    coins: [],
    enemies: [],
    scrollX: 0,
    keys: {},
    gravity: 0.6,
    jumpPower: -12,
    moveSpeed: 4,
    groundY: 400
  });

  // Initialize level
  const initGame = () => {
    const game = gameRef.current;

    // Reset player
    game.player = {
      x: 100,
      y: 0,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
      direction: 1,
      animation: 0
    };

    game.scrollX = 0;

    // Create platforms
    game.platforms = [
      // Ground platforms
      { x: 0, y: 450, width: 800, height: 50 },
      { x: 900, y: 450, width: 400, height: 50 },
      { x: 1400, y: 450, width: 600, height: 50 },
      { x: 2100, y: 450, width: 400, height: 50 },
      { x: 2600, y: 450, width: 800, height: 50 },

      // Floating platforms
      { x: 300, y: 350, width: 120, height: 20 },
      { x: 500, y: 280, width: 100, height: 20 },
      { x: 700, y: 320, width: 120, height: 20 },
      { x: 1000, y: 350, width: 150, height: 20 },
      { x: 1300, y: 280, width: 100, height: 20 },
      { x: 1500, y: 350, width: 120, height: 20 },
      { x: 1800, y: 300, width: 100, height: 20 },
      { x: 2000, y: 360, width: 120, height: 20 },
      { x: 2300, y: 300, width: 150, height: 20 },
      { x: 2700, y: 280, width: 200, height: 20 }
    ];

    // Create coins
    game.coins = [
      { x: 350, y: 310, collected: false },
      { x: 520, y: 240, collected: false },
      { x: 540, y: 240, collected: false },
      { x: 720, y: 280, collected: false },
      { x: 1020, y: 310, collected: false },
      { x: 1050, y: 310, collected: false },
      { x: 1320, y: 240, collected: false },
      { x: 1520, y: 310, collected: false },
      { x: 1820, y: 260, collected: false },
      { x: 2020, y: 320, collected: false },
      { x: 2320, y: 260, collected: false },
      { x: 2350, y: 260, collected: false },
      { x: 2720, y: 240, collected: false },
      { x: 2750, y: 240, collected: false },
      { x: 2780, y: 240, collected: false }
    ];

    // Create enemies
    game.enemies = [
      { x: 600, y: 418, width: 32, height: 32, velocityX: -2, minX: 500, maxX: 700 },
      { x: 1100, y: 418, width: 32, height: 32, velocityX: 2, minX: 950, maxX: 1250 },
      { x: 1600, y: 418, width: 32, height: 32, velocityX: -2, minX: 1450, maxX: 1700 },
      { x: 2200, y: 418, width: 32, height: 32, velocityX: 2, minX: 2150, maxX: 2450 }
    ];
  };

  // Draw Mario character
  const drawMario = (ctx, x, y, direction, animation) => {
    ctx.save();
    ctx.translate(x + 16, y + 16);
    if (direction === -1) {
      ctx.scale(-1, 1);
    }

    // Body
    ctx.fillStyle = '#E30000';
    ctx.fillRect(-12, -8, 24, 20);

    // Head
    ctx.fillStyle = '#FFB077';
    ctx.fillRect(-10, -16, 20, 12);

    // Hat
    ctx.fillStyle = '#E30000';
    ctx.fillRect(-12, -20, 24, 8);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(-6, -14, 3, 3);
    ctx.fillRect(3, -14, 3, 3);

    // Mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-8, -8, 16, 3);

    // Legs (animated)
    ctx.fillStyle = '#0000CD';
    const legOffset = Math.sin(animation * 0.3) * 3;
    ctx.fillRect(-10, 12, 8, 12 + legOffset);
    ctx.fillRect(2, 12, 8, 12 - legOffset);

    // Shoes
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-12, 22, 10, 6);
    ctx.fillRect(2, 22, 10, 6);

    ctx.restore();
  };

  // Draw coin
  const drawCoin = (ctx, x, y, time) => {
    ctx.save();
    ctx.translate(x + 10, y + 10);

    const scale = Math.abs(Math.cos(time * 0.05));
    ctx.scale(scale, 1);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Draw enemy (Goomba-style)
  const drawEnemy = (ctx, x, y, time) => {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, 32, 28);

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + 6, y + 8, 8, 8);
    ctx.fillRect(x + 18, y + 8, 8, 8);

    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8, y + 10, 4, 4);
    ctx.fillRect(x + 20, y + 10, 4, 4);

    // Angry eyebrows
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 6, y + 6, 8, 2);
    ctx.fillRect(x + 18, y + 6, 8, 2);

    // Feet (animated)
    const footOffset = Math.sin(time * 0.1) * 2;
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 4, y + 28, 10, 4 + footOffset);
    ctx.fillRect(x + 18, y + 28, 10, 4 - footOffset);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      gameRef.current.keys[e.code] = true;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    let time = 0;

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const gameLoop = () => {
      time++;

      // Update player velocity based on input
      if (game.keys['ArrowLeft'] || game.keys['KeyA']) {
        game.player.velocityX = -game.moveSpeed;
        game.player.direction = -1;
        game.player.animation = time;
      } else if (game.keys['ArrowRight'] || game.keys['KeyD']) {
        game.player.velocityX = game.moveSpeed;
        game.player.direction = 1;
        game.player.animation = time;
      } else {
        game.player.velocityX = 0;
      }

      // Jump
      if ((game.keys['Space'] || game.keys['ArrowUp'] || game.keys['KeyW']) && !game.player.jumping) {
        game.player.velocityY = game.jumpPower;
        game.player.jumping = true;
      }

      // Apply gravity
      game.player.velocityY += game.gravity;

      // Update player position
      game.player.x += game.player.velocityX;
      game.player.y += game.player.velocityY;

      // Check platform collisions
      let onGround = false;
      game.platforms.forEach(platform => {
        if (checkCollision(game.player, platform)) {
          // Landing on top of platform
          if (game.player.velocityY > 0 &&
              game.player.y + game.player.height - game.player.velocityY <= platform.y) {
            game.player.y = platform.y - game.player.height;
            game.player.velocityY = 0;
            game.player.jumping = false;
            onGround = true;
          }
          // Hitting bottom of platform
          else if (game.player.velocityY < 0 &&
                   game.player.y - game.player.velocityY >= platform.y + platform.height) {
            game.player.y = platform.y + platform.height;
            game.player.velocityY = 0;
          }
        }
      });

      // Check coin collection
      game.coins.forEach(coin => {
        if (!coin.collected) {
          const coinRect = { x: coin.x, y: coin.y, width: 20, height: 20 };
          if (checkCollision(game.player, coinRect)) {
            coin.collected = true;
            setScore(prev => prev + 100);
          }
        }
      });

      // Update enemies
      game.enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        // Bounce enemies at their boundaries
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
          enemy.velocityX *= -1;
        }

        // Check collision with player
        if (checkCollision(game.player, enemy)) {
          // Check if player is jumping on enemy
          if (game.player.velocityY > 0 &&
              game.player.y + game.player.height - 10 < enemy.y + enemy.height / 2) {
            // Bounce player
            game.player.velocityY = -8;
            setScore(prev => prev + 200);
            // Remove enemy
            enemy.x = -1000;
          } else {
            // Player dies
            setGameState('gameover');
            if (score > highScore) {
              setHighScore(score);
            }
          }
        }
      });

      // Update camera scroll
      const targetScrollX = game.player.x - canvas.width / 3;
      game.scrollX += (targetScrollX - game.scrollX) * 0.1;
      game.scrollX = Math.max(0, game.scrollX);

      // Check if player fell off
      if (game.player.y > 600) {
        setGameState('gameover');
        if (score > highScore) {
          setHighScore(score);
        }
      }

      // Render
      ctx.fillStyle = '#5C94FC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      ctx.fillStyle = '#FFF';
      for (let i = 0; i < 5; i++) {
        const cloudX = (i * 300 + time * 0.2) % (canvas.width + game.scrollX) - game.scrollX;
        ctx.beginPath();
        ctx.arc(cloudX, 50 + i * 20, 20, 0, Math.PI * 2);
        ctx.arc(cloudX + 20, 50 + i * 20, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 40, 50 + i * 20, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(-game.scrollX, 0);

      // Draw platforms
      game.platforms.forEach(platform => {
        // Grass top
        ctx.fillStyle = '#7CB342';
        ctx.fillRect(platform.x, platform.y, platform.width, 10);

        // Dirt
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(platform.x, platform.y + 10, platform.width, platform.height - 10);

        // Add texture dots
        ctx.fillStyle = '#6D4C41';
        for (let i = 0; i < platform.width; i += 20) {
          for (let j = 10; j < platform.height; j += 20) {
            ctx.fillRect(platform.x + i + 5, platform.y + j + 5, 3, 3);
          }
        }
      });

      // Draw coins
      game.coins.forEach(coin => {
        if (!coin.collected) {
          drawCoin(ctx, coin.x, coin.y, time);
        }
      });

      // Draw enemies
      game.enemies.forEach(enemy => {
        if (enemy.x > -100) {
          drawEnemy(ctx, enemy.x, enemy.y, time);
        }
      });

      // Draw player
      drawMario(ctx, game.player.x, game.player.y, game.player.direction, game.player.animation);

      ctx.restore();

      // Draw UI
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 20px Arial';
      ctx.strokeText(`Score: ${score}`, 10, 30);
      ctx.fillText(`Score: ${score}`, 10, 30);

      ctx.strokeText(`High Score: ${highScore}`, 10, 60);
      ctx.fillText(`High Score: ${highScore}`, 10, 60);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, score, highScore]);

  const startGame = () => {
    initGame();
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className={classes.gameContainer}>
      <h1 className={classes.title}>Super Mario Game</h1>

      {gameState === 'menu' && (
        <div className={classes.menu}>
          <div className={classes.menuContent}>
            <h2>Welcome to Mario!</h2>
            <p>Use Arrow Keys or WASD to move</p>
            <p>Space or Up Arrow to jump</p>
            <p>Collect coins and avoid enemies!</p>
            <button className={classes.startButton} onClick={startGame}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className={classes.menu}>
          <div className={classes.menuContent}>
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button className={classes.startButton} onClick={startGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className={classes.canvas}
      />

      <div className={classes.instructions}>
        <p><strong>Controls:</strong> Arrow Keys or WASD to move | Space or Up to jump</p>
        <p><strong>Goal:</strong> Collect coins and defeat enemies by jumping on them!</p>
      </div>
    </div>
  );
}

export default MarioGame;
