//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static POINTER_MOVEMENT = 5;
	static POINTER_USED = false; // true when the pointer is used by orbit controls
	
	constructor( )
	{
		super( );
		
		new Matrix( );
		this.carousel = new Carousel( );
		this.base = new Base( this );
		new Button( );
		
		this.resize( );

		this.pointerMovement = 0;
		
		orb.addEventListener( 'start', () => {Playground.POINTER_USED=true} );
		orb.addEventListener( 'end', () => {Playground.POINTER_USED=false} );
		
		this.translate( [
			{id: 'txt-caption',
				en: 'Matrix carousel',
				bg: 'Матрична въртележка',
				jp: 'マトリックス回転ブランコ'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		this.clickSound.play( );
		super.newGame( );

		this.carousel.newGame( );

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
		
		return 0 * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		this.clackSound.play( );
		super.endGame( );
		
		this.carousel.endGame( );
		
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
		console.log('loading sounds');
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	update( t, dT )
	{
		this.carousel.update( t, dT );
	}

} // class Playground
