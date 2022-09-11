// 827 -> 260 (31%)

MEIRO.Models.T005.prototype.constructDigits = function()
{
	const N = this.config.lines;
	
	this.mapDigit1 = MEIRO.loadTexture( "textures/005_digit_1.jpg" );
	this.mapDigit0 = MEIRO.loadTexture( "textures/005_digit_0.jpg" );
	this.mapDigitX = MEIRO.loadTexture( "textures/005_digit_none.jpg" );


	var geometry = new THREE.CylinderBufferGeometry( this.WELL_RADIUS, this.WELL_RADIUS, this.PLATE_HEIGHT, 6, 1, true, -Math.PI/25, 2*Math.PI/25  );

	var plateGeometry = new THREE.CylinderBufferGeometry( this.WELL_RADIUS, this.WELL_RADIUS, N*this.PLATE_HEIGHT, 6, 1, true, -Math.PI/25, 2*Math.PI/25  );
	
	var plateMap = MEIRO.loadTexture( "textures/005_rusty_plates.jpg", 1, N/6 );
	var plateMaterial = new THREE.MeshLambertMaterial({
		map: plateMap,
		//alphaMap: alphaMap,
		//transparent: true,
		polygonOffset: true,
		polygonOffsetUnits: -1,
		polygonOffsetFactor: -1,
	});
		
	for (var i=0; i<2*N; i++)
	{
		var angle = (this.zones[i]/2+this.zones[i+1]/2)/12-3/12;
		var user = i==this.config.user_index;
		var skip = false;
		if (!user && this.config.skip && Math.random()>0.35)
		{
//console.log('userIdx=',this.config.user_index,'skipIdx=',i);
			skip = true;
			this.config.skip--;
			continue;
		}

		var plate = new THREE.Mesh( plateGeometry, plateMaterial );
		plate.position.y = this.WELL_HEIGHT-N*this.PLATE_HEIGHT/2-this.PLATE_HEIGHT;
		plate.rotation.y = -angle*2*Math.PI;
		this.image.add( plate );
		
		for (var j=0; j<N; j++)
		{
			var material = new THREE.MeshLambertMaterial({
				color: user?'navy':'darkorange',
				map: this.mapDigitX,
				alphaMap: this.mapDigitX,
				transparent: true,
				opacity: 0.3+0.7*Math.random(),
				polygonOffset: true,
				polygonOffsetUnits: -4,
				polygonOffsetFactor: -4,
			});
			if (!user)
			{
				switch (this.codes[i][j])
				{
					case '0':
						material.map = this.mapDigit0;
						material.alphaMap = this.mapDigit0;
						break;
					case '1':
						material.map = this.mapDigit1;
						material.alphaMap = this.mapDigit1;
						break;
				}
			}
			
			var plate = new THREE.Mesh( geometry, material );
			plate.rotation.z = 0.2-0.4*Math.random();	
			plate.position.y = this.WELL_HEIGHT-3/2*this.PLATE_HEIGHT-j*this.PLATE_HEIGHT;
			plate.rotation.y = -angle*2*Math.PI;
			plate.angle = -angle*2*Math.PI;
			
			if (user) this.plates.push( plate );
			this.image.add( plate );
		}
	}
}



MEIRO.Models.T005.prototype.onObject = function()
{
	if (!this.playing) return undefined;
	
	// координати на мишка
	this.mouse.x = (controls.human.mousePos.x/window.innerWidth)*2 - 1;
	this.mouse.y = -(controls.human.mousePos.y/window.innerHeight)*2 + 1;

	this.raycaster.setFromCamera( this.mouse, camera );

	for (var i=0; i<this.plates.length; i++)
	{
		var plate = this.plates[i];
		var intersects = this.raycaster.intersectObject( plate );
		if (intersects.length)
		{	
			this.clicks++;
			if (plate.material.map == this.mapDigitX)
			{
				plate.material.map = this.mapDigit0;
				plate.material.alphaMap = this.mapDigit0;
			}
			else
			if (plate.material.map == this.mapDigit0)
			{
				plate.material.map = this.mapDigit1;
				plate.material.alphaMap = this.mapDigit1;
			}
			else
			if (plate.material.map == this.mapDigit1)
			{
				plate.material.map = this.mapDigitX;
				plate.material.alphaMap = this.mapDigitX;
			}
			
			this.swithchLight.position.set( 
				(this.WELL_RADIUS+0.3)*Math.sin(plate.angle),
				plate.position.y,
				(this.WELL_RADIUS+0.3)*Math.cos(plate.angle) );
			this.swithchLight.intensity = 10;
			
			//console.log(i);
			this.buttonClick.pause();
			this.buttonClick.currentTime=0;;
			this.buttonClick.play();
			return this.plates[i];
		}
	}

	return undefined;
}


