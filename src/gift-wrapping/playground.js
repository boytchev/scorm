//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		super( );
		
		this.pointerMovement = 0;
		
		this.cloud = new Cloud( );
		new Button( );
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Gift-wrapping',
				bg: 'Опаковане на подарък',
				jp: 'ギフト包装'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.cloud.randomizePoints( Math.round(random(5,20)), 2 );
		
		// ...

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// if at least 4 points are selected, the game can end

		var canEnd = this.cloud.selectedPoints().length >= 4;
		
		// somewhat impractical:
		//	- first click is ok, selects all points
		//	- they cannot be deselected, because a new click ends the game
		if( !canEnd )
			this.cloud.toggleAllPoints( );
		
		return canEnd;
		
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		
		function hashCode( x, y, z )
		{
			const QUANT = 1000;
			
			return ((QUANT*x)|0)+'/'+((QUANT*y)|0)+'/'+((QUANT*z)|0);
		}
		

		var correctCount = 0;
		var wrongCount = 0;
		
		// get coordinates of correct points
		var correctMap = {};
		var pos = this.cloud.fullHull.threejs.geometry.getAttribute( 'position' );
		for( let i=0; i<pos.count; i++ )
		{
			let hash = hashCode( pos.getX(i), pos.getY(i), pos.getZ(i) );
			correctMap[hash] = false;
		}
		
		// check whether each selected point
		// is one of the correct points
		var pnt = this.cloud.selectedPoints( );
		for( let i=0; i<pnt.length; i++ )
		{
			let hash = hashCode( ...pnt[i] );
			if( hash in correctMap )
			{
				correctMap[hash] = true;
				correctCount++;
			}
			else
			{
				wrongCount++;
			}
		}
		
		// check how many correct points
		// were not selected
		for( var p in correctMap )
		{
			if( !correctMap[p] ) wrongCount++;
		}
		
		console.log( 'correctCount =',correctCount,'wrongCount =',wrongCount );
		return 0 * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		this.cloud.showConvexHull( );
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
		this.cloud.update( t, dT );
	}
} // class Playground
