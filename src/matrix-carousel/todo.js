// 1138 -> 514 (45%)

MEIRO.Models.T007.prototype.initialize = function()
{
	this.matrixData = [];
	
	this.DIGIT_SIZE = 0.3;
	
	this.SYSTEM_HEIGHT = 7;
	this.SYSTEM_SCALE = 0.15;
	this.SYSTEM_LENGTH = 5; // length of thread
	
	this.FRAME_WIDTH = 0.1;
	
	this.systems = [];
	//this.arenas = [];

	//this.labels = [];
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


	
MEIRO.Models.T007.prototype.generateCoordSystem = function(x,y,z)
{
	var W = 0.3;	// width of axes	
	var L = 10;		// length of axes
	var S = 8;		// letter scale
	var coordSystem = new THREE.Group();
//	var material = new THREE.MeshBasicMaterial({color:'cornflowerblue'});
	var material = new THREE.MeshStandardMaterial({color:'orange'});

	// arrows
	var geometry = new THREE.CylinderBufferGeometry(W/2,W,L,6/*,1,true*/);
	// y+
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.y = L/2;
	coordSystem.add( arrow );
	// y-
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.y = -L/2;
	arrow.rotation.x = Math.PI;
	coordSystem.add( arrow );
	// x+
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.x = L/2;
	arrow.rotation.z = -Math.PI/2;
	coordSystem.add( arrow );
	// x-
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.x = -L/2;
	arrow.rotation.z = Math.PI/2;
	coordSystem.add( arrow );
	// z+
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.z = L/2;
	arrow.rotation.x = Math.PI/2;
	coordSystem.add( arrow );
	// z-
	var arrow = new THREE.Mesh( geometry, material );
	arrow.position.z = -L/2;
	arrow.rotation.x = -Math.PI/2;
	coordSystem.add( arrow );

	// labels
	// x
	MEIRO.PRIMITIVE.GEOMETRY.X.center();
	MEIRO.PRIMITIVE.GEOMETRY.Y.center();
	MEIRO.PRIMITIVE.GEOMETRY.Z.center();
	
	var label = new THREE.Mesh(MEIRO.PRIMITIVE.GEOMETRY.X, material);
	label.scale.set( S,S,4*S );
	label.position.set(L,0,0);
	label.rotation.x = -Math.PI/2;
	label.rotation.z = -Math.PI/2;
	coordSystem.add( label );
	//this.labels.push( label );

	var label = new THREE.Mesh(MEIRO.PRIMITIVE.GEOMETRY.Y, material);
	label.scale.set( S,S,4*S );
	label.position.set(0,L,0);
	coordSystem.add( label );
	//this.labels.push( label );

	var label = new THREE.Mesh(MEIRO.PRIMITIVE.GEOMETRY.Z, material);
	label.scale.set( S,S,4*S );
	label.position.set(0,0,L);
	label.rotation.x = -Math.PI/2;
	coordSystem.add( label );
	//this.labels.push( label );
	
	// cube
	var materialFront = new THREE.MeshStandardMaterial({
		color: 'pink',
		metalness: 0.4,
		transparent: true,
		opacity: 0.7,
		emissive: 'orange',
		emissiveIntensity: 0.5,
		side: THREE.FrontSide,
	});
	var materialBack = materialFront.clone();
	materialBack.side = THREE.BackSide;
	
	coordSystem.cube = new THREE.Group();
	coordSystem.cube.matrixAutoUpdate = false;
	
	var cube = new THREE.Mesh( new THREE.BoxGeometry(8,8,8), materialBack );
	cube.geometry.translate(x,y,z);
	coordSystem.cube.add( cube );
	var cube = new THREE.Mesh( cube.geometry, materialFront );
	coordSystem.cube.add( cube );
	var edges = new THREE.EdgesGeometry( cube.geometry );
	var cube = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'saddlebrown' } ) );
	coordSystem.cube.add( cube );
	coordSystem.add( coordSystem.cube );
	
	coordSystem.scale.set( this.SYSTEM_SCALE, this.SYSTEM_SCALE, this.SYSTEM_SCALE );
	return coordSystem;
}


MEIRO.Models.T007.prototype.constructMatrices = function()
{
	this.matrixData = [];
	for (var i=0; i<6; i++)
	{
		var matrixData = this.randomMatrix();
		this.matrixData.push( matrixData );
	}
}



