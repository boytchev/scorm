//
//	class Ring( )
//

	
class Ring extends Group
{
	static SIZE = 20;
	static CLAMP_SIZE = 19.7;
	static WIDTH = 1.5;
	
	constructor( )
	{
		super( suica );

		this.constructRing( );
		
		this.addEventListener( 'click', this.onClick );

	} // Ring.constructor



	// handles clicks on the ring
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the ring will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Ring.onClick
	
	
	
	// construct the ring
	constructRing( )
	{
		function ringCurve(u)
		{
			u = 2*Math.PI*u;
			return [
				Ring.SIZE*Math.sin(u), Ring.SIZE*Math.cos(u), 0, // x,y,z
				Ring.WIDTH*(0.3+0.7*(Math.round(120*u)%2)) // r
			];
		}
		
		// main body of the base
		var map = ScormUtils.image( 'metal_plate.jpg', 56, 4 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 56, 4 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0.1,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
		} );	

		var ring = tube( [0,0,0], ringCurve, Ring.WIDTH, [121,20] );
			its.threejs.material = material;
		
		// flatten the inner side
		var pos = its.threejs.geometry.getAttribute( 'position' ),
			v = new THREE.Vector3;
		for( var i=0; i<pos.count; i++ )
		{
			v.set( pos.getX(i), pos.getY(i), pos.getZ(i) );
			if( v.length() < Ring.CLAMP_SIZE )
			{
				v.setLength( Ring.CLAMP_SIZE );
				pos.setXYZ( i, v.x, v.y, v.z );
			}
		}
		
		its.threejs.geometry.computeVertexNormals( );
		
		
		this.add( ring );
	} // Ring.constructBase

} // class Ring

