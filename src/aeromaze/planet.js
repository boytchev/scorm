//
//	class Planet
	


class Planet extends Group
{
	static PLATES = 3; // must be odd
	static SIZE = 2+4/Planet.PLATES;
	static SCALE = 4;
	static GRID_SCALE = 2*Planet.SCALE/Planet.PLATES;
		
	constructor( )
	{
		super( suica );

		this.constructPlanet( );
		
	} // Planet.constructor



	// construct the planet as 6 square plates, connested in a 3D body
	constructPlanet( )
	{
		// material
		var map = ScormUtils.image( 'metal_plate.jpg', Planet.PLATES/2, Planet.PLATES/2, 1/2, 1/2 ),
			//normalMap = ScormUtils.image( 'metal_plate_normal.jpg' ),
			alphaMap = ScormUtils.image( 'metal_plate_alpha.jpg', Planet.PLATES/2, Planet.PLATES/2, 1/2, 1/2 );
		var materialBack = new THREE.MeshStandardMaterial( {
			color: 'lightgray',//'white',
			metalness: 0,
			roughness: 1,//0.42,
			map: map,
//			normalMap: normalMap,
//			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			side: THREE.BackSide,
		} );	
		var materialFront = new THREE.MeshPhysicalMaterial( {
			color: 'white',
			metalness: 0,
			roughness: 0,
//			map: map,
			alphaMap: alphaMap,
			side: THREE.FrontSide,
			transparent: true,
			opacity: 0.5,
			depthWrite: false,
		} );	
		
		// geometry
		const S = Planet.SIZE/2;
		var vertices = [
			[ S, -1, -1], /* X+ */
			[ S, -1,  1], 
			[ S,  1,  1], 
			[ S,  1, -1], 
			
			[-S, -1, -1], /* X- */
			[-S, -1,  1], 
			[-S,  1,  1], 
			[-S,  1, -1], 

			[-1,  S, -1], /* Y+ */
			[-1,  S,  1], 
			[ 1,  S,  1], 
			[ 1,  S, -1], 

			[-1, -S, -1], /* Y- */
			[-1, -S,  1], 
			[ 1, -S,  1], 
			[ 1, -S, -1], 

			[-1, -1,  S], /* Z+ */
			[-1,  1,  S], 
			[ 1,  1,  S], 
			[ 1, -1,  S], 

			[-1, -1, -S], /* Z- */
			[-1,  1, -S], 
			[ 1,  1, -S], 
			[ 1, -1, -S], 
		]

		this.add( convex( vertices, Planet.SCALE ) );
			its.threejs.material = materialBack;
			its.threejs.receiveShadow = true;

		this.add( convex( vertices, Planet.SCALE ) );
			its.threejs.material = materialFront;
			its.threejs.receiveShadow = true;
	}


	
	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
			playground.newGame( 0 );
	} // Planet.onClick
	
		
} // class Planet
