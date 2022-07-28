1252 -> 640(51%)

MEIRO.Models.T004.prototype.initialize = function()
{
	if (SCORE_STATISTICS) this.configureStats();
	
	random.randomize();

	this.OBJECT_SIZE = 5;
	this.OBJECT_HEIGHT = 6;
	
	this.AXIS_LENGTH = 3;
	this.AXIS_RADIUS = 0.2;
	this.AXIS_DISTANCE = 5.05;

	this.DISC_RADIUS = 1;
	this.DISC_WIDTH = 1/2;

	this.PILLAR_WIDTH = 2*this.DISC_RADIUS+1;
	
	this.BASE_HEIGHT = 1;
	this.BASE_LENGTH = 13;
	this.BASE_WIDTH = 7;
	
	this.TUBE_LENGTH = this.BASE_LENGTH-2;
	this.TUBE_RADIUS = this.BASE_HEIGHT/4;
	
	this.RULER_LENGTH = this.BASE_LENGTH-0.3;
	this.RULER_WIDTH = 0.5;
	this.RULER_DISTANCE = 0;
	
	this.axes = new THREE.Group();
	this.object = new THREE.Group();

	this.tubeBalance = Math.PI/2;
	this.inBalancing = false;
	this.userAnswer = 0;
	
	this.F = 0;
	this.E = 0;
	this.V = 0;

	//this.constructObject(); -- in configure()
	this.constructAxes();
	this.constructPillars();
	this.constructBase();
	this.constructTube();
	this.constructRuler();
	
	this.playing = false;
	this.startTime = 0;
	this.lastTime = 0;
	this.clicks = 0;
	
	this.waterGulp = new Audio('sounds/water-gulp.mp3');
}

	

MEIRO.Models.T004.prototype.construct = function()
{
	var light = new THREE.SpotLight( 'white', 1, 0, Math.PI/2, 1 );
	light.position.set( 4, 4, 0 );
	light.target = new THREE.Object3D();
	light.target.position.set( 5, 4+1, 0 );
	this.image.add( light );
	this.image.add( light.target );
	
	var light = new THREE.SpotLight( 'white', 1, 0, Math.PI/2, 1 );
	light.position.set( -4, 4, 0 );
	light.target = new THREE.Object3D();
	light.target.position.set( -5, 4+1, 0 );
	this.image.add( light );
	this.image.add( light.target );
	

	this.raycaster = new THREE.Raycaster();
	this.mouse = new THREE.Vector2();

	// бутон за стартиране/приключване
	var that = this;
	this.buttonTimer = new MEIRO.CornerButton('topLeft', function(){that.onExitModel();}, '0:00', 'images/time.png');
	this.buttonTimer.hide();

	this.defaultInfo = '<h1>Характерният брой</h1>';
	this.defaultInfo += '<p>Определете Ойлеровата характеристика на централното тяло. Тази характеристика е равна на броя стени минус броя ръбове плюс броя върхове. Огледайте добре дали има тунели или вдлъбнатини и колко са.</p><p>Отговорът е цяло число (положително, нула или отрицателно) и се избира като се кликва на тръбичката с течност. Ако се кликне в някоя от половините на тръбичката, тази половина се издига нагоре и мехурчето се плъзва към нея.</p>';
}



MEIRO.Models.T004.prototype.constructRuler = function()
{
	// ruler
	var textureMap = MEIRO.loadTexture( "textures/004_ruler.jpg", 1, 1 );

	var geometry = new THREE.PlaneBufferGeometry( this.RULER_LENGTH, this.RULER_WIDTH );
	
	var ruler = new THREE.Mesh(
		geometry,
		new THREE.MeshBasicMaterial( {
				color: 'white',
				map: textureMap,
				polygonOffset: true,
				polygonOffsetFactor: -1,
				polygonOffsetUnits: -1,
		})
	);
	ruler.position.z = this.BASE_WIDTH/2+this.RULER_DISTANCE;
	ruler.position.y = this.RULER_WIDTH/2+0.1;
	//ruler.rotation.set(-Math.PI/2,Math.PI/2*0,0);
	this.image.add( ruler );
}


