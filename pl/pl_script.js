var fps = 30;
var scr_width = 32;
var scr_height = 24;

var c_grass = "#2f4f2f";
var c_grass_d = "#0a1f0a";

var sightRange = 12;
var yellRange = 18;

var rm_width = 64;
var rm_height = 128;

var screen = new Array();
var screen_color = new Array();
var display = document.getElementById("screen");
var murder = false;
var game_level = 0;

var game_screen = 0;//SCREEN 0 is menu, 1 is between, 2 is game, 3 is win, 

var game_item = -1;
var game_item_pick = false;
var game_item_lethal = false;
var game_item_fence = false;
var game_item_level = 0;
var game_item_stat_attack = 1;
var game_item_stat_strength = 1;
var game_item_stat_dodge = 1;
var game_item_stat_armor = 1;

var game_potion = -1;
var game_potion_level = 0;

var keyPress = -2;
var xView = 0;
var yView = 0;
var map = new Array();
for (var xx = 0; xx < rm_width; xx++)
{
	if (!map[xx]) map[xx] = [];
	for (var yy = 0; yy < rm_height; yy++)
	{
		map[xx][yy] = 0;
	}
}

//Output
var output = document.getElementById("output");
var OPNum = 10;
var OP = new Array();
for (var i = 0; i < OPNum; i++)
{
	OP[i] = "";
}

//Init objLists
var player = 0;
var goal = 0;

var wallList = new Array();
var wallNum = 0;

var treeList = new Array();
var treeNum = 0;

var npcList = new Array();
var npcNum = 0;

var particleList = new Array();
var particleNum = 0;

var waterList = new Array();
var waterNum = 0;

var floorList = new Array();
var floorNum = 0;

var houseList = new Array();
var houseNum = 0;

var itemList = new Array();
var itemNum = 0;

var potionList = new Array();
var potionNum = 0;

/*
var s_mus = new Audio("music.mp3");
s_mus.addEventListener('ended', function() {
this.currentTime = 0;
this.play();
}, false);//Music
*/

function Player(x,y)
{
	this.x = x;
	this.y = y;
	this.col = "#564012" + "; font-weight: 900;";
	this.proxList = new Array();
	this.proxNum = 0;
	this.tree = false;
	this.x_last = x;
	this.y_last = y;
	this.name = "You";
	this.dead = false;

	this.item = -1;//None;
	this.potion = -1;
	this.potionDur = -1;
	this.p_att = 1;
	this.p_str = 1;
	this.p_dge = 1;
	this.p_arm = 1;
	
	this.bleed = 0;
	
	this.stat_hp = 25;
	this.stat_attack = 10;
	this.stat_strength = 5;//Max hit
	this.stat_dodge = 3;//Dodge chance //Counter attack?
	this.stat_armor = 1;//Damage reduction (%/100)
	this.hp = this.stat_hp;
	this.EV_step = function(dir)
	{
		if (!this.dead)
		{
			this.x_last = this.x;
			this.y_last = this.y;
			var go_x = this.x;
			var go_y = this.y;
			switch(dir)
			{
				case 0:
				go_x --;//Left
				break;
				case 1:
				go_x ++;//Right
				break;
				case 2: 
				go_y --;//Up
				break;
				case 3:
				go_y ++;//Down
				break;
				case 4:
				go_x --;//UpLeft
				go_y --;
				break;
				case 5:
				go_x ++;//UpRight
				go_y --;
				break;
				case 6: 
				go_x ++;
				go_y ++;//DownRight
				break;
				case 7:
				go_x --;
				go_y ++;//DownLeft
				break;
				case 8: //Action
				this.EV_interact();
				break;
				case 9: //potion
				if (this.potion != -1)
				{
					output_add("You drink the " + this.potion.name.toLowerCase() + ".");
					var ty = this.potion.type;
					var lv = this.potion.level;
					this.potion = -1;
					switch(ty)
					{
						case 0://str
						this.p_str += 1.5 + (0.25*lv);
						this.potionDur = 10 + (lv*2);
						output_add("Your blood burns, and you feel like you could take on an ox.");
							break;
						case 1://atk
						this.p_att += 2 + (0.5*lv);
						this.potionDur = 10 + (lv*2);
						var str = "fists tighten."
						if (this.item != -1)
						{
							str = "grip tightens on your " + this.item.name.toLowerCase();
						}
						output_add("A tingling sensation floods through your body, and your " + str);
							break;
						case 2://dge
						this.p_dge += 1.5 + (0.25*lv);
						this.p_arm += 1.5 + (0.25*lv);
						this.potionDur = 10 + (lv*2);
						output_add("You feel light on your feet, and your skin numbs to pain.");
							break;
						case 3://hp
						var hhp = (5+irandom(5*(lv+1)))
						if (hhp > (this.stat_hp-this.hp))
						hhp = (this.stat_hp-this.hp);
						this.hp += hhp;
						output_add("You feel warmth in your chest, and you gain " + hhp + "HP.");
							break;
					}	
				}
				break;
				case 10: //item_swap
				
				var item_last = -1;
				if (this.item != -1)
				{
					item_last = this.item;
					this.item = -1;
					output_add("You drop your " + item_last.name.toLowerCase() + ".");
				}
				for (var i = 0; i < itemNum; i ++)
				{
					var o = itemList[i];
					if (Math.abs(o.x -this.x) > 1.5) continue;
					if (Math.abs(o.y -this.y) > 1.5) continue;
					this.item = o;
					this.item.x = -100;
					this.item.y = -100;
					output_add("You pick up the " + this.item.name.toLowerCase() + ".");
					break;
				}
				if (item_last != -1)
				{
					item_last.x=this.x;
					item_last.y=this.y;
				}
					break;
				case 11: //Potion_swap
				var potion_last = -1;
				if (this.potion != -1)
				{
					potion_last = this.potion;
					this.potion = -1;
					output_add("You drop the bottle of " + potion_last.name.toLowerCase() + ".");
				}
				for (var i = 0; i < potionNum; i ++)
				{
					var o = potionList[i];
					if (Math.abs(o.x -this.x) > 1.5) continue;
					if (Math.abs(o.y -this.y) > 1.5) continue;
					this.potion = o;
					this.potion.x = -100;
					this.potion.y = -100;
					output_add("You pick up the bottle of " + this.potion.name.toLowerCase() + ".");
					break;
				}
				
				if (potion_last != -1)
				{
					potion_last.x=this.x;
					potion_last.y=this.y;
				}
				else
				{
				
				}
				break;
			}
			
			if (this.potionDur > -1)
			{
				this.potionDur--;
			}
			else
			{
					this.p_att = 1;
					this.p_str = 1;
					this.p_dge = 1;
					this.p_arm = 1;
			}
			
			var at = -1;
			//Attack
			for (i = 0; i < npcNum; i++)
			{
				var o = npcList[i];
				if (o.x_prev == go_x)
				if (o.y_prev == go_y)
				if (!o.dead)
				if (o.state != 5)
				at = o;
			}
			
			if (at == -1)
			{
				if (canMove(go_x,go_y))
				{
					this.x = go_x;
					this.y = go_y;
				}
				else
				{
					if (this.item != -1)
					if (this.item.fence)
					{
						for (i = 0; i < wallNum; i++)
						{
							var o = wallList[i];
							if (!o.seethru) continue;
							if (o.window) continue;
							if (o.door) continue;
							if (o.x != go_x) continue;
							if (o.y != go_y) continue;
							o.hp -= 1+irandom(this.item.stat_strength-1);
							o.EV_healthcheck();
							output_add("You hit the fence post with your " + (this.item.name).toLowerCase() + ".");
							if (o.hp <= 0)
							output_add("The fence post splinters, leaving a gap large enough for you to squeeze through.");
						}
					}
				}
			}
			else
			{
				attack(player,at,false);
			}
			
			xView = clamp(0,this.x-(scr_width/2),rm_width-(scr_width));
			yView = clamp(0,this.y-(scr_height/2),rm_height-(scr_height));
			
			var test = false;
			for (var i = 0; i < treeNum; i++)
			{
				var t = treeList[i];
				if (this.x == t.x)
				if (this.y == t.y)
				{
					test = true;
					break;
				}
			}
			if (this.tree != test)
			{
				if (test)
				output_add("You crouch down and duck into the stand of trees.");
				else
				output_add("You slip out from the stand of trees.");
				
				
				this.tree = test;
			}
			
			if (this.bleed > 0)
			{
				this.bleed--;
				this.hp -= irandom(2);
				this.EV_healthcheck(true);
				particleList[particleNum] = new Gib(this.x,this.y);
				particleNum++;
			}
			
			this.proxNum = 0;
			this.proxList.length = 0;
			for (var w = 0; w < wallNum; w++)
			{
				var W = wallList[w];
				if (point_distance(this.x,this.y,W.x,W.y) < sightRange)
				{
					this.proxList[this.proxNum] = W;
					this.proxNum++;
				}
			}
		}
		else
		{
			if (dir == 8)
			{
				init();
				game_screen = 1;
			}
		}
	}
	
	this.EV_draw = function()
	{
		if (!this.dead)
		{
			var xx = this.x-xView;
			var yy = this.y-yView;
			var c = this.col;
			
			if (this.tree)
			{
				c = "#405612"
			}
			
			//Lighten surrounding empty tiles
			for (var X = Math.max(xx-sightRange,0); X < Math.min(xx+sightRange,scr_width); X++)
			{
				for (var Y = Math.max(yy-sightRange,0); Y < Math.min(yy+sightRange,scr_height); Y++)
				{
					if (screen[X][Y] != 0)
					continue;
					
					if (this.proxNum == 0)
					{
						if (point_distance(xx,yy,X,Y) < sightRange)
						screen_color[X][Y] = c_grass;
						continue;
					}
					
					
					if (canSee(xx,yy,X,Y,-4,this.proxList,this.proxNum,sightRange))
					{
						screen_color[X][Y] = c_grass;
					}
				}
			}
			
			screen[xx][yy] = 2;//player
			screen_color[xx][yy] = c;
		}
	}
	
	this.EV_healthcheck = function(L)
	{
		
		if (this.hp<=0)
		if (!this.dead)
		{
			this.dead = true;
			
			output_add("");
			
			if (L)
			output_add("You collapsed on the ground, blood pouring from your chest.</br>You looked up at the vast blue sky for one moment, then passed out.</br>You never woke up.</br></br>");
			else
			{
				if (murder)
				output_add("Knocked out, they brought you to jail.</br>You were sentenced to death.</br></br>");
				else
				output_add("Knocked out, you were taken back to Magnolia Plantation.</br>They made sure that you never ran away again.</br></br>");
			}
			
			output_add("Press R to restart");
		}
	}
	
	this.EV_interact = function()
	{
		//door
		for (var i = 0; i < wallNum; i ++)
		{
			var o = wallList[i];
			if (!o.door) continue;
			if (Math.abs(o.x -this.x) > 1.5) continue;
			if (Math.abs(o.y -this.y) > 1.5) continue;
			o.EV_toggle(false);
		}
		
		//goal
		if (Math.abs(goal.x -this.x) < 1.5)
		if (Math.abs(goal.y -this.y) < 1.5)
		{
			var check = true;
			for (var i = 0; i < npcNum; i++)
			{
				var o = npcList[i];
				if (o.dead) continue;
				if ((o.state == 2) || (o.state == 3))
				{
					output_add("You can't sleep now, there are enemies chasing you!");
					check = false;
					break;
				}
			}
			
			if (check)
			{
				game_level ++;
				
				if (game_level < 10)
				game_screen = 1;
				else
				{
					game_screen = 3;
					draw();
				}
				
				if (this.item != -1)
				{
					game_item = this.item.type;
					game_item_pick = this.item.pick;
					game_item_lethal = this.item.lethal;
					game_item_fence = this.item.fence;
					game_item_level = this.item.level;
					game_item_stat_attack = this.item.stat_attack;
					game_item_stat_strength = this.item.stat_strength;
					game_item_stat_dodge = this.item.stat_dodge;
					game_item_stat_armor = this.item.stat_armor;
				}
				else
				{
					game_item = -1;
					game_item_pick = false;
					game_item_lethal = false;
					game_item_fence = false;
					game_item_level = 0;
					game_item_stat_attack = 0;
					game_item_stat_strength = 0;
					game_item_stat_dodge = 0;
					game_item_stat_armor = 0;
				}
				
				if (this.potion != -1)
				{
					game_potion = this.potion.type;
					game_potion_level = this.potion.level;
				}
				else
				{
					game_potion = -1;
					game_potion_level = 0;
				}
				
				keyPress = -2;
				levelClear();
			}
		}
	}
}

function Goal(x,y)
{
	this.x = x;
	this.y = y;
	this.col = "#dddddd";//brick
	this.col_d = "#666666";//dark
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = 20;//wall
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			screen_color[xx][yy] = this.col;
			else
			screen_color[xx][yy] = this.col_d;
		}
	}
}

function House(x,y)
{
	this.x = x;
	this.y = y;
	this.hMap = [];
}

function Wall(x,y)
{
	this.seethru = false;
	this.x = x;
	this.y = y;
	this.col = "#573330";//brick
	this.col_d = "#371310";//dark
	this.solid = true;
	this.door = false;
	this.window = false;
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = 1;//wall
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			screen_color[xx][yy] = this.col;
			else
			screen_color[xx][yy] = this.col_d;
		}
	}
}

function Floor(x,y,type)
{
	this.x = x;
	this.y = y;
	this.type = type;
	if ((type == 0) || (type == 2))//Bridge or floor
	{
		this.col = "#917350";//brown
		this.col_d = "#59452E";//brown
		this.s = 19;
	}
	else//Farmland
	{
		this.col = "#321606";//brown
		this.col_d = "#200901";//brown
		this.s = 21;//Farmland
	}
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = this.s;
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			screen_color[xx][yy] = this.col;
			else
			screen_color[xx][yy] = this.col_d;
		}
	}
}

