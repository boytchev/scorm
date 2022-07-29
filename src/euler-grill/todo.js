1252 -> 301(24%)

MEIRO.Models.T004.prototype.initialize = function()
{
	this.BASE_HEIGHT = 1;
	this.BASE_LENGTH = 13;
	this.BASE_WIDTH = 7;
	
	this.TUBE_LENGTH = this.BASE_LENGTH-2;
	this.TUBE_RADIUS = this.BASE_HEIGHT/4;
	
	this.RULER_LENGTH = this.BASE_LENGTH-0.3;
	this.RULER_WIDTH = 0.5;
	this.RULER_DISTANCE = 0;

	this.waterGulp = new Audio('sounds/water-gulp.mp3');
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
