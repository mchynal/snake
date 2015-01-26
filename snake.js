
    var snake = {
      snd: new Audio("Boom-Kick.wav"),

      init: function(){
        this.segments = [{x:5,y:5},{x:4,y:5},{x:3,y:5},{x:2,y:5}];
        this.direction = 'right';
        this.apple = {x:10, y:10};
        this.score = 0;
        this.speed = 0;
        this.paused = false;

        var canvas = document.getElementById("canvas");

        if (canvas.getContext) {
          this.ctx = canvas.getContext("2d");
        }

        this.game = setInterval(function(){
          snake.move();
        }, 200);

        this.started = true;  
      },

      gameOver: function(){
        clearInterval(this.game);
        this.ctx.fillStyle = 'rgb(0,0,200)';
        this.ctx.font = "40px Arial";
        this.ctx.fillText("Game Over",50,150);
        this.ctx.font = "15px Arial";
        this.ctx.fillText("press space to restart",90,170);
        this.started = false;
      },
      
      pause: function(){
        if(!this.paused){
          clearInterval(this.game);
          this.paused = true;
        }else{
          this.game = setInterval(function(){
            snake.move();
          }, 200-this.speed*10);
          this.paused = false;
        }
      },

      drawSegment: function(x, y, c){
          var nx = (1+x+((x-1)*15))-1;
          var ny = (1+y+((y-1)*15))-1;

          this.ctx.fillStyle = c;
          this.ctx.fillRect (nx, ny, 15, 15);
      },

      draw: function(){

        this.ctx.clearRect(0, 0, 321, 321);

        for(var i=0; i<this.segments.length; i++){
          if(i==0){
            var c='rgb(0,100,0)';
          }else if(i==this.segments.length-1){
            var c='rgba(0,200,0,0.5)';
          }else{
            var c='rgb(0,200,0)';
          }

          this.drawSegment(this.segments[i].x, this.segments[i].y, c);
        }

          this.drawSegment(this.apple.x, this.apple.y, 'rgb(200,0,0)');

          this.ctx.fillStyle = 'rgb(0,0,200)';
          this.ctx.font = "15px Arial";
          this.ctx.fillText("speed :"+this.speed+" score: "+this.score,170,310);
      },

      move: function(){
        this.segments.unshift({x:this.segments[0].x, y:this.segments[0].y});

        var head = {};

        if(this.direction=='up'){
          head.x = this.segments[0].x;
          head.y = this.segments[0].y - 1;
        }else if(this.direction=='down'){
          head.x = this.segments[0].x;
          head.y = this.segments[0].y + 1;
        }else if(this.direction=='left'){
          head.x = this.segments[0].x - 1;
          head.y = this.segments[0].y;
        }else if(this.direction=='right'){
          head.x = this.segments[0].x + 1;
          head.y = this.segments[0].y;
        }

        for(var i=0; i<this.segments.length-1; i++){
          if(this.segments[i].x==head.x &&  this.segments[i].y==head.y){
            this.gameOver();
            return;
          }
        };

        if(head.x<1 || head.y<1 || head.x>20 || head.y>20){
          this.gameOver();
          return;
        }

        if(head.x==this.apple.x && head.y==this.apple.y){
          this.newApple()
          this.score++;
          this.snd.load();
          this.snd.play();

          if(this.score % 10 == 0){
            this.speed++;
            clearInterval(this.game);
            this.game = setInterval(function(){
              snake.move();
            }, 200-this.speed*10);

          }

        }else{
          this.segments.pop();
        }

        this.segments[0].x = head.x;
        this.segments[0].y = head.y;

        this.draw();
      },

      control: function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if(key==32){
          if(!snake.started){
            snake.init();
          }else{
            snake.pause();
          }
          return;
        }

        var directions = {
          38: 'up',
          40: 'down',
          37: 'left',
          39: 'right'
        }
        
        snake.direction = directions[key] || 'right';
      },

      newApple: function(){
        this.apple = {
          x: parseInt(Math.random()*18)+1,
          y: parseInt(Math.random()*18)+1
        };

        for(var i=0; i<this.segments.length; i++){
          if(this.segments[i].x==this.apple.x &&  this.segments[i].y==this.apple.y){
            this.newApple();
          }
        }
      }


    }

    window.onkeyup = snake.control;