//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTS_SPEED = 2000;
	static MAX_BITS = 6;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		new Base( );
		new Button( );
		this.thimble = new Thimble( );
		this.plates = [];
		for( var i=0; i<2*Playground.MAX_BITS; i++ )
			this.plates.push( new Plate(i) );
		
		this.translate( [
			{id: 'txt-caption',
				en: 'Thimble bits',
				bg: 'Битове на напръстник',
				jp: '指ぬきビット'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		this.clickSound.play();
		
		super.newGame( );

		this.thimble.lines = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 2, 6 ) );
		this.thimble.extra_bumps = Math.round( THREE.MathUtils.clamp( THREE.MathUtils.mapLinear( this.difficulty, 40, 100, 0, 20 ), 0, 20 ) );

		this.thimble.regenerate( );
		

		// ...

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// ...
		return true;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		
		// ...
		
		return 1 * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		this.clackSound.play();

		super.endGame( );
		
		this.thimble.lines = 0;
		this.thimble.extra_bumps = 0;
		this.thimble.regenerate( );
		
	} // Playground.endGame
	


	// update the viewpoint to set the image size depending
	// on orientation of mobile devices
	resize( )
	{
		// ...
	} // Playground.resize
	


	// load all sounds
	loadSounds( )
	{
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	// update the playground
	update( t, dT )
	{
		// ...
	}
} // class Playground
