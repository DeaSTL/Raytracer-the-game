//Enemy Config
var enemy_spawn_rate = 14;
var bonus_round_enemy_spawn_rate = 5 
////////////////////////////////////

//General Config
var score_incrementor = 1;                            
var score_required_bonus_round = 100;
var bonus_round = false;
var score_point_spawn_rate = 150;
var imagine_font;
var game_running = true;
////////////////////////

//Global entities
var main_player;
////////////////

//List Definitions
var enemy_list = [];
var float_text_list = [];
var entity_list = []; 
/////////////////////////
function ResetGame(){
	score_incrementor = 1;
	score_required_bonus_round = 100;
	bonus_round = false;
	score_point_spawn_rate = 150;
	game_running = true;
	main_player.score = 100;
	main_player.x = windowWidth/2
	enemy_spawn_rate = 14;
	bonus_round_enemy_spawn_rate = 5;
	entity_list = [];
	textSize(32);
}
class RectangleCollisionObject{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.width = 100;
		this.height = 100;
	}
	collides(rect){
		return collideRectRect(
			rect.x,
			rect.y,
			rect.width,
			rect.height,
			this.x,
			this.y,
			this.width,
			this.height);
	}

}
class Entity extends RectangleCollisionObject {
	constructor(x,y){
		super(x,y);
		//this is a varible for entities that have a limited lifespan
		this.to_delete = false;
		this.is_collidable = true;
	}
	update(){

	}
	draw(){

	}
	out_of_bounds(){

	}

}


class Player extends RectangleCollisionObject {
	constructor(x,y){
		super(x,y);
		this.width = 100;
		this.height = 100;
		this.score = 100;
		this.speed = 0;
		this.max_speed = 10;
		this.direction = false;
		this.is_moving = false;	
	}
	
	draw(){
		if(this.direction){
			this.speed = this.max_speed;
		}else{
			this.speed = -this.max_speed;
		}
		if(!this.is_moving){
			this.speed = 0;
		}
		if(this.x < 0){
			this.speed = 0;
			this.x = 0;
		}
		if(this.x > windowWidth-this.width){
			this.speed = 0;
			this.x = windowWidth-this.width;
		}		

		this.x += this.speed;
		
		fill(255);
		rect(this.x,this.y,this.width,this.height);
	}
}



 
class FloatText extends Entity {
	constructor(input_text,x,y,life_span){
		super(x,y);
		this.input_text = input_text;
		this.is_collidable = false;
		this.text_scale = 32;
		this.brightness = 255;

		this.life_span = life_span
		this.life_span_decrementor = 255/this.life_span;
		textSize(this.text_scale);


	}
	draw(){
		
		this.life_span -= 1;
		this.brightness -= this.life_span_decrememtor;
		fill(255);
		text(this.input_text,this.x,this.y);
		this.y -= 4;
		if(this.life_span <= 0){
			this.to_delete = true;
		} 
	}
}
class Enemy extends Entity {
	constructor(x,y){
		super(x,y);
		this.width = 25;
		this.height = 100;
		this.speed = (Math.random()*40)+5;
		this.tail_length = this.speed;
		this.damage = Math.round(this.speed);
		this.color = color(360,0,0);
		this.saturation = 0;
		this.hue = 360;


	}

	draw(){
		
		for(var i = 0;i<Math.round(this.tail_length);i++){	
			fill(color(this.hue,this.saturation,lightness(this.color)+(i*3)));
			
			rect(this.x,this.y+(i*20)-(this.tail_length*10),this.width,this.height);
		}
		this.y += this.speed;
		if(this.collides(main_player)){
			this.to_delete = true;
			addNewFloatText("-"+this.damage,this.x,this.y,100);
			main_player.score-=this.damage;
		}
		this.update();		
	}
	out_of_bounds(){
		return  this.y > windowHeight+300;
	}
}
class RainbowEnemy extends Enemy{
	constructor(x,y){
		super(x,y);
		this.saturation = 100;
		this.hue = Math.random()*360;
		this.damage *= 2;
	}
	update(){
		this.hue += 4;
		if(this.hue > 360){
			this.hue = 0;
		}
	}
}

