//
//	class Tile( )
//

	
class Tile extends Group
{
	static HEIGHT = 2.5;
	static WIDTH = 2.5;

	static mapDigit1 = null;
	static mapDigit0 = null;
	static mapDigitX = null;
	
	constructor( idx, y )
	{
		super( suica );

		// read textures once
		if( !Tile.mapDigit1 )
		{
			Tile.mapDigit1 = ScormUtils.image( "digit_1.jpg" );
			Tile.mapDigit0 = ScormUtils.image( "digit_0.jpg" );
			Tile.mapDigitX = ScormUtils.image( "digit_none.jpg" );
		}
		
		this.y = y;
		this.digit = '';
		
		this.tile = square( [0,0,0], [Tile.WIDTH, Tile.HEIGHT] );
		its.threejs.material = new THREE.MeshLambertMaterial({
			color: 'black',
			map: Tile.mapDigit1,
			alphaMap: Tile.mapDigit1,
			transparent: true,
		});
		its.idx = idx;
		this.threejs.renderOrder = 1;
		this.add( this.tile );

		this.visible = false;
		
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



	// clear the digit
	clearDigit( )
	{
		this.visible = false;
	} // Tile.clearDigit



	// set the digit
	setDigit( digit, userPlate )
	{
		this.visible = true;
		this.digit = digit;
		
		var material = this.tile.threejs.material;
		
		if( userPlate )
			material.color.setRGB( 2, 1, 0.5 );
		else
			material.color.set( 'lightgray' );
		
		switch( digit )
		{
			case '0':
				material.map = Tile.mapDigit0;
				material.alphaMap = Tile.mapDigit0;
				break;
			case '1':
				material.map = Tile.mapDigit1;
				material.alphaMap = Tile.mapDigit1;
				break;
			default:
				material.map = Tile.mapDigitX;
				material.alphaMap = Tile.mapDigitX;
				break;
		}
	} // Tile.setDigit
	


	// toggle digit: none->0 and 0<->1
	toggle( )
	{
		var material = this.tile.threejs.material;

		switch( this.digit )
		{
			case '0':
				this.digit = '1';
				material.map = Tile.mapDigit1;
				material.alphaMap = Tile.mapDigit1;
				break;
			default:
				this.digit = '0';
				material.map = Tile.mapDigit0;
				material.alphaMap = Tile.mapDigit0;
				break;
		}
	} // Tile.toggle
	
	
	
	// marks the button when the mouse pointer goes over it
	onPointerEnter( event )
	{
		if( Button.POINTER_USED ) return;
		this.tile.threejs.material.color.setRGB( 2, 1, 0.5 );
		event.target.style.cursor = 'pointer';
	} // Tile.onPointerEnter
	
	
	
	// unmarks the button when the mouse pointer goes out of it
	onPointerLeave( event )
	{
		this.tile.threejs.material.color.setRGB( 2, 1, 0.5 );
		event.target.style.cursor = 'default';
	} // Tile.onPointerLeave
	
} // class Tile

