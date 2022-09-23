//
//	class Planet
	


class Planet extends Group
{
	//	PLT	SIZ			SCA		GRID_SCALE	SP_SHP_SCALE
	//	3	10/3=3.33	4		8/3=2.67	3/3=1.00
	//	5	14/5=2.80	4		8/5=1.60	3/5=0.60
	//	7	18/7=2.57	4		8/7=1.14	3/7=0.43
	//	9	22/9=2.44	4		8/9=0.89	3/9=0.33
	
	constructor( plates )
	{
		super( suica );

		this.PLATES = plates; // must be odd
		this.SIZE = 2+4/this.PLATES;
		this.SCALE = 20/3 * this.PLATES / (this.PLATES+2);
		this.GRID_SCALE = 2*this.SCALE/this.PLATES;
		//this.SPACESHIP_SCALE = 1/2;
		//this.PLATFRORM_SCALE = 1/2;
			
		this.planetBack = null;
		this.planetFront = null;
		
		this.constructPlanet( );
		
		this.threejs.castShadow = true;
		
		this.visible = false;
	} // Planet.constructor



	// construct the planet as 6 square plates, connested in a 3D body
	constructPlanet( )
	{
		// material
		var map = ScormUtils.image( 'metal_plate.jpg', this.PLATES/2, this.PLATES/2, 1/2, 1/2 ),
			alphaMap = ScormUtils.image( 'metal_plate_alpha.jpg', this.PLATES/2, this.PLATES/2, 1/2, 1/2 );
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
		const S = this.SIZE/2;
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

		this.planetBack = convex( vertices, this.SCALE );
		this.add( this.planetBack );
			its.threejs.material = materialBack;
			its.threejs.receiveShadow = true;

		this.planetFront = convex( vertices, this.SCALE );
		this.add( this.planetFront );
			its.threejs.material = materialFront;
			its.threejs.receiveShadow = true;
			
		this.addEventListener( 'click', this.onClick );
	}
	
	
	
	
	// handles clicks on a plate
	onClick( )
	{
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT )
			return;
		
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
		{
			playground.newGame( );
		}
	} // Planet.onClick
	
		
} // class Planet
