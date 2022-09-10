// 827 -> 439 (53%)

MEIRO.Models.T005.prototype.constructWell = function()
{
	// generate bumps points in 3D
	var bumpsPoints = [];
	const BUMP_RADIUS = this.WELL_RADIUS+0.8;
	var y = this.WELL_HEIGHT-1;
	for (var i=0; i<2*this.config.lines; i++)
	{
		var angle = this.bumps[i]/12*Math.PI*2;
		bumpsPoints.push( new THREE.Vector3(BUMP_RADIUS*Math.cos(angle),y,BUMP_RADIUS*Math.sin(angle)) );
		if (i%2) y -= this.PLATE_HEIGHT;
	}

	// add random bumps
	var y = this.WELL_HEIGHT-1;
	for (var i=0; i<this.config.extra_bumps; i++)
	{
		var angle = random(0,11)/12*Math.PI*2;
		var y = this.WELL_HEIGHT-1-this.PLATE_HEIGHT*random(0,5);
		bumpsPoints.push( new THREE.Vector3(BUMP_RADIUS*Math.cos(angle),y,BUMP_RADIUS*Math.sin(angle)) );
	}

	// makes the bumps
	var q = new THREE.Vector3(0,0,0);
	var pos = geometry.getAttribute('position');
	for (var i=0; i<pos.count; i++)
	{
		q.set( pos.getX(i), pos.getY(i), pos.getZ(i) );
		for (var j=0; j<bumpsPoints.length; j++)
		{
			var dist = Math.pow(q.distanceTo(bumpsPoints[j]),4);
			if (dist<2)
			{
				var k = 1-1/dist/dist/50;
				q.x *= k;
				q.z *= k;
			}
		}
		pos.setXYZ( i, q.x, q.y, q.z );
	}

	geometry.computeVertexNormals();
	for (var i=0; i<fixNormals.length; i++)
	{
		nor.setX(fixNormals[i],0);
	}

	
	var materialOutside = new THREE.MeshStandardMaterial( {
			metalness: 0.2,
			map: textureMap,
			normalMap: normalMap,
			side: THREE.FrontSide,
			//wireframe: true,
			lightMap: lightMap,
			lightMapIntensity: -1,
	});
	
	var well = new THREE.Mesh( geometry, materialOutside );
	this.image.add( well );
	
	
	// generate bumps connections
	var scale1 = (this.WELL_RADIUS-0.35)/BUMP_RADIUS;
	var scale2 = (this.WELL_RADIUS-1.2)/BUMP_RADIUS;

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	var v3 = new THREE.Vector3();
	var v4 = new THREE.Vector3();
	
	//var material = new THREE.LineBasicMaterial( { color : 'black' } );
	var materialThread = new THREE.MeshStandardMaterial( {
			color: 'cornflowerblue',
			metalness: 0.5,
			map: textureMap,
			emissive: 'white',
			emissiveIntensity: 0.5,
			//wireframe: true,
	});
	
	for (var i=0; i<2*this.config.lines; i+=2)
	{
		v1.set( scale1*bumpsPoints[i].x,
				bumpsPoints[i].y,
				scale1*bumpsPoints[i].z );
		v2.set( scale2*bumpsPoints[i].x,
				bumpsPoints[i].y,
				scale2*bumpsPoints[i].z );
		v3.set( scale2*bumpsPoints[i+1].x,
				bumpsPoints[i+1].y,
				scale2*bumpsPoints[i+1].z );
		v4.set( scale1*bumpsPoints[i+1].x,
				bumpsPoints[i+1].y,
				scale1*bumpsPoints[i+1].z );

		var curve = new THREE.CubicBezierCurve3(v1,v2,v3,v4);
		
		var geometry = new THREE.TubeGeometry( curve, 20, 0.08, 8, false );
		var mesh = new THREE.Mesh( geometry, materialThread );
		this.image.add( mesh );
	}

	
}	


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



// превключвател на модела
MEIRO.Models.T005.prototype.onExitModel = function(element)
{
	//MEIRO.Model.prototype.onExit.call(this);
	
	var that = this;
	
	that.playing = false;
	that.evaluateResult();

	that.sendResult(
	function(){
		MEIRO.showInfo(this,
				function(){
//					console.log('on before close info');
					if (MEIRO.singleRoom)
					{	
						window.history.back();
					}
				},
				function(){
//					console.log('on after close info');
					if (!MEIRO.singleRoom)
					{
						if (controls.buttonMotion) controls.buttonMotion.show();
						controls.startWalk(true,false);
					}
					that.info = that.defaultInfo;
				}
		);
	}
	);
	
	reanimate();
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
	this.config.max_score += 0.1*this.config.crosses;
	
	//console.log('max_score',this.config.max_score);
}


MEIRO.Models.T005.prototype.generateBumpsPositions = function()
{
	//...
	
	// find number of crosses
	var line_indexes = [];
	for (var i=0; i<this.zones.length; i++)
	{
		// swich bit corresponding the line pair containing zones[i]
		var pair = this.bumps.indexOf(this.zones[i]%12)>>1;
		line_indexes.push( pair );
	}
	line_indexes.push( line_indexes[0] );
	this.config.crosses = 0;
	for (var i=0; i<line_indexes.length-1; i++)
		if (line_indexes[i]!=line_indexes[i+1])
			this.config.crosses += 1/(line_indexes.length-2);
	this.config.crosses = 2*this.config.crosses-1;
}

MEIRO.Models.T005.prototype.initialize = function()
{
	this.WELL_RADIUS = 3;
	this.WELL_HEIGHT = 8;

	this.bumps = [];
	this.zones = [];
	this.codes = [];
	this.plates = [];
}

	

MEIRO.Models.T005.prototype.construct = function()
{
	this.swithchLight = new THREE.PointLight( 'cornflowerblue', 0 );
	this.image.add( this.swithchLight );
}
	
	
