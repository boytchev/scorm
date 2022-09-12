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

		this.tile = square( [0,0,Plate.DEPTH], [Tile.WIDTH, Tile.HEIGHT] );
		its.threejs.material = new THREE.MeshLambertMaterial({
			color: 'black',
			map: Tile.mapDigit1,
			alphaMap: Tile.mapDigit1,
			transparent: true,
			opacity: random( 0.6, 1 ),
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



	// set the digit
	setDigit( digit )
	{
		this.digit = digit;
		this.tile.spin = [90, random(-20,20), -90];
		this.tile.threejs.material.opacity = random( 0.6, 1 );
		
		switch( digit )
		{
			case 0:
				this.threejs.material.map = Tile.mapDigit0;
				this.threejs.material.alphaMap = Tile.mapDigit0;
				break;
			case 1:
				this.threejs.material.map = Tile.mapDigit1;
				this.threejs.material.alphaMap = Tile.mapDigit1;
				break;
			default:
				this.threejs.material.map = Tile.mapDigitX;
				this.threejs.material.alphaMap = Tile.mapDigitX;
				break;
		}
	}
	
	
} // class Tile

