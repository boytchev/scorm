//
//	class Pin( )
//

	
class Pin extends Group
{
	static LENGTH = 10;
	static HEAD_SIZE = 1;
	static WIDTH = 0.1;
	static TIP_WIDTH = 0.05;
	
	constructor( )
	{
		super( suica );

		this.constructPin( );
		this.spinV = 90;
		
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onPointerEnter );
		this.addEventListener( 'pointerleave', this.onPointerLeave );

		this.visible = false;
		
	} // Ring.constructor



	// handles clicks on the ring
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
			
		// if game is not started, click on the ring will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Ring.onClick
	
	
	
	// handles activating the ring
	onPointerEnter( event )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
			
		this.size = [2,2,2];
		
		event.target.style.cursor = 'move';
	} // Ring.onPointerEnter
	
	
	// handles deactivating the ring
	onPointerLeave( event )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
			
		this.size = [1,1,1];

		event.target.style.cursor = 'default';
	} // Ring.onPointerEnter
	
	
	
	// construct the ring
	constructPin( )
	{
		var material = new THREE.MeshPhongMaterial( {
				color: 'dimgray',
				shininess: 150
		});
		
		var body = tube( [0,0,0], spline([
							[0,-Pin.LENGTH,0,Pin.WIDTH],
							[0,0,0,Pin.TIP_WIDTH],
							[0,Pin.LENGTH,0,Pin.WIDTH]]),
						1, [2,8] );
			its.threejs.material = material;
					
		var head1 = sphere( [0,Pin.LENGTH,0], Pin.HEAD_SIZE, 'crimson' );
		var head2 = sphere( [0,-Pin.LENGTH,0], Pin.HEAD_SIZE, 'crimson' );
		
		this.add( body, head1, head2 );
	} // Pin.constructPin



	randomize( )
	{
		var u = random( 0.25, 0.75 ),
			v = random( 0.25, 0.75 );

		this.center = playground.membrane.surface.curve( u, v );
		this.visible = true;
		
		
		var p = new THREE.Vector3( ...this.center ),
			pu = new THREE.Vector3( ...playground.membrane.surface.curve( u+0.001, v ) ) . sub( p ),
			pv = new THREE.Vector3( ...playground.membrane.surface.curve( u, v+0.001 ) ) . sub( p );
			
		var n = new THREE.Vector3() . crossVectors( pu, pv ) . setLength( Pin.LENGTH/2 );
		
		line( this.center, [this.center[0]+n.x,this.center[1]+n.y,this.center[2]+n.z], 'crimson' );
		
	} // Pin.randomize
} // class Pin

