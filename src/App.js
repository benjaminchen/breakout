import Brick from './Brick.js';
import Paddle from './Paddle.js';
import Ball from './Ball.js';
import Text from './Text.js';

class App {
    constructor(canvas) {
        this.screenWidth = canvas.width;
        this.screenHeight = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.pressRight = false;
        this.pressLeft = false;
        this.handle = null;
        this.listen();
    }

    init() {
        var screenWidth = this.screenWidth,
            screenHeight = this.screenHeight;
        this.bricks = [];
        this.createBricks(6, 5);
        this.paddle = new Paddle(screenWidth * 0.85 / 2, screenHeight * 0.975, screenWidth * 0.15, screenHeight * 0.025);
        var ballRadius = this.bricks[0].height / 2;
        this.ball = new Ball(screenWidth / 2, screenHeight * 0.975 - ballRadius, ballRadius);
        this.text = new Text("", screenWidth * 0.5, screenHeight * 0.65);
        this.state = 0; // 0 => stop, 1 => start, 2 => over
        this.text.content = "Press Enter to Start";
        this.draw();
    }

    draw() {
        var ctx = this.ctx,
            ball = this.ball,
            paddle = this.paddle,
            me = this;

        this._clearScreen(ctx);

        this._drawBricks(ctx);
        this._drawPaddle(ctx);
        this._drawBall(ctx);

        if (this.bricks.length == 0) {
            this.over();
            return;
        }

        var bY = ball.y,
            bX = ball.x,
            bR = ball.radius,
            sH = this.screenHeight,
            pH = paddle.height,
            pW = paddle.width,
            pX = paddle.x,
            pY = paddle.y;

        // ball hit paddle
        if (bX > pX && bX < (pX + pW)) {
            if ((bY >= (pY - bR) && bY < pY) || (bY >= (pY - ball.speed) && bY < pY)) {
                ball.dy = -ball.speed;
            }
        } else if ((bX > (pX - bR) && bX <= pX) || (bX < (pX + pW + bR) && bX > (pX + pW))) {
            if (bY >= (pY - bR) && bY <= (pY + pH)) {
                ball.dy = -ball.speed;
                ball.dx = -ball.dx;
            }
        } else if (bY > (sH + bR)) {
            this.over();
        }

        // ball hit brick
        this.bricks.forEach(function(b, index) {
            var left = b.x - 2.5,
                right = b.x + b.width + 2.5,
                up = b.y - 2.5,
                down = b.y + b.height + 2.5;

            if (bX >= left && bX <= right) {
                if ((bY >= (up - bR) && bY <= up) || (bY >= down && bY <= (down + bR))) {
                    ball.dy = ball.speed;
                    me.bricks.splice(index, 1);
                }
            }

            if (bY >= up && bY <= down) {
                if ((bX <= left && bX >= (left - bR)) || (bX >= right && bX <= (right + bR))) {
                    ball.dy = ball.speed;
                    ball.dx = -ball.dx;
                    me.bricks.splice(index, 1);
                }
            }
        });

        this.text.draw(ctx);

        if (this.state == 1) this.handle = window.requestAnimationFrame(this.draw.bind(this));
    }

    _clearScreen(ctx) {
        ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    }

    _drawBricks(ctx) {
        this.bricks.forEach(function(brick) {
            brick.draw(ctx);
        });
    }

    _drawPaddle(ctx) {
        var paddle = this.paddle,
            displacement = 0;

        if (this.pressRight && paddle.x < (this.screenWidth - paddle.width - paddle.speed)) displacement = paddle.speed;
        if (this.pressLeft && paddle.x > paddle.speed) displacement = -paddle.speed;
        paddle.x += displacement;
        paddle.draw(ctx);
    }

    _drawBall(ctx) {
        var ball = this.ball;

        if (ball.dx == 0 && this.state == 1) {
            ball.dx = ball.speed;
            ball.dy = -ball.speed;
        }
        if (ball.x >= (this.screenWidth - ball.radius)) ball.dx = -ball.speed;
        if (ball.x <= ball.radius) ball.dx = ball.speed;
        if (ball.y <= ball.radius) ball.dy = ball.speed;

        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.draw(ctx);
    }

    start() {
        this.state = 1;
        this.paddle.speed = 5;
        this.ball.speed = 5;
        this.text.content = "";
        this.draw();
    }

    restart() {
        this.init();
    }

    pause() {
        if (this.state != 1) return;
        this.state = 0;
        this.text.content = "Press Enter to Start";
        this.draw();
    }

    over() {
        this.state = 2;
        this.text.content = "Press Space to Restart";
        window.cancelAnimationFrame(this.handle);
    }

    createBricks(row, column) {
        var space = 5;
        var brickWidth = (this.screenWidth - space * (column - 1)) / column;
        var brickHeight = (this.screenHeight * 0.25 - space * (row - 1) / 2) / row;

        for (var c = 0; c < column; c++) {
            for (var r = 0; r < row; r++) {
                var x = space * c + brickWidth * c;
                var y = space * r + brickHeight * r;
                this.bricks.push(new Brick(x, y, brickWidth, brickHeight));
            }
        }
    }

    listen() {
        var me = this;
        document.addEventListener("keypress", function(e) {
            switch (e.keyCode) {
                case 32:
                    if (me.state == 1) {
                        me.pause();
                    } else if (me.state == 2) {
                        me.restart();
                    }
                    break;
                case 13:
                    if (me.state == 0) me.start();
                    // if (game.states.over) location.reload();
                    break;
            }
        });
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 39) me.pressRight = true;
            if (e.keyCode == 37) me.pressLeft = true;
        });
        document.addEventListener("keyup", function(e) {
            if (e.keyCode == 39) me.pressRight = false;
            if (e.keyCode == 37) me.pressLeft = false;
        });
    }
}

export default App;