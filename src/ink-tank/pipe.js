//
//	class Pipe( )
//

	
class Pipe extends Group
{
	
	static VALVE_LENGTH = 0.8;
	static VALVE_RADIUS = 0.8;
	static VALVE_WIDTH = 0.1;

	static RADIUS = 0.5;	
	static LENGTH = 3.5;
	static EXTRUDE = 0.15;

	static OPEN_SPEED = 500;
	static OPEN_ANGLE = 270;
	
	constructor( color )
	{
		super( suica );

		this._aperture = 0;
		this._color = color;
		
		this.y = Tank.VERTICAL_OFFSET;
		
		this.valveTween = new TWEEN.Tween( this );
		
		// wrapper
		var wrapper = cube( [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2+Pipe.LENGTH/2+Pipe.RADIUS], [4*Pipe.RADIUS,Tank.BASE_HEIGHT,Pipe.LENGTH+Pipe.RADIUS] );
		wrapper.threejs.material.transparent = true;
		wrapper.threejs.material.opacity = 0;

		// floor connector
		var floorConnector = new Connector( [0,0,Tank.WIDTH/2 + Pipe.LENGTH] );
		var wallConnector = new Connector( [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2], 90 );

		// pipe connector
		var pipeConnector = cylinder( [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH - 3*Pipe.RADIUS], [2*Pipe.RADIUS+0.05,2*Pipe.RADIUS] );
			its.spinV = 90;
			its.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'dimgray',
						metalness: 0.8,
						roughness: 0.3,
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 1, 1/2 ),
						normalScale: new THREE.Vector2( 0.25, 0.25 ),
					} );
		
		// pipe
		this.pipe = tube(
			[0,0,0],
			spline([ [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2-1], // wall
			  [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH - Tank.BASE_HEIGHT/2],
			  [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH],
			  [0,0,Tank.WIDTH/2 + Pipe.LENGTH], // floor
			  ],false,false),
			 Pipe.RADIUS, [50,20], 1
		);
		this.pipe.threejs.material = new THREE.MeshPhysicalMaterial( {
					color: new THREE.Color(1.2,1.2,1.2),
					metalness: 0.5,
					roughness: 0.2,
					normalMap: ScormUtils.image( 'metal_pipe_normal.jpg', 10, 1, 0.5 ),
					sheenRoughness: 0.5,
					sheenColor: color,
					sheen: 0,
					emissive: color,
					emissiveIntensity: 0,
				} );
		
		// valve
		this.valve = group( );
		{
			var valveMaterial = new THREE.MeshStandardMaterial( {
							color: color,
							metalness: 0.6,
							roughness: 0.7,
						} );
						
			var rod = cylinder( [0,0,0], [2*Pipe.VALVE_WIDTH,Pipe.VALVE_LENGTH] );
				its.threejs.material = valveMaterial;
				
			var bar1 = cylinder( [0,Pipe.VALVE_LENGTH,-Pipe.VALVE_RADIUS], [Pipe.VALVE_WIDTH,2*Pipe.VALVE_RADIUS] );
				its.spinV = 90;
				its.threejs.material = valveMaterial;
				
			var bar2 = cylinder( [-Pipe.VALVE_RADIUS,Pipe.VALVE_LENGTH,0], [Pipe.VALVE_WIDTH,2*Pipe.VALVE_RADIUS] );
				its.spinH = 90;
				its.spinV = 90;
				its.threejs.material = valveMaterial;
			
			var ring = tube( [0,Pipe.VALVE_LENGTH,0], u=>[Pipe.VALVE_RADIUS*Math.sin(2*Math.PI*u),0,Pipe.VALVE_RADIUS*Math.cos(2*Math.PI*u)], Pipe.VALVE_WIDTH, [40,16] );
				its.threejs.material = valveMaterial;

			this.valve.add( rod, bar1, bar2, ring );
			this.valve.size = 1.5;
		}
		this.valve.center = [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH - 2*Pipe.RADIUS];
		
		this.add( floorConnector, wallConnector, this.pipe, pipeConnector, this.valve, wrapper/*, this.indicator*/ );
		
		this.addEventListener( 'pointerdown', this.onPointerDown );
	} // Pipe.constructor
	
	
	
	get aperture()
	{
		return this._aperture;
	}
	
	set aperture( aperture )
	{
		this._aperture = aperture;
		this.valve.y = Tank.BASE_HEIGHT/2 + aperture*Pipe.VALVE_LENGTH/2;
		this.valve.spinH = Pipe.OPEN_ANGLE*aperture;
		this.pipe.threejs.material.sheen = aperture;
		this.pipe.threejs.material.emissiveIntensity = 0.3*aperture;
	}
	
	
	onPointerDown( event )
	{
		// if a game is not started, then start a game
		if( !playground.gameStarted )
		{
			playground.newGame();
			return;
		}
		
		
		playground.bubblesSound.stop();
		playground.bubblesSound.play();
		
		this.valveTween.stop();
		
		var speed = Pipe.OPEN_SPEED*(1-this.aperture);

		this.valveTween = new TWEEN.Tween( this )
			.to( {aperture:1}, speed )
			.easing( TWEEN.Easing.Linear.None )
			.start( );
	}
	

	deactivate( )
	{
		this.valveTween.stop();
		
		var speed = Pipe.OPEN_SPEED*this.aperture;
		
		this.valveTween = new TWEEN.Tween( this )
			.to( {aperture:0}, speed )
			.easing( TWEEN.Easing.Linear.None )
			.start( );
	}
	

} // class Pipe

