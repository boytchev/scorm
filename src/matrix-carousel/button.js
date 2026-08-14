//
//	class Button( )
//
	

var SC = 5;

class Button extends Suica.Group
{
	static SIZE = 6/SC;
	static YOYO_SPEED = 150; // in ms
	
	constructor( )
	{
		super( suica );

		var y = Base.POS_Y + Base.BASE_HEIGHT + Carousel.PILLAR_HEIGHT + Button.SIZE/2/* + 0.8/SC*/;
		
		this.colorPlate = sphere( [0,y,0], [Button.SIZE/*,2/SC*/], 'goldenrod' );
		this.colorPlate.threejs.material.emissive = this.colorPlate.threejs.material.color;
		this.colorPlate.threejs.material.emissiveIntensity = 0.5;
		
//		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerup', this.onpointerup );
		this.addEventListener( 'pointerdown', this.onpointerdown );
		this.addEventListener( 'pointerenter', this.onMark );
		this.addEventListener( 'pointerleave', this.onUnmark );

		this.colorPlate.parent = this;
		
		this.add( this.colorPlate );
	} // Button.constructor


	
	onpointerdown( event )
	{
	}


	// handles clicks on a plate
	onpointerdown( )
	{
		// avoid fake onClicks
		//if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		//console.log( !playground.inVR && (Date.now()-playground.pointerDownTime > Playground.POINTER_TIME) )
		if( !playground.inVR && (Date.now()-playground.pointerDownTime > Playground.POINTER_TIME) ) return;
		if( playground ) playground.pointerDownTime = Date.now();

		// this.height = 1;
		
		// new TWEEN.Tween( this.colorPlate )
				// .to( {height:1.5/SC, y:this.colorPlate.y+0.1, width:Button.SIZE*0.9, depth:Button.SIZE*0.9}, Button.YOYO_SPEED )
				// .easing( TWEEN.Easing.Cubic.Out )
				// .repeat( 1 )
				// .yoyo( true )
				// .start( );

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
