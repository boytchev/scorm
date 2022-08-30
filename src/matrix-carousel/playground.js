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
		
		//new Matrix( );
		this.carousel = new Carousel( );
		this.base = new Base( this );
		this.button = new Button( );
		
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
		this.clickSound?.play( );
		super.newGame( );

		var n; // difficulty case
		
		const PERCENTS 		= [ 10, 35, 50, 65, 80, 95, 97, 200 ]; // compared against this.difficulty
		const MIN_GROUPS 	= [  0,  1,  2,  3,  8,  3,  3,   3 ]; // minimal group of matrices to use
		const MAX_GROUPS 	= [  0,  1,  2,  3,  9,  9,  9,   9 ]; // maximal grou of matrices to use
		const COUNTS		= [  2,  3,  6,  6,  6,  6,  6,   6 ]; // number of cosys to display
		const FAKES			= [  4,  0,  0,  0,  0,  0,  1,   2 ]; // number of wrong matrices
		const SPINS			= [  0,  0,  0,  0,  0,  1,  2,   3 ]; // cmplexity of spin orientation
		for( n=0; n<6; n++ )
		{
			if( this.difficulty <= PERCENTS[n] ) break;
		}

		var minIndex = Matrix.allGroups[ MIN_GROUPS[n] ].min,
			maxIndex = Matrix.allGroups[ MAX_GROUPS[n] ].max;

		
		// define top and bottom matrices (complete match)
		var topIdx = [],
			botIdx = [];
		for( let i=0; i<6; i++ )
		{
			let idx = random(minIndex,maxIndex) | 0;
			topIdx[i] = idx;
			botIdx[i] = idx;
		}
		
		// in any case, for first level (n=0) set two identity matrices
		
		// remove elements from the top
		var removeCount = 6 - COUNTS[n];
		while( removeCount > 0 )
		{
			let i = random( [0,1,2,3,4,5] );
			if( topIdx[i] >= 0 ) // valid index is removed
			{
				topIdx[i] = -1;
				removeCount--;
			}
		}
		
		// fakes matrices at the bottom
		var fakeCount = FAKES[n];
//		console.log('fakeCount',fakeCount,n);
		while( fakeCount > 0 )
		{
			let i = random( [0,1,2,3,4,5] );
			if( n>0 && topIdx[i]>=0 ) // faking bottom only if there is top
			{
				botIdx[i] = random(minIndex,maxIndex) | 0;
				fakeCount--;
			}
			if( n==0 && topIdx[i]<0 ) // faking bottom only if there is no top
			{
				botIdx[i] = random(Matrix.allGroups[1].min,Matrix.allGroups[3].max) | 0;
				fakeCount--;
			}
		}
		

		// rotate the carousel integer number of swings
		this.carousel.spinH = 60 * random( [0,1,2,3,4,5] );
		
		for( let i in this.carousel.cosys )
		{	
			var cosys = this.carousel.cosys[i];
			
			cosys.idx = topIdx[i];
			cosys.cube.visible = cosys.idx >= 0;
			cosys.cosys.visible = cosys.idx >= 0;
			cosys.cube.size = cosys.idx >= 0 ? 1 : 0;
			cosys.cosys.size = cosys.idx >= 0 ? 1 : 0;
			
			cosys.cosys.spinH = 0;
			cosys.cosys.spinV = 180;
			cosys.cosys.spinT = 0;
			
			switch( SPINS[n] )
			{
				case 3: cosys.cosys.spinT = random( [0,90,180,270] ); // no break
				case 2: cosys.cosys.spinV = random( [0,90,180,270] ); // no break
				case 1: cosys.cosys.spinH = random( [0,90,180,270] ); // no break
			}

			cosys.cosys.spinT += 90/4;

			playground.base.arenas[i].setMatrix( botIdx[i] );
		}	

		this.carousel.showCoSys( );

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		return this.carousel.phase == Carousel.STOPPED;
	} // Playground.canEndGame
	
	
	
	// returns the pure score [0..1] of the current game
	evaluateScore(  )
	{
		var tops = [],
			bots = [];
			
		for( let i=0; i<6; i++ )
		{
			tops[i] = this.carousel.cosys[(i + Math.round(this.carousel.spinH/60))%6].idx;
			bots[i] = this.base.arenas[i].matrixIdx;
		}

		// collect array ot matches:
		// - element 0 is the match of the current configuration
		// - element 1 is the match is shifted 1 position
		// - etc
		
		var match = [];
		for( let shift=0; shift<6; shift++ )
		{
			match[shift] = 0;
			
			for( let i=0; i<6; i++ ) if( tops[i] >= 0 )
			{
				var j = (i+shift)%6;
				
				// 70% for exact match
				match[shift] += tops[i]==bots[j] ? 0.70 : 0;
				
				// 20% for group match (eg scale on 1 axis <-> scale on 1 axis)
				match[shift] += Matrix.group(tops[i])==Matrix.group(bots[j]) ? 0.20 : 0;
				
				// 10% for type match (eg scale <-> scale)
				match[shift] += Matrix.type(tops[i])==Matrix.type(bots[j]) ? 0.10 : 0;
			}
		}
		
		return match[0] / Math.max( ...match );

	} // Playground.evaluateScore
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 ),
			score = this.evaluateScore( );
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		this.clackSound.play( );
		super.endGame( );
		
		this.carousel.hideCoSys( );
		
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
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		this.carouselSound = new PlaygroundAudio( 'sounds/carousel.mp3', 0.08 );
		this.swingSound = new PlaygroundAudio( 'sounds/swing_squeak.mp3', 0.02 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.05, 1, true, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound, this.carouselSound, this.swingSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	

	
	update( t, dT )
	{
		this.carousel.update( t, dT );
	} // Playground.update

} // class Playground
