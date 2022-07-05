//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FILL_SPEED = 0.2;
	static DRAIN_SPEED = 0.5;
	
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

		this.tank.water.clearWater( );
		this.tank.cyanPipe.show( );
		this.tank.magentaPipe.show( );
		this.tank.yellowPipe.show( );
		this.tank.drainPipe.show( );

		this.tank.water.plate.y = 20;
		new TWEEN.Tween( this.tank.water.plate )
			.to( {y:Tank.BASE_HEIGHT+Tank.PLATE_HEIGHT/2}, 1000 )
			.easing( TWEEN.Easing.Quartic.In )
			.start( );
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
console.log('end game');
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
		this.tank.water.addInk( 'cyan', Math.pow(this.tank.cyanPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.addInk( 'magenta', Math.pow(this.tank.magentaPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.addInk( 'yellow', Math.pow(this.tank.yellowPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.drain( Math.pow(this.tank.drainPipe.aperture,2)*dT*Playground.DRAIN_SPEED );
		
		//this.tank.water.addYellow( dT/20 );
		this.tank.water.waves( t );
	}
} // class Playground
