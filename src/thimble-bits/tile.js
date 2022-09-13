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

	//static allTiles = [];
	
	constructor( y )
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
		
		this.addEventListener( 'click', this.onClick );

		this.tile = square( [0,0,0], [Tile.WIDTH, Tile.HEIGHT] );
		its.threejs.material = new THREE.MeshLambertMaterial({
			color: 'black',
			map: Tile.mapDigit1,
			alphaMap: Tile.mapDigit1,
			transparent: true,
//			opacity: random( 0.6, 1 ),
		});
		this.threejs.renderOrder = 1;
		this.add( this.tile );

		this.visible = false;
		
		//Tile.allTiles.push( this );
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
		
//		this.tile.spin = [90, random(-10,10)+random(-10,10), -90];
		
		var material = this.tile.threejs.material;
		
		if( userPlate )
			material.color.setRGB( 2, 1, 0.5 );
		else
			material.color.set( 'lightgray' );
		
//		material.opacity = random( 0.6, 1 );
		
		switch( digit )
		{
			case 0:
			case '0':
				material.map = Tile.mapDigit0;
				material.alphaMap = Tile.mapDigit0;
				break;
			case 1:
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
	
	
} // class Tile

