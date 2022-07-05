//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static FILL_SPEED = 0.2;
	static DRAIN_SPEED = 0.5;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.tank = new Tank;
		
// this.tank.water.addCyan( 0.25 );
// this.tank.water.addYellow( 0.25 );
// this.tank.water.addMagenta( 0.25 );

// setTimeout( ()=> playground.tank.water.drain(), 500 );

		this.translate( [
			{id: 'txt-caption',
				en: 'Ink tank',
				bg: 'Мастилен резервоар',
				jp: 'インクタンク'},
		] );
		

		// create possible variations of inks
		const STEPS = [60,30,20,15,12,10,6,5,4];
		const MAX = STEPS[0];
		
		var hashTable = [];
		
		this.inkVariations = {};
		
		for( var step of STEPS )
		{
			this.inkVariations[step] = [];
			
			var count = MAX/step;
			
			for( var cyan = 0; cyan<=count; cyan++ ) 
			for( var magenta = 0; magenta<=count-cyan; magenta++ )
			{
				var yellow = count-cyan-magenta;
				
				var hash = `${cyan*step},${magenta*step},${yellow*step}`;
				
				if( hashTable.indexOf(hash)==-1 )
				{
					hashTable.push( hash );
					this.inkVariations[step].push( hash.split(',') );
				}
			}			
		}
		console.log(this.inkVariations);


	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.tank.water.clearWater( );
		this.tank.cyanPipe.show( );
		this.tank.magentaPipe.show( );
		this.tank.yellowPipe.show( );
		this.tank.drainPipe.show( );

		// invent new color
		var cmy;
		
		if( this.difficulty<20 )
			cmy = random( this.inkVariations[60].concat(this.inkVariations[30]) );
		else
		if( this.difficulty<35 )
			cmy = random( this.inkVariations[20] );
		else
		if( this.difficulty<50 )
			cmy = random( this.inkVariations[15] );
		else
		if( this.difficulty<65 )
			cmy = random( this.inkVariations[12] );
		else
		if( this.difficulty<80 )
			cmy = random( this.inkVariations[10] );
		else
		if( this.difficulty<90 )
			cmy = random( this.inkVariations[6] );
		else
			cmy = random( this.inkVariations[5].concat(this.inkVariations[4]) );

		var max = Math.max( cmy[0], cmy[1], cmy[2] );
		
		this.tank.water.plateColor.color = rgb(
			255 - 255*cmy[0]/max,
			255 - 255*cmy[1]/max,
			255 - 255*cmy[2]/max
		)
		
		this.tank.water.plate.y = 20;
		new TWEEN.Tween( this.tank.water.plate )
			.to( {y:Tank.BASE_HEIGHT+Tank.PLATE_HEIGHT}, 100 )
			.easing( TWEEN.Easing.Quartic.In )
			.start( );
	} // Playground.newGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		
		var water = this.tank.water,
			max = Math.max( water.cyan, water.magenta, water.yellow );
		
		console.log(1-water.cyan/max,1-water.magenta/max,1-water.yellow/max);
		console.log(water.plateColor.color);
		
		var error =
				Math.abs(water.plateColor.color[0] - (1-water.cyan/max)) +
				Math.abs(water.plateColor.color[1] - (1-water.magenta/max)) +
				Math.abs(water.plateColor.color[2] - (1-water.yellow/max));

console.log('error',error);
		
		var score = THREE.MathUtils.mapLinear( error, 0, 0.25, 1, 0 );

console.log('score',score);

		score = Math.max( 0, score );
		
console.log('points',score * points);

		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
console.log('end game');
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
		if( !playground.gameStarted ) return;
		

		this.tank.water.addInk( 'cyan', Math.pow(this.tank.cyanPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.addInk( 'magenta', Math.pow(this.tank.magentaPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.addInk( 'yellow', Math.pow(this.tank.yellowPipe.aperture,2)*dT*Playground.FILL_SPEED );
		this.tank.water.drain( Math.pow(this.tank.drainPipe.aperture,2)*dT*Playground.DRAIN_SPEED );
/*		
		this.tank.cyanPipe.updateIndicator( );
		this.tank.magentaPipe.updateIndicator( );
		this.tank.yellowPipe.updateIndicator( );
*/		

		this.tank.water.waves( t );
	}
} // class Playground
