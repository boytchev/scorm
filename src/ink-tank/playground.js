//
//	class Playground( )
//

	
var SC = 5;

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FILL_SPEED = 0.2;
	static DRAIN_SPEED = 0.6;

	static PLATE_HIT_SPEED = 100;
	static PLATE_FALL_SPEED = 900;
	
	static MARKER_SIZE = 0.05;
	
	constructor( )
	{
		super( Playground.MARKER_SIZE );
		
		this.resize( );

		this.tank = new Tank( );
		this.light.intensity = 3;
		
		this.translate( [
			{id: 'txt-caption',
				en: 'Ink tank',
				bg: 'Мастилен резервоар',
				jp: 'インクタンク'},
		] );

		lookAt( [0,0,-2*Tank.WIDTH], [0,0,0], [0,1,0] );
		
		suica.controls.update();
		
		if( this.inVRMode )
		{
			orb.enabled = false;
			orb.minPolarAngle = -0.5;
			orb.maxPolarAngle = 1.3;
			
			this.vrDist = 2*Tank.WIDTH;
			
			suica.vrCamera.updateMatrixWorld(true);

			this.intersectables.push(
				this.tank.water.plate.threejs,
				this.tank.cyanPipe.wrapperPipe.threejs,
				this.tank.cyanPipe.wrapperValve.threejs,
				this.tank.magentaPipe.wrapperPipe.threejs,
				this.tank.magentaPipe.wrapperValve.threejs,
				this.tank.yellowPipe.wrapperPipe.threejs,
				this.tank.yellowPipe.wrapperValve.threejs,
			);

		}
/*		
		// create possible variations of inks
		this.inkVariations = [];
		for( var i=0; i<=10; i++ )
			this.inkVariations[i] = [];
		
		for( var cyan = 0; cyan < 8; cyan++ )
		for( var magenta = 0; magenta < 8; magenta++ )
		for( var yellow = 0; yellow < 8; yellow++ )
			if( magenta>cyan && magenta>yellow )
		{
			if( (cyan%2)+(magenta%2)+(yellow%2) == 0 ) continue;
			if( (cyan%3)+(magenta%3)+(yellow%3) == 0 ) continue;
			if( (cyan%5)+(magenta%5)+(yellow%5) == 0 ) continue;
			if( (cyan%7)+(magenta%7)+(yellow%7) == 0 ) continue;

			var max = Math.max( cyan, magenta, yellow );
			var level = max-2;
			
			if( cyan > 0 ) level++;
			if( magenta > 0 ) level++;
			if( yellow > 0 ) level++;

			var color = [cyan/max, magenta/max, yellow/max];
			this.inkVariations[level].push( color );
			
			if( level == 0 ) this.inkVariations[1].push( color );
			if( level == 8 ) this.inkVariations[9].push( color );
			if( level == 8 ) this.inkVariations[10].push( color );
		}

		this.lastcCmy = null;
console.log(this.inkVariations);
*/

	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		this.clickSound?.play();
		
		super.newGame( );

		this.tank.water.clearWater( );
/*
		var level = THREE.MathUtils.clamp(Math.round(this.difficulty/10),0,10),
			cmy = random( this.inkVariations[level] );
		
		if( cmy==this.lastCmy ) cmy = random( this.inkVariations[level] );
		if( cmy==this.lastCmy ) cmy = random( this.inkVariations[level] );

		this.lastcCmy = cmy;
*/		
		var c = Math.random(),
			m = Math.random(),
			y = Math.random(),
			max = Math.max( c, m, y );

		new TWEEN.Tween( this.tank.water.plate )
			.to( {y:this.tank.water.plate.y+2/SC}, Playground.PLATE_HIT_SPEED )
			.easing( TWEEN.Easing.Quartic.Out )
			.chain( 
				new TWEEN.Tween( this.tank.water.plate )
					.to( {y:this.tank.water.plate.y}, Playground.PLATE_FALL_SPEED )
					.easing( TWEEN.Easing.Bounce.Out )
			).start( );
		
		var colorA = rgb( ...playground.tank.water.plateColor.color );
		var colorB = rgb(
							255 - 255*c/max,
							255 - 255*m/max,
							255 - 255*y/max
						);
		var target = playground.tank.water.plateColor;
		new TWEEN.Tween( colorA )
			.to( colorB, Playground.PLATE_FALL_SPEED )
			.onUpdate( color => target.color = color )
			.delay( Playground.PLATE_HIT_SPEED )
			.start( );
		
	} // Playground.newGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = this.configRange( 30, 100, 1/2 );
		var granularity  = Math.round(this.configRange( 4, 8 ));
		
		var water = this.tank.water,
			max = Math.max( water.cyan, water.magenta, water.yellow );
			if( max==0 ) max = 1;
		
		var userC = /*Math.round*/(granularity*water.cyan/max),
			userM = /*Math.round*/(granularity*water.magenta/max),
			userY = /*Math.round*/(granularity*water.yellow/max);
		
		var goalC = /*Math.round*/(granularity*(1-water.plateColor.color[0])),
			goalM = /*Math.round*/(granularity*(1-water.plateColor.color[1])),
			goalY = /*Math.round*/(granularity*(1-water.plateColor.color[2]));
		
		var error = Math.hypot( userC-goalC, userM-goalM, userY-goalY );

		var score = THREE.MathUtils.mapLinear( error, 1, 2, 1, 0 );
			score = THREE.MathUtils.clamp( score, 0, 1 );
console.log('--------------------')
console.log('user',userC,userM,userY)
console.log('goal',goalC,goalM,goalY)
console.log('granularity',granularity,'-> error',error)
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		this.clackSound.play();
		
		super.endGame( );
		
		this.tank.water.drainAll( );
		
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
		this.boomSound = new PlaygroundAudio( 'sounds/boom.mp3', 0.2 );
		this.bubblesSound = new PlaygroundAudio( 'sounds/bubbles.mp3', 0, 1,  true );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true, false );
		
		this.soundEffects.push( this.clickSound, this.clackSound, this.boomSound, this.bubblesSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	// floating plate
	update( t, dT )
	{
		this.updateCameraLight();

		if( playground.gameStarted )
		{
			var aperture = Math.max( this.tank.cyanPipe.aperture, this.tank.magentaPipe.aperture, this.tank.yellowPipe.aperture );
			if( aperture > 0 )
			{
				if( this.bubblesSound )
				{
					this.bubblesSound.setVolume( 0.3*aperture );
				}
				
				var k = 3-2*this.tank.water.level;
				
				this.tank.water.addInk( 'cyan', k*Math.pow(this.tank.cyanPipe.aperture,1)*dT*Playground.FILL_SPEED );
				this.tank.water.addInk( 'magenta', k*Math.pow(this.tank.magentaPipe.aperture,1)*dT*Playground.FILL_SPEED );
				this.tank.water.addInk( 'yellow', k*Math.pow(this.tank.yellowPipe.aperture,1)*dT*Playground.FILL_SPEED );
			}
		}
		else
		{
			this.tank.water.colorize( t );
		}
		
		this.tank.water.waves( t );
			
	}
} // class Playground
