var canvas = document.getElementById("c");
var inventory = document.getElementById("inventory");
canvas.addEventListener('mousedown', function(e) {Click(canvas, e);});
canvas.addEventListener('mousemove', function(e) {mouseUpdate(canvas, e);});
inventory.addEventListener('mousedown', function(e) {iClick(inventory, e);});
inventory.addEventListener('mousemove', function(e) {mouseUpdate_i(inventory, e);});
var context = canvas.getContext("2d");
var icontext = inventory.getContext("2d");
var c_width = 640;
var c_height = 480;
var lipstick = 0;
var penny = 0;
var cheese = 0;
var key = 0;
var tape = 0;
var water = true;
var security = true;
var iHighlight = -1;

var unlock2 = false;
var unlock8 = false;
var rat = true;
var unlock17 = false;
var sparkp = 0;
var spark = 0;

var popup = false;
var popup_text = "";
var popup_x = 128;
var popup_y = 128;
var popup_w = 384;
var popup_h = 224;

var fade = 0;
var roomfrom = 1;


var visited = {};
for (var i = 1; i<26; ++i)
{
	visited[i] = false;
}
visited[1] = true;

var room = 1;
var names = ["",
"Atrium",
"Restrooms", //Men's is closed
"Main Hall",
"Utility Closet",//turn off fountain
"Sears & Robuck",
"Dillard's",
"Kohl's",
"JC Penny", //need penny
"AC Vent",
"Information",

"Radio Shack", //Electrical Tape   /NOCAM
"Beauty Counter", //Lipstick   /NOCAM
"Skylight",
"Fountain",//penny  /NOCAM
"Employees Only",
"Changing Rooms",
"Electrical",//Rats gnawing on the wires
"Security Office", //turn off cameras
"Goody's",
"AC Room",

"Pretzel Cart",
"Service Hallway",
"Kid's Area",
"Food Court", //cheese   /NOCAM
"The Heart of The Mall"
];

var show_popup = function(m)
{
	popup = true;
	popup_text = m;
	update();
}

var draw_dot = function(x,y)
{
	context.beginPath();
	context.fillStyle = "red";
	context.arc(x, y, 3, 0, 2 * Math.PI);
	context.fill();
}

