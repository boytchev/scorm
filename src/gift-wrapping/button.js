//
//	class Button( )
//
	


class Button extends Group
{
	static SIZE = 8;
	static YOYO_SPEED = 150; // in ms
	static POINTER_USED = false; // true when the pointer is used by orbit controls
	
	constructor( )
	{
		super( suica );

		this.colorBall = sphere( [0,0,0], Button.SIZE );
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'goldenrod',
				clearcoat: 1,
				clearcoatRoughness: 0.5,
				roughness: 0.1,
				metalness: 0.05,
		});

	
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		orb.addEventListener( 'start', () => Button.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Button.POINTER_USED=false );
		
		this.add( this.colorBall );
	} // Button.constructor


	
	// handles clicks on a plate
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		new TWEEN.Tween( this.colorBall )
				.to( {width:0.9*Button.SIZE, depth:0.9*Button.SIZE}, Button.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.repeat( 1 )
				.yoyo( true )
				.start( );

		// if game is not started, click on the button will start it
		if( playground.gameStarted )
		{
			if( playground.canEndGame() )
				playground.endGame( );
		}
		else
		{
			playground.newGame( );
		}
	} // Button.onClick
	
	
	
	// marks the button when the mouse pointer goes over it
	onMark( event )
	{
		if( Button.POINTER_USED ) return;
		this.colorBall.color = 'gold';
	} // Button.onMark
	
	
	
	// unmarks the button when the mouse pointer goes out of it
	onUnmark( event )
	{
		this.colorBall.color = 'goldenrod';
	} // Button.onUnmark
	
} // class Button
