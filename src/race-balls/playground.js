//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FLIP_SPEED = 6000;
	static BALL_SHOW_SPEED = 500;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Race balls',
				bg: 'Състезателни топки',
				jp: 'レースボール'},
		] );
		
		this.tracks = [];
		for( var i=0; i<5; i++ )
			this.tracks.push( new Track( 5+3.9*i ) );
		
		this.lastEventIsMove = false;
		
		this.switcher = new Switcher;
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );


		// working with angular speed
		
		// speed difference between wrong angles
		var speedGap = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0.1, 0.02 ),
			speed = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0.1, 0.3 );

		// generate array of speeds
		var speeds = [];
		for( var i=0; i<this.tracks.length; i++ )
		{
			speeds.push( speed );
			speed += speedGap*random(0.9,1.1);
		}
		
		// shuffle the speeds
		speeds.sort( ()=>random(-10,10) );
		speeds.sort( ()=>random(-10,10) );
		speeds.sort( ()=>random(-10,10) );
		

		// configure tracks
		var offset = random( 0, 360 ),
			offsetSpan = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0, 360 );
		
		for( var track of this.tracks )
		{
			track.speed = speeds.pop();
			track.pos = offset + random( 0, offsetSpan );

			new TWEEN.Tween( track )
				.to( {spinV:0, spinH:random(0,360), spinT:random(0,360)}, Playground.FLIP_SPEED )
				.easing( TWEEN.Easing.Elastic.Out )
				.start( );

			new TWEEN.Tween( track.ball )
				.to( {size:1}, Playground.BALL_SHOW_SPEED )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.start( );
		}
		

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
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		//this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	update( t, dT )
	{
		for( var track of this.tracks )
			track.moveBall( dT );
	}
	
} // class Playground