var get_goto = function(xx,yy,r)
{
if (r == 1)
{
	if ((xx >= 115 && xx < 247 && yy >= 3 && yy < 123))
	{
		return (10);
	}
	if ((xx >= 267 && xx < 417 && yy >= 3 && yy < 123))
	{
		return (19);
	}
	if ((xx >= 507 && xx < 585 && yy >= 236 && yy < 289) || (xx >= 563 && xx < 656 && yy >= 177 && yy < 262) || (xx >= 514 && xx < 651 && yy >= 46 && yy < 179))
	{
		return (3);
	}
	if ((xx >= 0 && xx < 136 && yy >= 140 && yy < 355))
	{
		return (21);
	}
	}
	if (r == 2)
	{
	if ((xx >= -18 && xx < 179 && yy >= 333 && yy < 489))
	{
		return (21);
	}
	if ((xx >= 547 && xx < 670 && yy >= 78 && yy < 376))
	{
		return (8);
	}
	if ((xx >= 153 && xx < 287 && yy >= 30 && yy < 298))
	{
		if (unlock2)
			return (6);
		else
			return (-1);
	}
	}
	if (r == 3)
	{
	if ((xx >= -10 && xx < 136 && yy >= 44 && yy < 223))
	{
		return (11)
	}
	if ((xx >= 196 && xx < 421 && yy >= 14 && yy < 215))
	{
		return (14)
	}
	if ((xx >= 498 && xx < 577 && yy >= 44 && yy < 212))
	{
		return (15)
	}
	if ((xx >= 586 && xx < 658 && yy >= 112 && yy < 236))
	{
		return (20)
	}
	}
	if (r == 4)
	{
	if ((xx >= 175 && xx < 312 && yy >= 115 && yy < 338))
	{
		return (15)
	}
	}
	if (r == 5)
	{
	if ((xx >= 1 && xx < 219 && yy >= 346 && yy < 493))
	{
		return (23)
	}
	if ((xx >= 372 && xx < 636 && yy >= 347 && yy < 485))
	{
		return (10)
	}
	}
	if (r == 6)
	{
	if ((xx >= -12 && xx < 68 && yy >= 258 && yy < 409))
	{
		return (2)
	}
	if ((xx >= 113 && xx < 229 && yy >= 366 && yy < 426))
	{
		return (4)
	}
	if ((xx >= 575 && xx < 682 && yy >= 238 && yy < 371))
	{
		return (8)
	}
	if ((xx >= 82 && xx < 213 && yy >= -3 && yy < 116))
	{
		return (17)
	}
	}
	if (r == 7)
	{
	if ((xx >= 529 && xx < 639 && yy >= 132 && yy < 367))
	{
		return (11)
	}
	if ((xx >= -7 && xx < 221 && yy >= 358 && yy < 494))
	{
		return (21)
	}
	if ((xx >= 407 && xx < 525 && yy >= 133 && yy < 360))
	{
		return (22)
	}
	}
	if (r == 8)
	{
	if ((xx >= -27 && xx < 73 && yy >= 175 && yy < 366))
	{
		if (unlock8)
			return (2);
		else
			return(-1);
	}
	if ((xx >= 518 && xx < 672 && yy >= 322 && yy < 492))
	{
		return (9)
	}
	}
	if (r == 9)
	{
	if ((xx >= 249 && xx < 405 && yy >= 36 && yy < 196))
	{
		return (20)
	}
	if ((xx >= 83 && xx < 211 && yy >= 39 && yy < 384))
	{
		return (22)
	}
	if ((xx >= 436 && xx < 532 && yy >= 43 && yy < 383))
	{
		return (8)
	}
	}
	if (r == 10)
	{
	if ((xx >= 474 && xx < 651 && yy >= 308 && yy < 465))
	{
		return (1)
	}
	if ((xx >= 7 && xx < 91 && yy >= 149 && yy < 408))
	{
		return (5)
	}
	}
	if (r == 11)
	{
	if ((xx >= 2 && xx < 101 && yy >= 80 && yy < 238))
	{
		return (13)
	}
	if ((xx >= 494 && xx < 689 && yy >= 363 && yy < 493))
	{
		return (23)
	}
	if ((xx >= -18 && xx < 174 && yy >= 368 && yy < 487))
	{
		return (24)
	}
	if ((xx >= 572 && xx < 658 && yy >= 118 && yy < 300))
	{
		return (7)
	}
	}
	if (r == 12)
	{
	if ((xx >= 14 && xx < 100 && yy >= 10 && yy < 264))
	{
		return (16)
	}
	if ((xx >= 182 && xx < 294 && yy >= -6 && yy < 143))
	{
		return (4)
	}
	}
	if (r == 13)
	{
	if ((xx >= 519 && xx < 668 && yy >= 174 && yy < 336))
	{
		return (18)
	}
	if ((xx >= 151 && xx < 247 && yy >= 192 && yy < 267))
	{
		return (20)
	}
	}
	if (r == 14)
	{
	if ((xx >= 94 && xx < 418 && yy >= -17 && yy < 111))
	{
		return (23)
	}
	}
	if (r == 15)
	{
	if ((xx >= 176 && xx < 358 && yy >= 68 && yy < 380))
	{
		return (14)
	}
	if ((xx >= 3 && xx < 144 && yy >= 146 && yy < 358))
	{
		return (3)
	}
	if ((xx >= 413 && xx < 623 && yy >= 68 && yy < 376))
	{
		return (4)
	}
	}
	if (r == 16)
	{
	if ((xx >= 521 && xx < 625 && yy >= 44 && yy < 457))
	{
		return (1)
	}
	if ((xx >= -12 && xx < 196 && yy >= 164 && yy < 437))
	{
		return (12)
	}
	if ((xx >= 225 && xx < 416 && yy >= 42 && yy < 343))
	{
		return (19)
	}
	}
	if (r == 17)
	{
	if ((xx >= 4 && xx < 113 && yy >= 50 && yy < 416))
	{
		return (6)
	}
	if ((xx >= 539 && xx < 648 && yy >= 50 && yy < 405))
	{
		return (5)
	}
	if ((xx >= 250 && xx < 425 && yy >= -5 && yy < 238))
	{
		if (unlock17)
			return (25)
		else
			return (-1);
	}
	}
	if (r == 18)
	{
	if ((xx >= 477 && xx < 637 && yy >= 355 && yy < 480))
	{
		return (13)
	}
	if ((xx >= -10 && xx < 82 && yy >= 103 && yy < 336))
	{
		return (5)
	}
	}
	if (r == 19)
	{
	if ((xx >= 332 && xx < 456 && yy >= 282 && yy < 379))
	{
		return (16)
	}
	if ((xx >= 2 && xx < 169 && yy >= 91 && yy < 450))
	{
		return (1)
	}
	}
	if (r == 20)
	{
	if ((xx >= 57 && xx < 100 && yy >= 301 && yy < 327) || (xx >= 11 && xx < 78 && yy >= 303 && yy < 360) || (xx >= 10 && xx < 124 && yy >= 162 && yy < 312))
	{
		return (3)
	}
	if ((xx >= 146 && xx < 197 && yy >= 331 && yy < 385) || (xx >= 95 && xx < 213 && yy >= 367 && yy < 416) || (xx >= 185 && xx < 337 && yy >= 326 && yy < 425))
	{
		return (7)
	}
	if ((xx >= 460 && xx < 629 && yy >= 123 && yy < 212))
	{
		return (9)
	}
	}
	if (r == 21)
	{
	if ((xx >= 531 && xx < 655 && yy >= 151 && yy < 330))
	{
		return (1)
	}
	if ((xx >= -5 && xx < 91 && yy >= 4 && yy < 180))
	{
		return (7)
	}
	}
	if (r == 22)
	{
	if ((xx >= 375 && xx < 402 && yy >= 109 && yy < 190) || (xx >= 384 && xx < 438 && yy >= 64 && yy < 246))
	{
		return (7)
	}
	if ((xx >= 199 && xx < 246 && yy >= 81 && yy < 244))
	{
		return (18)
	}
	if ((xx >= 282 && xx < 351 && yy >= 42 && yy < 142))
	{
		return (4)
	}
	if ((xx >= 36 && xx < 197 && yy >=212  && yy < 399))
	{
		return (9)
	}
	}
	if (r == 23)
	{
	if ((xx >= 513 && xx < 586 && yy >= 134 && yy < 180) || (xx >= 452 && xx < 618 && yy >= -8 && yy < 155))
	{
		return (11)
	}
	if ((xx >= 280 && xx < 582 && yy >= 315 && yy < 496))
	{
		return (14)
	}
	if ((xx >= 72 && xx < 151 && yy >= 139 && yy < 177) || (xx >= 36 && xx < 209 && yy >= -18 && yy < 154))
	{
		return (12)
	}
	}
	if (r == 24)
	{
	if ((xx >= 506 && xx < 650 && yy >= 331 && yy < 483))
	{
		return (19)
	}
	if ((xx >= 150 && xx < 327 && yy >= 58 && yy < 261))
	{
		return (10)
	}
	if ((xx >= 138 && xx < 425 && yy >= 345 && yy < 488))
	{
		return (11)
	}
	if ((xx >= -12 && xx < 138 && yy >= 66 && yy < 277))
	{
		return (21)
	}
	}
	if (r == 25)
	{
	if ((xx >= 9 && xx < 257 && yy >= 334 && yy < 481))
	{
		return (4)
	}
	}
	return 0;
}

