var canvas = document.getElementById("c");
canvas.addEventListener('mousedown', function(e) {Click(canvas, e);});
var context = canvas.getContext("2d");
var c_width = 640;
var c_height = 480;
var fps = 10;
var difficulty_name = ["Easy", "Medium", "Hard", "Expert"];
var difficulty_grid = [[4,4],[6,4],[8,6],[16,8]];
var difficulty_size = [64,64,48,32]
var difficulty_types = [4, 6, 12, 16]

var selected = null;

var type_color = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#0066ff","#ff6600","#00ff66","#ff0066","#6600ff","#66ff00","#000000","#666666","#ffffff","#b00b69"]

var tiles = [];

function Tile(x,y,size,type)
{
	this.x = x;
	this.y = y;
	this.size = size;
	this.type = type;
	this.ev_draw = function()
	{
		context.fillStyle = type_color[type];
		context.fillRect(this.x,this.y, this.size, this.size);
		if (selected != this)
		{
			context.strokeStyle = "#222";
			context.moveTo(this.x, this.y);
			context.lineTo(this.x+size, this.y);
			context.lineTo(this.x+size, this.y + size);
			context.lineTo(this.x, this.y+size);
			context.lineTo(this.x, this.y);
			context.stroke();
		}
	}
	
	this.tryClick = function(x,y)
	{
			if (x>=this.x && y>=this.y && x<this.x+this.size&&y<this.y+this.size)
			{
				selected = this;
			}
	}
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

var Init = function(d)
{
	var board_w =  difficulty_grid[d][0]*difficulty_size[d];
	var board_h =  difficulty_grid[d][1]*difficulty_size[d];
	var corner_x = (c_width-board_w)/2;
	var corner_y = (c_height-board_h)/2;
	var tile_types = [];
	var dupes = ((difficulty_grid[d][0]*difficulty_grid[d][1])/2)/difficulty_types[d];
	
	for (var i = 0; i < difficulty_types[d]; ++i)
	{
			for (var j = 0; j < dupes*2; ++j)
			{
				tile_types.push(i);
			}
	}
	console.log(tile_types.length);
	tile_types = shuffle(tile_types);
	
	for(var xx = 0; xx < difficulty_grid[d][0]; ++xx)
	{
		for(var yy = 0; yy < difficulty_grid[d][1]; ++yy)
		{
			tiles.push(new Tile(corner_x+xx*difficulty_size[d], corner_y+yy*difficulty_size[d], difficulty_size[d], tile_types.pop()));
		}
	}
	
}

var Click = function(canvas, event)
{
	const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
	tiles.forEach((t) =>
	{
		t.tryClick(x,y);
	});
};

var Draw = function()
{
    context.fillStyle = "#bbb";
    context.fillRect(0 ,0 ,c_width,c_height);
	
	tiles.forEach((t) =>
	{
		t.ev_draw();
	});
};

var Update = function()
{
    Draw();
};

Init(2);
setInterval(Update,1000 / fps);