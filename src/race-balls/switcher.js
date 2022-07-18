//
//	class Switcher( )
//

	
class Switcher extends Group
{
	static SIZE = 10;
	
	constructor( )
	{
		super( suica );
	
		var ball = sphere( [0,0,0], Switcher.SIZE+0.1 );
		ball.threejs.material = new THREE.MeshPhysicalMaterial( {
						color: 0x202020,
						metalness: 0.5,
						roughness: 0.3,
						clearcoat: 1,
						clearcoatRoughness: 0.5,
						//sheen: 1,
						//sheenColor: 'pink',
						//sheenRoughness: 0.5,
						map: ScormUtils.image( 'marble.jpg', 1, 1 ),
						//transmission: 0.2,
						//thickness: 10,
						//ior: 1.5,
					} );
		//this.reshape( ball );
					
		this.add( ball );

		this.addEventListener( 'click', this.onClick );
		
	} // Switcher.constructor
	

	reshape( object )
	{
		var pos = object.threejs.geometry.getAttribute( 'position' );
			
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i )/2,
				z = pos.getZ( i );
				
			// flatten the bottom
			if( y<0 )
			{
				y = y/2;
			}
			pos.setXYZ( i, x, y, z );
		}
	} // Switcher.reshapeTrack



	// handles clicks on a track
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( playground.lastEventIsMove ) return;
			
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
			if( playground.canEndGame( ) )
				playground.endGame( );
		}
		else
			playground.newGame( );
	} // Plate.onClick
		
} // class Track

