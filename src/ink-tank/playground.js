//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.tank = new Tank;
		
// this.tank.water.addCyan( 0.25 );
// this.tank.water.addYellow( 0.25 );
// this.tank.water.addMagenta( 0.25 );

// setTimeout( ()=> playground.tank.water.drain(), 500 );

		this.translate( [
			{id: 'txt-caption',
				en: 'Ink tank',
				bg: 'Мастилен резервоар',
				jp: 'インクタンク'},
		] );
		
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
		//this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		//this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		this.drainSound = new PlaygroundAudio( 'sounds/drain.mp3', 0.2 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/bubbles.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.drainSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	// floating plate
	update( t, dT )
	{
		//this.tank.water.addCyan( dT/2/20 );
		//this.tank.water.addYellow( dT/20 );
		this.tank.water.waves( t );
	}
} // class Playground
