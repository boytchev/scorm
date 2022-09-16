//
//	class Planet
	


class Planet extends Group
{
	static SIZE = 3;
	static SCALE = 4;
	
	
	constructor( )
	{
		super( suica );

		this.planet = this.constructPlanet( );
	} // Planet.constructor



	// construct the planet as 6 square plates, connested in a 3D body
	constructPlanet( )
	{
		// material
		var map = ScormUtils.image( 'metal_plate.jpg', 3/2, 3/2, 1/2, 1/2 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg' );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
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

		var planet = convex( vertices, Planet.SCALE );
			its.threejs.material = material;

		var nor = planet.threejs.geometry.getAttribute( 'normal' ),
			uv  = planet.threejs.geometry.getAttribute( 'uv' );
			
		for( var i=0; i<nor.count; i++ )
		{
			var dir = nor.getX(i)**2 + nor.getY(i)**2 + nor.getZ(i)**2;
			if( dir == 1 ) continue;
			
			var u = uv.getX( i ),
				v = uv.getY( i );
				
//			uv.setXY( i, 2*2/3*u, 2*2/3*v );
		}
		
		return planet;
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
