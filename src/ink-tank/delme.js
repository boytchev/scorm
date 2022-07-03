LINES: 1097 -> 324 (30%)

//	Glass texture
//		https://www.deviantart.com/galaxiesanddust/art/Dirty-Window-Texture-311006931
//	Warning symbols
//		https://en.wikipedia.org/wiki/European_hazard_symbols
//		http://www.hse.gov.uk/chemical-classification/labelling-packaging/hazard-symbols-hazard-pictograms.htm
//	Sound effects
//		https://freesound.org/people/irisfilm/sounds/463719/
//		https://freesound.org/people/DCSFX/sounds/366159/
//		https://freesound.org/people/Johnnyfarmer/sounds/209772/
//

// конструктор на модела
MEIRO.Models.T001 = function T001(room, model)
{
	MEIRO.Model.apply(this, arguments);
	

	this.initialize();
	this.construct();
	
	this.audioWater = new Audio('sounds/water-pipes.mp3');
	this.audioWater.loop = true;
	this.audioWater.volume = 0;

	this.audioBubbles = new Audio('sounds/water-bubbles.mp3');
	this.audioBubbles.loop = true;
	this.audioBubbles.volume = 0;

	this.audioBoom = new Audio('sounds/water-boom.mp3');
	this.audioBoom.loop = false;
	this.audioBoom.volume = 0.5;
}
MEIRO.Models.T001.prototype = Object.create(MEIRO.Model.prototype);



MEIRO.Models.T001.prototype.initialize = function()
{
	this.waterCyan = 0;
	this.waterMagenta = 0;
	this.waterYellow = 0;
	this.waterLevel = 0;
	this.oldWaterLevel = 0;
	this.activePipe = undefined;
}

	

MEIRO.Models.T001.prototype.constructPipes = function()
{
	// cyan, magenta, yellow and black pipes
	var pipe = this.constructPipe();
	var valve = this.constructValve();
	attach( 0, pipe, valve );
	attach( 1, pipe.clone(), valve.clone() );
	attach( 2, pipe.clone(), valve.clone() );
	attach( 3, pipe.clone(), valve.clone() );

	this.image.add( this.pipes );
}



MEIRO.Models.T001.prototype.onObject = function()
{
	if (!this.playing) return undefined;
	
	// координати на мишка
	this.mouse.x = (controls.human.mousePos.x/window.innerWidth)*2 - 1;
	this.mouse.y = -(controls.human.mousePos.y/window.innerHeight)*2 + 1;

	this.raycaster.setFromCamera( this.mouse, camera );
	
	var intersects = this.raycaster.intersectObject( this.water );
	if (intersects.length)
	{	// при кликване върху водата се маркира, че няма кликване
		// в противен случай може да се кликне на тръба зад водата
		return undefined;
	}
			
	for( var i=0; i<4; i++)
	{
		var pipe = this.pipes.children[i];
		
		for(var j=0; j<pipe.children.length; j++)
		{
			var element = pipe.children[j];
			var intersects = this.raycaster.intersectObject( element );
			if (intersects.length)
			{
				this.clicks++;
				//console.log('on '+i);
				this.activePipe = pipe;
				return pipe;
			}
		}
	}

	return undefined;
}



MEIRO.Models.T001.prototype.onDragEnd = function()
{
	this.activePipe = undefined;
}



MEIRO.Models.T001.prototype.updateWaterAmount = function()
{
	// добавяне на цветна вода според активния входен кран
	if (this.activePipe === this.pipes.children[0])
		this.waterCyan -= this.pipes.children[0].valve.rotation.z/3000;

	if (this.activePipe === this.pipes.children[1])
		this.waterMagenta -= this.pipes.children[1].valve.rotation.z/3000;

	if (this.activePipe === this.pipes.children[2])
		this.waterYellow -= this.pipes.children[2].valve.rotation.z/3000;

	// премахване на вода, ако е развъртян изходния кран
	if (this.activePipe === this.pipes.children[3])
	{
		var sum = this.waterCyan+this.waterMagenta+this.waterYellow;
		let k = (sum<0.001) ? 0 : 1-0.005/sum;
		this.waterCyan = Math.max( 0, k*this.waterCyan );
		this.waterMagenta = Math.max( 0, k*this.waterMagenta );
		this.waterYellow = Math.max( 0, k*this.waterYellow );
	}
}


MEIRO.Models.T001.prototype.activateWaterSound = function()
{	
	// сила на звука на тръбите
	var valveOpenness = 0;
	for (var i=0; i<4; i++)
		valveOpenness = Math.max(valveOpenness,Math.abs(this.pipes.children[i].valve.rotation.z));
	valveOpenness = valveOpenness / (2*Math.PI);
	
	var waterAudioVolume = valveOpenness * this.waterLevel;

	if (waterAudioVolume>0.001)
	{
		if (this.audioWater.paused)
		{
			this.audioWater.currentTime = 0;
			this.audioWater.play();
		}
		this.audioWater.volume = waterAudioVolume;
	}
	else
		this.audioWater.pause();

	// сила на звука на резервоара
	if (this.waterLevel>0.01)
		this.audioBubbles.play();
	this.audioBubbles.volume = this.waterLevel/4;
	
	// сблъсък на плочката в пода
	if (this.waterLevel<0.01 && this.oldWaterLevel>0.01)
	{
		this.audioBoom.currentTime = 0;
		this.audioBoom.play();
	}
	this.olsWaterLevel = this.waterLevel;
}


