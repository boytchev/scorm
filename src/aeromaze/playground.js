//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTS_SPEED = 2000;
	static POINTER_USED = false;
	static NEW_ATTEMPTS = 2;
	
	constructor( )
	{
		super( );
		
		this.pointerMovement = 0;
		this.addLightsAndShadows( );

		this.attempts = 0;
		
		this.planets = [
			new Planet( 1 ),
			new Planet( 3 ),
			new Planet( 5 ),
			new Planet( 7 ),
			new Planet( 9 )
		]
		this.planet = this.planets[0];
		this.planet.visible = true;

		this.maze = new Maze( this.planet );
		this.spaceship = new Spaceship( );
		
		this.platformA = new Platform( this.planet ); // from platform
		this.platformB = new Platform( this.planet ); // to platform
	
		// add the platforms and ships to the planet so they are scaled automatically
		this.maze.add( this.platformA, this.platformB, this.spaceship );
		this.maze.threejs.castShadow = true;

		orb.addEventListener( 'start', () => Playground.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Playground.POINTER_USED=false );

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

		this.attempts += Playground.NEW_ATTEMPTS;
		
		// config
		var planetSize = Math.round(THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 0, this.planets.length-1 )),
			midPointsCount = Math.round(THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 0, 5 )),
			randomRoutesCount = Math.round(THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 0, 10 ));
		
		this.planet.visible = false;
		this.planet = this.planets[ planetSize ];
		this.planet.visible = true;
		
		this.maze.update( this.planet );
		this.platformA.update( this.planet );
		this.platformB.update( this.planet );

		
		// platforms
		var sides = [0,1,2,3,4,5].sort( ()=>Math.random()-0.5 );
		this.platformA.randomize( this.planet, sides[0] );
		this.platformB.randomize( this.planet, sides[1] );

		element( 'button_start' ).style.display = 'block';
		element( 'counter_start' ).innerHTML = this.attempts;
		element( 'counter_start' ).style.display = this.attempts>1 ? 'block' : 'none';
		

		this.spaceship.goToPlatformA( );
		
		this.maze.regenerate( midPointsCount, randomRoutesCount );
		

		//this.spaceship.fly( 'FFUFDFF' );
		

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// no more attemps, game must end now
		if( this.attempts == 0 )
			return true;
		
		// if the spaceship is not at platform B
		// then this is not the end of the game
		if( this.spaceship.x == this.platformB.x &&
			this.spaceship.y == this.platformB.y &&
			this.spaceship.z == this.platformB.z ) return true;
		
		return false;
		
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

		this.platformA.visible = false;
		this.platformB.visible = false;
		
		this.spaceship.ring.style.display = 'none';
		this.spaceship.goToCenter( );
		
		// hide all points and lines
		this.maze.clearPoints( );
		this.maze.clearLines( );
		

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
		
		this.spaceship.update( t, dT );

		
//		if( this.spaceship ) this.spaceship.up(t,dT);//spinH = 250*t;
//		if( this.spaceshipA ) this.spaceshipA.up(t,dT);//spinH = 250*t;
		//this.spaceship.y = 0.07*Math.sin( 2*t )+0.07*Math.sin( 1.3*t );
	}
} // class Playground
