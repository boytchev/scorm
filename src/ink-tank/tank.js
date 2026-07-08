//
//	class Tank( )
//

	
var SC = 5;

class Tank extends Suica.Group
{
	static WIDTH = 9/SC;
	static DEPTH = 4.1/SC;
	static VERTICAL_OFFSET = -2/SC;

	static BASE_HEIGHT = 2/SC;
	static FRAME_WIDTH = 0.25/SC;
	
	static WATER_HEIGHT = 3.9/SC;
	
	static GLASS_HEIGHT = 4.1/SC;
	static GLASS_WIDTH = 0.1/SC;
	
	static FLOOR_SIZE = 18/SC;
	
	static PLATE_SIZE = 4/SC;
	static PLATE_HEIGHT = 0.6/SC;
	
	constructor( )
	{
		super( suica );
		
		this.water = new Water( suica );
		
		this.constructFloor( );
		this.constructBase( );
		this.constructFrames( );
		this.constructGlass( );
		this.constructPipes( );
		
		this.addEventListener( 'pointerdown', this.onPointerDown );
		
		this.y = Tank.VERTICAL_OFFSET;
		
	} // Tank.constructor



	static metal( map, normalMap, aoMap=null, offset=0, aoMapIntensity=5 )
	{
		var material = new THREE.MeshStandardMaterial( {
			color: 'lightgray',
			metalness: 0.6,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			polygonOffset: offset!=0,
			polygonOffsetFactor: offset,
			polygonOffsetUnits: offset,
		} );
		
		if( aoMap ) {
			
			material.aoMap = aoMap;
			material.aoMapIntensity = aoMapIntensity;
			
		}
		
		return material;
	}
	
	
	
	constructFloor( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', 8 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 8 ),
			aoMap = ScormUtils.image( 'floor_ao.jpg', 0.89 );

		aoMap.center.set( 0.5, 0.5 );

		var floor = prism( 128, [0,-0.2/SC,0], [Tank.FLOOR_SIZE,0.2/SC] );
			floor.threejs.material = Tank.metal( map, normalMap, aoMap );
			floor.threejs.material.color = new THREE.Color( 'lightgray' );

		var shadow = square( [0,-0.2/SC,0], Tank.FLOOR_SIZE*1.1 );
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
		var map = ScormUtils.image( 'metal_plate.jpg', 12, 1 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 12, 1 ),
			aoMap = ScormUtils.image( 'wall_ao.jpg', 3, 1, 0.5, 0 );

		var base = cylinder( [0,0,0], [Tank.WIDTH+0.1/SC, Tank.BASE_HEIGHT] );
			base.threejs.material = Tank.metal( map, normalMap, aoMap, 5, 10 );

		map = ScormUtils.image( 'metal_plate.jpg', 12, 1.5 ),
		normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 12, 1.5 );

		var baseTop = cone( [0,Tank.BASE_HEIGHT,0], [Tank.WIDTH+0.1/SC,0.01] );
			baseTop.threejs.material = Tank.metal( map, normalMap, null, -2/SC );

		var baseWhite = circle( [0,Tank.BASE_HEIGHT+0.1/SC,0], Tank.WIDTH-3*Tank.FRAME_WIDTH );
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
		var map = ScormUtils.image( 'metal_frame.jpg', 1, 3 ),
			normalMap = ScormUtils.image( 'metal_frame_normal.jpg', 1, 3 );
		
		for( var i=0; i<3; i++ )
		{
			var angle = radians( 120*i+60 ),
				radius = Tank.WIDTH/2-Tank.FRAME_WIDTH/6;
			
			var bar = cube(
						[radius*Math.cos(angle), Tank.BASE_HEIGHT/2+Tank.DEPTH/2, radius*Math.sin(angle)],
						[Tank.FRAME_WIDTH, Tank.DEPTH+Tank.BASE_HEIGHT, Tank.FRAME_WIDTH]
					);
			bar.spinH = -120*i-60;
			bar.threejs.material = Tank.metal( map, normalMap, null );
			bar.threejs.material.color = new THREE.Color( 2, 2, 2 );
			// bar.threejs.material.roughness = 1;
			//bar.threejs.material.metalness = 1/2;
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
			glass.spinH = -30;
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
						[Tank.WIDTH-0.1/SC, Tank.GLASS_HEIGHT],
					);
			glass2.spinH = -30;
			glass2.threejs.geometry = new THREE.CylinderGeometry(1/2,1/2,1,100,1,true);
			glass2.threejs.material = new THREE.MeshBasicMaterial({
				map: map,
				alphaMap: alphaMap,
				side: THREE.BackSide,
				transparent: true,
			})
			glass2.threejs.renderOrder = -2;

		this.add( glass, glass2);
		
	} // Tank.constructGlass



	constructPipes( )
	{
		this.cyanPipe = new Pipe( 'cyan' );
		this.cyanPipe.spinH = 0-30;
			
		this.magentaPipe = new Pipe( 'magenta' );
		this.magentaPipe.spinH = 120-30;
			
		this.yellowPipe = new Pipe( 'yellow' );
		this.yellowPipe.spinH = 240-30;		
	} // Tank.constructPipes



	onPointerDown( )
	{
		if( !playground.gameStarted )
			playground.newGame();
	} // Tank.onClick

} // class Tank