var Click = function(canvas, event)
{
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	
	if (fade == 0)
	{
		if (!popup)
		{
			if (iHighlight == -1)
			{
				var r = get_goto(x,y,room);
				if (r>0)
				{
					roomfrom = room;
					room=r;
					visited[r] = true;
					fade = 1;
				}
				else
				{
					if (room == 4)
					{
						xx = 160;
						yy = 64;
						if (x>xx && y>yy && x<xx+48 && y<yy+48)
						{
							water = false;
							Draw();
						}
					}
					else
					if (room == 11)
					{
						xx = 352;
						yy = 288;
						if (tape==0)
						if (!security)
						if (x>xx && y>yy && x<xx+48 && y<yy+48)
						{
							tape = 1;
							Draw();
						}
					}
					else
					if (room == 12)
					{
						xx = 448;
						yy = 320;
						if (lipstick==0)
						if (!security)
						if (x>xx && y>yy && x<xx+48 && y<yy+48)
						{
							lipstick = 1;
							Draw();
						}
					}
					else
					if (room == 13)
					{
						xx = 96;
						yy = 288;
						if (key==0)
						if (x>xx && y>yy && x<xx+48 && y<yy+48)
						{
							key = 1;
							Draw();
						}
					}
					else
					if (room == 14)
					{
						xx = 32;
						yy = 352;
						if (penny==0)
						{
							if (!water)
							if (x>xx && y>yy && x<xx+48 && y<yy+48)
							{
								penny = 1;
								Draw();
							}
						}
					}
					else
					if (room == 24)
					{
						xx = 448;
						yy = 224;
						if (cheese==0)
						if (!security)
						if (x>xx && y>yy && x<xx+48 && y<yy+48)
						{
							cheese = 1;
							Draw();
						}
					}
					
				}
				
			}
			else
			{
				if (room == 18 && iHighlight == 0)
				{
					if (x > 289 && y > 177 && x < 367 && y < 233)
					{
						security = false;
						key = 2;
						Draw();
					}
				}
				else
				if (room == 8 && iHighlight == 4)
				{
					if (x > 0 && y > 230 && x < 90 && y < 300)
					{
						unlock8 = true;
						penny = 2;
					}
				}
				else
				if (room == 17)
				{
					if (iHighlight == 2 && rat && x > 220 && y > 185 && x < 510 && y < 290)
					{
						rat = false;
						cheese = 2;
					}
					else
					if (iHighlight == 3 && !rat && x > 220 && y > 185 && x < 510 && y < 290)
					{
						unlock17 = true;
						tape = 2;
					}
				}
			}
			iHighlight = -1;
		}
		else
		{
			if (x>=popup_x && y >= popup_y && x<popup_x+popup_w && y<popup_y+popup_h)
			{
				popup = false;
			}
		}
	}
	mouseUpdate(canvas, event);
	if (fade == 0)
		Update();
};

