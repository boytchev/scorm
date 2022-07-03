//
//	class Water( )
//

	

class Water extends Group
{
	static DRAIN_SPEED = 3000;
	
	constructor( )
	{
		super( suica );

		this.cyan = 0;
		this.magenta = 0;
		this.yellow = 0;

		this.water = cube( [0,0,0], [Tank.WIDTH-2*Tank.FRAME_WIDTH/3,0] );
		this.water.threejs.material = new THREE.MeshBasicMaterial({
			color: 'cyan',
			polygonOffset: true,
			polygonOffsetUnits: 1,
			polygonOffsetFactor: 1,
			transparent: true,
			opacity: 0.5,
		});
		this.water.threejs.renderOrder = -1;
		
		this.waterBorder = square( [0,0,0], Tank.WIDTH-2*Tank.FRAME_WIDTH/3, 'black' );
			its.wireframe = true;
			its.spinV = 90;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.3;
			its.threejs.renderOrder = -1;

		this.plate = group(
			cube( [0,Tank.PLATE_HEIGHT/2,0], [Tank.PLATE_SIZE, Tank.PLATE_HEIGHT] ),
			cube( [0,Tank.PLATE_HEIGHT/2,0], [Tank.PLATE_SIZE, Tank.PLATE_HEIGHT], 'black' ).style({ wireframe:true }),
			square( [0,Tank.PLATE_HEIGHT,0], Tank.PLATE_SIZE ).style({ spinV:-90 }),
		);

		this.add( this.water, this.waterBorder, this.plate );
		
	} // Water.constructor
	
	
	
	adjustWater( )
	{
		// calibrate ink level (if it is more than 1)
		var level = this.cyan + this.magenta + this.yellow;
		if( level > 1 )
		{
			this.cyan    = this.cyan/level;
			this.magenta = this.magenta/level;
			this.yellow  = this.yellow/level;
			
			level = 1;
		}

		var color = rgb( 255-255*this.cyan/level, 255-255*this.magenta/level, 255-255*this.yellow/level );
		
		var height = level * Tank.WATER_HEIGHT;
		
		this.water.y = height/2 + Tank.BASE_HEIGHT;
		this.water.height = height;
		this.water.threejs.material.opacity = level;
		this.water.threejs.material.color = color;
		
		this.waterBorder.y = height + Tank.BASE_HEIGHT;

		this.plate.y = Math.max( 0.05, height-Tank.PLATE_HEIGHT/2 ) + Tank.BASE_HEIGHT;
		
	} // Water.adjustWater

	
	
	drain( )
	{
		var cyan = this.cyan,
			magenta = this.magenta,
			yellow = this.yellow;
			
		var total = this.cyan + this.magenta + this.yellow,
			water = this;
		
		new TWEEN.Tween( {total:total} )
			.to( {total:0}, Water.DRAIN_SPEED*total )
			.easing( TWEEN.Easing.Linear.None )
			.onUpdate( rec => {
				water.cyan = cyan*rec.total;
				water.magenta = magenta*rec.total;
				water.yellow = yellow*rec.total;
				water.adjustWater( );
			})
			.onComplete( ()=>{ playground.drainSound?.play()} )
			.start( );
	} // Water.drain
	

	
	addCyan( value )
	{
		this.cyan += value;
		this.adjustWater( );
	} // Water.addCyan
	

	
	addMagenta( value )
	{
		this.magenta += value;
		this.adjustWater( );
	} // Water.addMagenta
	

	
	addYellow( value )
	{
		this.yellow += value;
		this.adjustWater( );
	} // Water.addYellow
	

	
	waves( t )
	{
		var amplitude = 0.03*this.level;
		
		this.plate.threejs.rotation.set( amplitude*Math.cos( 1.91*t ),0, amplitude*Math.sin( 1.72*t ) );
		
	} // Water.waves
	
	
} // class Water

