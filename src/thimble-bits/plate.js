//
//	class Plate( )
//

	
class Plate extends Group
{
	static DEPTH = 0.1;
	
	constructor( idx )
	{
		super( suica );

		//this.idx = i;
		
		var angle = 2*Math.PI/12 * (idx+0.5),
			x = Thimble.RADIUS * Math.cos(angle),
			y = 0, // will be set by regenerate
			z = Thimble.RADIUS * Math.sin(angle);
		
		this.plate = cube( [x,y,z], [Tile.WIDTH,6*Tile.HEIGHT,Plate.DEPTH], 'white' );
			its.image = ScormUtils.image( 'rusty_plates.jpg' );
			its.image.offset.y = random([0,1,2,3,4,5]) * (1/Playground.MAX_BITS);
			its.spin = 90 - degrees(angle);
			its.visible = false;
			
		this.addEventListener( 'click', this.onClick );

		this.add( this.plate );
		
	} // Plate.constructor



	// handles clicks on the thimble
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Plate.onClick



	// change the size of the plate depending on the number of bits
	regenerate( )
	{
		// number of visible plates
		var n = playground.thimble.lines;
		
		if( n > 0 )
		{
			this.plate.visible = true;
			this.plate.y = Thimble.HEIGHT - (n/2+0.5)*Tile.HEIGHT + Base.POS_Y,
			this.plate.height = n * Tile.HEIGHT;
			this.plate.images = [1, n/Playground.MAX_BITS];
		}
		else
		{
			this.plate.visible = false;
		}
		
		
	} // Plate.newGame

	
} // class Plate

