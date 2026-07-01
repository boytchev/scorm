//
//	class Playground( )
//

	
var hues = [0, 3, 6, 9, 12, 15, 18, 22, 25, 30, 35, 41, 46, 53, 59, 70, 82, 93, 103, 112, 120, 130, 143, 160, 176, 185, 190, 196, 202, 208, 213, 218, 223, 226, 229, 232, 235, 238, 242, 243, 247, 251, 256, 263, 271, 279, 288, 299, 321, 334, 344, 353];
const HUES_SPAN = hues.length;
const HUES = [
	...hues,
	...hues.map(e=>e+360),
	...hues.map(e=>e+2*360),
	...hues.map(e=>e+3*360)];

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		
		super( );

		this.light.position.y = 20/10;

		this.plates = [];
	
		// create plates
		this.masterPlate = new Plate( [0,0,0], 0 );
		this.masterPlate.isMasterPlate = true;

		if( this.inVRMode ) this.intersectables.push( this.masterPlate.threejs );

		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19/10 * Math.cos( radians(spin) ),
				z = 19/10 * Math.sin( radians(spin) );
		
			var plate = new Plate( [x,0,z], 90-spin );
			this.plates.push( plate );
			if( this.inVRMode ) this.intersectables.push( plate.threejs );
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

		var hueStart = Math.floor(random( 0, HUES_SPAN )),
			hueStep = Math.round(this.configRange( 8, 1 ));
		
		// setup master plate hue
		var idx = random([0,1,2,3,4]),
			c1 = hsl(HUES[hueStart + idx*hueStep],100,50),
			c2 = hsl(HUES[hueStart + (idx+1)*hueStep],100,50);
		this.masterPlate.index = idx+0.5;
		this.masterPlate.color = [(c1.r+c2.r)/2,(c1.g+c2.g)/2,(c1.b+c2.b)/2];

		this.masterPlate.flipIn( );
		
		// setup other plates hues
		var offset = random([0,1,2,3,4,5]);
		for( var i=0; i<6; i++ )
		{
			var plate = this.plates[ (i+offset)%6 ];
			plate.color = hsl(HUES[hueStart + i*hueStep], 100, 50);
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

		var points = this.maxPoints( );
		
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

		// spin all plates
		//playground.masterPlate.spinIt( );
		
	} // Playground.endGame
	


	// update the viewpoint to set the image size depending
	// on orientation of mobile devices
	resize( )
	{
		if( !this.inVR ) 
		{
			var distance = 90/10*THREE.MathUtils.clamp(suica.canvas.clientHeight/suica.canvas.clientWidth,1,3);
			lookAt( [0,distance,0], [0,0,0], [0,0,1] );
		}
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
	
	
	
	// move the view point to stay only above the master plate
	update( t, dT )
	{
		if( this.inVR )
		{
			var y = suica.renderer.xr.getCamera().position.y;
			lookAt( [0,7,-y], [0,0,-y], [0,0,1] );
			suica.vrCamera.updateMatrixWorld(true);
		}
	}
	
	
} // class Playground
