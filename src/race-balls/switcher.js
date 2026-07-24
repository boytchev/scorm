//
//	class Switcher( )
//

	
class Switcher extends Suica.Group
{
	static SIZE = 1;
	static YOYO_SPEED = 150;
	
	constructor( )
	{
		super( suica );
	
		this.ball = sphere( [0,0,0], Switcher.SIZE+0.1 );
		this.ball.threejs.material = new THREE.MeshStandardMaterial( {
						color: 0x202020,
						metalness: 0.8,
						roughness: 0.3,
					} );
		its.parent = this; // used for VR click
					
		this.add( this.ball );

		this.addEventListener( 'click', this.onClick );
		
	} // Switcher.constructor



	// handles clicks on a track
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( (!playground.inVRMode) && playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		new TWEEN.Tween( this.ball )
				.to( {size:Switcher.SIZE*0.8}, Switcher.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.repeat( 1 )
				.yoyo( true )
				.start( );
				
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
			if( playground.canEndGame( ) )
			{
				playground.clackSound.play( );
				playground.endGame( );
			}
		}
		else
		{
			playground.clickSound?.play( );
			playground.newGame( );
		}
	} // Switcher.onClick
		
} // class Switcher