MEIRO.Models.T004.prototype.constructBase = function()
{
	// base
	var textureMap = MEIRO.loadTexture( "textures/Metal_plate_256x256.jpg", 1, 1 );
	//var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", 1, 1 );
	var lightMap = MEIRO.loadTexture( "textures/004_base_lightmap.jpg" );

	var geometry = new THREE.BoxBufferGeometry( this.BASE_LENGTH, this.BASE_HEIGHT, this.BASE_WIDTH );
	MEIRO.allowLightmap(geometry);
	
	var uv = geometry.getAttribute('uv');
	var position = geometry.getAttribute('position');
	for (var i=0; i<uv.count; i++)
	{
		uv.setXY( i, position.getX(i)+position.getZ(i), position.getY(i)+0.5 );
	}
	
	var base = new THREE.Mesh(
		geometry,
		new THREE.MeshStandardMaterial( {
				color: 'white',
				metalness: 0.3,
				roughness: 0.5,
				map: textureMap,
				//normalMap: normalMap,
				lightMap: lightMap,
				lightMapIntensity: -1/2,
		})
	);
	base.position.y = this.BASE_HEIGHT/2;
	base.scale.x = this.BASE_LENGTH/(this.BASE_LENGTH+0.1);
	this.image.add( base );

	// base top
	var textureMap = MEIRO.loadTexture( "textures/Metal_plate_256x256.jpg", this.BASE_LENGTH, this.BASE_WIDTH );
	//var normalMap = MEIRO.loadTexture( "textures/Metal_plate_256x256_normal.jpg", this.BASE_LENGTH, this.BASE_WIDTH );
	var lightMap = MEIRO.loadTexture( "textures/004_basetop_lightmap.jpg" );
	var geometry = new THREE.PlaneBufferGeometry( this.BASE_LENGTH, this.BASE_WIDTH );
	MEIRO.allowLightmap(geometry);
	var base = new THREE.Mesh(
		geometry,
		new THREE.MeshStandardMaterial({
				color: 'white',
				metalness: 0.3,
				roughness: 0.5,
				map: textureMap,
				//normalMap: normalMap,
				//normalScale: new THREE.Vector2(0.2,0.2),
				polygonOffset: true,
				polygonOffsetFactor: -1,
				polygonOffsetUnits: -1,
				lightMap: lightMap,
				lightMapIntensity: 2,
		})
	);
	base.scale.x = this.BASE_LENGTH/(this.BASE_LENGTH+0.1);
	base.position.y = this.BASE_HEIGHT;
	base.rotation.x = -Math.PI/2;
	this.image.add( base );

}