MEIRO.Models.T007.prototype.constructSystems = function()
{
	var alphaMap = MEIRO.loadTexture( "textures/007_rope_alpha.jpg",1,7 );
	alphaMap.rotation = 0.018;
	
	var geometry = new THREE.ConeBufferGeometry(0.07,this.SYSTEM_LENGTH,12,1,true);
	var materialBack = new THREE.MeshBasicMaterial({
		color:'navy',
		alphaMap: alphaMap,
		transparent: true,
		side: THREE.BackSide,
	});
	var materialFront = new THREE.MeshBasicMaterial({
		color:'navy',
		alphaMap: alphaMap,
		transparent: true,
		side: THREE.FrontSide,
	});
	
	var angle = 0;
	var dAngle = 2*Math.PI/6;
	for (var i=0; i<6; i++,angle+=dAngle)
	{
		var matrixData = this.matrixData[i];
		
		var system = new THREE.Group();
		{
			// coord system
			var coords = this.generateCoordSystem(...matrixData.offset);
			switch (this.config.difficulty)
			{
				case 0:
					break;
				case 1:
					coords.rotation.set( Math.PI/2*random(0,1),Math.PI/2*random(0,1),0*Math.PI/2*random(0,1),'ZXY' );
					break;
				case 2:
					coords.rotation.set( Math.PI/2*random(0,3),Math.PI/2*random(0,3),Math.PI/2*random(0,3),'ZXY' );
					break;
			}
			coords.position.y = -this.SYSTEM_LENGTH;
			system.add( coords );
			
			// rope
			var rope = new THREE.Mesh( geometry, materialBack );
			rope.rotation.x = Math.PI;
			rope.position.y = -this.SYSTEM_LENGTH/2;
			system.add( rope );

			var rope = rope.clone();
			rope.material = materialFront;
			system.add( rope );
		}
		system.position.set( this.ARENA_DISTANCE*Math.cos(angle), this.BASE_HEIGHT+this.SYSTEM_HEIGHT, this.ARENA_DISTANCE*Math.sin(angle) );
		system.yRot = -angle;
			
		this.carousel.add( system );
		this.systems.push( system );
	}
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
//console.log('randomIndex=',randomIndex,'hard=',hard);
	if (!matrixData.offset) matrixData.offset=[0,0,0];
	
	var mat4 = new THREE.Matrix4();
	mat4.set(
		...matrixData.step[0],
		...matrixData.step[1],
		...matrixData.step[2],
		...matrixData.step[3] );
	matrixData.matrixStep = mat4;
	
	return matrixData;
}



MEIRO.Models.T007.prototype.onObject = function()
{
	if (!this.playing) return undefined;
	
	// координати на мишка
	this.mouse.x = (controls.human.mousePos.x/window.innerWidth)*2 - 1;
	this.mouse.y = -(controls.human.mousePos.y/window.innerHeight)*2 + 1;

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
		if (time-this.lastTime>=1000)
		{
			var dTime =  Math.floor((time-this.startTime)/1000);
			var s = dTime%60;
			var m = Math.floor(dTime/60)%60;
			var h = Math.floor(dTime/60/60);
			var string = (m<10?0:'')+m+':'+(s<10?0:'')+s;
			if (h) string = h+':'+string;
			this.buttonTimer.setText(string);
			this.lastTime = time;
		}
		
		//for (var i=0; i<this.labels.length; i++)
		//	this.labels[i].rotation.y = i+rpm(time,12);

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
				
			//animate the cube;
			var k = (time/3000+i*Math.sin(i))%2;
			k = THREE.Math.clamp(k-0.5,0.001,0.999);
			
			var rescale = this.matrixData[i].id[0]=='R';
			//if (this.animaitonStep%this.animaitonSteps==0)
			//	this.systems[i].children[0].cube.matrix.identity();
			//else
			//	this.systems[i].children[0].cube.matrix.multiply(this.systems[i].matrixStep);
			//this.animaitonStep++;
			var matrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
			for (var x=0; x<4; x++)
			{
				var len = 0;
				for (var y=0; y<4; y++)
				{
					matrix[x][y] = THREE.Math.lerp(matrix[x][y],this.matrixData[i].step[x][y],k);
					if (rescale) len += matrix[x][y]*matrix[x][y];
				}
				if (rescale) 
				{
					len = Math.sqrt(len);
					for (var y=0; y<4; y++)
						matrix[x][y] /= len;
				}
			}
			this.systems[i].children[0].cube.matrix.set(
				...matrix[0],
				...matrix[1],
				...matrix[2],
				...matrix[3]
			);
		}
		
		this.carouselMusic.volume = speedK;
	}

	//TWEEN.update();
	reanimate();
}



MEIRO.Models.T007.prototype.evaluateResult = function()
{	
	var match = 0;
		
	//var S=[];
	//for (var i=0; i<6; i++)
	//	S.push(this.matrixData[Math.round(this.carouselSpin+i)%6].id);

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
//		console.log(s1,s2);
		var sim = similarity(s1,s2);
		sims.push(sim);
		match += sim/arenas;
	}

		
	this.config.score = match*this.config.max_score;

	this.config.time =  Math.floor((animationLoop.time-this.startTime)/1000);
	
//	console.log('score=',this.config.score);
	this.info = '';
	this.info += '<h1 style="text-align:center;">Матричната въртележка &ndash; '+Math.round(1000*this.config.score)/10+' от '+Math.round(100*this.config.max_score)+' точки</span></h1>';
	this.info += '<p>В задачата трябва да се определят правилните трансформации на '+arenas+' матрици. '
	for (var i=0; i<arenas; i++)
	{
		this.info += ' '+(['Първата','Другата','Третата','Следващата','Петата','Последата'])[i];
		this.info += ' матрица съвпада на '+Math.floor(100*sims[i])+'%.';
	}
	this.info += '</p>';
//	console.log('evaluation=',this.config.score*match);
}



// конфигурира сцената според желаната трудност
MEIRO.Models.T007.prototype.configure = function(difficulty)
{	
	this.config = {difficulty: difficulty};
		
	var max_score = 0;
	
	switch (difficulty)
	{
		// ниска трудност
		case DIFFICULTY_LOW:
			arenas = 2;
			//max_score = 0.2;
			break;
			
		// средна трудност
		case DIFFICULTY_MEDIUM:
			arenas = 3;
			//max_score = 0.4;
			break;
			
		// висока трудност
		case DIFFICULTY_HIGH:
			arenas = 6;
			//max_score = 1.0;
			break;
			
		default: console.error('Unknown difficulty level');
	}

	this.config.arenas = arenas;
	
	this.constructMatrices();
	for (var i=0; i<6; i++) max_score += this.matrixData[i].hard/100;

}