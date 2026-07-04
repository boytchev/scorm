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
		//this.water = prism( 100, [0,0,0], [Tank.WIDTH-2*Tank.FRAME_WIDTH/3,0] );
		this.water = prism( 100, [0,0,0], 1 );
		this.water.threejs.geometry = new THREE.CylinderGeometry( r, r, 1, 100, 1, true ).translate(0,0.5,0);
		this.water.threejs.material = new THREE.MeshStandardMaterial({
				roughness: 0.2,
				metalness: 0,
				transparent: true,
				side: THREE.DoubleSide,
		});
//		this.water.threejs.renderOrder = -10;
		
		//this.waterBorder = polygon( 100, [0,0,0], Tank.WIDTH-2*Tank.FRAME_WIDTH/3, 'black' );
		this.waterBorder = polygon( 100, [0,0,0], 1, 'black' );
		this.waterBorder.threejs.geometry = new THREE.RingGeometry( Tank.PLATE_SIZE/8, r, 100, 10 ).rotateX(Math.PI/2).rotateY(-Math.PI/2/100);
		this.waterBorder.threejs.material = new THREE.MeshPhysicalMaterial({
				roughness: 0,
				metalness: 0,
				transparent: true,
				side: THREE.BackSide,
		});
		this.waterBorder.threejs.renderOrder = -5;
//			its.wireframe = true;
//			its.spinV = -90;
//			its.spinH = 60;
//			its.threejs.material.transparent = true;
//			its.threejs.material.opacity = 0.3;
//			its.threejs.material.wireframe = true;
//			its.threejs.renderOrder = -1;
	


//=============

//=============================










	
		this.plateColor = sphere( [0,0.05/SC,0], [Tank.PLATE_SIZE, Tank.PLATE_HEIGHT] );
			its.threejs.material.map = ScormUtils.image( 'plate_border.jpg', 24, 0.85 );
			
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
		var scale = level/this.level;
		
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
			level = this.level;
		}
		
		var max = Math.max( this.cyan, this.magenta, this.yellow );
		var color = rgb( 255-255*this.cyan/max, 255-255*this.magenta/max, 255-255*this.yellow/max );
		
		var height = level*Tank.WATER_HEIGHT;
		
		this.water.y = Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;
		this.water.height = height;
		this.water.threejs.material.opacity = THREE.MathUtils.smoothstep(level,0,1/2);
		this.water.threejs.material.color = color;
		this.waterBorder.threejs.material.opacity = THREE.MathUtils.smoothstep(level,0,1/2);
		this.waterBorder.threejs.material.color = color;
		
		this.waterBorder.y = height + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;

		this.plate.y = Math.max(height,Tank.PLATE_HEIGHT/2) + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;

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
		var amplitude = 0.08*this.level;
		if( window.simplex ) 
		this.plate.threejs.rotation.set(
			amplitude*window.simplex.noise(t/3,0)/2,
			amplitude*window.simplex.noise(t/3,t/3)/2,
			amplitude*window.simplex.noise(0,t/3)/2,
			'ZYX'
		);
		


		var geo = this.water.threejs.geometry,
			pos = geo.attributes.position;

		if( window.simplex ) {
			for( var i=0; i<pos.count; i++ )
				if( pos.getY(i)>0.5 )
				{
					var noise = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					pos.setY(i, 1+0.025*this.level*noise );
//					console.log( pos.getX(i), pos.getZ(i), noise );
				}
//			geo.computeVertexNormals();
			pos.needsUpdate = true;
		}
		
		geo = this.waterBorder.threejs.geometry;
		pos = geo.attributes.position;

		if( window.simplex ) {
			for( var i=0; i<pos.count; i++ )
			{
					var noise = window.simplex.noise3d(2*pos.getX(i),2*pos.getZ(i),t/2 );
					pos.setY(i, 0.025*this.level*noise*this.water.height );
//					console.log( pos.getZ(i), pos.getX(i), noise );
			}
			geo.computeVertexNormals();
			pos.needsUpdate = true;
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
		//this.plateColor.color = hsl( (200*t + 100*Math.sin(t))%360, 100, 50 );
		this.plateColor.color = hsl( 0, 0, 50+10*Math.sin(10*t)+10*Math.sin(5*t) );
	}
} // class Water