MEIRO.Models.T004.prototype.constructTube = function()
{
	// tube
	var geometry = new THREE.CylinderBufferGeometry( this.TUBE_RADIUS, this.TUBE_RADIUS, this.TUBE_LENGTH, 12, 1, !true );
	//MEIRO.allowLightmap(geometry);
	
	var tube = new THREE.Mesh(
		geometry,
		new THREE.MeshStandardMaterial( {
				color: 'lightblue',
				//metalness: 1,
				//map: textureMap,
				transparent: true,
				opacity: 0.5,
				//normalMap: normalMap,
				//lightMap: lightMap,
				//lightMapIntensity: -1/2,
				side: THREE.BackSide,
		})
	);
	tube.position.set(0, this.BASE_HEIGHT-0.2, +this.BASE_WIDTH/2+1.2*this.TUBE_RADIUS);
	tube.rotation.z = Math.PI/2;
	this.image.add( tube );
	this.tube = tube;
	
	var liquid = new THREE.Mesh(
		geometry,
		new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
				//metalness: 1,
				//roughness: 0.5,
				transparent: true,
				opacity: 0.8,
				emissive: 'cornflowerblue',
				emissiveIntensity: 0.5,
				side: THREE.BackSide,
		})
	);
	liquid.scale.set( 0.6, 1.08, 0.6 );
	liquid.renderOrder = -2;
	tube.add( liquid );
	
	// bubble
	var geometry = new THREE.SphereBufferGeometry( this.TUBE_RADIUS*0.6, 8, 24 );
	var pos = geometry.getAttribute('position');
	for (var i=0; i<pos.count; i++)
	{
		var x = pos.getX(i);
		var z = pos.getZ(i);
		var r = Math.sqrt(x*x+z*z);
		if (r>0.0001)
			r = (1*this.TUBE_RADIUS*0.7+1*r)/2/r;
		pos.setX(i,r*x);
		pos.setZ(i,r*z);
	}
	
	var bubble = new THREE.Mesh(
		geometry,
		new THREE.MeshStandardMaterial( {
				color: 'white',
				metalness: 1/2,
				transparent: true,
				opacity: 0.5,
				emissive: 'white',
				emissiveIntensity: 0.2,
				//polygonOffset: !true,
				//polygonOffsetFactor: -10,
				//polygonOffsetUnits: -10,
				
		})
	);
	bubble.scale.set(1,1.5,1);
	bubble.position.y = 0;
	//bubble.rotation.z = Math.PI/2;
	bubble.renderOrder = 2;
	tube.add( bubble );
	this.bubble = bubble;
	
	var bubble2 = bubble.clone();
	bubble2.position.y = 0;
	bubble.add(bubble2);
	bubble2.scale.set(0.8,0.7,0.8);
	
//	var light = new THREE.SpotLight('red',1);
//	light.position.y = 1;
//	light.target = bubble;
//	bubble.add( light );
	
	// caps
	var geometry = new THREE.SphereBufferGeometry( this.TUBE_RADIUS, 24, 12, 0, 2*Math.PI, 0, Math.PI/2 );
	var material = new THREE.MeshStandardMaterial( {
		color: 'gray',
		metalness: 0.8,
		side: THREE.DoubleSide,
	})

	//MEIRO.allowLightmap(geometry);
	
	var cap = new THREE.Mesh( geometry, material );
	cap.position.y = this.TUBE_LENGTH/2+1/4;
	tube.add( cap );
	
	cap = cap.clone();
	cap.position.y *= -1;
	cap.rotation.z = Math.PI;
	tube.add( cap );
	
	var geometry = new THREE.CylinderBufferGeometry( this.TUBE_RADIUS, this.TUBE_RADIUS, 1/4, 12, 1, true );
	var cap = new THREE.Mesh( geometry, material );
	cap.position.y = this.TUBE_LENGTH/2+1/8;
	tube.add( cap );
	
	cap = cap.clone();
	cap.position.y *= -1;
	tube.add( cap );
	

	// holder
	var geometry = new THREE.CylinderBufferGeometry( this.TUBE_RADIUS, this.TUBE_RADIUS, 1, 12, 1, true, Math.PI/4, 6*Math.PI/4 );
	var holder = new THREE.Mesh( geometry, material );
	tube.add( holder );
	
	// rod
	var rod = new THREE.Mesh( geometry, material );
	rod.scale.set(0.3,1,0.3);
	rod.rotation.y = -Math.PI/2;
	rod.rotation.x = Math.PI/2;
	rod.position.z = -0.7;
	tube.add( rod );
	
}



