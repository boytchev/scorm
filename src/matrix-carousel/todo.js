// 1138 -> 234 (21%)

MEIRO.Models.T007.prototype.initialize = function()
{
	this.carouselSpeed = 0;
	this.carouselSpin = random(1,5);
	this.carouselUp = 0;
	this.carouselBack = 0;
	
	this.animationSteps = 90;
	this.animationStep = 0;

	this.speedUp = false;
	this.animateTime = 0;
	this.stopTime = -1000000;
	this.scaleVibro = 0;
	
	this.carouselMusic = new Audio('sounds/carousel.mp3');
	this.carouselMusic.loop = true;
	this.carouselMusic.volume = 0;
	this.carouselMusic.pause();
	
	this.swingSqueak = new Audio('sounds/swing_squeak_2.mp3');
	this.swingSqueak.pause();
	this.swingSqueak.volume = 0;
}



MEIRO.Models.T007.prototype.randomMatrix = function()
{
	var randomIndex = 0;
	switch (this.config.difficulty)
	{
		case 0: randomIndex = random(0,24); break;
		case 1: randomIndex = random(13,52); break;
		case 2: randomIndex = random(37,70); break;
	}
	matrixData = allMatrixData[randomIndex];

	var hard = 0;
	if (randomIndex>=1)  hard++;
	if (randomIndex>=7)  hard++;
	if (randomIndex>=13) hard++;
	if (randomIndex>=25) hard++;
	if (randomIndex>=37) hard++;
	if (randomIndex>=45) hard++;
	if (randomIndex>=53) hard++;
	if (randomIndex>=59) hard++;
	if (randomIndex>=65) hard++;
	matrixData.hard = hard;

	return matrixData;
}



MEIRO.Models.T007.prototype.onObject = function()
{
	if (!this.playing) return undefined;

	this.raycaster.setFromCamera( this.mouse, camera );
	
	var intersects = this.raycaster.intersectObject( this.pillar );
	if (intersects.length)
	{	
		this.clicks++;
		this.speedUp = true;
		this.carouselMusic.play();
		return this.carousel;
	}

	return undefined;
}



MEIRO.Models.T007.prototype.onDragEnd = function()
{
	this.speedUp = false;
	this.stopTime = animationLoop.time;
	this.scaleVibro = this.carouselSpeed*500;
	this.swingSqueak.volume = 0;
	this.swingSqueak.currentTime = 0;
	this.swingSqueak.play();
}



// аниматор на модела
MEIRO.Models.T007.prototype.onAnimate = function(time)
{	
	var deltaTime = this.animateTime?time-this.animateTime:0;
	this.animateTime = time;
	
	if (this.playing)
	{

		if (this.speedUp)
			this.carouselSpeed = THREE.Math.lerp(this.carouselSpeed,0.005,0.005);
		else
			this.carouselSpeed = THREE.Math.lerp(this.carouselSpeed,0,0.05);
		
		var speedK = this.carouselSpeed/0.005;
		
		this.carouselSpin += this.carouselSpeed*deltaTime;
		this.carousel.rotation.y = this.carouselSpin*2*Math.PI/6;
		
		if (this.carouselSpin>6) this.carouselSpin -= 6;
		if (!this.speedUp)
		{
			this.carouselSpin = THREE.Math.lerp(this.carouselSpin,Math.round(this.carouselSpin+0.25),0.01);
		}
		
		if (this.speedUp)
			this.swingSqueak.volume = 0;
		else
		{
			this.swingSqueak.volume = Math.pow(0.998,(time-this.stopTime)/3)/2;
		}
		
		for (var i=0; i<this.systems.length; i++)
		{
			var targetCarouselBack = 0;
			var targetCarouselUp = 0;
			var targetCarouselTwist = 0;
			
			if (this.speedUp)
			{ 
				if (0.2<speedK && speedK<0.8)
					targetCarouselBack = -1*Math.pow(Math.sin(i/12+(speedK-0.2)/0.6*Math.PI),2);
				else
					targetCarouselBack = 0;
				targetCarouselUp   = 1.5*speedK;
				targetCarouselTwist = this.systems[i].yRot;
			}
			else
			{
				var vibro = Math.pow(0.999,(time-this.stopTime)/3);
				targetCarouselBack = 0.6*this.scaleVibro*vibro*Math.sin(rpm(time-this.stopTime+i,40-4*i));
				targetCarouselUp   = -0.3*this.scaleVibro*vibro*Math.cos(rpm(time-this.stopTime-i,42+4*i));
				targetCarouselTwist = this.systems[i].yRot + this.scaleVibro*vibro*Math.sin(rpm(time-this.stopTime+i,20+2*i));
				
			}
			this.carouselBack = THREE.Math.lerp(this.carouselBack ,targetCarouselBack,0.01);
			this.carouselUp   = THREE.Math.lerp(this.carouselUp   ,targetCarouselUp,0.01);

			this.systems[i].rotation.set(
				this.carouselBack,
				THREE.Math.lerp(this.systems[i].rotation.y,targetCarouselTwist,0.03),
				this.carouselUp,
				'YXZ');
				
		}
		
		this.carouselMusic.volume = speedK;
	}
}



MEIRO.Models.T007.prototype.evaluateResult = function()
{	
	var match = 0;
		
	function similarity(a,b)
	{
		if (a==b) return 1; // complete match
		if (a[0]!=b[0]) return 0; // complete mismatch
		
		a += '    ';
		b += '    ';
		var sim = 1;
		
		// check exact match of characters (bulls)
		for (var i=0; i<4; i++)
			if (a[i]!=b[i])
				sim *= 0.8;
			
		// check usage of characters (cows)
		for (var i=0; i<4; i++)
		{
			if (a.indexOf(b[i])<0)
				sim *= 0.8;
			if (b.indexOf(a[i])<0)
				sim *= 0.8;
		}
		return sim;
	}
	
	var arenas = this.config.arenas;
	var dArena = Math.round(6/arenas);
	var sims = [];
	for (var i=0; i<arenas; i++)
	{
		var index = i*dArena
		var s1 = this.matrixData[index].id;
		var s2 = this.matrixData[Math.round(this.carouselSpin+i*dArena)%6].id;

		var sim = similarity(s1,s2);
		sims.push(sim);
		match += sim/arenas;
	}
		
	this.config.score = match*this.config.max_score;
}



// конфигурира сцената според желаната трудност
MEIRO.Models.T007.prototype.configure = function(difficulty)
{	
	switch (difficulty)
	{
		// ниска трудност
		case DIFFICULTY_LOW:
			arenas = 2;
			break;
			
		// средна трудност
		case DIFFICULTY_MEDIUM:
			arenas = 3;
			break;
			
		// висока трудност
		case DIFFICULTY_HIGH:
			arenas = 6;
			break;
	}

	this.config.arenas = arenas;
	
	this.constructMatrices();
}