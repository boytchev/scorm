//
//	class Button( )
//
	


class Button extends Group
{
	static SIZE = 8;
	static YOYO_SPEED = 150; // in ms
	
	constructor( )
	{
		super( suica );

		var y = Base.POS_Y + Base.BASE_HEIGHT + Carousel.PILLAR_HEIGHT + 0.8;
		
		this.colorPlate = sphere( [0,y,0], [Button.SIZE,2], 'goldenrod' );
	
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		this.add( this.colorPlate );
	} // Button.constructor


	
	// handles clicks on a plate
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		this.height = 1;
		
		new TWEEN.Tween( this )
				.to( {height:0.99}, Button.YOYO_SPEED )
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
	onMark( )
	{
		if( Playground.POINTER_USED ) return;
		this.colorPlate.color = 'gold';
	} // Button.onMark
	
	
	
	// unmarks the button when the mouse pointer goes out of it
	onUnmark( )
	{
		this.colorPlate.color = 'goldenrod';
	} // Button.onUnmark
	
} // class Button
