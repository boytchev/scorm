//
//	class Playground( )
//

var SC = 10;

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FLIP_SPEED = 4000;
	static BALL_SHOW_SPEED = 500;
	static N = 5;
	//static POINTER_MOVEMENT = 30;
	static POINTER_TIME = 250; // milliseconds
	
	static MARKER_SIZE = 0.2;
	
	constructor( )
	{
		super( Playground.MARKER_SIZE );

		this.light.intensity = 4;
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
			this.allTracks.push( new Track( 5*Switcher.SIZE+Track.RADIUS+(2*Track.RADIUS-0.1)*i ) );
			this.allTracks[i].threejs.visible = i<3;
			this.allTracks[i].size = 1/SC;
		}
		
//		this.pointerMovement = 0;
		this.pointerDownTime = Date.now();
		this.direction = 0;
		
		this.switcher = new Switcher;

		orb.enabled = false;
		suica.lookAt( [0,6,0.01] );
		suica.controls.update();
//		orb.enabled = true;
		
		if( this.inVRMode )
		{
			this.vrDist = 6;
			
			suica.vrCamera.updateMatrixWorld(true);

			this.allTracks.forEach( e => this.intersectables.push( e.threejs ) );
			this.intersectables.push( this.switcher.threejs );

		}
				
	} // Playground.constructor

	

	// starts a new game by selecting new tracks and new balls' speeds
	newGame( )
	{
		super.newGame( );

		// direction of balls
		this.direction = random( [-1, 1] );
		
		// number of tracks
		var n;
		if( this.difficulty < 70 )
			n = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 0, 70, 2, Playground.N ));
		else
			n = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 70, 100, Playground.N, 4 ));
		n = THREE.MathUtils.clamp( n, 3, Playground.N );

		// prepare this.tracks to contain only active tracks
		this.tracks = [];
		for( let i=0; i<Playground.N; i++ )
			if( i < n )
			{
				this.allTracks[i].threejs.visible = true;
				this.tracks.push( this.allTracks[i] );
				this.allTracks[i].size = 1/SC;
			}
			else
			{
				this.allTracks[i].threejs.visible = false;
				this.allTracks[i].size = 0;
			}
		
		// pick speeds based on difficulty
		var speedGap = this.configRange( 0.25, 0.2/n ),
			speed = this.configRange( 0.1, 0.5 );

		// generate shuffled array of speeds
		var speeds = [];
		for( var i=0; i<n; i++ )
		{
			speeds.push( speed );
			speeds.sort( ()=>random(-10,10) );
			
			speed += speedGap;
		}

		// configure tracks
		for( var track of this.tracks )
		{
			track.speed = speeds.pop();
			track.pos = random( 0, 360 );
			
			track.direction = 1;

			track.ballLight.position.y = 0.2;

			var verticalAngle = 0;
			
			if( this.difficulty > 95 )
				verticalAngle = random( -90, 90 );//[-90, -45, 0, 45, 90] );
			else
			if( this.difficulty > 85 )
				verticalAngle = random( -40, 40 );//[-40, -20, 0, 20, 40] );
			else
			if( this.difficulty > 70 )
				verticalAngle = random( -20, 20 );//[-20, -10, 0, 10, 20] );
				
			new TWEEN.Tween( track )
				.to( {	spinV: verticalAngle,
						spinH: random( [-180, -135, -90, -45, 0, 45, 90, 135, 180] ),
						spinT: random( [-180, -135, -90, -45, 0, 45, 90, 135, 180] )
					}, Playground.FLIP_SPEED )
				.easing( TWEEN.Easing.Elastic.Out )
				.start( );

			new TWEEN.Tween( track.ball )
				.to( {size:1}, Playground.BALL_SHOW_SPEED )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.start( );
		}

		if( this.difficulty>25 && this.difficulty<35 ) random(this.tracks).direction = -1;
		if( this.difficulty>50 && this.difficulty<60 ) random(this.tracks).direction = -1;

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
		var points = this.maxPoints( );

		var speeds = [];
		for( let track of this.tracks )
		{
			speeds.push( track.speed );
		}
		speeds.sort();

		var score = 0;

		// each correct answers = +50%,
		// each next to correct = +10..30% (depending on difficulty)
		for( let track of this.tracks )
			if( track.selected )
			{
				var idx = speeds.indexOf( track.speed );
				if( idx==0 || idx==speeds.length-1 )
					score += 0.5
				else
				if( idx==1 || idx==speeds.length-2 )
					score += this.configRange( 0.1, 0.3 );
			}
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
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.05 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.1, 1, true, false );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	update( t, dT )
	{

		orb.enabled = playground.inVR == false;
		orb.minPolarAngle = -1.57;
		orb.maxPolarAngle = 1.57;
			
		this.updateCameraLight();
		
		for( var track of this.tracks )
		{
			track.moveBall( this.direction*track.direction*dT );
		}
	}
	
} // class Playground
