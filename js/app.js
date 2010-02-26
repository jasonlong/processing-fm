/* 
If you're cloning this project, please copy your own key here.
*/
var LASTFM_API_KEY = "c80fad311cee991e56e2f328ff1bfc71";

jQuery(function($) {
  
  var p       = Processing("mycanvas");
  var artists = [];
  var balls   = [];  
  var vels    = [];
  var font    = p.loadFont("Helvetica");  
  
  p.setup = function() {
    this.size(window.innerWidth, window.innerHeight);
    this.noStroke();
    this.frameRate(60);

    var chart_from, chart_to;
    
    $.getJSON(
      "http://ws.audioscrobbler.com/2.0/?callback=?",
      { 
        api_key:  LASTFM_API_KEY,
        format:   'json',
        method:   'tag.getweeklyartistchart', 
        tag:      'alternative',
        from:     '1266148800',
        to:       '1266753600',
        limit:    '50', 
      },

      function(data){
        var highest_weight = data.weeklyartistchart.artist[0].weight;
        $.each(data.weeklyartistchart.artist, function(i,item) {
          var x = p.random(0, p.width);
          var y = p.random(0, p.height);
          var r = p.map(parseInt(item.weight), 0, parseInt(highest_weight), 0, p.width / 8);
          balls[i] = new Ball(x, y, r, item.name);
          
          var vx = p.random(-1, 1);
          var yx = p.random(-1, 1);

          // not too slow
          if (vx >= 0 && vx < 0.2) vx = 0.3;
          else if (vx < 0 && vx > -0.2) vx = -0.3;

          if (yx >= 0 && yx < 0.3) yx = 0.3;
          else if (yx < 0 && yx > -0.3) yx = -0.3;

          vels[i] = new Vect2D(vx, yx);
        });      
      }
  	);

  }
  
  p.draw = function() {
    this.background(214, 232, 237);
    
    for (var i=0; i < balls.length; i++) {        
      this.fill(43, 33, 12, 200);    
      this.strokeWeight(2);
      this.stroke(0, 0, 0, 100);
      balls[i].x += vels[i].vx;
      balls[i].y += vels[i].vy;    
      this.ellipse(balls[i].x, balls[i].y, balls[i].r*1.8, balls[i].r*1.8);   
      
      // text label
      this.fill(255);
      this.textFont(font);
      this.textSize(balls[i].r * 0.4);
      this.text(balls[i].artist, balls[i].x - (balls[i].r * 0.8), balls[i].y + (balls[i].r * 0.1));
      
      checkBoundaryCollision(balls[i], vels[i], this.width, this.height);
    };
  }
  
  p.init();

  function checkBoundaryCollision(ball, vel, width, height) {
    if (ball.x > width-ball.r){
      ball.x = width-ball.r;
      vel.vx *= -1;
    } 
    else if (ball.x < ball.r){
      ball.x = ball.r;
      vel.vx *= -1;
    } 
    else if (ball.y > height-ball.r){
      ball.y = height-ball.r;
      vel.vy *= -1;
    } 
    else if (ball.y < ball.r){
      ball.y = ball.r;
      vel.vy *= -1;
    }
  }

  var Ball = function Ball(x, y, r, artist) {
    this.x      = x;
    this.y      = y;
    this.r      = r;
    this.artist = artist;
  }

  var Vect2D = function Vect2D(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }
  
});

