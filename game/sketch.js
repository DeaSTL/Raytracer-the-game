//Enemy Config
var enemy_spawn_rate = 14;
var enemy_damage_rate = 10;
var bonus_round_enemy_spawn_rate = 5 
////////////////////////////////////
var score_incrementor = 1;                            
var score_required_bonus_round = 100;
var bonus_round = false;
var main_player;
var enemy_list = [];
var float_text_list = []; 


function Player(x,y){
	this.position = {x:x,y:y};
	this.width = 100;
	this.height = 100;
	this.color = 255
	this.health = 255;
	this.score = 0;
	this.speed = 0;
	this.maxSpeed = 5;
	this.draw = function(){
		if(this.position.x < 0){
			this.speed = 0;
			this.position.x = 0;
		}
		if(this.position.x > windowWidth-this.width){
			this.speed = 0;
			this.position.x = windowWidth-this.width;
		}		

		this.position.x += this.speed;
		
		fill(this.color)
		rect(this.position.x,this.position.y-100,this.width,this.height);
			
		
	};
		
};
function FloatText(input_text,x,y,lifeSpan){
	this.input_text = input_text;
	this.x = x;
	this.y = y;
	this.text_scale = 32;
	this.brightness = 255;
	
	this.life_span = lifeSpan;
	this.brightness_decrememtor = 255/this.life_span;
	textSize(this.text_scale);

	this.draw = function(){
		this.life_span -= 1;
		this.brightness -= this.brightness_decrememtor;
		fill(color(255,0,this.brightness*25));
		text(this.input_text,this.x,this.y);
		this.y -= 4; 

	};
};
function Enemy(x,y){
	this.position = {x:x,y:y};
	this.width = 25;
	this.height = 100;
	this.color = color(255);
	this.speed = 0;
	this.random_color = false;
	this.rand_color_value = Math.random()*255; 
	
	this.draw = function(){
		
		for(var i = 0;i<10;i++){
			if(bonus_round){
				this.speed = 17;
				fill(color(this.rand_color_value,255,i*15))
			}else{
				this.speed = 10;
				fill(color(255,0,i*15))
			}
			rect(this.position.x,this.position.y+(i*20)-200,this.width,this.height);		
		}
	};
	this.collides = function(x,y,width,height){
		return collideRectRect(x,y,width,height,this.position.x,this.position.y,this.width,this.height);
	};	
};
function GenerateEntities(){


	if(frameCount%enemy_spawn_rate == 0){
		enemy_list.push(new Enemy(Math.random()*windowWidth,-200))		
	}

}
function DrawEnemies(){
	for(var i = 0;i<enemy_list.length;i++){
		currentEnemy = enemy_list[i];
		collision = currentEnemy.collides(main_player.position.x,main_player.position.y-100,main_player.width,main_player.height);

		if(collision == true){
			addNewFloatText("-10",main_player.position.x,main_player.position.y);
			main_player.health -= 10;
			main_player.color = main_player.health;
			if(main_player.health < 1){
				main_player.health = 255;
				main_player.score = 0;
			}
			enemy_list.splice(i,1);
			
		
		}
		
		currentEnemy.draw();
		currentEnemy.position.y += currentEnemy.speed;
		if(main_player.score == score_required_bonus_round){
			bonus_round = true;
			score_incrementor = 5;
		}
		if(main_player.score == score_required_bonus_round+100){
			bonus_round = false;
			score_required_bonus_round *= 2;
			score_incrementor = 1;
		}
		
		if(currentEnemy.position.y >= windowHeight+200){
			if(bonus_round){
				addNewFloatText("+5",currentEnemy.position.x,windowHeight+10);
				main_player.score += 5;
			}else{
				addNewFloatText("+1",currentEnemy.position.x,windowHeight+10);
				main_player.score += 1;
			}			
			enemy_list.splice(i,1);

		}
		if(bonus_round){
			enemy_spawn_rate = 10;
		}else{
			enemy_spawn_rate = 20;
		}
		
	}
}
function DrawFloatText(){
	for (var i = 0; i<float_text_list.length; i++) {
	    float_text_list[i].draw();
		if(float_text_list[i].life_span < 1){
			float_text_list.splice(i,1);
	    }
		
	}
}
function addNewFloatText(input_text,x,y){
	float_text_list.push(new FloatText(input_text,x,y,100))
}


function setup(){
	main_player = new Player(windowHeight-50,windowWidth/2)
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
	DrawFloatText();
	DrawEnemies();
	main_player.draw();
	fill(255);
	text("Health: "+main_player.health,100,100);
	text("Score: "+main_player.score,100,100+35);
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