function Fence(x,y)
{
	this.seethru = true;
	this.x = x;
	this.y = y;
	this.col = "#564027";//brown
	this.col_d = "#362010";//brown
	this.solid = true;
	this.door = false;
	this.window = false;
	this.dead = false;
	this.hp = 5;
	
	this.EV_draw = function()
	{
		if (!this.dead)
		{
			var xx = this.x-xView;
			var yy = this.y-yView;
			if (onScreen(xx,yy))
			{
				screen[xx][yy] = 5;//fence
				if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
				screen_color[xx][yy] = this.col;
				else
				screen_color[xx][yy] = this.col_d;
			}
		}
	}
	
	this.EV_healthcheck = function()
	{
		if (this.hp<=0)
		{
			this.x = -100;
			this.y = -100;
			this.dead = true;
		}
	}
}

function Window(x,y,h)
{
	this.seethru = true;
	this.x = x;
	this.y = y;
	this.col = "#A1E3E3";//brown
	this.col_d = "#356E6E";//brown
	this.solid = true;
	this.door = false;
	this.window = true;
	this.hor = h;
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			if (this.hor)
			screen[xx][yy] = 15;//horizontal
			else
			screen[xx][yy] = 14;//vertical
			
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			screen_color[xx][yy] = this.col;
			else
			screen_color[xx][yy] = this.col_d;
		}
	}
}

function Water(x,y,deep)
{
	this.x = x;
	this.y = y;
	this.col = "#3D7BCC";//brown
	this.col_d = "#153F75";//brown
	this.dcol = "#141790";//brown
	this.dcol_d = "#0b0d45";//brown
	this.deep=deep;
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = 18;
			
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			{
				if (!this.deep)
				screen_color[xx][yy] = this.col;
				else
				screen_color[xx][yy] = this.dcol;
			}
			else
			{
				if (!this.deep)
				screen_color[xx][yy] = this.col_d;
				else
				screen_color[xx][yy] = this.dcol_d;
			}
		}
	}
}

function Tree(x,y)
{
	this.x=x;
	this.y=y;
	this.col_d = "#034000";//green
	this.col = "#136020";//dark
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = 3;//tree
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			screen_color[xx][yy] = this.col;
			else
			screen_color[xx][yy] = this.col_d;
		}
	}
}

function Npc(x,y,type,state)
{
	this.x=x;
	this.y=y;
	this.xBase = x;
	this.yBase = y;
	this.x_prev = x;
	this.y_prev = y;
	this.hostile = true;
	this.type = type;
	this.alert = false;
	this.timer = -1;
	this.koTimer = -1;
	this.col = "#e0a0a0";
	this.col_ko = "#a07070";
	this.proxNum = 0;
	this.proxList = new Array();
	this.state = state;
	this.attacking = false;
	this.dead = false;
	this.bleed = 0;
	
	this.p_att = 1;
	this.p_str = 1;
	this.p_dge = 1;
	this.p_arm = 1;
	
	this.item = -1;
	
	this.viewX = clamp(0,this.x-(scr_width/2),rm_width-(scr_width));
	this.viewY = clamp(0,this.y-(scr_height/2),rm_height-(scr_height));
	
	
	switch(type)
	{
		case 0:
		this.name = "farmhand";
			this.stat_hp = 10;
			this.stat_attack = 6;//Hit change
			this.stat_strength = 2;//mAX hit
			this.stat_dodge = 2;//Dodge chance //Counter attack?
			this.stat_armor = 1;//Damage reduction (%/100)
			
		break;
		case 1:
		this.name = "overseer";
			this.stat_hp = 14;
			this.stat_attack = 7;//Hit change
			this.stat_strength = 3;//mAX hit
			this.stat_dodge = 3;//Dodge chance //Counter attack?
			this.stat_armor = 1;//Damage reduction (%/100)
		break;
		case 2:
		this.name = "policeman";
			this.stat_hp = 18;
			this.stat_attack = 8;//Hit change
			this.stat_strength = 5;//MAX hit
			this.stat_dodge = 4;//Dodge chance //Counter attack?
			this.stat_armor = 1;//Damage reduction (%/100)
		break;
		case 3:
		this.name = "slave catcher";
			this.stat_hp = 20;
			this.stat_attack = 10;//Hit change
			this.stat_strength = 6;//max hit
			this.stat_dodge = 5;//Dodge chance //Counter attack?
			this.stat_armor = 1;//Damage reduction (%/100)
		break;
		case 4: 
		this.name = "slave";
		this.stat_hp = 20;
		this.stat_attack = 8;
		this.stat_strength = 3;
		this.stat_dodge = 3;
		this.stat_armor = 1;
		
		var c1 = (50+irandom(9)).toString();
		var c2 = (30+irandom(9)).toString();
		var c3 = (10+irandom(9)).toString();
		this.col = "#"+c1+c2+c3;//brown
		c1 = (30+irandom(9)).toString();
		c2 = (20+irandom(9)).toString();
		c3 = (10+irandom(9)).toString();
		this.col_ko = "#"+c1+c2+c3;//brown
		
		
		this.hostile = false;
		this.state = 1;
		break;
	}
	this.hp = this.stat_hp;
	
	this.house = -1;
	this.goalX = x;
	this.goalY = y;
	/*
		STATES
		0: Idle
		1: Patrol
		2: Approach
		3: Search
		4: Run
		5: KO
		
		TYPES
		0: Farm Hand
		1: Plantation Owner 
		2: Police Officer
		3: Slave Catcher
	*/	
	this.EV_step = function()
	{
		if (!this.dead)
		{
			if (this.house == -1)
			{
				this.house = instance_nearest(this.x,this.y,houseList);
				var itemRoll = irandom(20);
				if (murder) itemRoll = irandom(14);
				if (itemRoll < game_level + (this.type))
				{
					this.makeItem(this.type);
				}	
			}

			this.attacking = false;
			this.x_prev = this.x;
			this.y_prev = this.y;
			var Step = true;
			var my_sightRange = (sightRange-3) + this.type;
			this.proxNum = 0;
			this.proxList.length = 0;
			this.run = false;
			for (var w = 0; w < wallNum; w++)
			{
				var W = wallList[w];
				if (point_distance(this.x,this.y,W.x,W.y) < sightRange)
				{
					this.proxList[this.proxNum] = W;
					this.proxNum++;
				}
			}
			switch(this.state)
			{
				case 0: //Idle
				if (canSee(player.x,player.y,this.x,this.y,-4,this.proxList,this.proxNum,my_sightRange) && (player.tree != true))
				{
					this.state = 2; //Approach
					this.goalX = player.x;
					this.goalY = player.y;
					if (this.alert)
					{
						output_add("The " + this.name + " sees you, and starts running full tilt in your direction.");
					}
					else
					{
						output_add("The " + this.name + " sees you and begins following you curiously.");
					}
				}
					break;
				case 1: //Patrol
				var golX = -1;
				var golY = -1;
				if (type != 0)
				if (type != 4)
				{
					
				}
				
				if (point_distance(this.x,this.y,this.goalX,this.goalY) < 2)
				{
					this.goalX = clamp(0,this.xBase-(sightRange*1.5) + irandom(sightRange*3),rm_width-1);
					this.goalY = clamp(0,this.yBase-(sightRange*1.5) + irandom(sightRange*3),rm_height-1);
				}
				
				if (!this.alert)
				Step = choose(true,false);
				
				if (this.hostile)
				if (canSee(player.x,player.y,this.x,this.y,-4,this.proxList,this.proxNum,my_sightRange) && (player.tree != true))
				{
					this.state = 2; //Approach
					this.goalX = player.x;
					this.goalY = player.y;
					
					if (this.alert)
					{
						output_add("The " + this.name + " sees you again, and runs at you full tilt.");
					}
					else
					{
						output_add("The " + this.name + " sees you again, and resumes following you.");
					}
				}
					break;
				case 2: //Approach
				if (!this.alert)
				{
					if (point_distance(this.x,this.y,player.x,player.y) < sightRange/2)
					{
						this.alert = true;
						output_add("The " + this.name + " recognizes you, and runs at you full tilt.");
					}
				}
				
				if (!this.alert)
				{
					Step = false;
					this.timer--;
					if (this.timer < 0)
					{
						this.timer = 4-this.type;
						Step = true;
					}
				}
				
				this.goalX = player.x;
				this.goalY = player.y;

				if (!canSee(player.x,player.y,this.x,this.y,-4,this.proxList,this.proxNum,my_sightRange) || (player.tree == true))
				{
					this.timer = -1;
					if (this.alert)
					{
						this.state = 3; //search
						this.timer = 10;
					}
					else
					{
						this.state = 1; //wander
						output_add("Having lost sight of you, the " + this.name + " wanders away.");
						this.goalX = this.x-(this.x-player.x);
						this.goalY = this.y-(this.y-player.y);
					}
				}
				
				if (this.hp < player.stat_strength)
				{
					this.state = 4;//Run
				}
					break;
				case 3: //Search (Add blood tracking later)
				if (canSee(player.x,player.y,this.x,this.y,-4,this.proxList,this.proxNum,my_sightRange) && (player.tree != true))
				{
					this.state = 2; //Approach
					this.goalX = player.x;
					this.goalY = player.y;
				}
				if (this.timer < 0)
				{
					this.goalX = this.x;
					this.goalY = this.y;
					this.state = 1;//Wander
					output_add("Glowering, the " + this.name + " gives up and wanders away.");
					this.timer = -1;
				}
				else
				{
					this.timer--;
				}
				
					break;
				case 4:
					this.run = true;
					this.goalX = player.x;
					this.goalY = player.y;
					if (this.hostile)
					{
						this.hp += Math.floor(Math.random()*1.2);
						if (this.hp > (this.stat_hp/1.5))
						this.state = 1;
						
					}
					else
					{
						if (irandom(10) < 1) state = 1;
					}
					this.yell(this.x,this.y,2,1,true);
					break;
				case 5: //KO
				if (this.koTimer < 0)
				{
					output_add("The " + this.name + " clambers to his feet, and starts running.");
					this.hp = 1;
					this.state = 4;
				}
				else
				{
					this.koTimer--;
				}
					break;
			}
			
			
			var go_x = 0;
			var go_y = 0;
			//Path_finding
			if ((this.state == 2) || (this.state == 4))
			{
				if ((this.goalX != this.x)
				|| (this.goalY != this.y))
				{
					var loval = 256;
					var xx = this.x;
					var yy = this.y;
					
					var em = map;
					if (this.run)
					em = this.house.hMap;
					
					for (var xp = -1; xp <= 1; xp++)
					{
						for (var yp = -1; yp <= 1; yp++)
						{
							if ((xx+xp < 0) || (xx+xp > rm_width-1)) continue;
							if ((yy+yp < 0) || (yy+yp > rm_height-1)) continue;
							if (em[xx+xp][yy+yp] ==-1) continue;
							
							if (em[xx+xp][yy+yp] < loval)
							{
								loval = em[xx+xp][yy+yp];
								go_x = xp;
								go_y = yp;
							}
							else
							if (em[xx+xp][yy+yp] == loval)
							{
								if (point_distance(xx+go_x,yy+go_y,player.x,player.y) > point_distance(xx+xp,yy+yp,player.x,player.y))
								{
									loval = em[xx+xp][yy+yp];
									go_x = xp;
									go_y = yp;
								}
							}
						}
					}
				}
				
			}
			else
				{
					go_x = clamp(-1,this.goalX-this.x,1);
					go_y = clamp(-1,this.goalY-this.y,1);
				}
			
			//Attacking
			if (this.state != 5)//KO
			{
				if ((Math.abs(player.x-this.x) <= 1) &&
				(Math.abs(player.y-this.y) <= 1) &&
				(this.hostile) &&
				(!player.dead) &&
				(!this.run))
				{
					//Attack him
					this.attacking = true;
					attack(this,player,false);
					this.yell(this.x,this.y,2,0.5,this.hostile);
					this.alert = true;
				}
				else //Open doors or move
				{
					var check = true;
					if (!canMove(this.x+go_x,this.y+go_y))
					{
						for (var i = 0; i < wallNum; i ++)
						{
							var o = wallList[i];
							if (!o.door) continue;
							if (o.x != this.x+go_x) continue;
							if (o.y != this.y+go_y) continue;
							if (o.open) continue;
							o.EV_toggle(true);
							check = false;
						}
					}
					
					if (check)//move
					if (Step)
					{
						var check = true;
						if (canMove(this.x+go_x,this.y))
						{
							this.x += go_x;
							check = false;
						}
						if (canMove(this.x,this.y+go_y))
						{
							this.y += go_y;
							//check = false;
						}
						
						if (check)
						{
							if (this.state == 1)
							{
								this.goalX = this.x;
								this.goalY = this.y;
							}
						}
					}
				}
			}
			
			if (this.bleed > 0)
			{
				this.bleed--;
				this.hp -= irandom(2);
				this.EV_healthcheck(true);
				particleList[particleNum] = new Gib(this.x,this.y);
				particleNum++;
			}
		}
	}
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		
		if (onScreen(xx,yy))
		{		
			if (canSee(player.x-xView,player.y-yView,xx,yy,-4,wallList,wallNum,sightRange))
			{
				if (this.type < 4)
				screen[xx][yy] = 10+this.type;
				else
				screen[xx][yy] = 4;
				
				if (!this.dead)
				{
					if (this.state != 5)
					screen_color[xx][yy] = this.col;
					else
					screen_color[xx][yy] = this.col_ko;
				}
				else
				screen_color[xx][yy] = "#aa1111";
			}
		}
		
	}
	
	this.EV_describe = function()
	{
		var distance = point_distance(this.x,this.y,player.x,player.y);
		if (!this.dead)
		{
			var iN = "";
			if (this.item != -1)
			{
				iN = this.item.name +  "-wielding ";
			}
			
			var message = "There is a "+ healthGeneral(this.hp/this.stat_hp) + " " + iN  + this.name + " " + disGeneral(distance) + " who ";
			if (this.alert)
			{
				if ((this.attacking) && (this.state != 5))
				message += "is attacking you";
				else
				switch(this.state)
				{
					case 0: message += "is just standing there, looking for you";
					break;
					case 1: message += "is wandering around, looking for you";
					break;
					case 2: message += "is charging towards you";
					break;
					case 3: message += "is searching for you";
					break;
					case 4: message += "is running away from you";
					break;
					case 5: message += "is out cold on the ground";
					break;
				}
			}
			else
			{
				switch(this.state)
				{
					case 0: message += "is just standing there";
					break;
					case 1: message += "is just wandering around";
					break;
					case 2: message += "is following you curiously";
					break;
					case 3: message += "is searching for you";
					break;
					case 4: message += "is running away from you";
					break;
					case 5: message += "is out cold on the ground";
					break;
				}
			}
		}
		else
		{
			var message = "The dead body of a " + this.name + " lies " + disGeneral(distance);
		}
		message += ".";
		output_add(message);
	}

	this.EV_healthcheck = function(lethal)
	{
		if (!this.hostile)
		{
			this.state = 4;
			this.yell(this.x,this.y,4,1,false);
		}
		
		if (lethal)
		{
			if (this.hp<=0)
			{
				output_add("You kill the " + this.name);
				this.dead = true;
				if (!murder)
				{
					murder = true;
					output_add("You hear a shout for the police in the distance." + ' "Murder!" ' + "</br>Things won't be so easy from now on.");
				}
			}
		}
		else
		{
			if (this.hp <= 2)
			{
				output_add("The " + this.name + " is knocked out cold.");
				this.koTimer = 14+irandom(8);
				this.state = 5;
			}
		}
	}

	this.yell = function(X,Y,state,scale,htl)
	{
		for (var i = 0; i < npcNum; i++)
		{
			var o = npcList[i];
			if (o.hostile != htl) continue;
			if (o.state == 4) continue;
			if (o.state == 5) continue;
			if (o == this) continue;
			if (point_distance(X,Y,o.x,o.y) < yellRange*scale)
			{
				if ((o.state != state) || (o.alert != true))
				{
					if (o.type != 4)
					if (OP[OPNum-1] != ("The " + this.name + "'s yelling attracts the attention of a nearby " + o.name + "."))
					output_add("The " + this.name + "'s yelling attracts the attention of a nearby " + o.name + ".")
				}
				o.state = state;
				o.alert = true;
			}
		}
	}

	this.makeItem = function(css)
	{
		switch(css)
		{
			case 0: //FH
			var it = irandom(2);
			if (it == 2)
			it++;
			var eI = new Item(-100,100,false,game_level,it)
			this.item = eI;
			itemList[itemNum] = eI;
			itemNum++;
			break;
			case 1: //O
			var it = choose(3,4);
			var eI = new Item(-100,100,false,game_level,it)
			this.item = eI;
			itemList[itemNum] = eI;
			itemNum++;
			break;
			case 2: //P
			var it = choose(6,7);//Sword or truncheon
			var eI = new Item(-100,100,false,game_level,it)
			this.item = eI;
			itemList[itemNum] = eI;
			itemNum++;
			break;
			case 3: //C
			var it = 4 + irandom(2);
			var eI = new Item(-100,100,false,game_level,it)
			this.item = eI;
			itemList[itemNum] = eI;
			itemNum++;
			case 4: //Slave
			break;
		}
	}

}

