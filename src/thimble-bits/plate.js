//
//	class Plate( )
//

	
class Plate extends Group
{
	static DEPTH = 0.1;
	
	constructor( )
	{
		super( suica );

		// plates are just group of tiles
		this.tiles = [];
		for( var i=0; i<Playground.MAX_BITS; i++ )
			this.tiles.push( new Tile( i, Base.POS_Y+Thimble.HEIGHT-(i+1)*Tile.HEIGHT+0.08 ) );
		
		this.visible = false;
		
		this.addEventListener( 'click', this.onClick );

		this.add( ...this.tiles );

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



	// hides a plate
	hide( )
	{
		this.size = 0; // to avoid clicks on invisible plates
		this.visible = false;
		for( var tile of this.tiles )
			tile.clearDigit( );
	} // Plate.hide
	
	
	
	// show plate at position idx and sets its size
	showAt( idx, code, userPlate )
	{
		this.size = 1; 

		var n = playground.thimble.lines;

		var angle = 2*Math.PI/12 * idx,
			x = Thimble.RADIUS * Math.cos(angle),
			z = Thimble.RADIUS * Math.sin(angle);
		
		this.x = x;
		this.z = z;
		this.spin = 90 - degrees(angle);

		for( var i=0; i<Playground.MAX_BITS; i++ )
		{
			if( i >= n )
				this.tiles[i].clearDigit( );
			else
			if( userPlate )	
				this.tiles[i].setDigit( '', userPlate );
			else
				this.tiles[i].setDigit( code[i], userPlate );
		}
	} // Plate.showAt

	
} // class Plate

