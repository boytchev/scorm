//
//	class Pipe( )
//

	
class Pipe extends Group
{
	
	static VALVE_LENGTH = 0.8;	// дължина на спирателния кран
	static VALVE_RADIUS = 0.8;	// радиус на врътката на крана
	static VALVE_WIDTH = 0.1;	// дебелина на врътката на крана

	static RADIUS = 0.5;	
	static LENGTH = 4;		// дължина на хоризонталната част на тръба
	static EXTRUDE = 0.15;	// издаденост на пръстените на тръба

	constructor( color )
	{
		super( suica );

		this._aperture = 0;
		
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
		var pipe = tube(
			[0,0,0],
			spline([ [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2-1], // wall
			  [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH - Tank.BASE_HEIGHT/2],
			  [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH],
			  [0,0,Tank.WIDTH/2 + Pipe.LENGTH], // floor
			  ],false,false),
			 Pipe.RADIUS, [50,20], 1
		);
		pipe.threejs.material = new THREE.MeshPhysicalMaterial( {
					color: new THREE.Color(1.2,1.2,1.2),
					metalness: 0.6,
					roughness: 0.4,
					normalMap: ScormUtils.image( 'metal_pipe_normal.jpg', 10, 1, 0.5 ),
				} );

		// valve
		this.valve = group( );
		{
			var valveMaterial = new THREE.MeshStandardMaterial( {
							color: color,
							metalness: 1,
							roughness: 0.5,
							normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 2, 1 ),
							normalScale: new THREE.Vector2( 1, 1 ),
							emissive: color,
							emissiveIntensity: 0.3,
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
			
			var ring = tube( [0,Pipe.VALVE_LENGTH,0], u=>[Pipe.VALVE_RADIUS*Math.sin(2*Math.PI*u),0,Pipe.VALVE_RADIUS*Math.cos(2*Math.PI*u)], Pipe.VALVE_WIDTH, [20,8] );
				its.threejs.material = valveMaterial;

			this.valve.add( rod, bar1, bar2, ring );
		}
		this.valve.center = [0,Tank.BASE_HEIGHT/2,Tank.WIDTH/2 + Pipe.LENGTH - 2*Pipe.RADIUS];
		
		this.add( floorConnector, wallConnector, pipe, pipeConnector, this.valve );
		
	} // Pipe.constructor
	
	
	
	get aperture()
	{
		return this._aperture;
	}
	
	set aperture( aperture )
	{
		this._aperture = aperture;
		this.valve.y = Tank.BASE_HEIGHT/2 + aperture*Pipe.VALVE_LENGTH/2;
		this.valve.spinH = 720*aperture;
	}
	
	
} // class Pipe

