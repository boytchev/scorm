//
//	class Planet
	


class Planet extends Group
{
	
	constructor( plates )
	{
		super( suica );

		this.PLATES = plates; // must be odd because of coordinates and textures
		this.SIZE = 2+4/this.PLATES;
		this.SCALE = 20/3 * this.PLATES / (this.PLATES+2);
		this.GRID_SCALE = 2*this.SCALE/this.PLATES;
			
		this.planetBack = null;
		this.planetFront = null;
		
		this.constructPlanet( );
		
		this.visible = false;
	} // Planet.constructor



	// construct the planet as 6 square plates, connested in a 3D body
	constructPlanet( )
	{
		// material
		var map = ScormUtils.image( 'metal_plate.jpg', this.PLATES/2, this.PLATES/2, 1/2, 1/2 ),
			alphaMap = ScormUtils.image( 'metal_plate_alpha.jpg', this.PLATES/2, this.PLATES/2, 1/2, 1/2 );
		var materialBack = new THREE.MeshStandardMaterial( {
			color: 'gray',
			metalness: 0,
			roughness: 1,
			map: map,
			side: THREE.BackSide,
		} );	
		var materialFront = new THREE.MeshPhysicalMaterial( {
			color: 'white',
			metalness: 0,
			roughness: 0,
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
	} // Planet.constructPlanet
	
	
	// handles clicks on a plate
	onClick( )
	{
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT )
			return;
		
		if( !playground.gameStarted )
			playground.newGame( );
	} // Planet.onClick
	
		
} // class Planet
