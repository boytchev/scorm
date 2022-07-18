//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FLIP_SPEED = 6000;
	static BALL_SHOW_SPEED = 500;
	static N = 6;
	
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
		
		this.tracks = []; // active tracks
		this.allTracks = [];
		for( var i=0; i<Playground.N; i++ )
		{
			this.allTracks.push( new Track( Switcher.SIZE/2+Track.RADIUS+(2*Track.RADIUS-0.1)*i ) );
			this.allTracks[i].threejs.visible = i<3;
		}
		
		this.lastEventIsMove = false;
		this.direction = 0;
		
		this.switcher = new Switcher;
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.direction = random( [-1, 1] );
		
		// number of tracks
		var n = THREE.MathUtils.clamp( Math.round( THREE.MathUtils.mapLinear( Math.pow(this.difficulty/100,2), 0, 1, 3, Playground.N )), 3, Playground.N );
		
		this.tracks = [];
		for( let i=0; i<Playground.N; i++ )
			if( i < n )
			{
				this.allTracks[i].threejs.visible = true;
				this.tracks.push( this.allTracks[i] );
			}
			else
			{
				this.allTracks[i].threejs.visible = false;
			}
		
		// speed difference between wrong angles
		var speedGap = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0.2, 0.02 ),
			speed = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0.1, 0.3 );

		// generate array of speeds
		var speeds = [];
		for( var i=0; i<n; i++ )
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
			offsetSpan = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0, 360 ),
			verticalSpan = 0;
			
		if( this.difficulty>=80 )
		{
			var x = (this.difficulty-80)/20; //0..1
				x = Math.pow( x, 4 ); //0..1
				x = THREE.MathUtils.mapLinear( x, 0, 1, 0, 60 );
			verticalSpan = x;
		}

//for(var d=0; d<=100; d+=5)
//console.log( 90*Math.pow(0.5+0.5*Math.cos(radians(360*(d/100-0.5))),2)  );	
		for( var track of this.tracks )
		{
			track.speed = speeds.pop();
			track.pos = offset + random( 0, offsetSpan );

			new TWEEN.Tween( track )
				.to( {spinV:verticalSpan, spinH:random(0,360), spinT:random(0,720)}, Playground.FLIP_SPEED )
				.easing( TWEEN.Easing.Elastic.Out )
				.start( );

			new TWEEN.Tween( track.ball )
				.to( {size:1}, Playground.BALL_SHOW_SPEED )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.start( );
		}

console.log('new----------------');		
		for( var track of this.tracks )
		{
			speeds.push( track.speed );
			console.log( track.speed.toFixed(2), track.selected );
		}
console.log('\t-------');		

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// can end only if there are exactly two selected tracks
		var selected = 0;
		for( var track of this.tracks )
			if( track.selected )
				selected++;
			
		return selected == 2;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );

		var speeds = [];
		for( var track of this.tracks )
		{
			speeds.push( track.speed );
			console.log( track.speed.toFixed(2), track.selected );
		}
		speeds.sort();

		var score = 0;

		// each correct answers gives 50%,
		// each answer next to the correct one gives 15%
		// possible results: 100% 75% 50% 30% 15% 0%
		for( var track of this.tracks )
			if( track.selected )
			{
				var idx = speeds.indexOf( track.speed );
				if( idx==0 ) score += 0.5;
				if( idx==1 ) score += 0.15;
				if( idx==speeds.length-1 ) score += 0.5;
				if( idx==speeds.length-2 ) score += 0.15;
			}
console.log( score );		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		for( var track of this.tracks )
		{
			if( track.selected ) track.toggle( );
			
			new TWEEN.Tween( track )
				.to( {spinV:180, spinH:random(0,360), spinT:random(0,360)}, Playground.FLIP_SPEED )
				.easing( TWEEN.Easing.Elastic.Out )
				.start( );

			new TWEEN.Tween( track.ball )
				.to( {size:0}, Playground.BALL_SHOW_SPEED )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.start( );
		}		
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
			track.moveBall( this.direction*dT );
	}
	
} // class Playground
