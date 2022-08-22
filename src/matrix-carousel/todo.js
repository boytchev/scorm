// 1138 -> 146 (13%)

MEIRO.Models.T007.prototype.initialize = function()
{
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



MEIRO.Models.T007.prototype.onDragEnd = function()
{
	this.scaleVibro = this.carouselSpeed*500;
	this.swingSqueak.volume = 0;
	this.swingSqueak.currentTime = 0;
	this.swingSqueak.play();
}



// аниматор на модела
MEIRO.Models.T007.prototype.onAnimate = function(time)
{	
	if (this.playing)
	{
		if (this.speedUp)
			this.swingSqueak.volume = 0;
		else
		{
			this.swingSqueak.volume = Math.pow(0.998,(time-this.stopTime)/3)/2;
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