MEIRO.Models.T004.prototype.constructAxes = function()
{
	var textureMap = MEIRO.loadTexture( "textures/002_sucktion.jpg", 1, 1 );

	// axes
	var material = new THREE.MeshStandardMaterial( {
			color: 'black',
			metalness: 0.2,
			side: THREE.DoubleSide,
			emissive: 'moccasin',
			emissiveIntensity: 0.1,
			polygonOffset: true,
			polygonOffsetUnits: -1,
			polygonOffsetFactor: -1,
	});

	var geometry = new THREE.CylinderBufferGeometry( this.AXIS_RADIUS, this.AXIS_RADIUS, this.AXIS_LENGTH, 3, 12, true );
	var pos = geometry.getAttribute( 'position' );
	for (var i=0; i<pos.count; i++)
	{
		var y = pos.getY(i);
		var scale = Math.pow(1/(y/this.AXIS_LENGTH+1),2.5);
		pos.setXYZ( i, scale*pos.getX(i), y, scale*pos.getZ(i)); 
	}
	
	var axis = new THREE.Mesh( geometry, material );
	axis.rotation.x = Math.PI/6;
	axis.rotation.z = Math.PI/2;
	axis.position.x = -this.AXIS_DISTANCE;
	this.axes.add( axis );
	
	var axis = new THREE.Mesh( geometry, material );
	axis.rotation.x = -Math.PI/6;
	axis.rotation.z = -Math.PI/2;
	axis.position.x = this.AXIS_DISTANCE;
	this.axes.add( axis );

	
	// rotation discs
	var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			map: textureMap,
			metalness: 0.5,
			side: THREE.DoubleSide,
			emissive: 'moccasin',
			emissiveIntensity: 0.1,
	});
	var geometry = new THREE.CylinderBufferGeometry( this.DISC_RADIUS, this.DISC_RADIUS, this.DISC_WIDTH, 40 );
	var disc = new THREE.Mesh( geometry, material );
	disc.rotation.z = -Math.PI/2;
	disc.position.x = this.AXIS_DISTANCE+this.AXIS_LENGTH/2-this.DISC_WIDTH/1.5+0.04;
	this.axes.add( disc );	
	
	var disc = disc.clone();
	disc.position.x *= -1;
	this.axes.add( disc );	
	
	this.axes.position.y = this.OBJECT_HEIGHT;

	this.image.add( this.axes );
}	


MEIRO.Models.T004.prototype.constructPillars = function()
{
	// pillars
	var textureMap = MEIRO.loadTexture( "textures/Metal_plate_256x256.jpg", this.PILLAR_WIDTH, this.OBJECT_HEIGHT );
	//var normalMap = MEIRO.loadTexture( "textures/Metal_plate_64x256_normal.jpg", this.PILLAR_WIDTH, this.OBJECT_HEIGHT );
	var lightMap = MEIRO.loadTexture( "textures/004_pillar_lightmap.jpg", 1, 1 );
	
	var geometry = new THREE.BoxBufferGeometry(this.DISC_WIDTH-0.1,this.OBJECT_HEIGHT-this.BASE_HEIGHT,this.PILLAR_WIDTH,1, 16, 1);
	MEIRO.allowLightmap(geometry);
	var material = new THREE.MeshStandardMaterial({
							color: 'white',
							//emissive: 'white',
							//emissiveIntensity: 0.1,
							metalness: 0.3,
							roughness: 0.5,
							map: textureMap,
							lightMap: lightMap,
							lightMapIntensity: -1,
							//normalMap: normalMap,
							//normalScale: new THREE.Vector2(1/3,1/3),
						})
	var normal = geometry.getAttribute('normal');
	var position = geometry.getAttribute('position');
	for (var i=0; i<normal.count; i++)
	{
		if (normal.getX(i)==0)
			normal.setXYZ(i,0,0,0);
		if (position.getY(i)<0 && position.getX(i)<0)
			position.setX(i,(1+Math.pow(-position.getY(i),2.26))*position.getX(i));
	}
	
	var pillar = new THREE.Mesh(geometry, material);
	pillar.position.set(this.AXIS_DISTANCE+this.AXIS_LENGTH/2-this.DISC_WIDTH/1.5+0.04,this.OBJECT_HEIGHT/2+this.BASE_HEIGHT/2,0);
	this.image.add(pillar);
	
	var pillar = pillar.clone();
	pillar.rotation.y = Math.PI;
	pillar.position.x *= -1;
	this.image.add(pillar);
	
	
	// pillar arks
	var textureMap = MEIRO.loadTexture( "textures/Metal_plate_256x256.jpg", this.PILLAR_WIDTH, this.PILLAR_WIDTH );
	textureMap.offset = new THREE.Vector2(0, 0.5);
//	var normalMap = MEIRO.loadTexture( "textures/Metal_plate_64x256_normal.jpg", this.PILLAR_WIDTH, this.PILLAR_WIDTH );
	var lightMap = MEIRO.loadTexture( "textures/004_ark_lightmap.jpg", 1, 1 );
	
	var geometry = new THREE.CylinderBufferGeometry(this.PILLAR_WIDTH/2,this.PILLAR_WIDTH/2,this.DISC_WIDTH-0.1, 30, 1, false, 0, Math.PI);
	var material = new THREE.MeshStandardMaterial({
							metalness: 0.3,
							//roughness: 0.5,
							map: textureMap,
//							normalMap: normalMap,
							lightMap: lightMap,
							lightMapIntensity: -1,
						})
	MEIRO.allowLightmap(geometry);
	
	var normal = geometry.getAttribute('normal');
	for (var i=0; i<normal.count; i++)
		if (normal.getZ(i)!=0)
			normal.setXYZ(i,0,0,0);
		
	var ark = new THREE.Mesh(geometry, material);
	ark.rotation.z = Math.PI/2;
	ark.position.set(this.AXIS_DISTANCE+this.AXIS_LENGTH/2-this.DISC_WIDTH/1.5+0.04,this.OBJECT_HEIGHT,0);
	this.image.add(ark);
	
	var ark = ark.clone();
	ark.position.x *= -1;
	this.image.add(ark);
}



