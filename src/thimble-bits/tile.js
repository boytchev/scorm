//
//	class Tile( )
//

	
class Tile extends Group
{
	static HEIGHT = 2.5;
	static WIDTH = 2.5;
	
	constructor( )
	{
		super( suica );

		this.addEventListener( 'click', this.onClick );

	} // Tile.constructor



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
	} // Tile.onClick

} // class Tile

