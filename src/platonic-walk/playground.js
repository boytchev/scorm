//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTER_USED = false;
	
	constructor( )
	{
		super( );
		
		this.pointerMovement = 0;
		this.solid = null;
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Platonic walk',
				bg: 'Платонична разходка',
				jp: 'プラトニックな散歩------'},
		] );
		
		orb.addEventListener( 'start', () => Playground.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Playground.POINTER_USED=false );

		//this.solid = new Platonic( 0 );
		//this.solid = new Platonic( 1 );
		//this.solid = new Platonic( 2 );
		//this.solid = new Platonic( 3 );
		this.solid = new Platonic( 4 );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		// ...

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// ...
		return false;
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
		super.endGame( );
		
		// ...
		
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
