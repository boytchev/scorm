//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	
	constructor( )
	{
		super( );

		// light and shadow
		suica0.renderer.shadowMap.enabled = true;
		suica0.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		var light;
		
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( 0, 10, 0 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( 0, -10, 0 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( 0, 0, 10 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( 0, 0, -10 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( 10, 0, 0 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );
		light = new THREE.DirectionalLight( 'white', 0.2 );
		light.position.set( -10, 0, 0 ); //default; light shining from top
		light.castShadow = true; // default false
		suica0.scene.add( light );

		//Set up shadow properties for the light
		// light.shadow.mapSize.width = 512; // default
		// light.shadow.mapSize.height = 512; // default
		// light.shadow.camera.near = 0.1; // default
		// light.shadow.camera.far = 50; // default

		new Planet( );
		this.maze = new Maze();
		
		this.spaceship = group();
		its.x = 3.5;
		this.model = model( 'models/craft_speederA.glb' );
			its.x = -2;
			its.y = -0.25;
			its.z = -1.75;
		this.spaceship.add( this.model );
		
		this.model.addEventListener( 'load', function(obj){
			function traverse( threejsObj )
			{
				threejsObj.castShadow = true;
				for( var i=0; i<threejsObj.children.length; i++ )
					traverse( threejsObj.children[i] );
			}
			
			traverse( obj.threejs );
		} );
			
			
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Aeromaze',
				bg: 'Аеролабиринт',
				jp: 'エアロ迷路'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		// ...

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// ...
		return false;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		
		// ...
		
		return 0 * points;

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
		this.spaceship.spinH = 50*t;
		this.spaceship.y = 0.07*Math.sin( 2*t )+0.07*Math.sin( 1.3*t );
	}
} // class Playground