// аниматор на модела
MEIRO.Models.T005.prototype.onAnimate = function(time)
{	
	if (this.playing)
	{
		this.swithchLight.intensity *= 0.8;
	}
	reanimate();
}



MEIRO.Models.T005.prototype.evaluateResult = function()
{	
	var match = 0;
	var user_code = '';
	for (var i=0; i<this.plates.length; i++)
	{
		var plate = this.plates[i];
		if (plate.material.map == this.mapDigit0)
			user_code += '0';
		else
		if (plate.material.map == this.mapDigit1)
			user_code += '1';
		else
			user_code += '?';
		if (plate.material.map == this.mapDigit0 && this.codes[this.config.user_index][i]=='0')
			match += 1/this.plates.length;
		else
		if (plate.material.map == this.mapDigit1 && this.codes[this.config.user_index][i]=='1')
			match += 1/this.plates.length;
	}
	match = match*match;
//	console.log('match',match);

	this.config.score = match*this.config.max_score;

	this.config.time =  Math.floor((animationLoop.time-this.startTime)/1000);
	
//	console.log('score=',this.config.score);
	this.info = '';
	this.info += '<h1 style="text-align:center;">Коенсъдърлендов напръстник &ndash; '+Math.round(100*this.config.score)/1+' от '+Math.round(100*this.config.max_score)+' точки</span></h1>';

	this.info += '<p>Верният код на избраната зона е <b>'+this.codes[this.config.user_index]+'</b>';

	if (match>0.99) this.info += ' и напълно съвпада с определения от вас код.</p>';
	else
	if (match<0.01) this.info += ' и нито една част от него не е правилно определена.</p>';
	else
		this.info += ', а определеният от вас код е <b>'+user_code+'</b>.</p>';
//	console.log('evaluation=',this.config.score*match);
}



// конфигурира сцената според желаната трудност
MEIRO.Models.T005.prototype.configure = function(difficulty)
{	
	this.config = {difficulty: difficulty};
		
	var max_score = 0;
	var lines = 0;
	var min_span = 0;
	var extra_bumps = 0;
	
	switch (difficulty)
	{
		// ниска трудност
		case DIFFICULTY_LOW:
			lines = 2;
			min_span = 3;
			skip = 1; //all=4, max skip=all-2=2
			extra_bumps = random(2,4);
			max_score = 0.1;
			break;
			
		// средна трудност
		case DIFFICULTY_MEDIUM:
			lines = 3;
			min_span = 2;
			skip = random(2,3); // all=6, max skip=all-2=4
			extra_bumps = random(4,8);
			max_score = 0.3;
			break;
			
		// висока трудност
		case DIFFICULTY_HIGH:
			lines = random(4,6);
			min_span = 1;
			skip = 2*lines-1-1;
			extra_bumps = random(8,24);
			max_score = 0.7+(lines-4)*0.1;
			break;
			
		default: console.error('Unknown difficulty level');
	}

	this.config.lines = lines;
	this.config.max_score = max_score/*+this.config.crosses*/;
	this.config.min_span = min_span;
	this.config.user_index = random(0,2*lines-1);
	this.config.skip = skip;
	this.config.extra_bumps = extra_bumps;
	
	this.generateBumpsPositions();
	if (!IN_SCORE_STATISTICS)
	{
		this.constructWell();
		this.constructDigits();
	}
	
	//console.log('max_score',this.config.max_score);
}


MEIRO.Models.T005.prototype.construct = function()
{
	this.swithchLight = new THREE.PointLight( 'cornflowerblue', 0 );
	this.image.add( this.swithchLight );
}
	
	