// аниматор на модела
MEIRO.Models.T001.prototype.onAnimate = function(time)
{	
	this.updateWaterAmount();
	this.updateWaterColor();
	this.generateWaterSurface(time);
	this.activateWaterSound();
	
	// развъртане на активния кран (ако има такъв)
	// и завъртане на всички неактивни кранове
	for( var i=0; i<4; i++)
	{
		var pipe = this.pipes.children[i];
		pipe.valve.position.y = this.PIPE_RADIUS+this.VALVE_LENGTH*(2/5-3/5*pipe.valve.rotation.z/(2*Math.PI));
		
		if (pipe == this.activePipe)
			pipe.valve.rotation.z = THREE.Math.lerp(pipe.valve.rotation.z,-2*Math.PI,0.015);
		else
			pipe.valve.rotation.z = Math.min( pipe.valve.rotation.z+0.25, 0 );
	}

	
	TWEEN.update();
	reanimate();
}




MEIRO.Models.T001.prototype.evaluateResult = function()
{	
	var r1 = this.water.material.color.r*this.water.material.opacity + (1-this.water.material.opacity);
	var g1 = this.water.material.color.g*this.water.material.opacity + (1-this.water.material.opacity);
	var b1 = this.water.material.color.b*this.water.material.opacity + (1-this.water.material.opacity);
	
	var r2 = this.config.targetColor.r;
	var g2 = this.config.targetColor.g;
	var b2 = this.config.targetColor.b;

	// https://en.wikipedia.org/wiki/Color_difference
	var dR = r1-r2;
	var dG = g1-g2;
	var dB = b1-b2;
	var rr = (r1+r2)/2*255;
	var k = (2+rr/256)+4+(2+(255-rr)/256);
	var dC = Math.sqrt( (2+rr/256)*dR*dR+4*dG*dG+(2+(255-rr)/256)*dB*dB)/Math.sqrt(k);

	var match1 = Math.max( 0, 1-2*dC );
	
	var maxDiff = Math.max(Math.abs(dR),Math.abs(dG),Math.abs(dB));
	var match2 = Math.max( 0, 1-20*maxDiff*maxDiff );
	
	var match = (match1+match2)/2;
	
	this.config.score = match*this.config.max_score;
	var target_color = Math.round(100-100*r2)/100+', '+Math.round(100-100*g2)/100+', '+Math.round(100-100*b2)/100;
	var player_color = Math.round(100-100*r1)/100+', '+Math.round(100-100*g1)/100+', '+Math.round(100-100*b1)/100;
	
	this.config.time =  Math.floor((animationLoop.time-this.startTime)/1000);
	
}





MEIRO.Models.T001.prototype.onEnter = function(element)
{
	MEIRO.Model.prototype.onEnter.call(this);

	var that = this;
	
	that.info = that.defaultInfo;

	if (controls.buttonMotion) controls.buttonMotion.hide();
	that.buttonTimer.setText('');
	that.buttonTimer.show();
	that.playing = true;
	that.configure(parseInt(options.difficulty)|0);
	that.startTime = animationLoop.time;
	new TWEEN.Tween({k:0})
		.to({k:1},500)
		.easing( TWEEN.Easing.Quadratic.InOut )
		.onUpdate( function(){
			that.targetColorBox.material.color.lerp(that.config.targetColor,this.k);
			that.targetColorPlate.material.color.set(that.targetColorBox.material.color);
			for( var i=0; i<4; i++)
			{
				that.pipes.children[i].valve.scale.set(this.k,this.k,this.k);
			}
		} )
		.start();
}



// конфигурира сцената според желаната трудност
MEIRO.Models.T001.prototype.configure = function(difficulty)
{	
	this.config = {difficulty: difficulty};
		
	var max_score = 0;
	var cmy = [0,0,0];
	
	switch (difficulty)
	{
		// ниска трудност - основни CMY цветове и млечните им варианти
		case DIFFICULTY_LOW:
			
			if (random(0,1))
			{
				max_score = 0.1;
				cmy[random(0,2)] = 4;
			}
			else
			{
				max_score = 0.2;
				cmy[random(0,2)] = 2;
			}
			break;
			
		// средна трудност - смесени CMY цветове и млечните им (основни RGB и млечните им)
		case DIFFICULTY_MEDIUM:
			var c = 2*random(1,2);
			cmy = [c,c,c];
			cmy[random(0,2)] = 0;
			if (c==4)
				max_score = 0.3;
			else
				max_score = 0.4;
			break;
			
		// висока трудност - цветове с поне една компонента наполовина
		case DIFFICULTY_HIGH:
			max_score = 1.0;
			cmy[0] = 1*random(1,4);
			cmy[1] = 1*random(1,4);
			cmy[2] = 1*random(1,4);
			if (cmy[0]==4) max_score -= 0.1;
			if (cmy[1]==4) max_score -= 0.1;
			if (cmy[2]==4) max_score -= 0.1;
			break;
			
		default: console.error('Unknown difficulty level');
	}

	this.config.targetColor = new THREE.Color( 1-cmy[0]/4, 1-cmy[1]/4, 1-cmy[2]/4 );
	this.config.max_score = max_score;

}
