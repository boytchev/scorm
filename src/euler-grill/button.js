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

		this.basePlate = sphere( [0,0,0], [Button.SIZE+1,1], 'black' );
		this.colorPlate = sphere( [0,0,0], [Button.SIZE,3], 'goldenrod' );
	
		this.y = -Base.PILLAR_SIZE[1]+Base.POS_Y;
		
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		orb.addEventListener( 'start', () => Button.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Button.POINTER_USED=false );
		
		this.add( this.basePlate, this.colorPlate );
	} // Button.constructor


	
	// handles clicks on a plate
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		new TWEEN.Tween( this )
				.to( {height:1/2}, Button.YOYO_SPEED )
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
		if( Button.POINTER_USED ) return;
		this.colorPlate.color = 'gold';
	} // Button.onMark
	
	
	
	// unmarks the button when the mouse pointer goes out of it
	onUnmark( )
	{
		this.colorPlate.color = 'goldenrod';
	} // Button.onUnmark
	
} // class Button
