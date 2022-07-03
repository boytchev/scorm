LINES: 1097 -> 622 (57%)

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

	

MEIRO.Models.T001.prototype.constructPipe = function()
{
	var pipe = new THREE.Group();
	pipe.position.y = this.BASE_HEIGHT/2;
	
	// horizontal pipe
	var normalMap = MEIRO.loadTexture( "textures/Metal_pipe_32x32_normal.jpg", 1, 24 );
	
	var geometry = new THREE.CylinderBufferGeometry( this.PIPE_RADIUS, this.PIPE_RADIUS, this.PIPE_LENGTH, options.lowpoly?6:32, 1, false );
	var material = new THREE.MeshStandardMaterial( {
		normalMap: normalMap,
		normalScale: new THREE.Vector2(2,2),
		metalness: 0.2 } );
		
	var tube = new THREE.Mesh( geometry, material );
	tube.position.z = this.POOL_SIZE/2+this.PIPE_LENGTH/2;
	tube.rotation.x = Math.PI/2;
	pipe.add( tube );

	// curved pipe
	var z = this.POOL_SIZE/2+this.PIPE_LENGTH;
	var y = this.BASE_HEIGHT/2;
	var curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 0,    z ),
		new THREE.Vector3( 0, 0,    z+3*y/4 ),
		new THREE.Vector3( 0, -y/4, z+y ),
		new THREE.Vector3( 0, -y,   z+y )
	);

	var normalMap = MEIRO.loadTexture( "textures/Metal_pipe_32x32_normal.jpg", 12, 1 );
	
	var geometry = new THREE.TubeGeometry( curve, options.lowpoly?6:20, this.PIPE_RADIUS, options.lowpoly?6:32, false );
	var material = new THREE.MeshStandardMaterial( {
		normalMap: normalMap,
		normalScale: new THREE.Vector2(2,2),
		metalness: 0.2 } );
	var tube = new THREE.Mesh( geometry, material );
	pipe.add( tube );

	// wall connector
	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 2, 2 );

	// floor connector
	var connector = new THREE.Mesh( geometry, material );
	connector.position.z = this.POOL_SIZE/2+this.PIPE_LENGTH+this.BASE_HEIGHT/2;
	connector.position.y = this.PIPE_EXTRUDE/2-this.BASE_HEIGHT/2;
	pipe.add( connector );

	// valve connector
	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 2, 1/2 );
	var geometry = new THREE.CylinderBufferGeometry(this.PIPE_RADIUS+this.PIPE_EXTRUDE/2,this.PIPE_RADIUS+this.PIPE_EXTRUDE/2,this.VALVE_LENGTH,options.lowpoly?6:32);
	var material = new THREE.MeshStandardMaterial( {
		color: 'lightgray',
		normalMap: normalMap,
		normalScale: new THREE.Vector2(1/2,1/2),
		roughness: 0.6,
		metalness: 0.7
		} );
	var connector = new THREE.Mesh( geometry, material );
	connector.position.z = this.POOL_SIZE/2+this.PIPE_LENGTH;
	connector.rotation.x = Math.PI/2;
	pipe.add( connector );
	
	return pipe;
}



MEIRO.Models.T001.prototype.constructValve = function()
{
	// handle
	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 8, 1 );
	normalMap.offset = new THREE.Vector2( 0, -0.25 );
	
	var material = new THREE.MeshStandardMaterial({
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 2, 2 ),
			metalness: 0.1
		});
	var valve = new THREE.Mesh(
		new THREE.TorusBufferGeometry(this.VALVE_RADIUS,this.VALVE_WIDTH,options.lowpoly?6:12,options.lowpoly?6:30),
		material
	);
	valve.position.y = this.PIPE_RADIUS/2+3*this.VALVE_LENGTH/4;
	valve.position.z = this.POOL_SIZE/2+this.PIPE_LENGTH;
	valve.rotation.x = Math.PI/2;
	valve.scale.set(EPS,EPS,EPS);

	// bar
	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 1/2, 2 );
	var bar = new THREE.Mesh(
		new THREE.CylinderBufferGeometry(this.VALVE_WIDTH*0.7,this.VALVE_WIDTH*0.7,2*this.VALVE_RADIUS,6,1,true),
		new THREE.MeshStandardMaterial({
			color: 'dimgray',
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 2, 2 ),
			metalness: 0.2
		})
	);
	valve.add(bar);

	// second bar
	bar = bar.clone();
	bar.rotation.z = Math.PI/2;
	valve.add(bar);
	valve.name = 'valve';

	// rod
	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 2, 2 );
	geometry = new THREE.CylinderBufferGeometry(this.PIPE_EXTRUDE,this.PIPE_EXTRUDE,this.VALVE_LENGTH,options.lowpoly?6:24);
	var tube = new THREE.Mesh( 
		geometry,
		new THREE.MeshStandardMaterial({
			color: 'dimgray',
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 8, 8 ),
			metalness: 0.2
		})
	);
	tube.position.z = 2*this.VALVE_LENGTH/5;
	tube.rotation.x = -Math.PI/2;
	valve.add( tube );

	return valve;
}



