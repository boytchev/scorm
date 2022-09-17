//
//	class Platform
	


class Platform extends Group
{
	static DISTANCE = Planet.SIZE/2 * Planet.SCALE;
	
	constructor( )
	{
		super( suica );

		this.model = model( 'models/platform_large.glb' );
			its.size = Planet.PLATFRORM_SCALE;
			its.x = -2*Planet.PLATFRORM_SCALE;
			its.y = 0;
			its.z = -1.5*Planet.PLATFRORM_SCALE;

		this.visible = false;

		this.add( this.model );
		
	} // Platform.constructor



	// set the platform on random position
	randomize( side )
	{
		switch( side )
		{
			case 0: // bottom
				this.spin = [0,0,0];
				this.y = -Platform.DISTANCE;
				break;
			case 1: // top
				this.spin = [0,180,0];
				this.y = Platform.DISTANCE;
				break;
			case 2: // left
				this.spin = [90,90,90];
				this.x = -Platform.DISTANCE;
				break;
			case 3: // right
				this.spin = [90,-90,90];
				this.x = Platform.DISTANCE;
				break;
			case 4: // front
				this.spin = [0,-90,0];
				this.z = Platform.DISTANCE;
				break;
			case 5: // back
				this.spin = [0,90,0];
				this.z = -Platform.DISTANCE;
				break;
			default:
				throw 'Unknown side';
		}
		
		this.visible = true;
		
	} // Platform.randomize
	
	
	
	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
			playground.newGame( 0 );
	} // Platform.onClick
	
		
} // class Platform