function Gib(x,y)
{
	this.x=x;
	this.y=y;
	this.col = "#aa1111";
	this.type = irandom(3);
	
	this.EV_draw = function()
	{
		var xx = this.x - xView;
		var yy = this.y - yView;
		if (onScreen(xx,yy))
		{
			screen[xx][yy] = 6+this.type;//gib
			screen_color[xx][yy] = this.col;
		}
	}
}

function Door(x,y,locked,h)
{
	this.x = x;
	this.y = y;
	this.open = false;
	this.locked = locked;
	this.col = "#564027";//brown
	this.col_d = "#362010";//brown
	this.window = false;
	this.seethru = false;
	this.solid = true;
	this.openS = choose(16,17);
	this.hor = h;
	this.dir = true;
	this.door = true;
	
	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			var s = 0;
			if (this.open)
			s = this.openS;
			else
			{
				if (this.hor)
				s = 15;
				else
				s = 14;
			}
			
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			{
				screen[xx][yy] = s;//door
				screen_color[xx][yy] = this.col;
			}
			else
			{
				if (this.hor)
				s = 15;
				else
				s = 14;
				screen[xx][yy] = s;//door
				screen_color[xx][yy] = this.col_d;
			}
		}
	}
	
	this.EV_toggle = function(enemy)
	{
		if (this.open)
		{
			this.open = !this.open;
			output_add("You close the door.");
			if (this.locked)
			{
				output_add("You hear a click");
			}
		}
		else
		{
			if ((this.locked)&&(!enemy))
			{
				
				
				output_add("The door is locked");
				if (player.item != -1)
				if (player.item.pick)
				{
					var str = "You slide ";
					if (player.item.type == 2) str += " a pick";
					else
					str += " the " + player.item.name;
					
					str += " into the lock and after a moment, the door pops open.";
					
					output_add(str);
					this.open = !this.open;
				}
			}
			else
			{
				var xx = this.x-xView;
				var yy = this.y-yView;
				
				this.open = !this.open;
				
				if ((canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange)) || (point_distance(this.x,this.y,player.x,player.y) < 1.5))
				output_add("The door opens");
			}
		}
		
		this.solid = (!this.open);
		this.seethru = this.open;
		this.EV_draw();
	}
}

function Item(x,y,inside,goodness,type)
{
	this.x=x;
	this.y=y;
	this.col = "#777777";//gray
	if (this.type != -1)
	this.type = type;

	this.pick = false;
	this.lethal = false;
	this.fence = false;
	var iI = 0;
	if (!inside)
	{
	if (type == -1)
	this.type =
		choose
		(
			choose(0,1)
			,
			choose
			(
				choose(0,1)
				,
				choose
				(
					irandom(4)
					,
					irandom(6)
				)
			)
		);
	}
	else
	{
		if (type == -1)
		this.type = choose(irandom(6),irandom(4));
		iI = 1;
	}
	
	this.level = clamp(1,irandom(goodness+(iI*2)),10);
	
	this.stat_attack = clamp(0,-1+irandom(this.level+1),10);
	this.stat_strength = Math.floor(clamp(0,-1+irandom(this.level+1),10)/2);
	this.stat_dodge = Math.floor(clamp(0,-1+irandom(this.level+1),10)/1.5);
	this.stat_armor = -(clamp(0,-1+irandom(this.level+1),10)/10);
	
	switch(this.type)
	{
	case 0://stick
	this.stat_attack = 1*this.level;
	this.stat_strength = 0.5*this.level;
	this.name = "Stick";
		break;
	case 1://rock
	this.stat_strength = 1*this.level;
	this.name = "Rock";
		break;
	case 2://Picks
	this.name = "Lock Picks";
	this.pick = true;
		break;
	case 3: //Hammer
	this.stat_strength = 1*this.level;
	this.stat_attack = -1 + Math.floor(this.level/2)
	this.fence = true;
	this.name = "Hammer";
		break;
	case 4://knife
	this.stat_attack = 1*this.level;
	this.stat_strength = 1*this.level;
	this.pick = true;
	this.name = "Knife";
	this.lethal = true;
	
		break;
	case 5://axe
	this.stat_strength = 2*this.level;
	this.stat_attack = -1 + Math.floor(this.level/2);
	this.fence = true;
	this.name = "Axe";
	this.lethal = true;
	
		break;
	case 6://sword
	this.name = "Sabre";
	this.stat_strength = 1.5*this.level;
	this.stat_attack = 2*this.level;
	this.lethal = true;
		break;
	case 7://rock
	this.stat_strength = 1*this.level;
	this.stat_dodge = 2;
	this.name = "Blackjack";
		break;
	}

	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			{
			screen[xx][yy] = this.type+22;//fence
			screen_color[xx][yy] = this.col;
			}
		}
	}

	this.EV_describe = function()
	{
		var des = "A";
		if (this.type == 5) des += "n";
		else
		if (this.type == 2) des += " set of";

		des += " ";
		
		des += this.name.toLowerCase();
		des += " lies on the ";
		var floor = false;
		for (i = 0; i < floorNum; i++)
		{
			var o = floorList[i];
			if (o.x != this.x) continue;
			if (o.y != this.y) continue;
			if (o.type != 0) continue;
			floor = true;
			break;
		}
		if (floor) 
		des += "floor";
		else
		des += "ground";
		des += " ";
		des += disGeneral(point_distance(this.x,this.y,player.x,player.y));
		des += ".";
		output_add(des);
	}
	
	this.EV_reval = function()
	{
		switch(this.type)
		{
		case 0://stick
		this.name = "Stick";
			break;
		case 1://rock
		this.name = "Rock";
			break;
		case 2://Picks
		this.name = "Lock Picks";
			break;
		case 3: //Hammer
		this.name = "Hammer";
			break;
		case 4://knife
		this.name = "Knife";
			break;
		case 5://axe
		this.name = "Axe";
			break;
		case 6://sword
		this.name = "Sabre";
			break;
		case 7://rock
		this.name = "Blackjack";
			break;
		}
	}
}

function Potion(x,y,goodness)
{
	this.x=x;
	this.y=y;
	this.level = clamp(0,irandom(goodness/3),3);
	this.type = choose(choose(0,1),choose(2,3));
	
	switch(this.type)
	{
		case 0:
		this.name = "Bourbon"; //Str++
		this.col = "#802010";
			break;
		case 1:
		this.name = "Rum"; //Att++
		this.col = "#60430b";
			break;
		case 2:
		this.name = "Beer"; //Dge++
		this.col = "#b58005";
			break;
		case 3:
		this.name = "Wine"; //Hp++
		this.col = "#9e2d62";
			break;
	}
	

	this.EV_draw = function()
	{
		var xx = this.x-xView;
		var yy = this.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,this,wallList,wallNum,sightRange))
			{
			screen[xx][yy] = 29;//potion
			screen_color[xx][yy] = this.col;
			}
		}
	}

	this.EV_describe = function()
	{
		var des = "A bottle of ";
		des += this.name.toLowerCase();
		des += " lies on the ";
		var floor = false;
		for (i = 0; i < floorNum; i++)
		{
			var o = floorList[i];
			if (o.x != this.x) continue;
			if (o.y != this.y) continue;
			if (o.type != 0) continue;
			floor = true;
			break;
		}
		if (floor) 
		des += "floor";
		else
		des += "ground";
		des += " ";
		des += disGeneral(point_distance(this.x,this.y,player.x,player.y));
		des += ".";
		output_add(des);
	}
	
	this.EV_reval = function()
	{
		switch(this.type)
		{
			case 0:
			this.name = "Bourbon"; //Str++
			this.col = "#802010";
				break;
			case 1:
			this.name = "Rum"; //Att++
			this.col = "#60430b";
				break;
			case 2:
			this.name = "Beer"; //Dge++
			this.col = "#b58005";
				break;
			case 3:
			this.name = "Wine"; //Hp++
			this.col = "#9e2d62";
				break;
		}
	}
}
//[------------------------------------------------------------------------------------------------------------------------------]
var takeInput = function()
{	

/*
 \    |    /   Interact  Swap item  Swap Potable
  Q   W   E    R         I          P 
    7 8 9      
--A 4 S 6 D--  F-Potion             L-Look
    1 2 3            
  Z   X   C   
 /    |    \ 
*/
	document.addEventListener('keydown', function(event)
	{
		keyPress = -2;
		if ((event.keyCode == 65) || (event.keyCode == 100))//Left
		{
			keyPress = 0;
		}
		else
		if ((event.keyCode == 68) || (event.keyCode == 102))//Right
		{
			keyPress = 1;
		}
		else
		if ((event.keyCode == 87) || (event.keyCode == 104))//Up
		{
			keyPress = 2;
		}
		else
		if ((event.keyCode == 88) || (event.keyCode == 98))//Down
		{
			keyPress = 3;
		}
		
		//-------------------------------------DIAG
		else
		if ((event.keyCode == 81) || (event.keyCode == 103))//NW
		{
			keyPress = 4;
		}
		else
		if ((event.keyCode == 69) || (event.keyCode == 105))//NE
		{
			keyPress = 5;
		}
		else
		if ((event.keyCode == 67) || (event.keyCode == 99))//SE
		{
			keyPress = 6;
		}
		else
		if ((event.keyCode == 90) || (event.keyCode == 97))//sW
		{
			keyPress = 7;
		}
		
		//-------------------------------------REsst
		//83
		else
		if ((event.keyCode == 83) || (event.keyCode == 101))
		{
			keyPress = -1;
		}
		
		//Actions
		
		else 
		if (event.keyCode == 82)//Interact
		{
			keyPress = 8;
		}
		else
		if (event.keyCode == 70)//Potion
		{
			keyPress = 9;
		}
		else
		if (event.keyCode == 73)//Item_swap
		{
			keyPress = 10;
		}
		else
		if (event.keyCode == 80) //Potable_Swap
		{
			keyPress = 11;
		}
		else
		if (event.keyCode == 76) //look
		{
			keyPress = 12;
		}
		else
		if (event.keyCode == 191) //help
		{
			keyPress = 13;
		}
		//update();
    });
};