MEIRO.Models.T004.prototype.onObject = function()
{
	if (!this.playing) return undefined;
	
	// координати на мишка
	this.mouse.x = (controls.human.mousePos.x/window.innerWidth)*2 - 1;
	this.mouse.y = -(controls.human.mousePos.y/window.innerHeight)*2 + 1;

	this.raycaster.setFromCamera( this.mouse, camera );
	
	var intersects = this.raycaster.intersectObject( this.tube, true );
	if (intersects.length)
	{	
		this.clicks++;
		var pnt = this.tube.worldToLocal(intersects[0].point);
		if (pnt.y<0)
		{
//			console.log('up');
			this.tubeBalance = Math.PI/2+0.1;
			this.tubeDebalance = 0;
		}
		else
		{
//			console.log('down');
			this.tubeBalance = Math.PI/2-0.1;
			this.tubeDebalance = 0;
		}
		this.inBalancing = true;
		this.waterGulp.pause();
		this.waterGulp.volume = 1;
		this.waterGulp.currentTime = 0;
		this.waterGulp.play();
		return this.tube;
	}

	return undefined;
}




// аниматор на модела
MEIRO.Models.T004.prototype.onAnimate = function(time)
{	
	if (this.playing)
	{
		
////		this.objectShadow.rotation.x = rpm(time,2);
		this.object.rotation.x = rpm(time,2);
		this.axes.rotation.x = rpm(time,2);
		this.bubble.position.y -= 0.3*(this.tube.rotation.z-Math.PI/2);
		this.bubble.position.y = THREE.Math.clamp(this.bubble.position.y,-this.TUBE_LENGTH/2,this.TUBE_LENGTH/2);
		
//	console.log(-2*this.bubble.position.y/this.RULER_LENGTH*10);
		this.tube.rotation.z = THREE.Math.lerp(this.tube.rotation.z, this.tubeBalance, 0.1);
		this.userAnswer = Math.round(-this.bubble.position.y*20/this.RULER_LENGTH);
		if (!this.inBalancing && Math.abs(this.tube.rotation.z-Math.PI/2)<0.01)
		{
			// move bubble to closest integer value
			var posY = -this.userAnswer/20*this.RULER_LENGTH;
			this.bubble.position.y = THREE.Math.lerp(this.bubble.position.y,posY,0.1);
			this.waterGulp.volume *= 0.8;
		}
	}

	//TWEEN.update();
	reanimate();
}



