var canvas = document.getElementById("c");
var context = canvas.getContext("2d");
var c_width = 640;
var c_height = 480;
var fps = 45;
var kp_left = false;
var kp_right = false;
var kp_up = false;
var kp_down = false;
var blockNum = 0;
var spikeNum = 0;
var blockList = new Array();
var spikeList = new Array();
var s_jump = new Audio("f_jump.wav");
var s_die = new Audio("f_die.wav");
var s_win = new Audio("f_win.wav");
var s_mus = new Audio("f_music.mp3");
s_mus.addEventListener('ended', function() {
this.currentTime = 0;
this.play();
}, false);
s_mus.play();
var level = 1;
if (true) //So I can collapse this massive level holder
{

/*
//0 empty, 1 player, 2 block, 3 spike, 4 end, 5 text
var level =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);
*/
var level1 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,2 ,2 ,0 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,0 ,2 ,2 ,2 ,0 ,2 ,2 ,2 ,0],
    [0 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0],
    [0 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0],
    [0 ,2 ,2 ,0 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0],
    [0 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0],
    [0 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,0],
	[0 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,2 ,2 ,2 ,0 ,0 ,2 ,0 ,0 ,2 ,2 ,2 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2]
);

var level2 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,2],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,2 ,2 ,3 ,3 ,2 ,2 ,2 ,2 ,2],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,3 ,3 ,3 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2]
);

var level3 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,2 ,3 ,3 ,3 ,3 ,3 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,1 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,2],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2]
);

