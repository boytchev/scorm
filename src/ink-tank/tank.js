//
//	class Tank( )
//

	

class Tank extends Group
{
	static WIDTH = 8;
	static DEPTH = 5;

	static BASE_HEIGHT = 2;
	static FRAME_WIDTH = 0.25;
	
	static WATER_HEIGHT = 4;
	
	static GLASS_HEIGHT = 4.5;
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
		
		this.constructFloor( );
		this.constructBase( );
		this.constructFrames( );
		this.constructGlass( );
		
		this.water = new Water( suica );

	} // Tank.constructor



	static metal( map, normalMap, aoMap=null, offset=0 )
	{
		var material = new THREE.MeshStandardMaterial( {
			color: 'lightgray',
			metalness: 0.3,
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

		ScormUtils.addUV2( floor ); // because of AO

		this.add( floor );

	} // Tank.constructFloor	
		
		
		
	constructBase( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', Tank.WIDTH, Tank.BASE_HEIGHT ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.WIDTH, Tank.BASE_HEIGHT ),
			aoMap = ScormUtils.image( 'wall_ao.jpg' );

		var base = cube( [0,Tank.BASE_HEIGHT/2,0], [Tank.WIDTH, Tank.BASE_HEIGHT, Tank.WIDTH] );
			base.threejs.material = Tank.metal( map, normalMap, aoMap );
			ScormUtils.addUV2( base ); // because of AO

		var map = ScormUtils.image( 'metal_plate.jpg', Tank.WIDTH ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.WIDTH );

		var baseTop = square( [0,Tank.BASE_HEIGHT,0], Tank.WIDTH );
			baseTop.threejs.material = Tank.metal( map, normalMap, null, -1 );
			baseTop.spinV = -90;

		var baseWhite = square( [0,Tank.BASE_HEIGHT,0], Tank.WIDTH-3*Tank.FRAME_WIDTH );
			baseWhite.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'white',
				polygonOffset: true,
				polygonOffsetFactor: -2,
				polygonOffsetUnits: -2,
			});		
			baseWhite.spinV = -90;
		
		this.add( base, baseTop, baseWhite );
	} // Tank.constructBase



	constructFrames( )
	{
		var map = ScormUtils.image( 'metal_frame.jpg', 1, Tank.DEPTH+Tank.BASE_HEIGHT ),
			normalMap = ScormUtils.image( 'metal_frame_normal.jpg', 1, Tank.DEPTH+Tank.BASE_HEIGHT );
		
		for( var i=0; i<4; i++ )
		{
			var angle = radians( 90*i + 45 ),
				radius = Math.sqrt(2) * (Tank.WIDTH/2-Tank.FRAME_WIDTH/3);
			
			var bar = cube(
						[radius*Math.cos(angle), Tank.BASE_HEIGHT/2+Tank.DEPTH/2, radius*Math.sin(angle)],
						[Tank.FRAME_WIDTH, Tank.DEPTH+Tank.BASE_HEIGHT, Tank.FRAME_WIDTH]
					);
			bar.threejs.material = Tank.metal( map, normalMap, null );
			bar.threejs.material.color = new THREE.Color( 1.2, 1.2, 1.2 );
			bar.threejs.material.roughness = 1;
			bar.threejs.material.metalness = 0;
			this.add( bar );
		}
	} // Tank.constructFrames



	constructGlass( )
	{
		var map = ScormUtils.image( 'glass.jpg' ),
			alphaMap = ScormUtils.image( 'glass_alpha.jpg' );
		
		for( var i=0; i<4; i++ )
		{
			var angle = radians( 90*i ),
				radius = Tank.WIDTH/2 - Tank.GLASS_WIDTH/2;
				
			var glass = cube(
						[radius*Math.cos(angle), Tank.BASE_HEIGHT+Tank.GLASS_HEIGHT/2, radius*Math.sin(angle)],
						[Tank.WIDTH, Tank.GLASS_HEIGHT, Tank.GLASS_WIDTH]
					);
				glass.threejs.material = new THREE.MeshBasicMaterial({
					map: map,
					alphaMap: alphaMap,
					transparent: true,
				})
				glass.spinH = 90*i-90;
					
			this.add( glass );
		}
	} // Tank.constructGlass




} // class Tank
