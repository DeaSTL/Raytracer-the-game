var enemy_spawn_rate = 14;
var enemy_damage_rate = 10;
var bonus_round_enemy_spawn_rate = 5 
var score_incrementor = 1;                            
var bonus_round = false;
var mainPlayer;
var enemyList = [];
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
		if(frameCount%10 == 0){
			this.score+= score_incrementor;
		}		
		
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
function GenerateEnemies(){
	if(bonus_round){
		if(frameCount%bonus_round_enemy_spawn_rate == 0){
			enemyList.push(new Enemy(Math.random()*windowWidth,-200))		
		}
	}else{
		if(frameCount%enemy_spawn_rate == 0){
			enemyList.push(new Enemy(Math.random()*windowWidth,-200))		
		}
	}
}
function DrawEnemies(){
	for(var i = 0;i<enemyList.length;i++){
		currentEnemy = enemyList[i];
		collision = currentEnemy.collides(mainPlayer.position.x,mainPlayer.position.y-100,mainPlayer.width,mainPlayer.height);

		if(collision == true){
			addNewFloatText("-10",mainPlayer.position.x,mainPlayer.position.y);
			mainPlayer.health -= 10;
			mainPlayer.color = mainPlayer.health;
			if(mainPlayer.health < 1){
				mainPlayer.health = 255;
				mainPlayer.score = 0;
			}
			enemyList.splice(i,1);
			
		
		}
		
		currentEnemy.draw();
		currentEnemy.position.y += currentEnemy.speed;
		if(mainPlayer.score % 100 == 0){
			bonus_round = true;
			score_incrementor = 5;
		}
		if(mainPlayer.score % 350 == 0){
			bonus_round = false;
			score_incrementor = 1;
		}
		if(currentEnemy.position.y >= windowHeight+500){
			enemyList.splice(i,1);
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
	mainPlayer = new Player(windowHeight-50,windowWidth/2)
	createCanvas(windowWidth-10,windowHeight-10);
	//noFill();
	textSize(32);
	noStroke();
	colorMode(HSB,255);
	frameRate(60);
		
}


function draw(){
	GenerateEnemies();
			
	background(0);
	DrawFloatText();
	DrawEnemies();
	mainPlayer.draw();
	fill(255);
	text("Health: "+mainPlayer.health,100,100);
	text("Score: "+mainPlayer.score,100,100+35);

			
}

function keyPressed(){
	if(keyCode == RIGHT_ARROW){
		mainPlayer.speed = mainPlayer.maxSpeed;
	}
	if(keyCode == LEFT_ARROW){
		mainPlayer.speed = -mainPlayer.maxSpeed;
	}	
}

function keyReleased(){
	if(keyCode == RIGHT_ARROW){
		mainPlayer.speed = 0;
	}
	if(keyCode == LEFT_ARROW){
		mainPlayer.speed = 0;
	}
}
