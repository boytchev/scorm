//
//	class Tank( )
//

	

class Tank extends Group
{
	static WIDTH = 8;
	static DEPTH = 5;

	static BASE_HEIGHT = 2;
	static FRAME_WIDTH = 0.25;
	
	static FLOOR_SIZE = 18;
	
	constructor( )
	{
		super( suica );
		
		// additional light
		var light = new THREE.PointLight( 'white', 0.2 );
			light.position.set( 0, 10, 0 );
		this.suica.scene.add( light );
		
		this.constructFloor( );
		this.constructBase( );

	} // Tank.constructor



	constructFloor( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', Tank.FLOOR_SIZE ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Tank.FLOOR_SIZE ),
			aoMap = ScormUtils.image( 'floor_ao.jpg' );
		
		var floor = polygon( 100, [0,0,0], Tank.FLOOR_SIZE );
			floor.threejs.material = new THREE.MeshStandardMaterial( {
				color: 'lightgray',
				metalness: 0.5,
				roughness: 0.32,
				map: map,
				normalMap: normalMap,
				normalScale: new THREE.Vector2( 0.2, 0.2 ),
				aoMap: aoMap,
			});
			floor.spinV = -90;

		ScormUtils.addUV2( floor ); // because of AO

		this.add( floor );

	} // Tank.constructFloor	
		
		
		
	constructBase( )
	{
		var map = image( 'images/metal_plate.jpg' );
			map.repeat.set( Tank.WIDTH, Tank.BASE_HEIGHT );
		
		var normalMap = image( 'images/metal_plate_normal.jpg' );
			normalMap.repeat.set( Tank.WIDTH, Tank.BASE_HEIGHT );

		var aoMap = image( 'images/wall_ao.jpg' );

		var base = cube( [0,Tank.BASE_HEIGHT/2,0], [Tank.WIDTH, Tank.BASE_HEIGHT, Tank.WIDTH] );
			base.threejs.material = new THREE.MeshStandardMaterial( {
				color: 'lightgray',
				metalness: 0.5,
				roughness: 0.32,
				map: map,
				normalMap: normalMap,
				normalScale: new THREE.Vector2( 0.2, 0.2 ),
				aoMap: aoMap,
			});		
		ScormUtils.addUV2( base ); // because of AO

		var map = image( 'images/metal_plate.jpg' );
			map.repeat.set( Tank.WIDTH, Tank.WIDTH );
		
		var normalMap = image( 'images/metal_plate_normal.jpg' );
			normalMap.repeat.set( Tank.WIDTH, Tank.WIDTH );

		var baseTop = square( [0,Tank.BASE_HEIGHT,0], Tank.WIDTH );
			baseTop.threejs.material = new THREE.MeshStandardMaterial( {
				color: 'lightgray',
				metalness: 0.5,
				roughness: 0.32,
				map: map,
				normalMap: normalMap,
				normalScale: new THREE.Vector2( 0.2, 0.2 ),
				polygonOffset: true,
				polygonOffsetFactor: -1,
				polygonOffsetUnits: -1,
			});		
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


} // class Tank
