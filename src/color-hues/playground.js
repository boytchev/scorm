//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		super( );
		
		// create plates
		this.masterPlate = new Plate( [0,0,0], 0 );
		this.masterPlate.isMasterPlate = true;

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
		
			this.plates.push( new Plate( [x,0,z], 90-spin ) );
		}
	
		this.masterIndex = 0;
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Color hues',
				bg: 'Цветни оттенъци',
				jp: '色相'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );
		
		// generate initial hue and hue step
		var masterHue = random( 0, 359 ),
			hueStep = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 70, 7 );
			
		// setup master plate hue
		this.masterPlate.index = random([0.5, 1.5, 2.5, 3.5, 4.5]);
		this.masterPlate.hue = masterHue + this.masterPlate.index*hueStep;
		this.masterPlate.flipIn( );
		
		// setup other plates hues
		var offset = random([0,1,2,3,4,5]);
		for( var i=0; i<6; i++ )
		{
			var plate = this.plates[ (i+offset)%6 ];
			plate.hue = masterHue + i*hueStep;
			plate.index = i;
			
			plate.flipIn( );
		}

	} // Playground.newGame



	// check whether a game can end - there must be two selected plates
	canEndGame( )
	{
		this.clackSound.play( );
		
		var selected = 0;
		for( var plate of this.plates )
			if( plate.selected )
				selected++;
		
		return selected==2;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		// get offsets of selected plates compared to the correct plate
		// 0 = the correct plate is selected; 1 = next to the correct, and so on
		
		var answers = [];
		for( var i in this.plates )
		{
			var plate = this.plates[i];
			if( plate.selected ) answers.push( Math.abs(plate.index-this.masterPlate.index)-0.5 );
		}

		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		
		var score = 0;
		
		switch( answers.join('') )
		{
			case '00': return points;		// 100% of points for correct answer

			case '01':
			case '10': return 0.5*points;	// 50%

			case '11': return 0.3*points;	// 30%

			case '02':
			case '20': return 0.1*points;	// 10%

			default: return 0;
		}
	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		// flip out all plates
		playground.masterPlate.flipOut( );
		for( var plate of this.plates ) plate.flipOut( );

	} // Playground.endGame
	


	// update the viewpoint to set the image size depending
	// on orientation of mobile devices
	resize( )
	{
		var distance = 90*THREE.MathUtils.clamp(suica.canvas.clientHeight/suica.canvas.clientWidth,1,3);
		lookAt( [0,distance,0], [0,0,0], [0,0,1] );
	} // Playground.resize
	


	// load all sounds
	loadSounds( )
	{
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true, false );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
} // class Playground
