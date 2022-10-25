//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTER_USED = false;
	
	constructor( )
	{
		super( );
		
		this.pointerMovement = 0;
		this.solid = null;
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Platonic walk',
				bg: 'Платонична разходка',
				jp: 'プラトニックな散歩------'},
		] );
		
		orb.addEventListener( 'start', () => Playground.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Playground.POINTER_USED=false );

		//this.solid = new Platonic( 0 );
		//this.solid = new Platonic( 1 );
		//this.solid = new Platonic( 2 );
		//this.solid = new Platonic( 3 );
		this.solid = new Platonic( 4 );
		
		this.model = new THREE.Group();
		suica.scene.add( this.model );
		this.loadModel( this.model, 'Look Around Claire.fbx' );
		
			
			
	} // Playground.constructor

	

	// loads Mixamo model (character & animation )
	loadModel( parent, name )
	{
		var that = this;
		var loader = new THREE.FBXLoader( );
			loader.load( 'models/'+name, objectLoaded );
				
		function objectLoaded( object )
		{
			// маха лъскавината, слага сенки, включва гама корекция
			object.traverse( function ( child )
			{
				if( child.material )
				{
					//encoding = sRGBEncoding
					//child.material.map.encoding = THREE.sRGBEncoding;
					//console.log(child.material);
					//console.log(child.material.color)
					child.material.emissive = new THREE.Color( 'white' );
					child.material.emissiveIntensity = 0.2;
//					child.material.color.setRGB(1.5,1.5,1.5);
				}
			} );				
			
			object.scale.set( 0.15, 0.15, 0.15 );
			parent.add( object );
			
			// анимация
			parent.animator = new THREE.AnimationMixer( object );
			parent.animator.clipAction( object.animations[0] ).play();
		}
	} // Playground.loadModel
	
	
	
	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		// pick a random slot

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
		if( this.model.animator ) this.model.animator.update( dT );
	}
} // class Playground
