//
//	class Water( )
//

	

class Water extends Group
{
	static DRAIN_ALL_SPEED = 500;
	
	constructor( )
	{
		super( suica );

		this.cyan = 0;
		this.magenta = 0;
		this.yellow = 0;

		this.water = cube( [0,0,0], [Tank.WIDTH-2*Tank.FRAME_WIDTH/3,0] );
		// this.water.threejs.material = new THREE.MeshBasicMaterial({
			// color: 'cyan',
			// polygonOffset: true,
			// polygonOffsetUnits: 1,
			// polygonOffsetFactor: 1,
			// transparent: true,
			// opacity: 0.5,
		// });
		this.water.threejs.material = new THREE.MeshPhysicalMaterial({
				//color: 'white',
				//clearcoat: 1,
				//clearcoatRoughness: 0,
				ior: 1.05,
				roughness: 0.5,
				metalness: 0,
				thickness: 0.1,
				transmission: 0.2,
				//emissiveIntensity: 0.1,
				//emissive: 'lime',
				//opacity: 1,
				transparent: !false,
		});
		this.water.threejs.renderOrder = -2;
		
		this.waterBorder = square( [0,0,0], Tank.WIDTH-2*Tank.FRAME_WIDTH/3, 'black' );
			its.wireframe = true;
			its.spinV = 90;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.3;
			its.threejs.renderOrder = -1;
			
		this.plateColor = sphere( [0,0.05,0], [Tank.PLATE_SIZE, Tank.PLATE_HEIGHT] );
			its.threejs.material.map = ScormUtils.image( 'plate_border.jpg', 24, 0.85 );
			
		this.plate = group(
			this.plateColor,
			sphere( [0,0,0], [Tank.PLATE_SIZE*1.1, Tank.PLATE_HEIGHT], 'black' )
		);
		this.plate.y = -2;
		
		this.addEventListener( 'onMouseDown', this.clickOnPlate );
		
		this.add( this.water, this.waterBorder, this.plate );
		
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
		
		this.water.y = height/2 + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;
		this.water.height = height;
		this.water.threejs.material.opacity = Math.pow(level,1);
		this.water.threejs.material.transmission = 0;//-1*Math.pow(level,1/6);
		this.water.threejs.material.roughness = 0;//Math.pow(level,1/6);
		this.water.threejs.material.thickness = 0;//Math.pow(level,1/6);
		this.water.threejs.material.color = color;
		
		this.waterBorder.y = height + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;

		this.plate.y = Math.max(height,Tank.PLATE_HEIGHT/2) + Tank.BASE_HEIGHT + Tank.VERTICAL_OFFSET;

	} // Water.adjustWater

	
	
	drain( value )
	{
		if( this.level==0 ) return;
		
		var scale = Math.max( 0, (this.level-value)/this.level );
		
		this.cyan *= scale;
		this.magenta *= scale;
		this.yellow *= scale;
		this.adjustWater( );
	} // Water.drain
	

	
	drainAll( )
	{
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
		this.plate.threejs.rotation.set(
			amplitude*Math.cos( 2.91*t ),
			amplitude*Math.cos( 1.31*t ),
			amplitude*Math.sin( 1.72*t  ),
			'ZYX'
		);
		
	} // Water.waves
	
	
	clickOnPlate( )
	{
		if( playground.tank.water.level > 0.9 )
			playground.endGame();
	}
	
	
} // class Water
