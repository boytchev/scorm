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

		this.basePlate = sphere( [0,0,0], [Button.SIZE+1,1], 'black' );
		this.colorPlate = sphere( [0,0,0], [Button.SIZE,3], 'goldenrod' );
	
		this.y = -Base.PILLAR_SIZE[1]+Base.POS_Y;
		
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		this.add( this.basePlate, this.colorPlate );
	} // Button.constructor


	
	// handles clicks on a plate
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		new TWEEN.Tween( this )
				.to( {height:1/2}, Button.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.repeat( 1 )
				.yoyo( true )
				.start( );

		// if game is not started, click on any plate will start it
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
	
	
	
	// marks a plate when the mouse pointer goes over it
	onMark( )
	{
		this.colorPlate.color = 'gold';
	} // Button.onMark
	
	
	
	// unmarks a plate when the mouse pointer goes out of it
	onUnmark( )
	{
		this.colorPlate.color = 'goldenrod';
	} // Button.onUnmark
	
} // class Button
