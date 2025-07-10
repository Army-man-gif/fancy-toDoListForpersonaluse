import { useEffect } from "react";

function Canvas() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomRGB() {
      return `rgb(${random(0, 255)} ${random(0, 255)} ${random(0, 255)})`;
    }
    class Ball {
      constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
      }
      update() {
        if (this.x + this.size >= width || this.x - this.size <= 0) {
          this.velX = -this.velX;
        }
        if (this.y + this.size >= height || this.y - this.size <= 0) {
          this.velY = -this.velY;
        }
        this.x += this.velX;
        this.y += this.velY;
      }
      collisionDetect() {
        const increment = 10;
        for (const ball of balls) {
          if (this !== ball) {
            const x_distance = this.x - ball.x;
            const y_distance = this.y - ball.y;
            const distance = Math.sqrt(
              x_distance * x_distance + y_distance * y_distance,
            );

            if (distance < this.size + ball.size) {
              this.velX = -this.velX - increment;
              this.velY = -this.velY - increment;
              ball.velX = -ball.velX + increment;
              ball.velY = -ball.velY + increment;
              return true;
            }
          }
        }
      }
    }
    const balls = [];

    while (balls.length < 12) {
      const size = 15;
      const speed = 20;
      const ball = new Ball(
        /* 
                    Ball position always drawn at least one ball 
                    width away from the edge of the canvas, to avoid drawing errors
                */
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-speed, speed),
        random(-speed, speed),
        randomRGB(),
        size,
      );

      balls.push(ball);
    }
    function loop() {
      ctx.fillStyle = "rgb(0 0 0 / 75%)";
      ctx.fillRect(0, 0, width, height);

      for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
      }

      requestAnimationFrame(loop);
    }
    loop();
  });

  return (
    <>
      <h1></h1>
      <canvas></canvas>
    </>
  );
}

export default Canvas;
