//
//	class Pin( )
//

	
class Pin extends Group
{
	static LENGTH = 10;
	static HEAD_SIZE = 1;
	static WIDTH = 0.15;
	static TIP_WIDTH = 0.02;
	
	constructor( )
	{
		super( suica );

		this.pinHeads = [];
		this.dragPinHead = null;

		// pin coordinates over surface (u,v in [0,1])
		this.u = 0;
		this.v = 0;
		
		this.constructPin( );
		this.spinV = 90;
		
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onPointerEnter );
		this.addEventListener( 'pointerleave', this.onPointerLeave );
		this.addEventListener( 'pointerdown', this.onPointerDown );

		this.visible = false;
		
	} // Ring.constructor



	// handles clicks on the pin
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
			
		// if game is not started, click on the pin will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Pin.onClick
	
	
	
	// handles clicks on the pin
	onPointerDown( event )
	{
		if( playground.gameStarted )
		{
			this.dragPinHead = findObject( event, this.pinHeads );
			if( !this.dragPinHead ) console.error( 'empty head' );

			for( var head of this.pinHeads )
				head.size = [2,2,2];

			playground.dragPin = this;
			playground.toucher.center = this.dragPinHead.objectPosition();
			playground.toucher.spinH = degrees( orb.getAzimuthalAngle() );
			playground.toucher.spinV = degrees( orb.getPolarAngle() )+90;

			orb.enableRotate = false;
			orb.enablePan = false;
			
			event.target.style.cursor = 'move';
		}
	} // Pin.onPointerDown
	
	
	
	// mark a pin
	onPointerEnter( event )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
		
		for( var head of this.pinHeads )
			head.size = [2,2,2];
		
		event.target.style.cursor = 'move';
	} // Ring.onPointerEnter
	
	
	// unmark a pin
	onPointerLeave( event )
	{
		if( playground.dragPin ) return;
		
		for( var head of this.pinHeads )
			head.size = [1,1,1];
		
		event.target.style.cursor = 'default';
	} // Ring.onPointerLeave
	
	
	// deactivate a pin (called from top level html)
	onPointerUp( )
	{
		for( var head of this.pinHeads )
			head.size = [1,1,1];

		playground.dragPin = null;
		
		orb.enableRotate = true;
		orb.enablePan = true;
		
		event.target.style.cursor = 'default';
	} // Pin.onPointerUp
	
	
	
	// drag a pin (called from top level html)
	onPointerMove( event )
	{
		var obj = findObject( event, [playground.toucher] );
		if( obj )
		{
			var pos = obj.intersectData.point;
			var target = [pos.x, pos.y, pos.z];
			var center = this.center;
			var vec = [target[0]-center[0], target[1]-center[1], target[2]-center[2]];
			
			// calculate spinV and spinH
			var spinH = degrees( Math.atan2(vec[2],vec[0]) );
			var spinV = degrees( Math.atan2((vec[0]**2+vec[2]**2)**0.5,vec[1]) );

			this.spinH = 90-spinH;
			this.spinV = spinV;
			return;
		}

	} // Ring.onPointerMove
	
	
	
	
	
	// construct the ring
	constructPin( )
	{
		var material = new THREE.MeshPhongMaterial( {
				color: 'crimson',
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
		this.pinHeads.push( head1, head2 );
		
	} // Pin.constructPin



	hide( )
	{
		this.visible = false;
	} // Pin.hide
	
	
	
	show( u, v )
	{
		this.u = u;
		this.v = v;
		this.spin = [0,90,0];
		this.center = playground.membrane.surface.curve( u, v );
		this.visible = true;
	} // Pin.show
	
} // class Pin

