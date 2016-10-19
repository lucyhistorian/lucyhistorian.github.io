var canv = document.getElementById("Canvas");
var context = canv.getContext("2d");
var fps = 60;
var kp_left = false;
var kp_right = false;
var kp_up = false;
var kp_down = false;
var score = 0;
var lost = false;
var startScreen = true;
var highscore = 0;
var asteroid = [0,0,0,0,0,0,0,0,0,0,0,0];
var roidCount = 0;

var s_die = new Audio("die.wav");
var s_mus = new Audio("music.mp3");
s_mus.addEventListener('ended', function() {
this.currentTime = 0;
this.play();
}, false);//Music


function Ship()
{
		this.x = 270;
		this.y = 270;
		this.rot = 0;
		this.hspeed = 0;
		this.vspeed = 0;
		this.roidTimer = Math.round(Math.random() * 80);
		this.EV_step = function()
		{
			if (kp_left)
			{
				if (this.hspeed > -4) this.hspeed -= 0.2;
			}
			if (kp_up)
			{
				if (this.vspeed > -8) this.vspeed -= 0.5;
			}
			if (kp_right)
			{
				if (this.hspeed < 4) this.hspeed += 0.2;
			}
			this.vspeed += 0.2;
			this.x += this.hspeed;
			this.y += this.vspeed;
			this.rot = this.hspeed * -10;
			
			this.roidTimer --;
			if (this.roidTimer === 0)
			{
				this.roidTimer = max(Math.round(Math.random() * (90 - roidCount)),1);
				var sos = Math.floor(Math.random() * 4);
				var s = 2 + Math.round(Math.random() * 5);
				var pos = Math.round(Math.random() * 540);
				
				switch(sos)
				{
					case 0: 
					asteroid[roidCount] = new Roid(0,pos,s,0);
					break;
					case 1: 
					asteroid[roidCount] = new Roid(540,pos,-s,0);
					break;
					case 2: 
					asteroid[roidCount] = new Roid(pos,0,0,s);
					break;
					case 3: 
					asteroid[roidCount] = new Roid(pos,540,0,-s);
					break;
				}
				roidCount ++;
			}
			
			if ((this.x > 540) ||
			(this.x < 0) ||
			(this.y > 540) ||
			(this.y < 0))
			gameOver();
		}
		
		this.EV_draw = function()
		{
			context.strokeStyle = "#fff";
			draw_line(this.x + lengthdir_x(this.rot - 45,12),this.y + lengthdir_y(this.rot - 45,12),this.x + lengthdir_x(this.rot + 180 + 45,12),this.y + lengthdir_y(this.rot + 180 + 45,12));
			draw_line(this.x + lengthdir_x(this.rot - 45,12),this.y + lengthdir_y(this.rot - 45,12),this.x + lengthdir_x(this.rot + 90,12),this.y + lengthdir_y(this.rot + 90,12));
			draw_line(this.x + lengthdir_x(this.rot + 180 + 45,12),this.y + lengthdir_y(this.rot + 180 + 45,12),this.x + lengthdir_x(this.rot + 90,12),this.y + lengthdir_y(this.rot + 90,12));
		}
}

function Roid(x,y,hs,vs)
{
	this.x = x;
	this.y = y;
	this.hspeed = hs;
	this.vspeed = vs;
	this.rot = 0;
	this.rSpeed = -8 + Math.round(Math.random() * 16);
	this.vertList = [0,0,0,0,0,0,0,0,0,0,0];
	this.pAv = 0;
	this.des = false;
	for (var i = 0; i < 10; i ++)
	{
		this.vertList[i] = 24 + Math.round(Math.random() * 8);
		this.pAv += this.vertList[i];
	}
	this.vertList[10] = this.vertList[0];
	
	this.pAv /= 10;
	this.EV_step = function()
	{
		this.rot += this.rSpeed;
		
		if (distance_to_object(this,ship) < (this.pAv + 8))
		{
			gameOver();
		}
		
		if (((this.x > 540) ||
		(this.x < 0) ||
		(this.y > 540) ||
		(this.y < 0)) &&
		(!this.des))
		{
			score ++;
			this.des = true;
		}
		this.x += this.hspeed;
		this.y += this.vspeed;
	}
	
	this.EV_draw = function()
	{
		for (var i = 0; i < 11; i ++)
		{
			context.strokeStyle = "#fff";
			draw_line(this.x + lengthdir_x(i * 36 + this.rot,this.vertList[i]),this.y + lengthdir_y(i * 36 + this.rot,this.vertList[i]),this.x + lengthdir_x((i+1) * 36 + this.rot,this.vertList[(i+1)]),this.y + lengthdir_y((i+1) * 36 + this.rot,this.vertList[(i+1)]));
		}
	}
}

