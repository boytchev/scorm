//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		super( );
		
		this.addLightsAndShadows( );

		this.planet = new Planet( );
		this.maze = new Maze( );
		
		this.spaceship = new Spaceship( );
//		this.spaceshipA = new Spaceship( );
		
		this.platformA = new Platform( ); // from platform
		this.platformB = new Platform( ); // to platform
	
		// add the platforms and ships to the planet so they are scaled automatically
		this.maze.add( this.platformA, this.platformB, this.spaceship );
		//, this.spaceshipA );
//		this.maze.threejs.castShadow = true;
			
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Aeromaze',
				bg: 'Аеролабиринт',
				jp: 'エアロ迷路'},
		] );
		
	} // Playground.constructor

	


	// add support for lights and shadows
	addLightsAndShadows( )
	{
		// allow shadows
		suica0.renderer.shadowMap.enabled = true;
		suica0.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		function addLight( x, y, z )
		{
			var light = new THREE.DirectionalLight( 'white', 0.2 );
				light.position.set( x, y, z );
				light.castShadow = true;

				light.shadow.mapSize.width = 512;
				light.shadow.mapSize.height = 512;
				light.shadow.camera.left = -10;//-Planet.SIZE*Planet.SCALE;
				light.shadow.camera.right = 10;//Planet.SIZE*Planet.SCALE;
				light.shadow.camera.bottom = -10;//-Planet.SIZE*Planet.SCALE;
				light.shadow.camera.top = 10;//Planet.SIZE*Planet.SCALE;
				light.shadow.camera.near = 20;
				light.shadow.camera.far = 100;

			suica0.scene.add( light );
			
			// var helper = new THREE.DirectionalLightHelper( light, 2, 'black' );
			// suica0.scene.add( helper );
		}
		
		// define 6 lights from 6 directions
		// all light flow towards (0,0,0)
		addLight(  40, 0, 0 );
		addLight( -40, 0, 0 );
		
		addLight( 0,  40, 0 );
		addLight( 0, -40, 0 );
		
		addLight( 0, 0,  40 );
		addLight( 0, 0, -40 );
	} // Playground.addLightsAndShadows
	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		// platforms
		var sides = [0,1,2,3,4,5].sort( ()=>Math.random()-0.5 );
		this.platformA.randomize( sides[0] );
		this.platformB.randomize( sides[1] );


		this.spaceship.show( );
		
		// this.spaceshipA.center = this.platformB.gridPos;
		// this.spaceshipA.spin = this.platformB.spin;

		// this.spaceship.fly(  'UFF' );
		// this.spaceshipA.fly( 'DFFUFUFFFFUAAFLL' );
		

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
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	
		
		
		
	// update the playground
	update( t, dT )
	{
		// ...
		
		this.spaceship.updateRing( );
		
//		if( this.spaceship ) this.spaceship.up(t,dT);//spinH = 250*t;
//		if( this.spaceshipA ) this.spaceshipA.up(t,dT);//spinH = 250*t;
		//this.spaceship.y = 0.07*Math.sin( 2*t )+0.07*Math.sin( 1.3*t );
	}
} // class Playground
