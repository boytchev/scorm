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
		for( var i=0; i<6; i++ )
			this.solids.push( new Platonic( i ) );
		
		this.model = new THREEJSModel();
		this.modelShell = prism( 6, [0,-THREEJSModel.HEIGHT,0], [2*THREEJSModel.SIZE,THREEJSModel.HEIGHT+9], 'crimson' );
		its.visible = false;


var img = drawing( 1024, 128, 'Black' );
fillText( 6, 40, 'Abcdefgh Ijklmno Pqrstuvwxyz', 'crimson', 'bold 60px Arial Black' );		
var img2 = drawing( 1024, 128, 'Black' );
fillText( 6, 40, 'Abcdefgh Ijklmno Pqrstuvwxyz', 'white', 'bold 60px Arial Black' );		

		this.route = [];
		this.routeRing = tube( [0,0,0], [[0,2,0,24.5], [0,1,0,25], [0,0,0,25.2], [0,-1,0,25], [0,-2,0,24.5]], 1, [10,120], 1, 'white' );
			//this.routeRing.threejs.material.transparent = true;
			//this.routeRing.threejs.material.opacity = 0.5;
			this.routeRing.threejs.material = new THREE.MeshPhysicalMaterial( {
				transparent: true,
				opacity: 1,
				clearcoat: 1,
				metalness: 0,
				roughness: 0,
				transmission: 0,
				thickness: 1,
				side: THREE.DoubleSide,
				map: new THREE.CanvasTexture( img.canvas ),
				alphaMap: new THREE.CanvasTexture( img2.canvas ),
				normalMap: ScormUtils.image( 'metal_plate_normal.jpg',1,80 ),
				envMap: ScormUtils.image( 'environment.jpg' ),
				envMapIntensity: 1,
			} );
			this.routeRing.threejs.renderOrder = -15;
			its.threejs.material.envMap.mapping = THREE.EquirectangularReflectionMapping; 
			its.threejs.material.map.repeat.set( 4, 1 ); 
			its.threejs.material.map.rotation = Math.PI/2; 
			its.threejs.material.map.offset.set( 0, 1 );
			its.threejs.material.map.wrapS = THREE.RepeatWrapping;
			its.threejs.material.map.wrapT = THREE.RepeatWrapping;			
		
		
		this.modelShell.addEventListener( 'click', this.onClickModel )
	} // Playground.constructor

	

	// clicking on the model while the game is not started
	// starts a new game
	onClickModel( )
	{
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT )
			return;

		if( !playground.gameStarted )
			playground.newGame( );
	} // Playground.onClickModel
	
	
	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.clickSound.play( );

		// remove model shell (because otherwise it will capture onclick events)
		this.modelShell.y = 1000;
		
		// pick solid index, spot index and route parameters
		var solidIdx = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 0, 4 ) ),
			spotIdx = Math.floor( random(0, this.solids[solidIdx].spots.length) ),
			routeLength = Math.round( THREE.MathUtils.mapLinear( this.difficulty**1.5, 10**1.5, 100**1.5, 2, 6 ) ),
			routeMax = THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 2, 5 );

		// generate descriptor of the route; forward > 0, backward < 0, twin between two numbers
		// [2,-2,3,0] means FFtBBtFFFt
		this.route = [];
		for( var i=0; i<=routeLength; i++ )
			this.route.push( Math.floor(routeMax * random(0,1)**0.5 ) * random([-1,1]) );

		// show selected solid
		this.solid = this.solids[solidIdx];
		this.solid.show( spotIdx );

		// move to a random slot
		this.model.moveToSpot( spotIdx );

		
		console.log('route',this.route);
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
		var score = 1;
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		this.clackSound.play( );
		
		this.solid.hide( );
		
		this.modelShell.y = -THREEJSModel.HEIGHT;
		
		this.model.moveToCenter( );
		
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
		this.model.update( t, dT );
	}
} // class Playground
