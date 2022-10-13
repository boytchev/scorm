//
//	class Button( )
//
	


class Button extends Group
{
	static SIZE = [7, 6.5, 7];
	static CUP_SIZE = [6.8, 7, 6.8];
	static YOYO_SPEED = 150; // in ms
	static POINTER_USED = false; // true when the pointer is used by orbit controls
	
	constructor( )
	{
		super( suica );

		this.cap = sphere( [0,0,0], Button.CUP_SIZE );
		//its.spinV = 90;
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				clearcoat: 0,
				clearcoatRoughness: 0.5,
				roughness: 0.3,
				metalness: 0.5,
				map: ScormUtils.image( 'metal_plate.jpg', 4, 3 ),
				normalMap: ScormUtils.image( 'metal_plate_normal.jpg' ),
				normalScale: new THREE.Vector2( 0.4, 0.4 ),
		});
		
		
		this.colorBall = sphere( [0,0,0], Button.SIZE );
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				roughness: 1,
				metalness: 0.0,
				map: ScormUtils.image( 'paper.jpg', 4, 2 ),
		});

	
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		orb.addEventListener( 'start', () => Button.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Button.POINTER_USED=false );
		
		this.add( this.colorBall, this.cap );
	} // Button.constructor


	
	// handles clicks on a plate
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		var that = this;
		
		new TWEEN.Tween( {k:1} )
				.to( {k:0.9}, Button.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.onUpdate( obj => that.size=obj.k )
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
		this.colorBall.color = 'orange';
	} // Button.onMark
	
	
	
	// unmarks the button when the mouse pointer goes out of it
	onUnmark( event )
	{
		this.colorBall.color = 'white';
	} // Button.onUnmark
	
} // class Button