var iClick = function(icanvas, event)
{
	const rect = icanvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	
	iHighlight = -1;
	
	var i_start = 336;	
	if (x > i_start && x < 640-64)
	{
		if (x<i_start+48*1)
		{
			if (key == 1)
				iHighlight = 0;
		}
		else
		if (x<i_start+48*2)
		{
			if (lipstick == 1)
			{
				if (!unlock2)
				{
					unlock2=true;
					Draw();
				}
			}
		}
		else
		if (x<i_start+48*3)
		{
			if (cheese == 1)
				iHighlight = 2;
		}
		else
		if (x<i_start+48*4)
		{
			if (tape == 1)
				iHighlight = 3;
		}
		else
		{
			if (penny == 1)
				iHighlight = 4;
		}
	}
	Inventory_Draw();
}

var Draw = function()
{
	var postfix = "";
	if (room == 14 && water == false) postfix = "_off";
	if (room == 18 && security == false) postfix = "_off";
	var img = document.getElementById("room"+room+postfix);
    context.drawImage(img, 0, 0)
	if (fade > 0 && fade <= 6)
	{
		var imp = document.getElementById("room"+roomfrom);
		context.drawImage(imp, 0, 0)
	}		
	if (fade == 0)
		draw_anim();
	var oimg = null;
	var xx = 0;
	var yy = 0;
	
	//valve (160/64)
	//tape (352/288)
	//lipstick (448/320)
	//penny (32/352)
	//key (96/288)
	//cheese (448/224)
	
	if (room == 4)
	{
		xx = 160;
		yy = 64;
		if (water)
			oimg = document.getElementById("valve_on");
		else
			oimg = document.getElementById("valve_off");
	}
	else
	if (room == 11)
	{
		xx = 352;
		yy = 288;
		if (tape ==0)
		oimg = document.getElementById("tape");
	
		if (security)
		{
			draw_dot(381,25);
		}
	}
	else
	if (room == 12)
	{
		xx = 448;
		yy = 320;
		if (lipstick==0)
		oimg = document.getElementById("lipstick");
	
		if (security)
		{
			draw_dot(627,3);
		}
	}
	else
	if (room == 13)
	{
		xx = 96;
		yy = 288;
		if (key==0)
		oimg = document.getElementById("key");
	}
	else
	if (room == 14)
	{
		xx = 32;
		yy = 352;
		if (penny==0)
		{
			if (water)
				oimg = document.getElementById("penny_u");
			else
				oimg = document.getElementById("penny");
		}
	}
	else
	if (room == 24)
	{
		xx = 448;
		yy = 224;
		if (cheese==0)
		oimg = document.getElementById("cheese");
	
		if (security)
		{
			draw_dot(460,48);
		}
	}
	else
	if (room == 8)
	{
		xx=0;
		yy=240;
		if (!unlock8)
		{
			oimg = document.getElementById("customersonly");
		}
	}
	else
	if (room == 2)
	{
		xx=185;
		yy=85;
		if (!unlock2)
		{
			oimg = document.getElementById("noboys");
		}
	}
	
	if (oimg != null)
	{
		context.drawImage(oimg, xx, yy)
	}
	document.getElementById("room_number").innerHTML = room;
	document.getElementById("room_title").innerHTML = names[room];
	Inventory_Draw();
	Popup_Draw();
};

