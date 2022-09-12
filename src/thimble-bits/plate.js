//
//	class Plate( )
//

	
class Plate extends Group
{
	static DEPTH = 0.1;
	
	constructor( )
	{
		super( suica );

		this.plate = cube( [0,0,0], [Tile.WIDTH,1,Plate.DEPTH], 'white' );
			its.image = ScormUtils.image( 'rusty_plates.jpg' );
			its.image.offset.y = random([0,1,2,3,4,5]) * (1/Playground.MAX_BITS);

		this.tiles = [];
		for( var i=0; i<Playground.MAX_BITS; i++ )
			this.tiles.push( new Tile( Base.POS_Y+Thimble.HEIGHT-(i+1)*Tile.HEIGHT ) );
		
		this.visible = false;
		
		this.addEventListener( 'click', this.onClick );

		this.add( this.plate, ...this.tiles );

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



	// show plate at position idx and sets its size
	showAt( idx )
	{
		
		var n = playground.thimble.lines;

		var angle = 2*Math.PI/12 * idx,
			x = Thimble.RADIUS * Math.cos(angle),
			y = Thimble.HEIGHT - (n/2+0.5)*Tile.HEIGHT + Base.POS_Y,
			z = Thimble.RADIUS * Math.sin(angle);
		
		this.x = x;
		this.z = z;
		this.plate.y = y;
		this.spin = 90 - degrees(angle);
		
		this.plate.height = n * Tile.HEIGHT;
		this.plate.images = [1, n/Playground.MAX_BITS];		
		
		for( var i=0; i<Playground.MAX_BITS; i++ )
		{
			if( i >= n )
				this.tiles[i].visible = false;
			else
			{
				this.tiles[i].visible = true;
				//this.tiles[i].y = this.plate.height/2 - Tile.HEIGHT/2 - i*Tile.HEIGHT;
			}
		}
	} // Plate.newGame

	
} // class Plate

