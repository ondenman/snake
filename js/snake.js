'use strict';

window.onload = function () {

        var canvas = document.getElementById('snake-container');

        var context = canvas.getContext('2d'),
            displayFont = 'Normal 16px "Ubuntu Mono"',
            pixelSize = 20,
            idleCounter = 0,
            idleTimer = 0,
            direction = 0,
            hi = 0,
            hiRank = 0,
            snakeColours = ['#1ABC9C',  //turqouise
                            '#2ECC71',  //green
                            '#3498DB',  //blue
                            ],
            foodColours = [ '#F1C40F',  //yellow
                            '#E67E22',  //orange
                            '#E74C3C',  //red
                            ],
            gameOverBackgroundColour = '#C0392B',
            textColour = '#ecf0f1',
            gameBackgroundColour = '#2C3E50',
            gameBackground = canvas,
            borderColour =  '#34495E',
            isPlaying = false,
            gameOver = false,
            idleKeyStrokes = [37,37,37,37,38,38,38,38,
                              39,39,39,39,40,40,40,40], // mimic user when game is idle
            rankNames = [ 'worm',
                          'centipede',
                          'millipede',
                          'boa',
                          'python',
                          'king cobra'
                         ];
        var snake, food, changeX, changeY, positionX, positionY, 
            keyReady, rank, score, gameTimer, gameOverMessage, key,
            interval;

        setUpGame();

        function setUpGame() {

          score = 0;
          rank = 0;
          keyReady = true;
          isPlaying = false;
          gameOver = false;
          changeX = 0;
          changeY = 0;
          direction = 0;
          interval = 160;
          idleCounter = 0;

          gameBackground.style.background = gameBackgroundColour;
          clearPlayArea();
          positionX = canvas.width/2+(pixelSize*2-pixelSize/2); // initial position
          positionY = canvas.height/2+(pixelSize-pixelSize/2);  // of snake
          food = [];
          snake = [{     x: positionX,
                         y: positionY,
                      fill: snakeColours[0],
                    }];

          drawStats();
          idleTimer = setInterval(idle, interval);
          drawPlayBorder();
          drawSnake();
          for (var i=0; i<2; i++) {
            growSnake();
        }

        document.onkeydown = function (e) {
          if (!isPlaying && !gameOver && (e.keyCode >= 37 && e.keyCode <= 40)) {
            clearInterval(idleTimer);
            startTimer(interval);
            for (var i = 0; i < 10; i++) { // populate the board with some food
              layFood(true);
            }
            isPlaying = true;
          } else if (!isPlaying && gameOver && (e.keyCode >= 37 && e.keyCode <= 40)) {
            setUpGame();
            clearInterval(idleTimer);
            startTimer(interval);
            layFood(true);
            isPlaying = true;
          }
          e = e || window.event;
          key = keyReady ? e.keyCode : 0;
          handleKey(key);
          keyReady = false;
        };

        document.onkeyup = function () {
          keyReady = true;
        };
      }

        function startTimer(interval) {
          gameTimer = setInterval(gameUpdate, interval);
        }

        function idle() {
            clearPlayArea();
            drawStats();
            showMessage('Control snake with cursor keys', canvas.height-60);
            showMessage('Press any key to start', canvas.height-80);
            handleKey(idleKeyStrokes[idleCounter]);
            if (idleCounter < idleKeyStrokes.length-1) {
              idleCounter++;
            } else {
              idleCounter = 0;
            }
            moveSnake();
            drawSnake();
            drawPlayBorder();
        }


        function handleKey(key) {
          if (key === 37 && direction !== 'right') {        // 37 = left
              setDirection(-pixelSize,0);
              direction = 'left';
          } else if (key === 38 && direction !== 'down') {  // 38 = up
              setDirection(0,-pixelSize);
              direction = 'up';
          } else if (key === 39 && direction !== 'left') {  // 39 = right
              setDirection(pixelSize,0);
              direction = 'right';
          } else if (key === 40 && direction !== 'up') {    // 40 = down
              setDirection(0,pixelSize);
              direction = 'down';
          }
        }

        function setDirection(differenceX, differenceY) {
            changeX = differenceX;
            changeY = differenceY;
        }

        function moveSnake() {
            var head = snake[0],
                i = snake.length-1;

            head.x += changeX;
            head.y += changeY;

            while ( i > 0 ) {
              var segment = snake[i];
              var newX = snake[i-1].x,
                  newY = snake[i-1].y;

              segment.x = newX;
              segment.y = newY;
              i--;
            }
        }

        function drawSnake() {
            for (var i in snake) {
              context.fillStyle = snake[i].fill;
              context.fillRect(snake[i].x, snake[i].y, pixelSize, pixelSize);
            }
        }

        function growSnake() {
          var lastSegment = snake[snake.length-1],
              x = lastSegment.x,
              y = lastSegment.y;

          var fillColour;

          do {
            fillColour = pickColour(snakeColours);
          } while (fillColour === lastSegment.fill);

            var newSegment = {   x: x,
                                 y: y,
                              fill: fillColour };
            snake.push(newSegment);

        }

        function pickColour(colourArray) {
          var random = Math.floor(Math.random()*snakeColours.length);
          return colourArray[random];
        }

        function layFood(forceLay) {

          var chance = forceLay ? 10 : Math.floor((Math.random() * 10) + 1);

          if (chance === 10) {
            var xGrid = canvas.width/pixelSize,
                yGrid = canvas.height/pixelSize;

            var xPos = Math.floor(Math.random() * xGrid + 1)*pixelSize,
                yPos = Math.floor(Math.random() * yGrid + 1)*pixelSize;
  

          var head = snake[0];

          if (xPos === head.x && yPos === head.y) { return false; } // bail out if food overlaps snake's head
          for (var i in food) {                                         // bail out if food overlaps existing food
            if (xPos === food[i].x && yPos === food[i].y) {
            return false;
            }
          }

            var fill = pickColour(foodColours);

            food.push({x: xPos, y: yPos, fill: fill});
        }
      }

        function drawFood() {
          for (var i in food) {
            context.fillStyle = food[i].fill;
            context.fillRect(food[i].x,food[i].y, pixelSize, pixelSize);
          }
        }

        function clearPlayArea() {
          canvas.width = canvas.width;
        }

        function drawPlayBorder() {
          context.beginPath();
          context.lineWidth=pixelSize*2;
          context.strokeStyle=borderColour;
          context.rect(0,0,canvas.width,canvas.height); 
          context.stroke();
        }

        function hasCollidedWithFood() {
          var head = snake[0];

          for (var i in food) {
            if (food[i].x === head.x && food[i].y === head.y) {
              food.splice(i,1);
              return true;
            }
          }
        }

        function hasCollidedWithSelfOrEdge() {
          var head = snake[0];

          if (head.y < (0 + pixelSize/2) ||
              head.y > (canvas.height - pixelSize*1.5)) {
            return true;
          }

         if (head.x < (0 + pixelSize/2) ||
              head.x > (canvas.width - pixelSize*1.5)) {
            return true;
          }

          for (var i = 2; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) { return true; }
          }
        }

        function increaseScore() {
          score +=10;
        }

        function increaseSpeed() {
          clearInterval(gameTimer);
          interval = interval - 5;
          startTimer(interval);
        }

        function drawStats() {
          context.font = displayFont;
          context.fillStyle = textColour;
          var x = 40,
              y = 50;

          var message = 'Score '+score;
          message = message.toUpperCase();
          context.fillText(message, x, y);

          message = 'Hi '+hi;
          message = message.toUpperCase();
          context.fillText(message, x+180, y);

          message = 'Rank  '+rankNames[rank];
          message = message.toUpperCase();
          context.fillText(message, x, y+20);

          message = 'Hi Rank  '+rankNames[hiRank];
          message = message.toUpperCase();
          context.fillText(message, x+180, y+20);
        }

        function endGame() {
          clearInterval(gameTimer);
          isPlaying = true;
          gameOver = true;
          hi = hi < score ? score : hi;
          hiRank = hiRank < rank ? rank : hiRank;
          gameBackground.style.background = gameOverBackgroundColour;

          var y = canvas.height/2;
          gameOverMessage = scrollMessage('key to continue ... Game over ... Press any ', y);
          setTimeout( function(){
                                waitForKey();
                                }, 1000);
        }

        function scrollMessage(message, height) {
          context.font = displayFont;

          message = message.toUpperCase();

          var banner = message.split(''),
              startPosition = 40,
              charWidth = 10,
              bannerSpeed = 120;

          return setInterval(function (){
            context.clearRect(20, height-14, canvas.width-40, 16);
            var position = startPosition;

            for (var i in banner) {
              var character = banner[i];
              context.fillStyle = textColour;
              if (position < canvas.width-40) {
                context.fillText(character, position, height);
              }
              position += charWidth;
            }
              var topCharacter = banner.shift();
              banner.push(topCharacter);

            }, bannerSpeed);

        }

        function showMessage(message, height) {
          message = message.toUpperCase();
          context.font = displayFont;
          context.fillStyle = textColour;
          context.textAlign='center'; 
          context.fillText(message, canvas.width/2, height);
        }

        function waitForKey() {
          document.onkeydown = function (e) {
            if (!e) {
              waitForKey();
            } else {
              clearInterval(gameOverMessage);
              setUpGame();
            }
        };
      }

        function gameUpdate() {
          canvas.width = canvas.width;
          clearPlayArea();
          drawSnake();
          layFood();
          if (hasCollidedWithSelfOrEdge()) { endGame(); }
          if (hasCollidedWithFood()) {
            growSnake();
            increaseScore();
            if (score % 40 === 0) { increaseSpeed(); }
            if (score % 240 === 0) {
              rank = rank > rankNames.length-2 ? rankNames.length-1 : rank+=1;
            }
          }
          moveSnake();
          drawFood();
          drawStats();
          drawPlayBorder();
        }
      };