var Update = function()
{
    Draw();
};

var Inventory_Draw = function()
{
	//draw bg
	var img = document.getElementById("i_inventory");
	icontext.drawImage(img, 0, 0)
	
	//draw hilight
	var i_start = 336;
	if (iHighlight != -1)
	{
		icontext.beginPath();
		icontext.fillStyle = "#ffffdd";
		icontext.arc(i_start+24+(48*iHighlight), 32, 20, 0, 2 * Math.PI);
		icontext.fill();
	}
	
	//draw objects
		
	if (key == 1)
	{
		var img_key = document.getElementById("i_key");
		icontext.drawImage(img_key, i_start, 8)
	}
	if (lipstick == 1)
	{
		var img_lip = document.getElementById("lipstick");
		icontext.drawImage(img_lip, i_start+48, 8)
	}
	if (cheese == 1)
	{
		var img_che = document.getElementById("cheese");
		icontext.drawImage(img_che, i_start+48*2, 8)
	}
	if (tape == 1)
	{
		var img_tap = document.getElementById("tape");
		icontext.drawImage(img_tap, i_start+48*3, 8)
	}
	if (penny == 1)
	{
		var img_pen = document.getElementById("i_penny");
		icontext.drawImage(img_pen, i_start+48*4, 8)
	}
	
	//draw_map
	var count = 1;
	for (var yy=0; yy<5; ++yy)
	{
		for (var xx=0; xx<5; ++xx)
		{
			if (room == count) 
			{
				if (fade == 0 || fade >6)
				{
					icontext.fillStyle = "cyan";
				}
				else
				{
					icontext.fillStyle = "black";
				}
			}
			else
			if (visited[count])
			{
				icontext.fillStyle = "blue";
			}
			else
			{
				icontext.fillStyle = "black";
			}
			
			icontext.beginPath();
			icontext.rect(640-64+2+((xx)*12),2+(yy*12),10,10);
			icontext.fill();
			count++;
		}
	}
};

var Popup_Draw = function()
{
	if (popup)
	{
		context.beginPath();
		context.fillStyle = "black";
		context.strokeStyle = "white";
		context.rect(popup_x,popup_y,popup_w,popup_h,0);
		context.fill();
		context.stroke();
	}
}