var level4 =
new Array(
    [0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,2 ,0 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [1 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0],
	[0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2],
	[2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level5 =
new Array(
    [0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [3 ,3 ,3 ,3 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,2 ,2 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,0 ,0 ,3 ,0 ,2 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,0 ,2 ,0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,2 ,2 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[1 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,2 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level6 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,3 ,0 ,4 ,0],
    [0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,2 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,3 ,0 ,0 ,2 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0],
	[0 ,1 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0],
	[0 ,2 ,0 ,0 ,0 ,0 ,2 ,3 ,0 ,0 ,0 ,0 ,3 ,2 ,0 ,0 ,2 ,0 ,0 ,0],
	[0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,2 ,2 ,2 ,0 ,0 ,0],
	[3 ,2 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level7 =
new Array(
    [0 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2],
    [4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,2],
    [0 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,3 ,0 ,2],
    [0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,3 ,0 ,0],
    [3 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,3 ,0 ,2 ,3 ,0 ,0 ,0 ,0 ,3 ,2 ,0],
    [0 ,0 ,0 ,0 ,2 ,3 ,0 ,0 ,0 ,3 ,0 ,2 ,3 ,0 ,0 ,0 ,0 ,3 ,0 ,0],
	[0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,3 ,0 ,0],
	[0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,2 ,0 ,3 ,2 ,0],
	[0 ,3 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,2 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,0],
	[0 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,2 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2],
	[0 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,2],
	[2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level8 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,3 ,3 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level9 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level10 =
new Array(
    [5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,3 ,3 ,3 ,0 ,0 ,0 ,3 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2],
    [0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2],
    [0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2],
    [0 ,1 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2],
	[3 ,2 ,2 ,0 ,0 ,3 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,2],
	[0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,2 ,2 ,2 ,3 ,3 ,0 ,0 ,0 ,0 ,3 ,2],
	[0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,2],
	[0 ,3 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,2 ,2 ,3 ,2 ,0 ,2],
	[0 ,3 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,0 ,2],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,2],
	[2 ,2 ,2 ,2 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2]
);

var level11 =
new Array(
    [2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,2 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,3 ,0 ,0 ,2 ,2 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,3 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,3 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,2 ,2 ,2 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level12 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,3 ,4 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0],
	[3 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,3],
	[0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0],
	[3 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,3]
);

var level13 =
new Array(
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,2 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,3 ,3 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,3 ,0 ,0 ,3 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,3 ,3 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,3 ,3 ,0 ,1 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[3 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,2 ,3 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level14 =
new Array(
    [2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,3],
    [2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [2 ,0 ,0 ,3 ,3 ,3 ,3 ,2 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,2 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
    [0 ,3 ,0 ,2 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,2 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
	[2 ,0 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0],
	[0 ,2 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
	[0 ,3 ,0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,0 ,3 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,0 ,0 ,0],
	[1 ,0 ,2 ,0 ,0 ,3 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]
);

var level15 =
new Array(
    [0 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,2 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3],
    [0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,2 ,0 ,5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [3 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,3 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,4 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,3 ,3 ,0 ,3 ,3 ,0 ,0 ,0 ,0],
    [0 ,2 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,3 ,0 ,0 ,0 ,0],
	[3 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,2 ,0 ,3 ,0 ,3 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,2 ,3 ,3],
	[3 ,0 ,2 ,0 ,0 ,3 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,0 ,0 ,0 ,0 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0],
	[3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,2 ,2 ,0 ,3 ,0 ,0 ,0 ,0],
	[0 ,2 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,0 ,0 ,2 ,0 ,0 ,0 ,2 ,2 ,2 ,0 ,0 ,0]
);

var end =
new Array(
    [2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2],
    [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,4],
    [0 ,3 ,3 ,3 ,0 ,3 ,0 ,3 ,0 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,3 ,3 ,3 ,0 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,0 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [0 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,0 ,3 ,3 ,3 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
    [5 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,3 ,3 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,3 ,0 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,3 ,3 ,0 ,3 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,3 ,3 ,0 ,3 ,0 ,3 ,3 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,0 ,0 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,0 ,3 ,0 ,0 ,0],
	[0 ,0 ,0 ,0 ,0 ,3 ,3 ,3 ,0 ,3 ,0 ,0 ,3 ,0 ,3 ,3 ,0 ,0 ,0 ,0],
	[1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0],
	[2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2 ,2]
);
}

function Player(startx,starty)
{
	this.x = startx;
	this.y = starty;
	this.hspeed = 0;
	this.vspeed = 0;
	this.grounded = false;
	this.h = 16;
	this.w = 16;
	this.xstart = this.x;
	this.ystart = this.y;
	this.upside = false;
	
	this.die = function()
	{
		this.x = this.xstart;
		this.y = this.ystart;
		this.vspeed = 0;
		this.hspeed = 0;
		this.grounded = false;
		s_die.play();
	}
	
	this.ev_step = function()
	{
		if (kp_left) this.hspeed -= 1;
		else
		if (this.hspeed < 0) this.hspeed += 1;
		
		if (kp_right) this.hspeed += 1;
		else
		if (this.hspeed > 0) this.hspeed -= 1;
		
		if ((kp_up) && (this.grounded))
		{
			this.vspeed = -12;
			this.y -= 9;
			s_jump.play();
		}
		
		if (!this.grounded)
		{
			this.vspeed += 1;
		}
		
		if (this.hspeed > 5) this.hspeed = 5;
		if (this.hspeed < -5) this.hspeed = -5;
		if (this.vspeed > 12) this.vspeed = 12;
		if (this.vspeed < -12) this.vspeed = -12;
		
		
		if (this.x < 0) 
		{
			this.x = 0;
			if (this.hspeed < 0) this.hspeed = 0;
		}
		
		if (this.x > c_width) 
		{
			this.x = c_width;
			if (this.hspeed > 0) this.hspeed = 0;
		}
		
		this.grounded = false;
		
		for(i = 0; i < blockNum; i ++)
		{
		
			if (collide_point(this.x - 8,this.y + 9,blockList[i]) || collide_point(this.x + 8,this.y + 9,blockList[i]))
			{
						this.y = blockList[i].y - (blockList[i].h / 2) - (this.h / 2) - 1;
						this.vspeed = 0;
						this.grounded = true;
						this.upside = false;
			}

			if (collide_point(this.x - 8,this.y - 9,blockList[i]) || collide_point(this.x + 8,this.y - 9,blockList[i]))
			{
						this.y = blockList[i].y + (blockList[i].h / 2) + (this.h / 2) + 1
						this.vspeed = 0;
						this.upside = true;
			}
			
			if (collide_point(this.x - 9,this.y + 8,blockList[i]) || collide_point(this.x - 9,this.y - 8,blockList[i]))
			{
						this.x = blockList[i].x + (blockList[i].w / 2) + (this.w / 2)
						this.hspeed = 0;
			}

			if (collide_point(this.x + 9,this.y + 8,blockList[i]) || collide_point(this.x + 9,this.y - 8,blockList[i]))
			{
						this.x = blockList[i].x - (blockList[i].w / 2) - (this.w / 2)
						this.hspeed = 0;
			}
		}
		
		for(i = 0; i < spikeNum; i ++)
		{
			if (collide(this,spikeList[i]))
			{
				this.die();
			}
		}
		
		if (collide(this,goal))
		{
			level ++;
			s_win.play();
			makeLevel(level);
		}
		
		this.x += this.hspeed;
		this.y += this.vspeed;
		
		if (this.y > c_height)
		{
			this.die();
		}
	}
	
	this.ev_draw = function()
	{
		context.strokeStyle = "#9922ff";
		
		if (this.upside)
		{	
			context.strokeRect(this.x - 8,this.y - 4, 16, 12);
			
			context.strokeRect(this.x - 7,this.y - 8,2,2);
			context.strokeRect(this.x + 5,this.y - 8,2,2);
			
			context.strokeRect(this.x - 5,this.y + 2,3,3);
			context.strokeRect(this.x + 2,this.y + 2,3,3);
		}
		else
		{
			context.strokeRect(this.x - 8,this.y - 8, 16, 12);
			context.strokeRect(this.x - 7,this.y + 6,2,2);
			context.strokeRect(this.x + 5,this.y + 6,2,2);
			context.strokeRect(this.x - 5,this.y - 4,3,3);
			context.strokeRect(this.x + 2,this.y - 4,3,3);
		}
	};
}

function Block(x,y)
{
	this.x = x;
	this.y = y;
	this.h = 32;
	this.w = 32;
	
	this.dotNum = 2 + (Math.floor(Math.random() * 3));
	this.dotSize = [0,0,0,0,0];
	this.dotX = [0,0,0,0,0];
	this.dotY =[0,0,0,0,0];

	for (c = 0; c < this.dotNum; c ++)
	{
		this.dotSize[c] = 2 + (Math.floor(Math.random() * 4));
		var r = this.dotSize[c];
		this.dotX[c] = r + Math.floor(Math.random() * (32 - (r*2)));
		this.dotY[c] = r + Math.floor(Math.random() * (32 - (r*2)));
	}

	this.ev_draw = function()
	{
		context.fillStyle = "#77eebb";
		context.fillRect(this.x - 16,this.y - 16, 32, 32);
		context.fillStyle = "#33aa88";
		for (c = 0; c < this.dotNum; c ++)
		{
			context.beginPath();
			context.arc(this.x - 16 + this.dotX[c],this.y - 16 + this.dotY[c],this.dotSize[c],0,2*Math.PI);
			context.fill();
		}
	}
}

function Spike(x,y)
{
	this.x = x;
	this.y = y;
	this.h = 32;
	this.w = 32;
	this.ev_draw = function()
	{
		context.fillStyle = "#ee1111";
		context.fillRect(this.x - 16,this.y - 16, 32, 32);
		context.strokeStyle = "#990101";
		context.moveTo(this.x, this.y - 16);
		context.lineTo(this.x - 16, this.y);
		context.lineTo(this.x, this.y + 16);
		context.lineTo(this.x + 16, this.y);
		context.lineTo(this.x, this.y - 16);
		context.stroke();

	}
}

function Goal(x,y)
{
		this.x = x;
		this.y = y;
		this.h = 32;
		this.w = 32;
		this.ev_draw = function()
		{
			context.fillStyle = "#6655ee";
			context.fillRect(this.x - 16,this.y - 16, 32, 32);
			context.fillStyle = "#3311bb";
			
			for (f = 0; f < 4; f++)
			{
				for(b = 0; b < 4; b++)
				{
					if (isOdd(f + b)) context.fillRect(this.x - 16 + (8 * f),this.y - 16 + (8 * b),8,8);
				}
			}
		}
}

function Text(x,y)
{
	switch(level)
	{
		case 1: this.text = "Don't use the arrow keys to move.";
		break;
		case 2: this.text = "Touch a red block to win.";
		break;
		case 3: this.text = "The laws of physics in this world are as they are in any other platform game.";
		break;
		case 4: this.text = "You can detach from the bottom of a block by hitting the down key.";
		break;
		case 5: this.text = "Here's an easy one for you.";
		break;
		case 6: this.text = "Two words; invisible blocks.";
		break;
		case 7: this.text = "You should probably just give up now.";
		break;
		case 8: this.text = "This is gonna' be a tricky one.";
		break;
		case 9: this.text = "Shoot, I left the impossible one in the game. You'll have to die 100 times for an skip.";
		break;
		case 10: this.text = "Forget everything you've just learned.";
		break;
		case 11: this.text = "You never want to go in blind.";
		break;
		case 12: this.text = "This one is... similar to the last one.";
		break;
		case 13: this.text = "This isn't pointless...";
		break;
		case 14: this.text = "See the hint for level #7";
		break;
		case 15: this.text = "Just one more level after this one.";
		break;
		case 16: this.text = "This isn't the end. I won't thank you for playing. Nothing in this game was made by Snail_Man.";
		break;
		default: this.text = "";
		break;
	}
	this.x = x;
	this.y = y;
	this.ev_draw = function()
	{
		context.fillStyle = "#efef67";
		if (level != 16) context.font = "italic 200 18px Times, sans-serif";
		else
		context.font = "italic 200 16px Times, sans-serif";
		context.fillText(this.text,this.x,this.y);
	}
}
//-----------------------------
var isOdd = function(num)
{
	var ret = true;
	if ((num / 2) == Math.round(num / 2)) ret = false;
	return(ret);
}

var makeLevel = function(num)
{
	var f = 0;
	switch(num)
	{
		case 1: f = level1;
		break;
		case 2: f = level2;
		break;
		case 3: f = level3;
		break;
		case 4: f = level4;
		break;
		case 5: f = level5;
		break;
		case 6: f = level6;
		break;
		case 7: f = level7;
		break;
		case 8: f = level8;
		break;
		case 9: f = level9;
		break;
		case 10: f = level10;
		break;
		case 11: f = level11;
		break;
		case 12: f = level12;
		break;
		case 13: f = level13;
		break;
		case 14: f = level14;
		break;
		case 15: f = level15;
		break;
		case 16: f = end;
		break;
	}
	
	kp_left = false;
	kp_right = false;
	kp_up = false;
	kp_down = false;

	blockNum = 0;
	spikeNum = 0;
	for( i = 0; i < 20; i ++)
	{
		for(j = 0; j < 15; j ++)
		{
			switch(f[j][i])
			{
				case 0:
				break;
				case 1: 
				you = new Player(i * 32 + 16,j * 32 + 16);
				break;
				case 2:
				blockList[blockNum] = new Block(i * 32 + 16,j * 32 + 16);
				blockNum ++;
				break;
				case 3:
				spikeList[spikeNum] = new Spike(i * 32 + 16,j * 32 + 16);
				spikeNum ++;
				break;
				case 4:
				goal = new Goal(i * 32 + 16,j * 32 + 16);
				break;
				case 5: 
				text = new Text(i * 32 + 16,j * 32 + 16);
				break;
			}
		}
	}
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

var collide = function(object1,object2)
{
			var ret = false;
			var bX1 = object1.x - (object1.w / 2);
			var bY1 = object1.y - (object1.h / 2);
			var bX2 = object1.x + (object1.w / 2);
			var bY2 = object1.y + (object1.h / 2);
			
			var pX1 = object2.x - (object2.w / 2);
			var pY1 = object2.y - (object2.h / 2);
			var pX2 = object2.x + (object2.w / 2);
			var pY2 = object2.y + (object2.h / 2);
			
			if ((((clamp(bX1,pX1,bX2) == pX1) || (clamp(bX1,pX2,bX2) == pX2))
			&& ((clamp(bY1,pY1,bY2) == pY1) || (clamp(bY1,pY2,bY2) == pY2)))
				||
			 (((clamp(pX1,bX1,pX2) == bX1) || (clamp(pX1,bX2,pX2) == bX2))
			&& ((clamp(pY1,bY1,pY2) == bY1) || (clamp(pY1,bY2,pY2) == bY2))))

			{
			//collision
			ret = true;
			}
			return(ret);
}

var collide_point = function(x,y,object)
{
			var ret = false;
			var oX1 = object.x - (object.w / 2);
			var oY1 = object.y - (object.h / 2);
			var oX2 = object.x + (object.w / 2);
			var oY2 = object.y + (object.h / 2);
			
			
			if (clamp(oX1,x,oX2) == x && clamp(oY1,y,oY2) == y)
			{
			//collision
			ret = true;
			}
			return(ret);
}

var clamp = function(min,mid,max)
{
	var ret = mid;
	if (mid < min) ret = min;
	if (mid > max) ret = max;
	return(ret);
}

var Step = function()
{
	you.ev_step();
};

var Draw = function()
{
    context.fillStyle = "#222";
    context.fillRect(0 ,0 ,c_width,c_height);
	for(i = 0; i < blockNum; i++)
	{
		blockList[i].ev_draw();
	}
	for(i = 0; i < spikeNum; i++)
	{
		spikeList[i].ev_draw();
	}
	you.ev_draw();
	goal.ev_draw();
	text.ev_draw();
};

var Update = function()
{
    Step();
    Draw();
};

makeLevel(1);
takeInput();
setInterval(Update,1000 / fps);