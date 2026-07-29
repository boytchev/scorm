//
//	class Button( )
//
	

var SC = 5;

class Button extends Suica.Group
{
	static SIZE = 8;
	static YOYO_SPEED = 150; // in ms
	static POINTER_USED = false; // true when the pointer is used by orbit controls
	static Y = -Base.PILLAR_SIZE[1]+SC*Base.POS_Y;
	
	constructor( )
	{
		super( suica );

		this.size = 1/SC;
		
		
		this.basePlate = sphere( [0,Button.Y,0], [Button.SIZE+1,1], 'black' );
		this.colorPlate = sphere( [0,Button.Y,0], [Button.SIZE,3], 'goldenrod' );
	
		
		this.addEventListener( 'pointerup', this.onpointerup );
		this.addEventListener( 'pointerdown', this.onpointerdown );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );
		
		orb.addEventListener( 'start', () => Button.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Button.POINTER_USED=false );
		
		this.basePlate.parent = this;
		this.colorPlate.parent = this;
		
		this.add( this.basePlate, this.colorPlate );
	} // Button.constructor


	onclick() { }
	
	
	onpointerdown( event )
	{
		if( playground ) playground.pointerDownTime = Date.now();
	}

	
	// handles clicks on a plate
	onpointerup( event )
	{
		// avoid fake onClicks
		//if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( !playground.inVR && (Date.now()-playground.pointerDownTime > Playground.POINTER_TIME) ) return;

		new TWEEN.Tween( this.colorPlate )
				.to( {height:2}, Button.YOYO_SPEED )
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