var draw_line = function(x1,y1,x2,y2)
{
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
}

var takeInput = function()
{
	
	document.addEventListener('keydown', function(event)
	{
		if (event.keyCode == 37)//Left
		{
			kp_left = true;
		}
		
		if (event.keyCode == 39)//Right
		{
			kp_right = true;
		}
		
		if (event.keyCode == 38)//Up
		{
			kp_up = true;
		}
		
		if (event.keyCode == 40)//Down
		{
			kp_down = true;
		}
    });
	
	//__
	
		document.addEventListener('keyup', function(event)
	{
		if (event.keyCode == 37)//Left
		{
			kp_left = false;
		}
		
		if (event.keyCode == 39)//Right
		{
			kp_right = false;
		}
		
		if (event.keyCode == 38)//Up
		{
			kp_up = false;
		}
		
		if (event.keyCode == 40)//Down
		{
			kp_down = false;
		}
    });
};

var lengthdir_x = function(dir,dis)
{
	var r = Math.cos(dir * Math.PI / 180) * dis;
	return(r);
}

var lengthdir_y = function(dir,dis)
{
	var r = - Math.sin(dir * Math.PI / 180) * dis;
	return(r);
}

var max = function(a,b)
{
	if (a > b)
	{
		return(a);
	}
	else
	{
		return(b);
	}
	
}

var distance_to_object = function lineDistance( point1, point2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

var gameOver = function()
{
	hs = parseInt(localStorage["high.score"]);
	if (isNaN(hs))
	{
		hs = 0;
	}
	
	if (score > hs)
	{
		localStorage["high.score"] = score;
		highscore = score;
	}
	else
	{
		highscore = hs;
	}
	s_die.play();
	lost = true;
}

var reset = function()
{
	score = 0;
	if (startScreen)
	s_mus.play();
	startScreen = false;
	highscore = 0;
	ship = new Ship();
	for (i = 0; i < roidCount; i ++)
	{
			asteroid[i] = null;
	}
	roidCount = 0;
	lost = false;
}

var step = function()
{
	takeInput();
	if ((!lost) && (!startScreen))
	{
		ship.EV_step();
		for (i = 0; i < roidCount; i ++)
		{
			var o = asteroid[i];
			if (!o.des)
			o.EV_step();
		}
	}
	else
	{
		if (kp_down)
		{
			reset();
		}
	}
}

var draw = function ()
{
	context.fillStyle="#090909";
	context.fillRect(0,0,540,540);
		
	if ((!lost) && (!startScreen))
	{
		context.textAlign = 'center';
		context.fillStyle = "#f0f0f0";
		context.font = "28px Courier";
		context.fillText("DODGED: " + score,270,28)
		ship.EV_draw();
		for (i = 0; i < roidCount; i ++)
		{
			var o = asteroid[i];
			if (!o.des)
			o.EV_draw();
		}
	}
	else
	if (lost)
	{
		context.textAlign = 'center';
		context.fillStyle="#565656";
		context.fillRect(20,20,500,500);
		context.strokeStyle="#e3e3e3";
		context.strokeRect(20,20,500,500);
		context.fillStyle = "#f0f0f0";
		context.font = "40px Courier";
		context.fillText("GAME OVER",270,240)
		context.font = "28px Courier";
		context.fillText("Score: " + score,270,270)
		context.fillText("Best: " + highscore,270,300)
		context.fillText("Press down to retry",270,360)
	}
	else
	{
		context.textAlign = 'center';
		context.fillStyle = "#f0f0f0";
		context.font = "40px Courier";
		context.fillText("SMASHY SPACESHIP",270,240)
		context.font = "28px Courier";
		context.fillText("Use up left & right to fly",270,360)
		context.fillText("Press down to play",270,385)
		
		context.strokeStyle = "#fff";
			draw_line(270 + lengthdir_x( - 45,12),270 + lengthdir_y( - 45,12),270 + lengthdir_x(180 + 45,12),270 + lengthdir_y(180 + 45,12));
			draw_line(270 + lengthdir_x( - 45,12),270 + lengthdir_y( - 45,12),270 + lengthdir_x(90,12),270 + lengthdir_y(90,12));
			draw_line(270 + lengthdir_x( + 180 + 45,12),270 + lengthdir_y( + 180 + 45,12),270 + lengthdir_x(90,12),270 + lengthdir_y(90,12));
	}
}

var update = function()
{
	step();
	draw();
}
window.setInterval(update,1000 / fps);