var mouseUpdate = function(canvas, e)
{
	var rect = canvas.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
	
	if (fade == 0)
	{
		if (!popup)
		{
			if (iHighlight == -1)
			{
				var c = get_goto(x,y,room);
				
				if (room == 4)
				{
					xx = 160;
					yy = 64;
					if (water)
					if (x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						c=-2;
					}
				}
				else
				if (room == 11)
				{
					xx = 352;
					yy = 288;
					if (tape==0)
					if (x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						if (!security)
						c=-2;
						else
						c=-1;
					}
				}
				else
				if (room == 12)
				{
					xx = 448;
					yy = 320;
					if (lipstick==0)
					if (x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						if (!security)
						c=-2;
						else
						c=-1;
					}
				}
				else
				if (room == 13)
				{
					xx = 96;
					yy = 288;
					if (key==0)
					if (x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						c=-2;
					}
				}
				else
				if (room == 14)
				{
					xx = 32;
					yy = 352;
					if (penny==0 && x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						if (!water)
						{
							c=-2;
						}
						else
						{
							c = -1;
						}
					}
				}
				else
				if (room == 24)
				{
					xx = 448;
					yy = 224;
					if (cheese==0)
					if (x>xx && y>yy && x<xx+48 && y<yy+48)
					{
						if (!security)
						c=-2;
						else
						c = -1;
					}
				}
				else
				if (room == 18)
				{
					if (security)
					if (x > 289 && y > 177 && x < 367 && y < 233)
					{
						if (key==1)
						c=-2;
						else
						c = -1;
					}
				}

				if (c==0)
					canvas.style="cursor:url('mall/c_arrow.png'), default;";
				else if (c > 0)
					canvas.style="cursor:url('mall/c_go.png'), w-resize;";
				else if (c == -1)
					canvas.style="cursor:url('mall/c_no.png'), not-allowed;";
				else if (c == -2)
					canvas.style="cursor:url('mall/c_get.png'), grab"; 
			}
			else
			var pf = "";
			if (iHighlight == 0)
			{
				if (room==18 && x > 289 && y > 177 && x < 367 && y < 233)
				{
					pf = "_light";
				}
				canvas.style="cursor:url('mall/key_icon"+pf+".png') 24 24, grab";
			}
			else
			if (iHighlight == 1)
			{
				canvas.style="cursor:url('mall/lipstick"+pf+".png') 24 24, grab";
			}
			else
			if (iHighlight == 2)
			{
				if (rat && x > 220 && y > 185 && x < 510 && y < 290) pf = "_light";
				canvas.style="cursor:url('mall/cheese"+pf+".png') 24 24, grab";
			}
			else
			if (iHighlight == 3)
			{
				if (!rat && x > 220 && y > 185 && x < 510 && y < 290) pf = "_light";
				canvas.style="cursor:url('mall/tape"+pf+".png') 24 24, grab";
			}
			else
			if (iHighlight == 4)
			{
				if (x > 0 && y > 230 && x < 70 && y < 300) pf = "_light";
				canvas.style="cursor:url('mall/penny_icon"+pf+".png') 24 24, grab";
			}
		}
		else
		{
			if (x>=popup_x && y >= popup_y && x<popup_x+popup_w && y<popup_y+popup_h)
			{
				console.log("no");
				canvas.style="cursor:url('mall/c_get.png'), grab"; 
			}
			else
			{
				console.log("go");
				canvas.style="cursor:url('mall/c_no.png'), not-allowed;";
			}
		}
	}
	else
	{
		canvas.style="cursor:none;";
	}
};

var mouseUpdate_i = function(icanvas, e)
{
	var rect = icanvas.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
	var c = 0;
	
	var i_start = 336;	
	if (x > i_start && x < 640-64)
	{
		if (x<i_start+48*1)
		{
			if (key == 1)
				c=1;
		}
		else
		if (x<i_start+48*2)
		{
			if (lipstick == 1)
				c=1;
		}
		else
		if (x<i_start+48*3)
		{
			if (cheese == 1)
				c=1;
		}
		else
		if (x<i_start+48*4)
		{
			if (tape == 1)
				c=1;
		}
		else
		{
			if (penny == 1)
				c=1;
		}
	}

	if (c==0)
		inventory.style="cursor:url('mall/c_arrow.png'), default;";
	else
		inventory.style="cursor:url('mall/c_get.png'), grab"; 
};

var draw_anim = function(canvas, e)
{
	if (fade == 0)
	{
		if (room == 17)
		{
				if (!unlock17)
				{
					sparkp = spark;
					while(sparkp == spark)
					{
						spark = Math.floor(Math.random() * 4);
					}
					var img = document.getElementById("room17n");
					var sparki = document.getElementById("spark"+spark);
					context.drawImage(img, 0, 0);
					context.drawImage(sparki, 292, 197);
					if (rat)
					{
						var rati = document.getElementById("rat");
						context.drawImage(rati, 275+Math.floor(Math.random()*3), 200+Math.floor(Math.random()*3));
					}
				}
		}
	}
	else
	{
		if (fade < 13)
		{
			Draw();
			Inventory_Draw();
			var f = fade;
			if (fade >6)
			{
				f=13-fade;
			}
			console.log(f);
			var fd = document.getElementById("fade"+f);
			for (var fx = 0; fx < 640; fx += 80)
			{
				for (var fy = 0; fy < 480; fy += 60)
				{
					context.drawImage(fd,fx,fy);
				}
				icontext.drawImage(fd,fx,0);
			}
			fade += 1;
		}
		else
		{
			fade = 0;
			Update();
		}
	}
}

setInterval(draw_anim,100);

Update();