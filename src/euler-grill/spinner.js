//
//	class Spinner( )
//

	
class Spinner extends Group
{
	static SPEED = 20;
	static MAX_SPEED = 100;
	static SIZE = [3,7,3];
	static ROTOR_SIZE = [10, 2.1, 10];
	static ROTOR_POS = 22;
	
	constructor( )
	{
		super( suica );

		this.box = new Box( );
		this.speed = Spinner.MAX_SPEED;
		this._state = 0;
		
		//var axisLine = line( [30,0,0], [-30,0,0], 'crimson' );
		var leftRotor = cylinder( [Spinner.ROTOR_POS,0,0], Spinner.ROTOR_SIZE, 'white' );
			its.spin = [90,90,0];
			its.image = image( 'images/rotor.jpg' );
		var rightRotor = leftRotor.clone;
			its.x = -Spinner.ROTOR_POS;
			its.spin = [-90,90,0];
		
		var offset = Math.sqrt(3)/2*Box.SIZE+Spinner.SIZE[1]-2.1;
		this.leftHandle = this.handle( -offset, 90 );
		this.rightHandle = this.handle( offset, -90 );
		
		this.add( leftRotor, rightRotor, this.leftHandle, this.rightHandle, this.box );

		this.addEventListener( 'click', this.onClick );
		
		this.y = Base.POS_Y;

		this.state = 0;
		
	} // Spinner.constructor



	// make the spinner (non-)interactive (pass through pointer
	// events to the slider and the button)
	activate( )
	{
		this.addEventListener( 'click', this.onClick );
	} // Spinner.activate
	
	deactivate( )
	{
		this.removeEventListener( 'click' );
	} // Spinner.deactivate
	
	
	// handles clicks on the box
	onClick( event )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the spinner will start it
		if( !playground.gameStarted )
			playground.newGame( );
		
	} // Spinner.onClick

	
	
	// generate box handle
	handle( x, spin )
	{
		function profile( u )
		{
			return [0,u,0,0.15+0.9*u**3];
		}
		
		var handle = tube( [0,0,0], profile, 1, [20, 3], Spinner.SIZE, 'black' );
			its.spin = [spin,90,90];
			its.x = x;
			
		return handle;
	} // Spinner.handle
	
	
	
	// spin the spinner
	update( t, dT )
	{
		this.spinV += this.speed*dT;
	} // Spinner.update
	
	
	
	// state: 0=stopped, 1=fully working
	get state( )
	{
		return this._state;
	}
	set state( state )
	{
		this._state = state;

		this.speed = Spinner.MAX_SPEED*(1-state) + Spinner.SPEED*state; // grill rotating speed
		this.box.state = state;
		
		this.leftHandle.height = 20*(1-state) + 7*state;
		this.rightHandle.height = 20*(1-state) + 7*state;
	}// Spinner.state
	
} // class Spinner

