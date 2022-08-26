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
		
		new Matrix( );
		this.carousel = new Carousel( );
		this.base = new Base( this );
		new Button( );
		
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
//this.totalScore = 90;

//		console.log('clickSound.play');
		this.clickSound?.play( );
		super.newGame( );

		var minGroup, maxGroup, removeCount, spinComplexity, fakeCount;
		
		if( this.difficulty<=10 ) minGroup = 0, maxGroup = 0, spinComplexity = 0, removeCount = 5, fakeCount = 0;
		else
		if( this.difficulty<=30 ) minGroup = 1, maxGroup = 1, spinComplexity = 0, removeCount = 4, fakeCount = 0;
		else
		if( this.difficulty<=45 ) minGroup = 1, maxGroup = 2, spinComplexity = 1, removeCount = 2, fakeCount = 0;
		else
		if( this.difficulty<=60 ) minGroup = 3, maxGroup = 3, spinComplexity = 0, removeCount = 3, fakeCount = 0;
		else
		if( this.difficulty<=70 ) minGroup = 3, maxGroup = 4, spinComplexity = 1, removeCount = 2, fakeCount = 0;
		else
		if( this.difficulty<=85 ) minGroup = 5, maxGroup = 6, spinComplexity = 2, removeCount = 1, fakeCount = 1;
		else
		if( this.difficulty<=95 ) minGroup = 7, maxGroup = 7, spinComplexity = 1, removeCount = 1, fakeCount = 1;
		else
                                  minGroup = 5, maxGroup = 9, spinComplexity = 3, removeCount = 0, fakeCount = 2;
			
		var minIndex = Matrix.allGroups[ minGroup ].min,
			maxIndex = Matrix.allGroups[ maxGroup ].max;

		
		// define top and bottom matrices to be the same
//console.log('---');
		var topIdx = [],
			botIdx = [];
		for( let i=0; i<6; i++ )
		{
			let idx = random(minIndex,maxIndex) | 0;
			topIdx[i] = idx;
			if( i>0 && maxGroup==0 )
				idx = Math.floor( random(0,Matrix.allMatrixData.length) );
			botIdx[i] = idx;
//console.log(topIdx[i],Matrix.allMatrixData[topIdx[i]]?.id);
		}
		
		// remove elements from the top
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
		while( fakeCount > 0 )
		{
			let i = random( [0,1,2,3,4,5] );
			if( topIdx[i] >= 0 ) // kept top index is used for faking bottom
			{
				botIdx[i] = random(minIndex,maxIndex) | 0;
				fakeCount--;
			}
		}
		
		// rotate the carousel integer number of swings
		// if the result is a match, spin again; and one more if needed
		this.carousel.spinH += 60*Math.round(random(60,300)/60);
		var score = this.evaluateScore( ),
			n = 5;
		while( score>0.9 && n>0)
		{
			//console.log( 'score=',score,'randomize',this.carousel.spinH );
			this.carousel.spinH = (this.carousel.spinH + 60*Math.round(random(60,300)/60))%360;
			n--;
			score = this.evaluateScore( );
		}
		
		for( let i in this.carousel.cosys )
		{	
			var cosys = this.carousel.cosys[i];
			
			cosys.idx = topIdx[i];
			cosys.cube.visible = cosys.idx >= 0;
			cosys.cosys.visible = cosys.idx >= 0;
			
			cosys.cosys.spinH = 0;
			cosys.cosys.spinV = 180;
			cosys.cosys.spinS = 0;
			
			switch( spinComplexity )
			{
				case 3: cosys.cosys.spinS = random( [0,90,180,270] ); // no break
				case 2: cosys.cosys.spinV = random( [0,90,180,270] ); // no break
				case 1: cosys.cosys.spinH = random( [0,90,180,270] ); // no break
			}

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
	evaluateScore( )
	{
		var bots = [],
			tops = [];
		for( let i=0; i<6; i++ )
		{
			bots[i] = this.base.arenas[i].matrixIdx;
			tops[i] = this.carousel.cosys[(i + Math.round(this.carousel.spinH/60))%6].idx;
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
		
//		console.log('match',match[0].toFixed(2), 'from', Math.max( ...match ).toFixed(2), '=> score',score.toFixed(4));
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
//		console.log('clackSound.play');
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
		this.swingSound = new PlaygroundAudio( 'sounds/swing_squeak.mp3', 0.03 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.05, 1, true, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound, this.carouselSound, this.swingSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	update( t, dT )
	{
		this.carousel.update( t, dT );
	}

} // class Playground