MEIRO.Models.T004.prototype.evaluateResult = function()
{	
	var match = 0;
	var euler = this.F-this.E+this.V;
	var diff = Math.abs(this.userAnswer - euler);
	match = THREE.Math.clamp(1-0.45*diff,0,1);
	
	// user can select from -9 to 9, but the answer might be beyond
	// so, assume the end value to be equal to any value beyons
	if (euler<-8.5 && this.userAnswer<-8.5) match = 1;
	if (euler>+8.5 && this.userAnswer>+8.5) match = 1;
	
	
	this.config.score = match*this.config.max_score;

	this.config.time =  Math.floor((animationLoop.time-this.startTime)/1000);
	
//	console.log('score=',this.config.score);
	this.info = '';
	this.info += '<h1 style="text-align:center;">Характерният брой &ndash; '+Math.round(1000*this.config.score)/10+' от '+Math.round(1000*this.config.max_score)/10+' точки</span></h1>';

	this.info += '<p>Конструкцията има ойлерова характеристика F-E+V='+euler+'. Вашият отговор е '+this.userAnswer+'.</p>';

//	console.log('evaluation=',this.config.score*match);
}



// конфигурира сцената според желаната трудност
MEIRO.Models.T004.prototype.configure = function(difficulty)
{	
	this.config = {difficulty: difficulty};
		
	var max_score = 0;
	var s = x = y = z = sum = 0;
	var limit = {from:0, to:0};
	var map = {from:0, to:0};
	
	var attempt = 30;
	while (--attempt > 0)
	{
		switch (difficulty)
		{
			// ниска трудност (10-20)
			case DIFFICULTY_LOW:
				s = random(3,5);
				sum = random(1,3);
				limit = {from:0.10, to:0.30};
				map   = {from:0.10, to:0.20};
				break;
				
			// средна трудност (30-40)
			case DIFFICULTY_MEDIUM:
				s = random(5,7);
				sum = random(2,5);
				limit = {from:0.20, to:0.40};
				map   = {from:0.30, to:0.40};
				break;
				
			// висока трудност (70-100)
			case DIFFICULTY_HIGH:
				s = random(8,11);
				sum = random(5,6);
				limit = {from:0.50, to:1.00};
				map   = {from:0.70, to:1.00};
				break;
				
			default: console.error('Unknown difficulty level');
		}
				
		x = random(0,sum-1);
		y = random(0,sum-x);
		z = sum-x-y;

		this.config.size = s;
		this.config.tunnels = {x:x,y:y,z:z};
		this.constructObject();

		var complexity = this.W;
		var euleristic1 = (this.F-this.E+this.V)!=2?1.25:1;		// *1,25 if euler not 2
		var euleristic2 = (100+this.F-this.E+this.V)%2?1.25:1;	// *1.25 if euler odd
		max_score = (complexity*euleristic1*euleristic2)/300;
		//break;
		
		//console.log('diff='+difficulty,' max_score=',max_score,'limit=[',limit.from,'..',limit.to,']');
		//if (max_score<limit.from) console.log('spoiled');
		if (max_score<limit.from)
		{
			if (!IN_SCORE_STATISTICS)
			{
				this.planes.dispose();
				this.edges.dispose();
			}
			continue;
		}
		if (max_score>limit.to) continue;
		
		break;
	}
	this.constructObjectImage();
	//if (30-attempt!=1) console.log('attempts',30-attempt);
	max_score = THREE.Math.mapLinear(max_score,limit.from,limit.to,map.from,map.to);
	max_score = THREE.Math.clamp(max_score,map.from,map.to);

	//	console.log('max_score=',max_score,' tunnels:',x,y,z);

	// recalibrate, because scores are crowded near the
	// bottom limit (=map.from)
	max_score = (max_score-map.from)/(map.to-map.from);
	max_score = Math.pow(max_score,1/6);
	max_score = max_score*(map.to-map.from)+map.from;
//	console.log('new_score=',max_score);
	
	this.config.max_score = max_score;
	if (!IN_SCORE_STATISTICS)
	{
		this.sendStartup();
	}
}