var shuffle = function(o)
{ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var point_distance = function (x1,y1,x2,y2)
{
  var xs = 0;
  var ys = 0;
 
  xs = x2 - x1;
  xs = xs * xs;
 
  ys = y2 - y1;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

var instance_nearest = function(x,y,Array)
{
	var loval = 1000;
	var obj = 0;
	for (var i = 0; i < Array.length; i++)
	{
		var o = Array[i];
		var d = point_distance(x,y,o.x,o.y);
		if (d < loval)
		{
			loval = d;
			obj = o;
		}
	}
	return(obj);
}

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

var irandom = function(x)
{
	return(Math.floor(Math.random()*(x+1)));
}

var choose = function(x,y)
{
	if (Math.random() > 0.5)
	return(x);
	
	return(y);
}

var clamp = function(Min,num,Max)
{
	return(Math.max(Min,Math.min(Max,num)));
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
	lost = true;
}

var screenClear = function()
{
	for (var y = 0; y < scr_height; y++)
	{
		for (var x = 0; x < scr_width; x++)
		{
			screen[x][y] = 0;
			screen_color[x][y] = c_grass_d;
		}
	}
}

var onScreen = function(xx,yy)
{
	if (xx < 0) return(false);
	if (xx >= scr_width) return(false);
	if (yy < 0) return(false);
	if (yy >= scr_width) return(false);
	return(true);
}

var canSee = function(x1,y1,x2,y2,exempt,Array,Num,range)
{
	var dis = point_distance(x1,y1,x2,y2);
	if (dis >= range) return(false);
	
	var xSteps = (x2-x1)/(dis*2);
	var ySteps = (y2-y1)/(dis*2);
	
	var xx = x1;
	var yy = y1;
	
	for (var i = 0; i < (dis*2); i++)
	{
		xx += xSteps;
		yy += ySteps;
		for (var w = 0; w < Num; w++)
		{
			var W = (Array[w]);
			
			if (W.seethru) continue;
			if (W == exempt) continue;
			
			if (W.x-xView == Math.round(xx))
			if (W.y-yView == Math.round(yy))
			return(false);
		}
	}
	return(true);
}

var symb = function(n)
{
	if (n < 100)
	switch(n)
	{
		case 0://empty
		return(".");
		case 1://wall
		return("#");
		case 2: //player
		return("@");
		case 3: //tree
		return("T");
		case 4: //NPC
		return("s");
		case 5: //Fence
		return("+");
		case 6: //Gib1
		return('`');
		case 7: //Gib2
		return('"');
		case 8: //Gib3
		return("'");
		case 9: //Gib4
		return(',');
		case 10: //Farmhand
		return("f");
		case 11://Owner
		return("o");
		case 12://Policeman
		return("p");
		case 13://Slave Catcher
		return("c");
		case 14://Door Closed v
		return("|")
		case 15://Door closed h
		return("-");
		case 16: //open door /
		return("/");
		case 17: //open door other
		return("\\");
		case 18: //Water
		return("~");
		case 19: //Ground again... don't ask
		return(".");
		case 20: //Goal
		return(":");
		case 21: //Farmland
		return("=");
		case 22: //Stick
		return("(");
		case 23: //Rock
		return("(");
		case 24: //Picks
		return("(");
		case 25: //Hammer
		return("(");
		case 26: //Axe
		return(")");
		case 27: //Knife
		return(")");
		case 28: //Sword
		return(")");
		case 29: //Potion
		return("!");
	}
	else
	return(n-100);
}

var col_get = function(c,b)
{
	return('<div class = "color" style = "color:' + c + '">');
}

var canMove = function(x,y)
{
	if (x < 0) return(false);
	if (x >= rm_width) return(false);
	if (y < 0) return(false);
	if (y >= rm_height) return(false);
	
	for (var i = 0; i < wallNum; i++)
	{
		var o = wallList[i];
		if (o.y != y) continue;
		if (o.x != x) continue;
		if (!o.solid) continue;
		return(false);
	}
	
	for (var i = 0; i < waterNum; i++)
	{
		var o = waterList[i];
		if (o.y != y) continue;
		if (o.x != x) continue;
		if (!o.deep) continue;
		return(false);
	}
	
	for (var i = 0; i < npcNum; i++)
	{
		var o = npcList[i];
		if (o.y != y) continue;
		if (o.x != x) continue;
		if (o.dead) continue;
		if (o.state == 5) continue;
		return(false);
	}
	
	var o = player;
		if (o.y == y)
		if (o.x == x)
		{
			return(false);
		}
		
	return(true);
}

var output_add = function(string)
{
	for (var i = 0; i < OPNum-1; i++)
	{
		OP[i] = OP[i+1];
	}
	OP[OPNum-1] = string;
	
	//Draw
	var nn = "";
	for (var i = 0; i < OPNum; i++)
	{
		var col = (20+(i*4)).toString();
		col = "#" + col + col + col;
		nn += '<div class = "output" style = "color:' + col + '">' + OP[i] + '</div><br/>';

	}
	output.innerHTML = nn;
}

var numGeneral = function(n)
{
	if (n < 2) 
	return("is a");
	else
	if (n < 3)
	return("are a couple of");
	else
	if (n < 6) 
	return("are a few");
	else
	return("are a number of")
}

var disGeneral = function(n)
{
	if (n < 2) 
	return("next to you");
	else
	if (n < 5)
	return("close to you");
	else
	if (n < 8) 
	return("nearby");
	else
	if (n < 10)
	return("a ways away");
	else
	return("far from you")
}

var healthGeneral = function(n)
{
	if (n < 0.1) 
	return(" badly wounded");
	else
	if (n < 0.3)
	return(" injured");
	else
	if (n < 0.6) 
	return(" battered");
	else
	if (n < 0.8) 
	return(" slightly hurt");
	else
	return(" ")
}

var get_weapon_icon = function(i)
{
	var set_col = function(col)
	{
		return('</div><div class = "color" style = "color:' + col + '">');
	}
	var blk = "#000000";
	var brn = "#564032";
	var skn = "#564012";
	var grn = "#207020";
	var wht = "#ffffff";
	var lgr = "#666666";
	var dgr = "#333333";
	var red = "#ff1111";
	
	switch(i)
	{
		case -2:
		return(set_col(wht)+ "+-------+</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>+-------+</br>");
		case -1:
		return(set_col(wht) + "+-------+</br>|"+ set_col(blk) + "--"+ set_col(skn) + "_..."+ set_col(blk) + "-"+ set_col(wht) + "|</br>|"+ set_col(blk) + "-"+ set_col(skn) + "'"+ set_col(blk) + "-"+ set_col(skn) + ";//|"+ set_col(wht) + "|</br>|"+ set_col(blk) + "--"+ set_col(skn) + "\\```,"+ set_col(wht) + "|</br>+--"+ set_col(skn) + "/"+ set_col(blk) + "--"+ set_col(skn) + "|"+ set_col(wht) + "-+</br>");
		case 0:
		return(set_col(wht) + "+--"+ set_col(brn) + "\\" + set_col(wht) +"-"+ set_col(brn) + "|" + set_col(wht) +"--+</br>|" + set_col(blk) +"--"+ set_col(grn) + "~"+ set_col(brn) + "\\," + set_col(blk) +"--"+ set_col(wht) + "|</br>|" + set_col(blk) +"--"+ set_col(brn) + ",/" + set_col(blk) +"---"+ set_col(wht) + "|</br>|" + set_col(blk) +"--"+ set_col(brn) + "/"+ set_col(grn) + "~" + set_col(blk) +"---"+ set_col(wht) + "|</br>+-"+ set_col(brn) + "/" + set_col(wht) +"-----+</br>");
		case 1:
		return(set_col(wht) + "+-------+</br>|" +set_col(blk) + "---"+set_col(lgr) + "__" +set_col(blk) + "--" +set_col(wht) + "|</br>|" +set_col(blk) + "-" +set_col(lgr) + ",`" +set_col(blk) + "--" +set_col(dgr) + "\\" +set_col(blk) + "-" +set_col(wht) + "|</br>|" +set_col(dgr) + ".___,`" +set_col(blk) + "-" +set_col(wht) + "|</br>+-------+</br>");
		case 2:
		return(set_col(wht) + "+-------+</br>|" +set_col(blk) + "--" +set_col(lgr) + "?!." +set_col(blk) + "--" +set_col(wht) + "|</br>|" +set_col(blk) + "--" +set_col(lgr) + "|||" +set_col(blk) + "--" +set_col(wht) + "|</br>|" +set_col(blk) + "-" +set_col(brn) + "|```|" +set_col(blk) + "-" +set_col(wht) + "|</br>+-" +set_col(brn) + "|" +set_col(blk) + "---" +set_col(brn) + "|" +set_col(wht) + "-+</br>");
		case 3:
		return(set_col(wht) + "+-------+</br>|" +set_col(blk) + "--" +set_col(dgr) + "[=]" +set_col(blk) + "--" +set_col(wht) + "|</br>|" +set_col(blk) + "---" +set_col(brn) + "|" +set_col(blk) + "---" +set_col(wht) + "|</br>|" +set_col(blk) + "---" +set_col(brn) + "|" +set_col(blk) + "---" +set_col(wht) + "|</br>+-------+</br>");
		case 4:
		return(set_col(wht) + "+-----" +set_col(lgr) + "^" +set_col(wht) + "-+</br>|" +set_col(blk) + "----" +set_col(lgr) + "/|" +set_col(blk) + "-" +set_col(wht) + "|</br>|" +set_col(blk) + "--" +set_col(dgr) + "'," +set_col(lgr) + "/" +set_col(blk) + "--" +set_col(wht) + "|</br>|" +set_col(blk) + "--" +set_col(brn) + "//" +set_col(dgr) + "'" +set_col(blk) + "--" +set_col(wht) + "|</br>+--" +set_col(brn) + "`" +set_col(wht) + "----+</br>");
		case 5:
		return(set_col(wht) + "+-------+</br>|" +set_col(blk) + "----" +set_col(lgr) + "/`-," +set_col(wht) + "</br>|" +set_col(blk) + "---" +set_col(brn) + "/" +set_col(blk) + "-" +set_col(lgr) + "`/" +set_col(wht) + "|</br>|" +set_col(blk) + "--" +set_col(brn) + "/" +set_col(blk) + "----" +set_col(wht) + "|</br>+" +set_col(brn) + ",/" +set_col(wht) + "-----+</br>");
		case 6:
		return(set_col(wht) + "+---" +set_col(red) + "'" +set_col(wht) + "---+</br>|" +set_col(blk) + "---" +set_col(lgr) + "|" +set_col(blk) + "---" +set_col(wht) + "|</br>|" +set_col(blk) + "---" +set_col(lgr) + "|" +set_col(blk) + "---" +set_col(wht) + "|</br>|" +set_col(blk) + "---" +set_col(dgr) + "+" +set_col(blk) + "---" +set_col(wht) + "|</br>+--" +set_col(dgr) + "(]" +set_col(wht) + "---+</br>");
	}
}

var get_potion_icon = function(i)
{
	var set_col = function(col)
	{
		return('</div><div class = "color" style = "color:' + col + '">');
	}
	var w = "#ffffff";
	var b = "#000000";
	var wht = w;
	var blk = b;
	var col = "";//Bev color
	var brn = "#564032";
	var red = "#700e0e";

	switch(i)
	{
		case -1: //none
		return(set_col(wht)+ "+-------+</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>|"+set_col(blk)+"-------"+set_col(wht)+"|</br>+-------+</br>");
		case 0: //Bourbon
		col = "#802010";
		return(set_col(w) + "+---"+set_col(brn)+"#"+set_col(w)+"---+</br>|"+set_col(b)+"---"+set_col(col)+"="+set_col(b)+"---"+set_col(w)+"|</br>|"+set_col(b)+"--"+set_col(col)+",~."+set_col(b)+"--"+set_col(w)+"|</br>|"+set_col(b)+"-"+set_col(col)+"/"+set_col(b)+"---"+set_col(col)+"\\"+set_col(b)+"-"+set_col(w)+"|</br>+-"+set_col(col)+"\\___/"+set_col(w)+"-+</br>");
		case 1: //Rum
		col = "#60430b";
		return(set_col(w) + "+---"+set_col(brn)+"#"+set_col(w)+"---+</br>|"+set_col(b)+"--"+set_col(col)+"_=_"+set_col(b)+"--"+set_col(w)+"|</br>|"+set_col(b)+"-"+set_col(col)+"/~~~\\"+set_col(b)+"-"+set_col(w)+"|</br>|"+set_col(b)+"-"+set_col(col)+"|"+set_col(b)+"---"+set_col(col)+"|"+set_col(b)+"-"+set_col(w)+"|</br>+-"+set_col(col)+"|___|"+set_col(w)+"-+</br>");
		case 2: //Beer
		col = "#b58005";
		return(set_col(w) + "+---"+set_col(col)+"#"+set_col(w)+"---+</br>|"+set_col(b)+"---"+set_col(col)+"="+set_col(b)+"---"+set_col(w)+"|</br>|"+set_col(b)+"--"+set_col(col)+"|~|"+set_col(b)+"--"+set_col(w)+"|</br>|"+set_col(b)+"--"+set_col(col)+"|"+set_col(b)+"-"+set_col(col)+"|"+set_col(b)+"--"+set_col(w)+"|</br>+--"+set_col(col)+"|_|"+set_col(w)+"--+</br>");
		case 3: //wine
		col = "#9e2d62";
		return(set_col(w) + "+---"+set_col(brn)+"#"+set_col(w)+"---+</br>|"+set_col(b)+"---"+set_col(red)+"="+set_col(b)+"---"+set_col(w)+"|</br>|"+set_col(b)+"--"+set_col(col)+"/~\\"+set_col(b)+"--"+set_col(w)+"|</br>|"+set_col(b)+"--"+set_col(col)+"|"+set_col(b)+"-"+set_col(col)+"|"+set_col(b)+"--"+set_col(w)+"|</br>+--"+set_col(col)+"|_|"+set_col(w)+"--+</br>");
	}
}

var get_wanted_poster = function()
{
   //0123456789abcdef0o123456789abcdef
   //////////////1234567890
   
   if (!murder)
   {
		var reward = "   $" + (100 + (game_level * 50)) +"   ";
		var temp = [
		"+------------------------------+".split(""),
		"-                              -".split(""),
		"-        ______________        -".split(""),
		"-        |            |        -".split(""),
	   ("-        | "+reward+" |        -").split(""),
		"-        |   REWARD   |        -".split(""),
		"-        |            |        -".split(""),
		"-        |Runaway from|        -".split(""),
		"-        |  Magnolia  |        -".split(""),
		"-        | Plantation |        -".split(""),
		"-        |on the night|        -".split(""),
		"-        |of Sun. 14th|        -".split(""),
		"-        |    May.    |        -".split(""),
		"-        | Man named  |        -".split(""),
		"-        |            |        -".split(""),
		"-        |   SAMUEL   |        -".split(""),
		"-        |            |        -".split(""),
		"-        |29 years of |        -".split(""),
		"-        | age, 5 feet|        -".split(""),
		"-        |8-10 inches |        -".split(""),
		"-        |____________|        -".split(""),
		"-                              -".split(""),
		"-      PRESS R TO PROCEED      -".split(""),
		"+------------------------------+".split("")
		];
	}
	else
	{
		var reward = "  $" + (1000 + (game_level * 750)) +"   ";
		reward = [reward.slice(0, 4), ",", reward.slice(4)].join('');
				var temp = [
		"+------------------------------+".split(""),
		"-                              -".split(""),
		"-        ______________        -".split(""),
		"-        |            |        -".split(""),
	   ("-        | "+reward+" |        -").split(""),
		"-        |   REWARD   |        -".split(""),
		"-        |            |        -".split(""),
		"-        | WANTED FOR |        -".split(""),
		"-        |  -MURDER-  |        -".split(""),
		"-        |            |        -".split(""),
		"-        |            |        -".split(""),
		"-        | A runaway  |        -".split(""),
		"-        |  negro man |        -".split(""),
		"-        |   called   |        -".split(""),
		"-        |            |        -".split(""),
		"-        |   SAMUEL   |        -".split(""),
		"-        |            |        -".split(""),
		"-        |29 years of |        -".split(""),
		"-        | age, 5 feet|        -".split(""),
		"-        |8-10 inches |        -".split(""),
		"-        |____________|        -".split(""),
		"-                              -".split(""),
		"-      PRESS R TO PROCEED      -".split(""),
		"+------------------------------+".split("")
		];

	}
   //0123456789abcdef0o123456789abcdef
	var t2 = [];
	for (var yy = 0; yy < scr_width; yy++)
	{
		if (!t2[yy]) t2[yy] = [];
		for (var xx = 0; xx < scr_height; xx++)
		{
			if (temp[xx][yy] == " ")
			temp[xx][yy] = '<div class = "color" style = "color:#000000">-</div>';
			t2[yy][xx] = temp[xx][yy];
		}
	}
	return(t2);
}

var get_menu = function()
{
       //0123456789abcdef0o123456789abcdef
		var temp = [
		"+------------------------------+".split(""),
		"-                              -".split(""),
		"-   T H E    P R O M I S E D   -".split(""),
		"-                              -".split(""),
	    "-                              -".split(""),
		"-      L A N D                 -".split(""),
		"-                              -".split(""),
		"-                              -".split(""),
		"-                              -".split(""),
		"-             ,/\\              -".split(""),
		"-       , /`~`/   ~~~`~,  .\\,  -".split(""),
		"-  ,/``~ `  ,/         ,``   /\\-".split(""),
		"-/`    \\             /         -".split(""),
		"-                   ,     ~    -".split(""),
		"-'    ,`                 /     -".split(""),
		"-' .         /`,           * | -".split(""),
		"-|'|        /   \\          |||'-".split(""),
		"-;|'      `              |*|.' -".split(""),
		"-|;||   `             `  | ;   -".split(""),
		"-;;|||| __   __     ___..|;    -".split(""),
		"-|;_...]: ''' :;..'': : : :    -".split(""),
		"- : : :                   : :  -".split(""),
		"- : :   PRESS R TO BEGIN  : : :-".split(""),
		"+------------------------------+".split("")
		];
   //0123456789abcdef0o123456789abcdef
	var t2 = [];
	for (var yy = 0; yy < scr_width; yy++)
	{
		if (!t2[yy]) t2[yy] = [];
		for (var xx = 0; xx < scr_height; xx++)
		{
			if (temp[xx][yy] == " ")
			temp[xx][yy] = '<div class = "color" style = "color:#000000">-</div>';
			t2[yy][xx] = temp[xx][yy];
		}
	}
	return(t2);
}

var get_win = function()
{
       //0123456789abcdef0o123456789abcdef
		var temp = [
		"+------------------------------+".split(""),
		"-                              -".split(""),
		"-  Y O U    A R E    F R E E   -".split(""),
		"-                              -".split(""),
	    "-                              -".split(""),
		"-                              -".split(""),
		"-                              -".split(""),
		"-                              -".split(""),
		"-                              -".split(""),
		"-             ,/\\              -".split(""),
		"-       , /`~`/   ~~~`~,  .\\,  -".split(""),
		"-  ,/``~ `  ,/         ,``   /\\-".split(""),
		"-/`    \\             /         -".split(""),
		"-                   ,     ~    -".split(""),
		"-'    ,`                 /     -".split(""),
		"-' .         /`,           * | -".split(""),
		"-|'|        /   \\          |||'-".split(""),
		"-;|'      `              |*|.' -".split(""),
		"-|;||   `             `  | ;   -".split(""),
		"-;;|||| __   __     ___..|;    -".split(""),
		"-|;_...]: ''' :;..'': : : :    -".split(""),
		"- : : :                   : :  -".split(""),
		"- : :                     : : :-".split(""),
		"+------------------------------+".split("")
		];
   //0123456789abcdef0o123456789abcdef
	var t2 = [];
	for (var yy = 0; yy < scr_width; yy++)
	{
		if (!t2[yy]) t2[yy] = [];
		for (var xx = 0; xx < scr_height; xx++)
		{
			if (temp[xx][yy] == " ")
			temp[xx][yy] = '<div class = "color" style = "color:#000000">-</div>';
			t2[yy][xx] = temp[xx][yy];
		}
	}
	return(t2);
}


var get_controls = function()
{
	var get_col = function(col)
	{
		return('<div class = "color" style = "color:' + col + '">');
	}

	var c = "##Q##W##E######7##8##9#|#Interact##Swap#Item##Swap#Potable</br>###\\#|#/########\\#|#/##|#R#########I##########P###########</br>##A-#S#-D##or##4-#5#-6#|##################################</br>###/#|#\\########/#|#\\##|#F-#Drink#############L-#Look#####</br>##Z##X##C######1##2##3#|##################################</br>";
	var count = (c.match(/#/g) || []).length;
	
	for (var i = 0; i < count; i++)
	var b = c.replace(/#/g,get_col("#000000") + "." + '</div>')
	
	return(b);
	}

var col_get_symbol = function(i)//For wanted poster
{
	switch(i)
	{
		case "+": return("#333333");
		case "-": return("#333333");
		case "_": return("#554533");
		case "|": return("#554533");
		default: return("#857363");
	}
}

var col_get_symbol_menu = function(i)//For menu
{
	switch(i)
	{
		case "+":
		case "-": return("#333333");
		case ":":
		case "]":
		case "_":
		case "'":
		case ".":
		return("#555558");
		
		case "*":
		return("#aaaa77");
		
		case "/":
		case "\\":
		case "~":
		case "`":
		case ",": return("#218b54");
		default: return("#554533");
	}
}

var f_map = function()
{		
		var list = [];
		for (var xx = 0; xx < rm_width; xx++)
		{
			for (var yy = 0; yy < rm_height; yy++)
			{
				map[xx][yy] = 32000;
				
				if ((xx == player.x) &&
				(yy ==player.y)) continue;
				list.push({x:xx,y:yy});
			}
		}
		
		map[player.x][player.y] = 0;
		
		for (var i = 0; i < wallNum; i++)
		{
			var o = wallList[i];
			if (o.door) continue;
			if (o.x<0) continue;
			map[o.x][o.y] = -1;
		}
		
		for (var i = 0; i < waterNum; i++)
		{
			var o = waterList[i];
			if (!o.deep) continue;
			map[o.x][o.y] = -1;
		}
		
		var dis = Math.max(Math.max(player.x,Math.abs((rm_width-1)-player.x)),Math.max(player.y,Math.abs((rm_height-1)-player.y)));
		for (var i = 1; i < dis; i++)
		{
			for (var j = 0; j < list.length; j++)
			{
				if (map[list[j].x][list[j].y] == -1)
				{
					list.splice(j,1);
					continue;
				}
				if (Math.abs(player.x-list[j].x) > i) continue;
				if (Math.abs(player.y-list[j].y) > i) continue;
				var loval = 32001;
				for (var xp = -1; xp <= 1; xp++)
				{
					for (var yp = -1; yp <= 1; yp++)
					{
						if (clamp(0,list[j].x+xp,rm_width-1) != list[j].x+xp) break;
						if (clamp(0,list[j].y+yp,rm_height-1) != list[j].y+yp) continue;
						if (map[list[j].x+xp][list[j].y+yp] == -1) continue;
						
						if (map[list[j].x+xp][list[j].y+yp] < loval)
						loval = map[list[j].x+xp][list[j].y+yp];
					}
				}
				if ((loval+1) < map[list[j].x][list[j].y])
				{
					map[list[j].x][list[j].y] = (loval+1);
				}
				else
				{
					if (map[list[j].x][list[j].y] != 32000)
					list.splice(j,1);
				}
			}
		}
}

var e_map = function(X,Y,lk)
{		
		var eMap = [];
		for (var xx = 0; xx < rm_width; xx++)
		{
			if (!eMap[xx]) eMap[xx] = [];
			for (var yy = 0; yy < rm_height; yy++)
			{
				eMap[xx][yy] = 0;
			}
		}
		
		var list = [];
		for (var xx = 0; xx < rm_width; xx++)
		{
			for (var yy = 0; yy < rm_height; yy++)
			{
				eMap[xx][yy] = 32000;
				
				if ((xx == X) &&
				(yy == Y)) continue;
				list.push({x:xx,y:yy});
			}
		}
		
		eMap[X][Y] = 0;
		
		for (var i = 0; i < waterNum; i++)
		{
			var o = waterList[i];
			if (!o.deep) continue;
			eMap[o.x][o.y] = -1;
		}
		
		for (var i = 0; i < wallNum; i++)
		{
			var o = wallList[i];
			if (o.door)
			if ((!lk) || (!o.locked)) continue;
			if (o.x<0) continue;
			eMap[o.x][o.y] = -1;
		}
		
		
		
		var dis = Math.max(Math.max(player.x,Math.abs((rm_width-1)-player.x)),Math.max(player.y,Math.abs((rm_height-1)-player.y)));
		for (var i = 1; i < dis; i++)
		{
			for (var j = 0; j < list.length; j++)
			{
				if (eMap[list[j].x][list[j].y] == -1)
				{
					list.splice(j,1);
					continue;
				}
				if (Math.abs(X-list[j].x) > i) continue;
				if (Math.abs(Y-list[j].y) > i) continue;
				var loval = 32001;
				for (var xp = -1; xp <= 1; xp++)
				{
					for (var yp = -1; yp <= 1; yp++)
					{
						if (clamp(0,list[j].x+xp,rm_width-1) != list[j].x+xp) break;
						if (clamp(0,list[j].y+yp,rm_height-1) != list[j].y+yp) continue;
						if (eMap[list[j].x+xp][list[j].y+yp] == -1) continue;
						
						if (eMap[list[j].x+xp][list[j].y+yp] < loval)
						loval = eMap[list[j].x+xp][list[j].y+yp];
					}
				}
				if ((loval+1) < eMap[list[j].x][list[j].y])
				{
					eMap[list[j].x][list[j].y] = (loval+1);
				}
				else
				{
					if (eMap[list[j].x][list[j].y] != 32000)
					list.splice(j,1);
				}
			}
		}
		return(eMap);
}

var attack = function(source,target,counter)
{
	var atb = 0;
	var stb = 0;
	var arb = 0;
	var deb = 0;
	var lethal = false;
	
	if (source.item != -1)
	{
		atb = source.item.stat_attack;
		stb = source.item.stat_strength;
		if (source.item.lethal) lethal = true;
	}
	
	if (target.item != -1)
	{
		arb = target.item.stat_armor;
		deb = target.item.stat_dodge;
	}
	var at = ((source.stat_attack)+atb)*source.p_att;
	var st = ((source.stat_strength)+stb)*source.p_str;
	var ar = ((target.stat_armor)+arb)*source.p_dge;
	var de = ((target.stat_dodge)+deb)*source.p_arm;
	var damage = 0;
	
	var roll = Math.random()*(de+at);
	
	if (source == player)
	{
		var P = " the ";
		var T = "";
		var TT = "The ";
		var SS = "s ";
		var sName = source.name;
		var sName_plu = "your";
		var tName = target.name.toLowerCase();
	}
	else
	{
		var P = "s ";
		var T = "The ";
		var TT = ""
		var SS = " ";
		var sName = source.name.toLowerCase();
		var sName_plu = sName + "'s";
		var tName = target.name.toLowerCase();
	}
	
	if (roll > de)//hit
	{
		var aC = 1 + ((at-10)/30);
		if (roll > (de+at)-((at/16)*aC)) //Critical!
		{
			damage = Math.round((st+(Math.random()*st))*ar);
		
			if (!counter)
			output_add(T + sName + " critically hit" + P + tName + ", dealing " + damage + " damage.");
			else
			output_add(T + sName + " critically counter attack" + P + tName + ", dealing " + damage + " damage.");
			if (lethal)
			if (!target.bleed)
			{
				target.bleed = irandom(at);
				output_add(TT + tName + " start" + SS + " bleeding");
			}
		}
		else
		{
			damage = 1+Math.round(((Math.random()*(st-1)))*ar);
			
			if (!counter)
			output_add(T + sName +" hit" + P + tName + ", dealing " + damage + " damage.");
			else
			output_add(T + sName +" counter attack" + P + tName + ", dealing " + damage + " damage.");
			
			particleList[particleNum] = new Gib(target.x,target.y);
			particleNum++;
		}
	}
	else//miss
	{	
		
		if (roll < de/3) //Critical fail
		{
			if (P == "s ") P = "es ";
			output_add(T + sName +" miss" + P + tName);
			if (!counter)
			attack(target,source,true);
		}
		else
		{
			if (counter)
			output_add(TT + tName +  " dodge" + SS + sName_plu + " counter attack");
			else
			output_add(TT + tName +" dodge" + SS + sName_plu + " attack");
		}	
	}
	target.hp -= damage;
	target.EV_healthcheck(lethal);
}

var levelClear = function()
{
	//Clear objects
	player = 0;
	goal = 0;

	wallList.length = 0;
	wallNum = 0;

	treeList.length = 0;
	treeNum = 0;

	npcList.length = 0;
	npcNum = 0;

	particleList.length = 0;
	particleNum = 0;

	waterList.length = 0;
	waterNum = 0;

	floorList.length = 0;
	floorNum = 0;

	houseList.length = 0;
	houseNum = 0;
	
	itemList.length = 0;
	itemNum = 0;
	
	potionList.length = 0;
    potionNum = 0;
}

var generateLevel = function(difficulty)
{
	levelClear();
	var temp_map = [];
	for (var xx = 0; xx < rm_width; xx++)
	{
		if (!temp_map[xx]) temp_map[xx] = [];
		for (var yy = 0; yy < rm_height; yy++)
		{
			temp_map[xx][yy] = 0; //Nothing
		}
	}
	
	var Grove = function(x,y)
	{
		var w = 2+irandom(3);
		var h = 2+irandom(3);
		for (var xx = 0; xx < w; xx++)
		{
			 for (var yy = 0; yy < h; yy++)
			{
				var dis = Math.random()*(Math.max(h/2,w/2));
				
				var createx = Math.round(x-(w/2)+xx);
				var createy = Math.round(y-(h/2)+yy);
				if (clamp(0,createx,rm_width-1) != createx) continue;
				if (clamp(0,createy,rm_height-1) != createy) continue;
				if (point_distance(x,y,createx,createy) < dis)
				{
					temp_map[createx][createy] = 1;//Tree
				}
			}
		}

		var lim = irandom(6);
		for (var i = 0; i < lim; i++)
		{
			temp_map[clamp(0,(x-w*2) + irandom(w*4),rm_width-1)][clamp(0,(y-h*2) + irandom(h*4),rm_height-1)] = 1;//Tree
		}
	}
	
	var River = function(y)
	{	
		var manW = Math.floor(difficulty/3);
		var width = (3+manW)+irandom(6-manW);
		var width_coef_top = 0;
		var width_coef_bot = 0;
		var width_var = irandom(4);
		var offset = 0;
		var curve = 0.2+(Math.random()*0.5);
		var creeks = irandom(Math.floor(width/3));
		var flow = choose(-1,1);
		var bNum = choose(1,2);
		var bWidth = choose(1,2,3);

		var br = [];
		for (var i = 0; i < bNum; i++)
		{
			br[i] = 3+irandom(rm_width-6);
		}

		var cr = [];
		for (var i = 0; i < creeks; i++)
		{
			cr[i] = irandom(rm_width);
		}

		for (var xx = 0; xx < rm_width; xx++)
		{
			var BR = false;
			for (var i = 0; i < bNum; i++)
			{
				if (bWidth == 1)
				BR = (br[i] == xx)
				else
				if (bWidth == 2)
				BR = ((br[i] == xx) || (br[i] == xx+1))
				else
				if (bWidth == 3)
				BR = ((br[i] == xx-1) || (br[i] == xx) || (br[i] == xx+1))
			}
			for (var yy = -Math.floor(width/2)-width_coef_top + offset; yy < Math.floor(width/2)+width_coef_bot + offset; yy ++)
			{
				if (BR)
				{
					temp_map[xx][y+yy] = 13;//Bridge
				}
				else
				if (temp_map[xx][y+yy] != 13)
				temp_map[xx][y+yy] = 2; //Water
			}
			
			//Place policemen
			
			
			if (Math.random() > curve)
			{
				if (choose(true,false))
				width_coef_top += choose(-1,1);
				
				if (choose(true,false))
				width_coef_bot += choose(-1,1);
				
				offset += choose(choose(-1,1),0);
			}
			width_coef_top = clamp(-width_var,width_coef_top,width_var);
			width_coef_bot = clamp(-width_var,width_coef_bot,width_var);
			
			for (var l = 0; l < creeks; l++)
			{
				if (xx == cr[l])
				{
					var up = choose(true,false);
					if (up)
					{
						var Y = y-Math.floor(width/2)-width_coef_top + offset;			
						var VS = -Math.random();
					}	
					else
					{
						var Y = y+Math.floor(width/2)+width_coef_bot + offset;			
						var VS = Math.random();
					}
					var len = 16 + irandom(128-16);
					Creek(xx,Y,flow,VS,irandom(len/64),choose(1,2),len);
				}
			}
		}
	}
	
	var Creek = function(x,y,hs,vs,splits,width,length)
	{
		var curve = 0.2+(Math.random()*0.3);
		
		var i = 0;
		while(true)
		{
				for (var xx = 0; xx < width; xx++)
				{
					for (var yy = 0; yy < width; yy++)
					{   
							if (clamp(0,Math.round(x)+xx,rm_width-1) != Math.round(x)+xx)  break;
							if (clamp(0,Math.round(y)+yy,rm_height-1) != Math.round(y)+yy)  continue;
							
							if (temp_map[Math.round(x)+xx][Math.round(y)+yy] != 4)
							temp_map[Math.round(x)+xx][Math.round(y)+yy] = 2;//Water
					}
				}
				
				if (width == 0)
				{
					if (clamp(0,Math.round(x),rm_width-1) == Math.round(x))
					if (clamp(0,Math.round(y),rm_height-1) == Math.round(y))
					if (temp_map[Math.round(x)+xx][Math.round(y)+yy] != 4)
					temp_map[Math.round(x)][Math.round(y)] = 2;//Water
				}
				
				x += hs;
				y += vs;
				
				if (Math.random() < curve)
				{
					if (y < 16)
					vs += Math.random()*0.2;
					else
					if (y > (rm_height-16))
					vs -= Math.random()*0.2;
					else
					{
						hs += -0.2+(Math.random()*0.4);
						vs += -0.2+(Math.random()*0.4);
					}
					
					hs = clamp(-1,hs,1);
					vs = clamp(-1,vs,1);
					
					width += clamp(-1,-1+irandom(10),0);
					width = clamp(0,width,2);
				}
				
				
				if (splits > 0)
				if (width > 0)
				if (irandom(length) < 10)
				{
					Creek(x,y,hs,vs,irandom(splits-1),width-1,irandom(length));
				}
				
				if (clamp(0,x,rm_width) != x) break;
				if (clamp(0,y,rm_height) != y) break;
				i ++;
		}
	}

	var Building = function(type)
	{
		var width = 5+irandom(5);
		var height = 5+irandom(5);
		var build = false;
		var window_in_h = 1+choose(1,2);
		var window_in_v = choose(window_in_h,1+choose(1,2));
		var fence = choose(1+irandom(4),choose(1+irandom(4),0));
		var allLocked = choose(choose(true,false),false);
		var door_l = choose(true,false);
		var door_r = choose(true,false);
		var door_u = choose(true,false);
		var door_d = choose(true,false);
		
		var locked = [];
		
		while((!door_l) && (!door_r) && (!door_u) && (!door_d))
		{
			door_l = choose(true,false);
			door_r = choose(true,false);
			door_u = choose(true,false);
			door_d = choose(true,false);
		}
		
		
		
		for (var i = 0; i < 4; i++)
		{
			if (type == 2)
			{
				if (!allLocked)
				locked[i] = choose(true,false);
				else
				locked[i] = true;
			}
			else
			locked[i] = false;
		}
		
		//Types; Start, goal, other
		
		var Check = function(X1,Y1,X2,Y2)
		{
			if (X1<1) return(false);
			if (X2>rm_width-2) return(false);
			if (Y1<0) return(false);
			if (Y2>rm_height-1) return(false);
			
			for (var xx = X1; xx <= X2; xx++)
			{
				for (var yy = Y1; yy <= Y2; yy++)
				{
					if ((temp_map[xx][yy] != 0) && (temp_map[xx][yy] != 12))
					{
						return(false);
					}
				}
			}
			return(true);
		}
		
		switch(type)
		{
			case 0: //start
			var escape = 100;
			while( escape > 0)
			{
				var offset = irandom(rm_width);
				for (var xx = 0; xx < rm_width; xx++)
				{
					var yy = rm_height- (height + 3 + irandom(2));
					if (Check(((xx+offset)%rm_width)-1,yy-1,((xx+offset)%rm_width)+width+1,yy+height+1))
					{
						x1 = ((xx+offset)%rm_width);
						y1 = yy;
						x2 = ((xx+offset)%rm_width)+width;
						y2 = yy+height;
						build = true;
						escape = 0;
						break;
					}
				}
				escape --;
				if (height > 5) height--;
				if (width > 5) width--;
			}
				break;
				case 1:
			var escape = 100;
			while( escape > 0)
			{
				var offset = irandom(rm_width);
				for (var xx = 0; xx < rm_width; xx++)
				{
					var yy = (3 + irandom(2));
					if (Check(((xx+offset)%rm_width)-1,yy-1,((xx+offset)%rm_width)+width+1,yy+height+1))
					{
						x1 = ((xx+offset)%rm_width);
						y1 = yy;
						x2 = ((xx+offset)%rm_width)+width;
						y2 = yy+height;
						build = true;
						escape = 0;
						break;
					}
				}
				escape --;
				if (height > 5) height--;
				if (width > 5) width--;
			}
				break;
			case 2: //other
			var escape = 1000;
			while(escape > 0)
			{
				escape--;
				var ec = 0;
				if (game_level == 0) ec = 8;
				var xx = irandom(rm_width);
				var yy = (16+ec)+irandom((rm_height-(32+ec))-height);
				
				if (Check(xx-1,yy-1,xx+width+1,yy+height+1))
				{
					x1 = xx;
					y1 = yy;
					x2 = xx+width;
					y2 = yy+height;
					build = true;
					break;
				}
			}
			break;
		}
	
		if (build)
		{
			var mid_x_1 = Math.floor(x2-((x2-x1)/2));
			var mid_x_2 = Math.ceil((x2-(x2-x1)/2));
			var mid_y_1 = Math.floor(y2-((y2-y1)/2));
			var mid_y_2 = Math.ceil(y2-((y2-y1)/2));
			if ((type != 0) || (game_level != 0))
			for (var xx = x1; xx <= x2; xx++)
			{
				for (yy = y1; yy <= y2; yy++)
				{
					if (((xx == x1) || (xx == x2)) || ((yy == y1) || (yy == y2)))
					{
						if ((xx == mid_x_1) || (xx == mid_x_2))
						{
							
							if ((yy == y1)&&(door_u)) 
							temp_map[xx][yy] = (9+(2*locked[2]));//Door vert
							else
							if ((temp_map[xx][yy] == 0) || (temp_map[xx][yy] == 12))
							temp_map[xx][yy] = 5;//Wall
							
							if ((yy == y2)&&(door_d))
							temp_map[xx][yy] = (9+(2*locked[3]));//Door vert
							else
							if ((temp_map[xx][yy] == 0) || (temp_map[xx][yy] == 12))
							temp_map[xx][yy] = 5;//Wall
						}
						else
						if ((yy == mid_y_1) || (yy == mid_y_2))
						{
							if ((xx == x1)&&(door_l))
							temp_map[xx][yy] = (8+(2*locked[0]));//Door hor
							else
							if ((temp_map[xx][yy] == 0) || (temp_map[xx][yy] == 12))
							temp_map[xx][yy] = 5;//Wall
							
							if ((xx == x2)&&(door_r))
							temp_map[xx][yy] = (8+(2*locked[1]));//Door hor
							else
							if ((temp_map[xx][yy] == 0) || (temp_map[xx][yy] == 12))
							temp_map[xx][yy] = 5;//Wall
						}
						else
						if (((xx == x1+window_in_v) || (xx == x2-window_in_v)) && (type != 0))
						{
							temp_map[xx][yy] = 7; //Glass vert
						}
						else
						if (((yy == y1+window_in_h) || (yy == y2-window_in_h)) && (type != 0))
						{
							temp_map[xx][yy] = 6;//Glass hor
						}
						else
						{
							temp_map[xx][yy] = 5; //Block
						}
					}
					else
					{
						temp_map[xx][yy] = 4; //Floor
					}
				}
			}
			if (type == 0)//Start
			player = new Player(choose(mid_x_1,mid_x_2),choose(mid_y_1,mid_y_2));
			else
			if (type == 1)//Goal
			goal = new Goal(choose(mid_x_1,mid_x_2),choose(mid_y_1,mid_y_2));
			else
			if (type == 2)//Enemy
			{
				var tX = choose(mid_x_1,mid_x_2);
				var tY = choose(mid_y_1,mid_y_2);
				houseList[houseNum] = new House(tX,tY,houseNum);
				houseNum++;
				
				var oNum = Math.floor(difficulty/4)+Math.floor(difficulty/4)+irandom(3);
				for (var i = 0; i < oNum; i++)
				{
					var nt2 = choose(4,1);
					
					if (difficulty > 4)
					if (difficulty < 6)
					nt2 = choose(choose(choose(4,1),3),choose(4,1));
					else
					if (difficulty < 6)
					nt2 = choose(choose(4,1),choose(1,3));
					else
					if (difficulty < 9)
					nt2 = choose(choose(0,1),3);
					else
					nt2 = choose(1,3);
				
					
					if (murder)
					nt2 = choose(2,3);
					
					var nt = choose(choose(4,1),nt2);
					var St = 0;
					switch(nt)
					{
						case 0: St = 1;
						break;
						case 1: St = 0;
						break;
						case 2: St = 0;
						break;
						case 3: St = 1;
						break;
						case 4: St = 1;
						break;
					}
					
					npcList[npcNum] = new Npc(choose(mid_x_1,mid_x_2)+choose(-1,0,1),(mid_y_1,mid_y_2)+choose(-1,0,1),nt,St);
					npcNum++;
				}
				
				if (fence > 0)
				{
					var relX = 0;
					var relY = 0;
					
					if ((fence == 1) || (fence == 3))
					{
						relY = y1+irandom((y2-y1));
						if (fence == 1)
						{
							relX = x1-1;
							makeFence(relX,relY,-1,0);
						}
						else
						{
							relX = x2+1;
							makeFence(relX,relY,1,0);
						}
					}
					else
					{
						relX = x1+irandom((x2-x1));
						if (fence == 2)
						{
							relY = y1-1;
							makeFence(relX,relY,0,-1);
						}
						else
						{
							relY = y2+1;
							makeFence(relX,relY,0,1);
						}
					}
				}
				var iitem = choose(choose(true,false),false);
				var ipot = choose(choose(true,false),false);
				if (allLocked) iitem = true;
				if (iitem)
				{
					itemList[itemNum] = new Item(choose(mid_x_1,mid_x_2),choose(mid_y_1,mid_y_2),true,difficulty,-1);
					itemNum++;
				}

				if (ipot)
				{
					potionList[potionNum] = new Potion(choose(mid_x_1,mid_x_2),choose(mid_y_1,mid_y_2),difficulty+3);
					potionNum++;
				}
			}
		}
		
	}
	
	var Farm = function()
	{
		var width = 7+irandom(9);
		var height = 7+irandom(9);
		var build = false;
		var fhNumber = 1+irandom(Math.max(width,height)/3);
		
		var Check = function(X1,Y1,X2,Y2)
		{
			if (X1<1) return(false);
			if (X2>rm_width-2) return(false);
			if (Y1<0) return(false);
			if (Y2>rm_height-1) return(false);
			
			for (var xx = X1; xx <= X2; xx++)
			{
				for (var yy = Y1; yy <= Y2; yy++)
				{
					if ((temp_map[xx][yy] != 0) && (temp_map[xx][yy] != 1) && (temp_map[xx][yy] != 2))
					{
						return(false);
					}
				}
			}
			return(true);
		}
		
		var escape = 100;
		while(escape > 0)
		{
			escape--;
			var ec = 0;
			if (game_level == 0) ec = 10;
			var xx = irandom(rm_width);
			var yy = (16+ec)+irandom(rm_height-(32+ec)-height);
			if (Check(xx-1,yy-1,xx+width+1,yy+height+1))
			{
				x1 = xx;
				y1 = yy;
				x2 = xx+width;
				y2 = yy+height;
				build = true;
				break;
			}
		}
		
		if (build)
		{
			var mid_x_1 = Math.floor(x2-((x2-x1)/2));
			var mid_x_2 = Math.ceil((x2-(x2-x1)/2));
			var mid_y_1 = Math.floor(y2-((y2-y1)/2));
			var mid_y_2 = Math.ceil(y2-((y2-y1)/2));
			for (var xx = x1; xx <= x2; xx++)
			{
				for (yy = y1; yy <= y2; yy++)
				{
					temp_map[xx][yy] = 12;//Farmland
				}
			}
			
			for (var i = 0; i < fhNumber; i++)
			{
				npcList[npcNum] = new Npc(x1+irandom(x2-x1),y1+irandom(y2-y1),choose(0,4),1);
				npcNum++;
			}
		}
	}

	var water_add_trees = function()
	{
		for (var xx = 0; xx < rm_width; xx++)
		{
			for (var yy = 0; yy < rm_height; yy++)
			{
				//For every water on the map
				if (temp_map[xx][yy] != 2) continue;
				
				var check = true;
				for (var xp = -1; xp <= 1; xp++)
				{
					for (var yp = -1; yp <= 1; yp++)
					{
						if (clamp(0,xx+xp,rm_width-1) != xx+xp) continue;
						if (clamp(0,yy+yp,rm_height-1) != yy+yp) continue;
						
						if (temp_map[xx+xp][yy+yp] == 2) continue;//Shallow
						if (temp_map[xx+xp][yy+yp] == 3) continue;//Deep
						if (temp_map[xx+xp][yy+yp] == 13) continue;//Bridge
						check = false;
						if (temp_map[xx+xp][yy+yp] == 0)
						if (Math.random() < 0.04 - (0.0035*difficulty))
						{
							
							temp_map[xx+xp][yy+yp] = 1; //Tree
						}
					}
				}
				if (check)
				temp_map[xx][yy] = 3; //Deep water
			}
		}
	}
	
	var makeFence = function(x,y,hs,vs)
	{
		while(true)
		{
			if (clamp(0,x,rm_width-1) != x) break;
			if (clamp(0,y,rm_height-1) != y) break;
			
			if ((temp_map[x][y] < 3) || (temp_map[x][y] == 12))
			{
				(temp_map[x][y] != 12)
				temp_map[x][y] = 14;//Fence
				x += hs;
				y += vs;
			}
			else
			break;
		}
	}
	
	if (game_level == 0)
	for (var i = 0; i < 15; i++)
	Grove(irandom(rm_width),rm_height-1-irandom(irandom(10)));
	
	var groveNum = ((3-Math.floor(difficulty/3)) + irandom(10 - (difficulty)));
	for (var i = 0; i < groveNum; i++)
	Grove(irandom(rm_width),16+irandom(rm_height-32));
	
	var riverNum = Math.floor(difficulty/4) + irandom(2+(difficulty/3));
	for (var i = 0; i < riverNum; i++)
	River(16+irandom(rm_height-32));
	
	for (var i = 0; i < 2-(riverNum/2); i++)
	{
		if (Math.random() > riverNum/4.4)
		{
			var l = 16 + irandom(128-16);
			Creek(irandom(rm_width),irandom(rm_height),-1 + Math.random()*2,-1 + Math.random()*2,irandom(l/64),choose(1,2),l);
		}
	}
	
	water_add_trees();
	
	var farmNum = Math.floor(difficulty/3)+irandom(3+(difficulty/2));
	for (var i = 0; i < farmNum; i++)
	Farm();
	
	
	
	var housenum = 2 + irandom(2+ (difficulty/2))
	for (var i = 0; i < housenum; i++)
	Building(2);
	
	Building(0);
	Building(1);
	
	//Write everything to the world
	for (var xx = 0; xx < rm_width; xx++)
	{
			for (var yy = 0; yy < rm_height; yy++)
		{
			switch(temp_map[xx][yy])
			{
				case 0: //Nothing
					break;
				case 1: //Tree
				treeList[treeNum] = new Tree(xx,yy);
				treeNum++;
					break;
				case 2: //Shallow Water
				waterList[waterNum] = new Water(xx,yy,false);
				waterNum++;
					break;
				case 3: //Deep water
				waterList[waterNum] = new Water(xx,yy,true);
				waterNum++;
					break;
				case 4: //Floor
				floorList[floorNum] = new Floor(xx,yy,0);
				floorNum++;
					break;
				case 5: //Block
				wallList[wallNum] = new Wall(xx,yy);
				wallNum++;
					break;
				case 6: //Glass vert
				wallList[wallNum] = new Window(xx,yy,false);
				wallNum++;
					break;
				case 7: //Glass hor
				wallList[wallNum] = new Window(xx,yy,true);
				wallNum++;
					break;
				case 8: //Door vert unlocked
				wallList[wallNum] = new Door(xx,yy,false,false);
				wallNum++;
					break;
				case 9: //Door hor unlocked
				wallList[wallNum] = new Door(xx,yy,false,true);
				wallNum++;
					break;
				case 10: //Door vert locked
				wallList[wallNum] = new Door(xx,yy,true,false);
				wallNum++;
					break;
				case 11: //Door hor locked
				wallList[wallNum] = new Door(xx,yy,true,true);
				wallNum++;
					break;
				case 12: //Farm
				floorList[floorNum] = new Floor(xx,yy,1);
				floorNum++;
					break;
				case 13: //Bridge
				floorList[floorNum] = new Floor(xx,yy,2);
				floorNum++;
				var p = false;
				var d = difficulty;
				if (murder) 
				{
					p = true;
					d += 5;
				}
				
				if (difficulty > 4)
				p = true;
				
				if (p)
				if (irandom(50) < d)
				{
					npcList[npcNum] = new Npc(xx,yy,2,0);
					npcNum++;
				}
				
					break;
				case 14: //Fence
				wallList[wallNum] = new Fence(xx,yy);
				wallNum++;
					break;
			}
		}
	}

	//Do checks
	if (player == 0) return(false);
	if (goal == 0) return(false);
	var m =  e_map(player.x,player.y);
	if (m[goal.x][goal.y] == 32000) return(false);
	
	for (var i = 0; i < houseNum; i++)
	{
		var o = houseList[i];
		o.hMap = e_map(o.x,o.y,false);
	}
	var d = difficulty;
	var p = false;
	
	if (murder)
	{
		d += 6;
		p = true;
	}
	
	if (difficulty > 5) p = true;
	
	var rNum = Math.floor(d/2) + irandom(d);
	
	if (p)
	{
		for (i = 0; i < rNum; i++)
		{
			var loop = true;
			var escape = 100;
			while(loop)
			{
				var epx = irandom(rm_width);
				var epy = irandom(rm_height);
				if (canMove(epx,epy))
				{
					loop = false;
					npcList[npcNum] = new Npc(epx,epy,choose(2,3),1);
					npcNum++;
				}
				escape--;
				if (escape < 0) break;
			}
		}
	}
	
	var iNum = irandom(2);
	for (var i = 0; i < iNum; i++)
	{
		var epx = irandom(rm_width);
		var epy = irandom(rm_height);
		if (canMove(epx,epy))
		{
			itemList[itemNum] = new Item(epx,epy,false,difficulty,-1);
			itemNum++;
		}
	}
	
	var pNum = irandom(3)
	for (var i = 0; i < pNum; i++)
	{
		var epx = irandom(rm_width);
		var epy = irandom(rm_height);
		if (canMove(epx,epy))
		{
			potionList[potionNum] = new Potion(epx,epy,difficulty);
			potionNum++;
		}
	}
	
	return(true);
	
}
//-----------------------------------------------------------------------------------------------

var UI_update = function()
{
	'<div class = "color" style = "color:' + "#ffffff" + '">'
	var set_col = function(col)
	{
		return('</div><div class = "color" style = "color:' + col + '">');
	}
	
	var UI_stats = document.getElementById("stats");
	var UI_inv = document.getElementById("inv");
	
	
	var ebc = "#291507";
	var ec = "#aa8855";//Eye color 
	var mc = "#964012";//Mouth color
	var brn = "#564012";
	var blk = "#000000";
	var wte = "#ffffff";
	var m = "`";//mouth
	var e = "'";//Eye
	var eb = "_";//eyebrow
	
	var cent = (player.hp/player.stat_hp);
	if (cent <= 0)
	{
		e = "-";
		eb = ",";
		m = "-";
	}
	else
	if (cent < 0.4)
	{
		e = "'";
		eb = ",";
		m = "^";
	}
	else
	if (cent < 0.7)
	{
		e = "'";
		eb = "_";
		m = "-";
	}
	else
	{
		e = "'";
		eb = "_";
		m = "`";
	}
	
	var atb = 0;
	var stb = 0;
	var arb = 0;
	var deb = 0;
	
	var atx = 1;
	var stx = 1;
	var arx = 1;
	var dex = 1;
	if (player != 0)
	{
		if (player.item != -1)
		{
			atb = player.item.stat_attack;
			stb = player.item.stat_strength;
			arb = player.item.stat_armor;
			deb = player.item.stat_dodge;
		}
		
		atx = player.p_att
		stx = player.p_str
		arx = player.p_arm
		dex = player.p_dge
	}
	
	if (game_screen == 2)
	var portrait = set_col(wte)+"</br>+--" + set_col(brn) + "___" + set_col(wte) + "--+</br>| " + set_col(brn) + "/" + set_col(ebc) + eb + set_col(brn) + " " + set_col(ebc) + eb + set_col(brn) + "\\" + set_col(wte) + " |</br>|" + set_col(brn) + "<|" + set_col(ec) + e + set_col(brn) + "u" + set_col(ec) + e + set_col(brn) + "|>" + set_col(wte) + "|</br>| " + set_col(brn) + "\\ "  + set_col(mc) +  m  + set_col(brn) +  " /" + set_col(wte) + " |</br>+--" + set_col(brn) + "| |" + set_col(wte) + "--+</br>";
	else
	var portrait = set_col(wte)+ "</br>+-------+</br>|"+set_col(blk)+"-------"+set_col(wte)+"|</br>|"+set_col(blk)+"-------"+set_col(wte)+"|</br>|"+set_col(blk)+"-------"+set_col(wte)+"|</br>+-------+</br>";
	
	var u_stats = set_col(wte);
	var u_inv = set_col(wte);
	u_stats += "HP: ";
	
	if (game_screen == 2)
	u_stats += Math.max(player.hp,0);
	else
	u_stats += "--";
	
	u_stats += "/";
	
	if (game_screen == 2)
	u_stats += player.stat_hp;
	else
	u_stats += "--";
	
	if (game_screen == 2)
	{
		var Atk = Math.round(player.stat_attack+atb);
		var Str = Math.round((player.stat_strength+stb)*2);
		var Dge = Math.round((player.stat_dodge+deb)*(10/3));
		var Arm = Math.round((10+((1-(player.stat_armor+arb))*10)));
	}
	else
	{
		var Atk = "--";
		var Str = "--";
		var Dge = "--";
		var Arm = "--";
	}
	
	var dS = false;
	var AK = "";
	var ST = "";
	var DE = "";
	var AR = "";
	
	if (atx > 1)
	{
		AK = "(x"+atx+")";
		dS = true;
	}
	
	if (stx > 1)
	{
		ST = "(x"+stx+")";
		dS = true;
	}
	
	if (dex > 1)
	{
		DE = "(x"+dex+")";
		dS = true;
	}
	
	if (arx > 1)
	{
		AR = "(x"+arx+")";
		dS = true;
	}
	
	u_stats += portrait;
	u_stats += "</br>ATK: " + Atk + AK;
	u_stats += "</br>STR: " + Str + ST;
	u_stats += "</br>DGE: " + Dge + DE;
	u_stats += "</br>ARM: " + Arm + AR;
	
	if (player != 0)
	if (dS)
	u_stats += "</br>Drink Duration: " + (player.potionDur+2);
	
	if (game_screen == 2)
	{
		if (player != 0)
		if (player.item != -1)
		{
			u_inv += player.item.name+"</br>";
			u_inv += get_weapon_icon(player.item.type);
			u_inv += "(";
			if (!player.item.lethal) u_inv += "non-";
			u_inv += "lethal)</br>"
			u_inv += "Level " + player.item.level + "</br>";
			if (player.item.pick)
			u_inv += "Pick locks";
			else
			if (player.item.fence)
			u_inv += "Destroy fences";
			
		}
		else
		{
			u_inv += "Fists</br>";
			u_inv += get_weapon_icon(-1);
			u_inv += "</br></br>";
		}
	}
	else
	{
			u_inv += "</br>";
			u_inv += get_weapon_icon(-2);
			u_inv += "</br></br>";
	}
	u_inv += "</br>";
	if (game_screen == 2)
	{
		if (player != 0)
		if (player.potion != -1)
		{
			var pq = "";
			switch(player.potion.level)
			{
				case 0: pq = "Bad";
				break;
				case 1: pq = "Cheap";
				break;
				case 2: pq = "Regular";
				break;
				case 3: pq = "Vintage";
				break;
			}
			u_inv += ""+pq + " " + player.potion.name.toLowerCase() + "</br>";
			u_inv += get_potion_icon(player.potion.type);
		}
		else
		{
			u_inv += "</br>";
			u_inv += get_potion_icon(-1);
			u_inv += "";
		}
	}
	else
	{
			u_inv += "</br>";
			u_inv += get_potion_icon(-1);
	}
	
	UI_stats.innerHTML = u_stats + "</div>";
	UI_inv.innerHTML = u_inv + "</div>";
}

var help = function()
{
	var str = get_controls();
	output_add("");
	output_add("");
	output_add(str);
	output_add("Try to get to the northernmost house. It will have a bed (" + '<div class = "color" style = "color:#ffffff">' + ":" + '</div>' + ") waiting.");
}

var init = function()
{
	for (var x = 0; x < scr_width; x++)
	{
			if (!screen[x]) screen[x] = [];
			if (!screen_color[x]) screen_color[x] = [];
	}
	murder = false;
	game_level = 0;
	
	game_item = -1;
	game_item_pick = false;
	game_item_lethal = false;
	game_item_fence = false;
	game_item_level = 0;
	game_item_stat_attack = 0;
	game_item_stat_strength = 0;
	game_item_stat_dodge = 0;
	game_item_stat_armor = 0;
	
	game_potion = -1;
    game_potion_level = 0;
	
	
	screenClear();
	for (var i = 0; i < OPNum; i++)
	output_add("");

	
	while(!generateLevel(0)) {};
	
	
	
	step(-1);
	UI_update();
	draw();
}

var start_level = function()
{
	game_screen = 2;
	screenClear();
	
	for (var i = 0; i < OPNum; i++)
	output_add("");
	
	while(!generateLevel(game_level)) {};
	
	if (game_item != -1)
	{
		var t_item = new Item(-100,100,false,-1,0);
		t_item.type = game_item;
		t_item.pick = game_item_pick;
		t_item.lethal = game_item_lethal;
		t_item.fence = game_item_fence;
		t_item.level = game_item_level;
		t_item.stat_attack = game_item_stat_attack;
		t_item.stat_strength = game_item_stat_strength;
		t_item.stat_dodge = game_item_stat_dodge;
		t_item.stat_armor = game_item_stat_armor;
		t_item.EV_reval();
		
		itemList[itemNum] = t_item;
		itemNum++;
		
		player.item = t_item;
	}
	
	if (game_potion != -1)
	{
		var t_potion = new Potion(-100,-100,0)
		t_potion.type = game_potion;
		t_potion.level = game_potion_level;
		t_potion.EV_reval();
		potionList[potionNum] = t_potion
		potionNum++;
		player.potion = t_potion;
	}


	
	step(-1);
	UI_update();
	draw();
}

var reset = function()
{
	score = 0;
	startScreen = true;
	highscore = 0;
	lost = false;
}

var look = function()
{
	var fence = 0;
	var tree = 0;
	var slave = 0;
	var houses = 0;
	
	var houseD = 1000;
	var bridgeD = 1000;
	var farmD = 1000;
	var fenceD = 1000;
	var treeD = 1000;
	var slaveD = 1000;
	var waterD = 1000;
	var depth = false;
	
	var inside = false;
	for (var i = 0; i < floorNum; i++)
	{
		var o = floorList[i];
		if (o.x != player.x) continue;
		if (o.y != player.y) continue;
		if (o.type == 0) 
		{
			inside = true;
			break;
		}
	}
	output_add("");
	if (!inside)
	{
		if (!player.tree)
		output_add("You look around.");
		else
		output_add("You peer out from the trees.");
	}
	else
	output_add("You glance out a window.");
	
	
	for (var i = 0; i < npcNum; i++)
	{
		var n = npcList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				if (!n.hostile)
				{
					slave++;
					var d = point_distance(player.x,player.y,n.x,n.y);
					if  (d < slaveD)
					slaveD = d;
				}
			}
		}
	}
	
	for (var i = 0; i < wallNum; i++)
	{
		var n = wallList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (n.seethru)
		if (!n.window)
		if (!n.door)
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				fence++;
					var d = point_distance(player.x,player.y,n.x,n.y);
					if  (d < fenceD)
					fenceD = d;
			}
		}
	}
	
	for (var i = 0; i < treeNum; i++)
	{
		var n = treeList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				tree++;
					var d = point_distance(player.x,player.y,n.x,n.y);
					if  (d < treeD)
					treeD = d;
			}
		}
	}
	
	for (var i = 0; i < waterNum; i++)
	{
		var n = waterList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
					var d = point_distance(player.x,player.y,n.x,n.y);
					if (d < waterD)
					waterD = d;
					if (n.deep) depth = true;
			}
		}
	}
	
	for (var i = 0; i < floorNum; i++)
	{
		var n = floorList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				if (n.type == 2) //Bridge
				{
					var d = point_distance(player.x,player.y,n.x,n.y);
					if  (d <bridgeD)
					bridgeD = d;
				}
				else
				if (n.type == 1) //farm
				{
					var d = point_distance(player.x,player.y,n.x,n.y);
					if  (d <farmD)
					farmD = d;
				}
			}
		}
	}
	
	for (var i = 0; i < houseNum; i++)
	{
		var n = houseList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			var empty = [];
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,empty,0,sightRange))
			{
				if (inside)
				if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
				continue;
				
				houses++;
				var d = point_distance(player.x,player.y,n.x,n.y);
				if  (d <houseD)
				houseD = d;
			}
		}
	}
	
	
	var des = "";
	if (fence > 0)
	des += "There is a fence " + disGeneral(fenceD);
	
	if (!player.tree)
	{
		if (tree > 0)
		{	
			if (des != "") des += "</br>";
			var plural = "";
			if (tree > 1) plural = "s";
			des += "There " + numGeneral(tree) + " tree" + plural + " " + disGeneral(treeD) + ".";
		}
	}
	
	if (farmD != 1000)
	{
		if (des != "") des += "</br>";
		des += "A stretch of farmland is " + disGeneral(farmD) + ".";
	}
	
	if (slave > 0)
	{
		if (des != "") des += "</br>";
		var plural = "";
		if (slave > 1) plural = "s";
		des += "There " + numGeneral(slave) + " slave" + plural + " working " + disGeneral(slaveD) + ".";
	}
	
	if (waterD != 1000)
	{
		if (des != "") des += "</br>";
		if (bridgeD != 1000)
		{
			des += "A river runs " + disGeneral(bridgeD) + ".";
		}
		else
		{
			if (!depth)
			des += "Some shallow water flows " + disGeneral(waterD) + ".";
			else
			des += "Some water lies " + disGeneral(waterD) + ".";
		}
	}
	
	if (houses > 0)
	{
		if (des != "") des += "</br>";
		var plural = "";
		if (houses > 1) plural = "s";
		des += "There " + numGeneral(houses) + " house" + plural + " " + disGeneral(houseD) + ".";
	}
	
	if (des != "")
	output_add(des);
	
	for (var i = 0; i < potionNum; i++)
	{
		var n = potionList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				n.EV_describe();
			}
		}
	}
	
	for (var i = 0; i < itemNum; i++)
	{
		var n = itemList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				n.EV_describe();
			}
		}
	}
	
	for (var i = 0; i < npcNum; i++)
	{
		var n = npcList[i];
		
		var xx = n.x-xView;
		var yy = n.y-yView;
		if (onScreen(xx,yy))
		{
			if (canSee(player.x-xView,player.y-yView,xx,yy,n,wallList,wallNum,sightRange))
			{
				if (n.hostile)
				n.EV_describe();
			}
		}
	}
}	

