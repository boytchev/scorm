//
//	class Water( )
//

	
var lastClickTime = -1000;


class Water extends Suica.Group
{
	static DRAIN_ALL_SPEED = 500;
	static BOOM_TIMEOUT = 350;
	static DOUBLE_CLICK_PROTECTION = 1; // 1 second
	
	constructor( )
	{
		super( suica );

		this.cyan = 0;
		this.magenta = 0;
		this.yellow = 0;

		var r = 0.5*(Tank.WIDTH-2*Tank.FRAME_WIDTH/3);
		this.water = prism( 100, [0,0,0], 1 );
		this.water.threejs.geometry = new THREE.CylinderGeometry( r, r, 1, 100, 1, true ).translate(0,0.5,0);
		this.water.threejs.material = new THREE.MeshStandardMaterial({
				color: new THREE.Color('black'),
				emissiveIntensity: 1,
				emissive: new THREE.Color('black'),
				roughness: 0.2,
				metalness: 0,
				transparent: true,
				side: THREE.DoubleSide,
		});
		
		this.waterBorder = polygon( 100, [0,0,0], 1, 'black' );
		this.waterBorder.threejs.geometry = new THREE.RingGeometry( Tank.PLATE_SIZE/8, r, 100, 20 ).rotateX(Math.PI/2).rotateY(-Math.PI/2/100);
		this.waterBorder.threejs.material = new THREE.MeshPhysicalMaterial({
				clearcoat: 2,
				clearcoatRoughness: 0.1,
				color: new THREE.Color('black'),
				emissiveIntensity: 1,
				emissive: new THREE.Color('black'),
				roughness: 1,
				metalness: 0,
				transparent: true,
				side: THREE.BackSide,
		});
		this.waterBorder.threejs.renderOrder = -5;

	
		this.plateColor = sphere( [0,0.05/SC,0], [Tank.PLATE_SIZE, Tank.PLATE_HEIGHT] );
//		this.plateColor.threejs.material = new THREE.MeshBasicMaterial({
		this.plateColor.threejs.material = new THREE.MeshPhysicalMaterial({
			clearcoat: 2,
			clearcoatRoughness: 0.1,
			color: new THREE.Color('black'),
			emissiveIntensity: 1,
			emissive: new THREE.Color('black'),
			roughness: 1,
			metalness: 0,
			emissiveMap: ScormUtils.image( 'plate_border.jpg', 24, 0.85 ),
			});
			
		var plateFrame = sphere( [0,0,0], [Tank.PLATE_SIZE*1.1, Tank.PLATE_HEIGHT], 'black' ); 
		its.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'white',
						metalness: 0.8,
						roughness: 0.3,
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 8, 2 ),
						normalScale: new THREE.Vector2( 0.25, 0.25 ),
					} );
					
		this.plate = group(
			this.plateColor,
			plateFrame
		);
		this.plateColor.parent = this.plate; // for VR clicks
		
		this.plate.addEventListener( 'onPointerDown', this.clickOnPlate );
		
		this.add( this.water, this.waterBorder );
		this.threejs.renderOrder = -100;
		
		this.adjustWater( );
		
	} // Water.constructor
	
	
	
	clearWater( )
	{
		this.cyan = 0;
		this.magenta = 0;
		this.yellow = 0;

		this.adjustWater( );
	}
	
	
	
	get level( )
	{
		return this.cyan + this.magenta + this.yellow;
	}
	
	set level( level )
	{
		var scale = this.level>0 && level>0 ? level/this.level : 1;
		
		this.cyan *= scale;
		this.magenta *= scale;
		this.yellow *= scale;
		
		this.adjustWater( );
	}
	
	adjustWater( )
	{
		// calibrate ink level (if it is more than 1)
		var level = this.level;
		if( level > 1 )
		{
			this.cyan    = this.cyan/level;
			this.magenta = this.magenta/level;
			this.yellow  = this.yellow/level;
			level = 1//this.level;
		}
		
		var max = Math.max( this.cyan, this.magenta, this.yellow );
		if( max == 0 ) max = 1;
		var color = rgb( 255-255*this.cyan/max, 255-255*this.magenta/max, 255-255*this.yellow/max );
		
		var height = level*Tank.WATER_HEIGHT;
		
		this.water.y = Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;
		this.water.height = height;
		this.water.threejs.material.opacity = THREE.MathUtils.smoothstep(level,0,1/2);

//		this.water.threejs.material.color = color;
		this.water.threejs.material.emissive.copy( color );
		this.waterBorder.threejs.material.opacity = THREE.MathUtils.smoothstep(level,0,1/2);
//		this.waterBorder.threejs.material.color = color;
		this.waterBorder.threejs.material.emissive.copy( color );
		
		this.waterBorder.y = height + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;

		this.plate.y = Math.max(height,Tank.PLATE_HEIGHT/2) + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;
		this.plate.baseY = this.plate.y;

	} // Water.adjustWater

	
	
	drainAll( )
	{
		setTimeout( ()=> playground.boomSound.play(), Water.BOOM_TIMEOUT );

		new TWEEN.Tween( this )
			.to( {level:0}, this.level*Water.DRAIN_ALL_SPEED )
			.easing( TWEEN.Easing.Quartic.In )
			.start( );
	} // Water.drain
	

	
	addInk( color, value )
	{
		this[color] += value;
		this.adjustWater( );
	} // Water.addInk
	

	
	waves( t )
	{
		var amplitude = 0.2*this.level**2;
		if( window.simplex ) 
		{
			var rx = amplitude*window.simplex.noise(t/3,0),
				ry = amplitude*window.simplex.noise(t/3,t/3),
				rz = amplitude*window.simplex.noise(0,t/3),
				max = Math.max(rx**2, ry**2, rz**2);
			
			this.plate.x = 0.5*amplitude*window.simplex.noise(t/6,-t/7);
			this.plate.y = this.plate.baseY - 4*max*window.simplex.noise(0,-t/3);
			this.plate.z = 0.5*amplitude*window.simplex.noise(-t/5,t/8);
			
			this.plate.threejs.rotation.set( rx, ry, rz, 'ZYX' );
		}
		

		var geo = this.water.threejs.geometry,
			pos = geo.attributes.position;

		if( window.simplex ) {
			for( var i=0; i<pos.count; i++ )
				if( pos.getY(i)>0.5 )
				{
					var noise = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					pos.setY(i, 1+0.025*this.level*noise );
				}
//			geo.computeVertexNormals();
			pos.needsUpdate = true;
		}
		
		geo = this.waterBorder.threejs.geometry;
		pos = geo.attributes.position;
		var nor = geo.attributes.normal;

		if( window.simplex ) {
			for( var i=0; i<pos.count; i++ )
			{
					var noise = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					var noiseX = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					var noiseY = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					pos.setY(i, 0.025*this.level*noise*this.water.height );
					nor.setXYZ(i,
						0.15*this.level*noiseX*this.water.height,
						-1,
						0.15*this.level*noiseY*this.water.height,						
					);
			}
			//geo.computeVertexNormals();
			pos.needsUpdate = true;
			nor.needsUpdate = true;
		}
		
	} // Water.waves
	
	
	
	clickOnPlate( )
	{
		var newClickTime = Date.now()/1000;
		
		if( newClickTime-lastClickTime < Water.DOUBLE_CLICK_PROTECTION ) return;

		lastClickTime = newClickTime;

		if( !playground.gameStarted )
		{
			playground.newGame( )
		}
		else
		{
			if( playground.tank.water.level > 0.9 )
			{
				playground.endGame();
			}
		}
	}
	
	
	colorize( t )
	{
		this.plateColor.threejs.material.emissive.copy( hsl( 0, 0, 50+10*Math.sin(10*t)+10*Math.sin(5*t) ) );
	}
} // class Water

