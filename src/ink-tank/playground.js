//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FILL_SPEED = 0.4;
	static DRAIN_SPEED = 0.6;

	static PLATE_HIT_SPEED = 100;
	static PLATE_FALL_SPEED = 900;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.tank = new Tank;

		this.translate( [
			{id: 'txt-caption',
				en: 'Ink tank',
				bg: 'Мастилен резервоар',
				jp: 'インクタンク'},
		] );
		

		// create possible variations of inks
		const STEPS = [60,30,20,15,12,10,6,5,4,3];
		const MAX = STEPS[0];
		
		var hashTable = [];
		
//.//		this.inkVariations = {};
		this.inkVariations = [];
		this.inkCounts = [];
		
		for( var step of STEPS )
		{
//.//			this.inkVariations[step] = [];
			
			var count = MAX/step;
			
			for( var cyan = 0; cyan<=count; cyan++ ) 
			for( var magenta = 0; magenta<=count-cyan; magenta++ )
			{
				var yellow = count-cyan-magenta;
				
				var hash = `${cyan*step},${magenta*step},${yellow*step}`;
				
				if( hashTable.indexOf(hash)==-1 )
				{
					hashTable.push( hash );
//.//					this.inkVariations[step].push( hash.split(',') );
					this.inkVariations.push( hash.split(',') );
				}
			}			
			this.inkCounts.push( this.inkVariations.length );
		}


	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.tank.water.clearWater( );

		// invent new color
		// inkVariations[] contains many colours, in groups with increasing difficulty
		// inkCounts[] marks the end of each group, pick a random color from the
		// beginning of inkVariations[] till the end of a group dependent on
		// difficulty
		var countIdx = Math.min( Math.round(this.difficulty/10), this.inkCounts.length-1 ),
			cmy = random( this.inkVariations.slice(0,this.inkCounts[ countIdx ]) ),
			max = Math.max( cmy[0], cmy[1], cmy[2] );

		
		new TWEEN.Tween( this.tank.water.plate )
			.to( {y:this.tank.water.plate.y+2}, Playground.PLATE_HIT_SPEED )
			.easing( TWEEN.Easing.Quartic.Out )
			.chain( 
				new TWEEN.Tween( this.tank.water.plate )
					.to( {y:this.tank.water.plate.y}, Playground.PLATE_FALL_SPEED )
					.easing( TWEEN.Easing.Bounce.Out )
			).start( );
		
		var colorA = rgb( ...playground.tank.water.plateColor.color );
		var colorB = rgb(
							255 - 255*cmy[0]/max,
							255 - 255*cmy[1]/max,
							255 - 255*cmy[2]/max
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
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		var granularity  = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 3, 16 );
		
		var water = this.tank.water,
			max = Math.max( water.cyan, water.magenta, water.yellow );
		
		var userC = Math.round(granularity*water.cyan/max),
			userM = Math.round(granularity*water.magenta/max),
			userY = Math.round(granularity*water.yellow/max);
		
		var goalC = Math.round(granularity*(1-water.plateColor.color[0])),
			goalM = Math.round(granularity*(1-water.plateColor.color[1])),
			goalY = Math.round(granularity*(1-water.plateColor.color[2]));
		
		var error = Math.pow(
				Math.pow(userC-goalC,2)+
				Math.pow(userM-goalM,2)+
				Math.pow(userY-goalY,2),
				0.5
			);

		var score = THREE.MathUtils.mapLinear( error, 1, granularity, 1, 0 );
			score = THREE.MathUtils.clamp( score, 0, 1 );
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
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
		//this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		//this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		this.drainSound = new PlaygroundAudio( 'sounds/drain.mp3', 0.2 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/bubbles.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.drainSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	// floating plate
	update( t, dT )
	{
		if( playground.gameStarted )
		{
			this.tank.water.addInk( 'cyan', Math.pow(this.tank.cyanPipe.aperture,2)*dT*Playground.FILL_SPEED );
			this.tank.water.addInk( 'magenta', Math.pow(this.tank.magentaPipe.aperture,2)*dT*Playground.FILL_SPEED );
			this.tank.water.addInk( 'yellow', Math.pow(this.tank.yellowPipe.aperture,2)*dT*Playground.FILL_SPEED );
			this.tank.water.drain( Math.pow(this.tank.drainPipe.aperture,2)*dT*Playground.DRAIN_SPEED );
		}
		else
			this.tank.water.colorize( t );

		this.tank.water.waves( t );
			
	}
} // class Playground
