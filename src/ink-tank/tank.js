//
//	class Tank( )
//

	

class Tank extends Group
{
	static WIDTH = 9;
	static DEPTH = 4.1;
	static VERTICAL_OFFSET = -2;

	static BASE_HEIGHT = 2;
	static FRAME_WIDTH = 0.25;
	
	static WATER_HEIGHT = 4;
	
	static GLASS_HEIGHT = 4.1;
	static GLASS_WIDTH = 0.1;
	
	static FLOOR_SIZE = 18;
	
	static PLATE_SIZE = 4;
	static PLATE_HEIGHT = 0.6;
	
	constructor( )
	{
		super( suica );
		
		// additional light
		var light = new THREE.PointLight( 'white', 0.3 );
			light.position.set( 0, 10, 0 );
		this.suica.scene.add( light );
		
		this.water = new Water( suica );
		
		this.constructFloor( );
		this.constructBase( );
		this.constructFrames( );
		this.constructGlass( );
		this.constructPipes( );
		
		this.addEventListener( 'pointerdown', this.onPointerDown );
		
		this.y = Tank.VERTICAL_OFFSET;
		
	} // Tank.constructor



	static metal( map, normalMap, aoMap=null, offset=0 )
	{
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0.4,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			polygonOffset: offset!=0,
			polygonOffsetFactor: offset,
			polygonOffsetUnits: offset,
		} );
		
		if( aoMap ) material.aoMap = aoMap;
		
		return material;
	}
	
	
	
	constructFloor( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', Tank.FLOOR_SIZE ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.FLOOR_SIZE ),
			aoMap = ScormUtils.image( 'floor_ao.jpg', 0.9, 0.9, 0.05, 0.05 );
		
		var floor = prism( 128, [0,-0.2,0], [Tank.FLOOR_SIZE,0.2] );
			floor.threejs.material = Tank.metal( map, normalMap, aoMap );
			floor.threejs.material.color = new THREE.Color( 'gray' );

		ScormUtils.addUV2( floor ); // because of AO

		var shadow = square( [0,-0.2,0], Tank.FLOOR_SIZE*1.1 );
			its.spinV = -90;
			its.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'black',
				alphaMap: ScormUtils.image( 'floor_shadow_alpha.jpg' ),
				transparent: true,
			});
			its.threejs.renderOrder = -10;
		
		this.add( floor, shadow );

	} // Tank.constructFloor	
		
		
		
	constructBase( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', 24, Tank.BASE_HEIGHT ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.WIDTH, Tank.BASE_HEIGHT ),
			aoMap = ScormUtils.image( 'wall_ao.jpg', 3, 1, 0.5, 0 );

		var base = cylinder( [0,0,0], [Tank.WIDTH+0.1, Tank.BASE_HEIGHT] );
			base.threejs.material = Tank.metal( map, normalMap, aoMap, 5 );
			ScormUtils.addUV2( base ); // because of AO

		map = ScormUtils.image( 'metal_plate.jpg', Tank.WIDTH ),
		normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.WIDTH );

		var baseTop = circle( [0,Tank.BASE_HEIGHT,0], Tank.WIDTH );
			baseTop.threejs.material = Tank.metal( map, normalMap, null, -2 );
			baseTop.spinV = -90;

		var baseWhite = circle( [0,Tank.BASE_HEIGHT+0.1,0], Tank.WIDTH-3*Tank.FRAME_WIDTH );
			baseWhite.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'white',
				polygonOffset: true,
				polygonOffsetFactor: -1,
				polygonOffsetUnits: -1,
			});		
			baseWhite.spinV = -90;
		
		this.add( base, baseTop, baseWhite );
	} // Tank.constructBase



	constructFrames( )
	{
		var map = ScormUtils.image( 'metal_frame.jpg', 1, Tank.DEPTH+Tank.BASE_HEIGHT ),
			normalMap = ScormUtils.image( 'metal_frame_normal.jpg', 1, Tank.DEPTH+Tank.BASE_HEIGHT );
		
		for( var i=0; i<3; i++ )
		{
			var angle = radians( 120*i+30 ),
				radius = Tank.WIDTH/2-Tank.FRAME_WIDTH/6;
			
			var bar = cube(
						[radius*Math.cos(angle), Tank.BASE_HEIGHT/2+Tank.DEPTH/2, radius*Math.sin(angle)],
						[Tank.FRAME_WIDTH, Tank.DEPTH+Tank.BASE_HEIGHT, Tank.FRAME_WIDTH]
					);
			bar.spinH = -120*i-30;
			bar.threejs.material = Tank.metal( map, normalMap, null );
			bar.threejs.material.color = new THREE.Color( 1.2, 1.2, 1.2 );
			bar.threejs.material.roughness = 1;
			bar.threejs.material.metalness = 0;
			this.add( bar );
		}
		
	} // Tank.constructFrames



	constructGlass( )
	{
		var map = ScormUtils.image( 'glass.jpg', 3, 1, 1/2, 0 ),
			alphaMap = ScormUtils.image( 'glass_alpha.jpg', 3, 1, 1/2, 0 );

		var glass = cylinder(
						[0, Tank.BASE_HEIGHT+Tank.GLASS_HEIGHT/2, 0],
						[Tank.WIDTH, Tank.GLASS_HEIGHT],
					);
			glass.threejs.geometry = new THREE.CylinderGeometry(1/2,1/2,1,100,1,true);
			glass.threejs.material = new THREE.MeshBasicMaterial({
				map: map,
				alphaMap: alphaMap,
				side: THREE.DoubleSide,
				transparent: true,
				})
			glass.threejs.renderOrder = -1;
			
		var glass2 = cylinder(
						[0, Tank.BASE_HEIGHT+Tank.GLASS_HEIGHT/2, 0],
						[Tank.WIDTH-0.2, Tank.GLASS_HEIGHT],
					);
			glass2.threejs.geometry = new THREE.CylinderGeometry(1/2,1/2,1,100,1,true);
			glass2.threejs.material = new THREE.MeshBasicMaterial({
				map: map,
				alphaMap: alphaMap,
				side: THREE.BackSide,
				transparent: true,
				})
			glass2.threejs.renderOrder = -21;

		this.add( glass, glass2 );

	} // Tank.constructGlass



	constructPipes( )
	{
		this.cyanPipe = new Pipe( 'cyan' );
		this.cyanPipe.spinH = 0;
			
		this.magentaPipe = new Pipe( 'magenta' );
		this.magentaPipe.spinH = 120;
			
		this.yellowPipe = new Pipe( 'yellow' );
		this.yellowPipe.spinH = 240;		
	} // Tank.constructPipes



	onPointerDown( )
	{
		if( !playground.gameStarted )
			playground.newGame();
	} // Tank.onClick
	
	
} // class Tank
