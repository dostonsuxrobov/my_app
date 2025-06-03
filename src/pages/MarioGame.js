import { useRef, useEffect, useState } from 'react';
import classes from './MarioGame.module.css';

function MarioGame(){
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  // Simple player state
  const player = useRef({x: 50, y: 0, vy: 0});
  const keys = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animation;

    const ground = 150;

    const loop = () => {
      if(!running){
        return;
      }
      // apply gravity
      player.current.vy += 0.5;
      player.current.y += player.current.vy;
      if(player.current.y > ground){
        player.current.y = ground;
        player.current.vy = 0;
      }
      // handle input
      if(keys.current['ArrowLeft']){
        player.current.x -= 2;
      }
      if(keys.current['ArrowRight']){
        player.current.x += 2;
      }
      if(keys.current['Space'] && player.current.y === ground){
        player.current.vy = -7;
      }

      // keep inside bounds
      player.current.x = Math.max(0, Math.min(canvas.width-20, player.current.x));

      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.fillStyle = '#8bc34a';
      ctx.fillRect(0, ground+20, canvas.width, canvas.height-ground-20);

      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(player.current.x, player.current.y, 20, 20);

      setScore(prev => prev + 1);

      animation = requestAnimationFrame(loop);
    };

    if(running){
      animation = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animation);
  }, [running]);

  useEffect(() => {
    const downHandler = (e) => { keys.current[e.code] = true; };
    const upHandler = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return (
    <div className={classes.gameContainer}>
      {!running && (
        <button className={classes.start} onClick={() => { setScore(0); setRunning(true); }}>Start Game</button>
      )}
      <canvas ref={canvasRef} width="300" height="200" className={classes.canvas}></canvas>
      <div className={classes.score}>Score: {score}</div>
    </div>
  );
}

export default MarioGame;
