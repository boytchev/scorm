//
//	class Planet
	


class Planet extends Group
{
	//	PLT	SIZ			SCA		GRID_SCALE	SP_SHP_SCALE
	//	3	10/3=3.33	4		8/3=2.67	3/3=1.00
	//	5	14/5=2.80	4		8/5=1.60	3/5=0.60
	//	7	18/7=2.57	4		8/7=1.14	3/7=0.43
	//	9	22/9=2.44	4		8/9=0.89	3/9=0.33
	
	static PLATES = 5; // must be odd
	static SIZE = 2+4/Planet.PLATES;
	static SCALE = 4;
	static GRID_SCALE = 2*Planet.SCALE/Planet.PLATES;
	static SPACESHIP_SCALE = 3/8 * Planet.GRID_SCALE;
	static PLATFRORM_SCALE = 9/16 * Planet.GRID_SCALE;
		
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
			
		this.addEventListener( 'click', this.onClick );
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
