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

		this.solids = [];
		for( var i=0; i<6; i++ )
			this.solids.push( new Platonic( i ) );
		
		//this.solid = this.solids[0];
		//this.solid.visible = true;
		
		this.model = new THREEJSModel();
		this.modelShell = prism( 6, [0,0,0], [2*THREEJSModel.SIZE,8], 'crimson' );
		its.spin = 30;
		its.visible = false;

		this.modelShell.addEventListener( 'click', this.onClickModel )
	} // Playground.constructor

	

	// clicking on the model while the game is not started
	// starts a new game
	onClickModel( )
	{
		if( !playground.gameStarted )
			playground.newGame( );
	} // Playground.onClickModel
	
	
	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		// pick a random slot
		this.model.ground.visible = false;
		this.solids[3].visible = true;
		this.solids[3].y = 0;

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
		this.model.update( t, dT );
	}
} // class Playground
