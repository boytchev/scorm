//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static START_SPEED = 1500;
	static POINTER_MOVEMENT = 5;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Euler grill',
				bg: 'Грил на Ойлер',
				jp: 'オイラーグリル'},
		] );
		
		this.spinner = new Spinner;
		this.slider = new Slider;
		this.base = new Base;

		this.dragPlane = new THREE.Mesh(
			new THREE.PlaneGeometry( 1000, 1000 ).rotateX( -Math.PI/2 ),
			new THREE.MeshBasicMaterial({ color: 'Crimson', transparent: true, opacity: 0.3 })
		);
		this.dragPlane.position.y = -14;
		this.dragPlane.visible = false;
		suica.scene.add( this.dragPlane );
		
		this.pointerMovement = 0;
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		Spinner.SPEED = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 10, 40 ); 
		
		new TWEEN.Tween( this.spinner )
			.to( {state:1}, Playground.START_SPEED )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );

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
		//this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		//this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		//this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	update( t, dT )
	{
		this.spinner.update( t, dT );
		this.base.update( );
//		this.slider.x = Base.GROOVE_SIZE[0]/2*Math.sin(t);
	}
	
	
	
	// the slider is being dragged, this sends a ray from view point
	// to horizontal plane where the slider is, from coordinates of
	// intersection finds the new position of the slider
	dragX( event )
	{		
		// sets this.raycastPointer
		suica.findPosition( event );

		// cast a ray and find intersection with all objects
		suica.raycaster.setFromCamera( suica.raycastPointer, suica.camera );
		
		var intersects = suica.raycaster.intersectObject( this.dragPlane );

		if( intersects.length )
			return intersects[0].point.x;
		else
			return 0;
	}
	
	

} // class Playground