class ScorePoint extends Entity{
	constructor(x,y){
		super(x,y)
		this.value = 50;
		this.width = 25;
		this.height = 25;
		this.speed = 10;
		this.color = color(59,100,50);
	}
	draw(){
		this.y += this.speed;
		fill(this.color);
		rect(this.x,this.y,this.width,this.height);
		if(this.collides(main_player)){
			this.to_delete = true;
			main_player.score += this.value;
			addNewFloatText("+"+this.value,this.x,this.y)
		}
	}
	out_of_bounds(){
		return this.y > windowHeight+300;
	}
}  

function GenerateEntities(){
	row_count = 30
	seperation_width = windowWidth/row_count;

	if(frameCount%enemy_spawn_rate == 0){
		rand_value = Math.round(Math.random()*row_count);
		entity_list.push(new Enemy(rand_value*seperation_width,-200))		
	}
	if(frameCount%(enemy_spawn_rate*5) == 0){
		rand_value = Math.round(Math.random()*row_count);
		entity_list.push(new RainbowEnemy(rand_value*seperation_width,-200))		
	}
	if(frameCount%score_point_spawn_rate == 0){
		rand_value = (Math.random()*row_count);
		entity_list.push(new ScorePoint(rand_value*seperation_width,-200));
	}

}
function DrawEntities(){
	for(var i = 0;i<entity_list.length;i++){
		current_entity = entity_list[i];
		current_entity.draw();
		if(current_entity.to_delete){
			entity_list.splice(i,1);
		}
		if(current_entity.out_of_bounds()){
			entity_list.splice(i,1);
		}
	}
	if(main_player.score < 1){
		game_running = false;
	}
}

function addNewFloatText(input_text,x,y){
	entity_list.push(new FloatText(input_text,x,y,100))
}
function preload(){
	imagine_font = loadFont('./imagine_font.otf');
}

function setup(){
	main_player = new Player(windowWidth/2,windowHeight-100)
	createCanvas(windowWidth-10,windowHeight-10);
	//noFill();
	textFont(imagine_font);
	textSize(32);
	noStroke();
	colorMode(HSL,360,100,100);
	frameRate(60);
		
}


function draw(){
	
	if(game_running){

		GenerateEntities();
		background(0);
		DrawEntities();
		main_player.draw();
		fill(255);
		
		if(main_player.score < 1){
			fill(color('hsb(0,99.51%,70.57%)'));
			text("Score: "+main_player.score,100,100+35);
		}else if(main_player.score > 0){
			fill(color('hsl(84, 100%, 40%)'));
			text("Score: "+main_player.score,100,100+35);	
		}
		fill(255);
	}else{
		game_over = "Game Over";

		textSize(windowWidth/game_over.length);
		background(0);
		x = (textWidth(game_over))-(windowWidth/2);
		y = (windowHeight/2)-textSize();
		width = textWidth(game_over);
		height = textSize();

		if(collidePointRect(mouseX,mouseY,x,y,width,height)){
			fill(98,100,42);
			text("Game Over",(textWidth(game_over))-(windowWidth/2),windowHeight/2);
			if(mouseIsPressed){
				ResetGame();	
			}
		}else{
			fill(0,0,100);
			text("Game Over",(textWidth(game_over))-(windowWidth/2),windowHeight/2);

		}

	}
	//text("Points till next bonus: "+(score_required_bonus_round-main_player.score),100,100+35+35);

			
}

function keyPressed(){
	if(keyCode == RIGHT_ARROW){
		main_player.direction = true;
		main_player.is_moving = true;
	}
	if(keyCode == LEFT_ARROW){
		main_player.direction = false;
		main_player.is_moving = true;
	}	
}

function keyReleased(){
	if(keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW){
		main_player.is_moving = false;
	}
	
}
function windowResized(){
	resizeCanvas(windowWidth-10,windowHeight-10);
	main_player.x = windowWidth/2;
	main_player.y = windowHeight-100;

}
