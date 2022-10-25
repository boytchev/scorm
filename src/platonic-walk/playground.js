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

		this.solids = [];
		for( var i=0; i<5; i++ )
			this.solids.push( new Platonic( i ) );
		
		this.solid = this.solids[4];
		this.solid.visible = true;
		
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
					child.material.emissive = new THREE.Color( 'white' );
					child.material.emissiveIntensity = 0.2;
				}
			} );				
			
			object.rotation.set( -Math.PI/2, 0, 0 );
			object.scale.set( 0.05, 0.05, 0.05 );
			parent.add( object );
			
			// анимация
			parent.animator = new THREE.AnimationMixer( object );
			parent.animator.clipAction( object.animations[0] ).play();
			parent.matrixAutoUpdate = false;

that.moveModelToSpot(49);
		}
	} // Playground.loadModel
	
	
	
	// move the model to spot n and make it
	// it stand on the sirface of the plate
	moveModelToSpot( n )
	{
		var plateIdx = this.solid.spotPlate[ n ],
			plate = this.solid.plates[ plateIdx ];
console.log('plateidx',plateIdx);
console.log('spot pos',this.solid.spots[n]);
			
console.log(this.solid.size);			
		// get position from the spot, but orientation from the plate
		this.model.matrix.copy( plate.threejs.matrix );
		this.model.matrix.setPosition( new THREE.Vector3( ...this.solid.spots[n] ).multiplyScalar(this.solid.size) );
	}
	
	
	
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