var step = function(t)
{	
	//CODES
	/*
	 -1: "Other"
	  0: left
	  1: right
	  2: up
	  3: down
	  4: NW
	  5: NE
	  6: SE 
	  7: Sw 
	  8: INTERACT
	  9: POTION
	  10: INVENTORY
	  11: LOOK (Does not count as move)
	*/
	f_map();
	
	for (i = 0; i < npcNum; i++)
	{
		npcList[i].EV_step();
	}
	player.EV_step(t);
}

var draw = function ()
{
	switch(game_screen)
	{
		case 0: //menu
		screenClear();
		var temp_s = get_menu();
		var scr = "";
		for (var y = 0; y < scr_height; y++)
	    {
			for (var x = 0; x < scr_width; x++)
			{
				scr += col_get(col_get_symbol_menu(temp_s[x][y]));
				scr += temp_s[x][y];
				scr += " </div>";
			}
			scr += "<br/>";
	    }
		display.innerHTML = scr;
			break;
		case 1: //in between levels
		screenClear();
		var temp_s = get_wanted_poster();
		var scr = "";
		for (var y = 0; y < scr_height; y++)
	    {
			for (var x = 0; x < scr_width; x++)
			{
				scr += col_get(col_get_symbol(temp_s[x][y]));
				scr += temp_s[x][y];
				scr += " </div>";
			}
			scr += "<br/>";
	    }
		display.innerHTML = scr;
		break;
		case 2: //game
		screenClear();
		//Objects draw
		for (var i = 0; i < floorNum; i++)
		{
			floorList[i].EV_draw();
		}
		
		for (var i = 0; i < particleNum; i++)
		{
			particleList[i].EV_draw();
		}
		
		for (var i = 0; i < waterNum; i++)
		{
			waterList[i].EV_draw();
		}
		
		for (var i = 0; i < wallNum; i++)
		{
			wallList[i].EV_draw();
		}
		
		for (var i = 0; i < potionNum; i++)
		{
			potionList[i].EV_draw();
		}
		
		for (var i = 0; i < itemNum; i++)
		{
			itemList[i].EV_draw();
		}
	
		for (var i = 0; i < treeNum; i++)
		{
			treeList[i].EV_draw();
		}
		
		for (var i = 0; i < npcNum; i++)
		{
			var o = npcList[i];
			
			if ((!o.dead) && (o.state != 5)) continue;
			o.EV_draw();
		}
		
		for (var i = 0; i < npcNum; i++)
		{
			var o = npcList[i];
			
			if (o.dead) continue;
			if (o.state == 5) continue;
			o.EV_draw();
		}
		
		goal.EV_draw();
		player.EV_draw();
		
		
		//Draw screen
		var scr = "";
		for (var y = 0; y < scr_height; y++)
	    {
			for (var x = 0; x < scr_width; x++)
			{
				scr += col_get(screen_color[x][y]);
				//if (screen[x][y] != 0)
				scr += symb(screen[x][y]);
				//else
				//scr += (map[clamp(0,x+xView,rm_width-1)][clamp(0,y+yView,rm_height-1)]).toString();
				
				scr += " </div>";
			}
			scr += "<br/>";
	    }
		display.innerHTML = scr;
		break;
		case 3: //win
		screenClear();
		var temp_s = get_win();
		var scr = "";
		for (var y = 0; y < scr_height; y++)
	    {
			for (var x = 0; x < scr_width; x++)
			{
				scr += col_get(col_get_symbol_menu(temp_s[x][y]));
				scr += temp_s[x][y];
				scr += " </div>";
			}
			scr += "<br/>";
	    }
		display.innerHTML = scr;
	}
}

var update = function()
{	
	switch(game_screen)
	{
		case 0: //menu
		if (keyPress == 8)
		{
			game_screen = 1;
			keyPress = -2;
			draw();
		}
		break;
		case 1: //Between levels
		if (keyPress == 8)
		{
			start_level();
			if (game_level == 0)
			output_add("Press ? for help");
		}	
		break;
		case 2:
		if (keyPress != -2)
		{
			if (keyPress == 12)
			{
				look();
			}
			else
			if (keyPress == 13)
			{
				help();
			}
			else
			{
				step(keyPress);
				draw();
				UI_update();
			}
		}
		break;
	}
	keyPress = -2;
}

init();
takeInput();
window.setInterval(update,1000 / fps);

