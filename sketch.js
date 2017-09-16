//Enemy Config
var enemy_spawn_rate = 14;
var bonus_round_enemy_spawn_rate = 5 
////////////////////////////////////

//General Config
var score_incrementor = 1;                            
var score_required_bonus_round = 100;
var bonus_round = false;
var score_point_spawn_rate = 200;
////////////////////////

//Global entities
var main_player;
////////////////

//List Definitions
var enemy_list = [];
var float_text_list = [];
var entity_list = []; 
/////////////////////////

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
		this.score = 0;
		this.speed = 0;
		this.maxSpeed = 5;	
	}
	draw(){
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
		this.speed = (Math.random()*20)+5;
		this.tail_length = this.speed;
		this.damage = Math.round(this.speed/2);
	}
	draw(){
		for(var i = 0;i<Math.round(this.tail_length);i++){
			if(bonus_round){
				
				fill(color(this.rand_color_value,255,i*15))
			}else{
				
				fill(color(255,0,i*15))
			}
			rect(this.x,this.y+(i*20)-200,this.width,this.height);
		}
		this.y += this.speed;
		if(this.collides(main_player)){
			this.to_delete = true;
			addNewFloatText("-"+this.damage,this.x,this.y,100);
			main_player.score-=this.damage;
		}		
	}
	out_of_bounds(){
		return  this.y > windowHeight+300;
	}
}
class ScorePoint extends Entity{
	constructor(x,y){
		super(x,y)
		this.value = 50;
		this.width = 25;
		this.height = 25;
		this.speed = 10;
		this.color = color('hsb(59, 100%, 50%)');
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
		// if(main_player.score == score_required_bonus_round){
		// 	bonus_round = true;
		// 	score_incrementor = 5;
		// }
		// if(main_player.score == score_required_bonus_round+100){
		// 	bonus_round = false;
		// 	score_required_bonus_round *= 2;
		// 	score_incrementor = 1;
		// }
		
		// if(current_entity.y >= windowHeight+200){
		// 	if(bonus_round){
		// 		addNewFloatText("+5",current_entity.x,windowHeight+10);
		// 		main_player.score += 5;
		// 	}else{
		// 		addNewFloatText("+1",current_entity.x,windowHeight+10);
		// 		main_player.score += 1;
		// 	}			
		// 	enemy_list.splice(i,1);

		// }
		// if(bonus_round){
		// 	enemy_spawn_rate = 10;
		// }else{
		// 	enemy_spawn_rate = 20;
		// }
		
	}
}

function addNewFloatText(input_text,x,y){
	entity_list.push(new FloatText(input_text,x,y,100))
}


function setup(){
	main_player = new Player(windowWidth/2,windowHeight-100)
	createCanvas(windowWidth-10,windowHeight-10);
	//noFill();
	textSize(32);
	noStroke();
	colorMode(HSB,255);
	frameRate(60);
		
}


function draw(){
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
	
	text("Points till next bonus: "+(score_required_bonus_round-main_player.score),100,100+35+35);

			
}

function keyPressed(){
	if(keyCode == RIGHT_ARROW){
		main_player.speed = main_player.maxSpeed;
	}
	if(keyCode == LEFT_ARROW){
		main_player.speed = -main_player.maxSpeed;
	}	
}

function keyReleased(){
	if(keyCode == RIGHT_ARROW){
		main_player.speed = 0;
	}
	if(keyCode == LEFT_ARROW){
		main_player.speed = 0;
	}
}
function windowResized(){
	resizeCanvas(windowWidth,windowHeight)
}
