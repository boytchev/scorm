//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static POINTER_MOVEMENT = 5;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.ring = new Ring;
		this.pins = [new Pin(),new Pin(),new Pin(),new Pin()];
		this.dragPin = null;
		
		this.membrane = new Membrane;

		this.toucher = this.constructToucher( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Normal pins',
				bg: 'Нормални карфици',
				jp: '法線ピン'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.membrane.show( );
		
		// number of pins
		var n = Math.round( THREE.MathUtils.mapLinear( this.difficulty**5, 10**5, 100**5, 1, 4 )),
			angle = random( 0, 2*Math.PI ),
			dist;
			
		for( var i=0; i<n; i++ )
		{
			dist = random( 0.1, 0.30 );
			angle += 2*Math.PI/n;

			this.pins[i].show( 0.5+dist*Math.sin(angle), 0.5+dist*Math.cos(angle) );
		}
		
		
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
		super.endGame( );
		
		this.membrane.hide( );

		// hide all pins
		for( var pin of this.pins ) pin.hide( );
		
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
	
	
	// construct toucher sphere
	constructToucher( )
	{
		var material = new THREE.MeshBasicMaterial( {
				color: 'crimson',
				side: THREE.DoubleSide,
//				transparent: true,
//				opacity: 0.2
		});

		var toucher = square( [0,0,0], 100 );
			its.threejs.material = material;
			its.visible = false;
			
		return toucher;
	}

	
	// update the playground
	update( t, dT )
	{
		// ...
		this.membrane.update( t, dT );
	}
} // class Playground