MEIRO.Models.T001.prototype.constructPipes = function()
{
	this.pipes = new THREE.Group();
	
	var that = this;
	function attach( index, pipe, valve )
	{
		pipe.rotation.y = Math.PI/2*index;
		pipe.index = 0;
		pipe.add( valve );
		pipe.valve = valve;
		valve.material = valve.material.clone();
		valve.material.color = new THREE.Color( (['cyan','magenta','yellow','black'])[index] );
		that.pipes.add(pipe);
	}
	
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



MEIRO.Models.T001.prototype.generateWaterSurface = function(time)
{
	// положение на горното ниво на водата
	var surfaceY = this.BASE_HEIGHT + this.waterLevel*this.POOL_DEPTH*4/5 - this.water.position.y;
	
	// генериране на вълни по горната повърхност
	var pos = this.water.geometry.getAttribute('position');
	for (var i=0; i<pos.count; i++)
	{
		var x = pos.getX(i);
		var y = pos.getY(i);
		var z = pos.getZ(i);
		if (y>0)
		{
			var y = surfaceY;
			y += (this.waterLevel)*Math.sin(rpm(time,25)+x+z*z/10)/10;
			y += (this.waterLevel)*Math.cos(rpm(time,28)+z-x*x/10)/10;
			pos.setY(i,y);
		}
	}
	pos.needsUpdate = true;	
	
	
	// генериране на контура на водата
	var pos = this.waterLine.geometry.getAttribute('position');
	for (var i=0; i<pos.count; i++)
	{
		var x = pos.getX(i);
		var y = pos.getY(i);
		var z = pos.getZ(i);
		
		var y = surfaceY;
		y += (this.waterLevel)*Math.sin(rpm(time,25)+x+z*z/10)/10;
		y += (this.waterLevel)*Math.cos(rpm(time,28)+z-x*x/10)/10;
		pos.setY(i,y);
	}
	pos.needsUpdate = true;	
	
	
	this.targetColorBox.position.set(
		this.waterLevel*Math.sin(rpm(time,3.5)),
		this.BASE_HEIGHT + this.waterLevel*this.POOL_DEPTH*4/5 + 0.3-0.3*this.waterLevel,
		this.waterLevel*Math.sin(rpm(time-2,3.1))
	);
	this.targetColorBox.rotation.set(0.2*this.waterLevel*Math.sin(rpm(time,10)),0.15*this.waterLevel*Math.cos(rpm(time,13)),0.1*this.waterLevel*Math.sin(rpm(time-1,14)));
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
	
	// сумарно водата не може да е повече от 100%
	var sum = this.waterCyan+this.waterMagenta+this.waterYellow;
	if (sum>1)
	{
		this.waterCyan *= 1/sum;
		this.waterMagenta *= 1/sum;
		this.waterYellow *= 1/sum;
	}
}


MEIRO.Models.T001.prototype.updateWaterColor = function()
{	
	// определяне на цвета на водата, като всяка компонента
	// се мащабира така, че най-голямата да стане 100%
	var max = Math.max(this.waterCyan,this.waterMagenta,this.waterYellow);
	max = Math.max(0.0001,max);
	this.water.material.color.setRGB(
		1-this.waterCyan/max,
		1-this.waterMagenta/max,
		1-this.waterYellow/max
	);

	// определяне на нивото на водата
	this.oldWaterLevel = this.waterLevel;
	this.waterLevel = this.waterCyan+this.waterMagenta+this.waterYellow;
	
	// определяне на прозрачността на водата - при малко вода
	// тя изглежда по-прозрачна, при повече вода - по-гъста
	//this.water.material.opacity = Math.pow((this.waterLevel),1/5);
	//this.water.material.opacity = Math.cos(Math.PI*(1-this.waterLevel))*0.5+0.5;
	this.water.material.opacity = Math.pow(Math.sin(Math.PI/2*(this.waterLevel)),2);
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
	
//	console.log('score=',this.config.score);
	this.info = '';
	this.info += '<h1 style="text-align:center;">Цветният резервоар &ndash; '+Math.round(1000*this.config.score)/10+' от '+Math.round(100*this.config.max_score)+' точки</span></h1>';

	this.info += '<p><table style="width:20em; margin:auto;">';
	this.info += '<tr><td style="text-align:center; width:10em;">Желан цвят:</td><td style="text-align:center; width:10em;">Постигнат цвят:</td></tr>';
	this.info += '<tr><td style="text-align:center;">'+target_color+'</td><td style="text-align:center;">'+player_color+' </td></tr>';
	this.info += '<tr><td style="text-align:center;"><div style="border: solid 1px black; height:3em; background:rgb('+Math.round(255*r2)+','+Math.round(255*g2)+','+Math.round(255*b2)+')"></div></td><td style="text-align:center;"><div style="border: solid 1px black; height:3em; background:rgb('+Math.round(255*r1)+','+Math.round(255*g1)+','+Math.round(255*b1)+')"></div></td></tr>';
	this.info += '</table></p>';
//	console.log('evaluation=',this.config.score*match);
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


// превключвател на модела
MEIRO.Models.T001.prototype.onExitModel = function(element)
{
	//MEIRO.Model.prototype.onExit.call(this);
	
	var that = this;
	
	that.playing = false;
	that.evaluateResult();
	new TWEEN.Tween({k:1})
		.to({k:EPS},500)
		.easing( TWEEN.Easing.Quadratic.InOut )
		.onUpdate( function(){
			for( var i=0; i<4; i++)
			{
				that.pipes.children[i].valve.scale.set(this.k,this.k,this.k);
			}
		} )
		.start();
	that.sendResult(
	function(){
		MEIRO.showInfo(this,
				function(){
					console.log('on before close info');
					if (MEIRO.singleRoom)
					{	
						window.history.back();
					}
				},
				function(){
					console.log('on after close info');
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
