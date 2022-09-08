//
//	class Pin( )
//

	
class Pin extends Group
{
	static LENGTH = 10;
	static SMALL_HEAD_SIZE = 2;
	static BIG_HEAD_SIZE = 3;
	static WIDTH = 0.2;
	static TIP_WIDTH = 0.03;
	
	
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
		this.threejs.castShadow = true;
		
	} // Pin.constructor



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
	
	
	
	// set pin head size
	setPinHeadSize( size )
	{
		for( var head of this.pinHeads )
			head.size = [size, size, size];
	}
	
	
	
	// handles clicks on the pin
	onPointerDown( event )
	{
		if( playground.gameStarted )
		{
			this.dragPinHead = findObject( event, this.pinHeads );
			if( !this.dragPinHead ) return;

			this.setPinHeadSize( Pin.BIG_HEAD_SIZE );

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
		if( Ring.POINTER_USED ) return;
		
		this.setPinHeadSize( Pin.BIG_HEAD_SIZE );
		
		event.target.style.cursor = 'move';
	} // Pin.onPointerEnter
	
	
	
	// unmark a pin
	onPointerLeave( event )
	{
		if( playground.dragPin ) return;
		
		this.setPinHeadSize( Pin.SMALL_HEAD_SIZE );
		
		event.target.style.cursor = 'default';
	} // Pin.onPointerLeave

	
	
	// deactivate a pin (called from top level html)
	onPointerUp( )
	{
		this.setPinHeadSize( Pin.SMALL_HEAD_SIZE );

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

	} // Pin.onPointerMove
	
	
	
	// construct the pin
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
			its.threejs.castShadow = true;
					
		var head1 = sphere( [0,Pin.LENGTH,0], Pin.SMALL_HEAD_SIZE, 'crimson' );
			its.threejs.castShadow = true;
		var head2 = sphere( [0,-Pin.LENGTH,0], Pin.SMALL_HEAD_SIZE, 'crimson' );
			its.threejs.castShadow = true;
		
		this.add( body, head1, head2 );
		this.pinHeads.push( head1, head2 );
		
	} // Pin.constructPin



	// hide the pin when the surface is 2D
	hide( )
	{
		this.visible = false;
	} // Pin.hide
	
	
	
	// show the pin when the surface is 3D
	show( u, v )
	{
		this.u = u;
		this.v = v;
		this.spin = [0,90,0];
		this.center = playground.membrane.surface.curve( u, v );
		this.visible = true;
	} // Pin.show
	
} // class Pin

