//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static START_SPEED = 800;
	static END_SPEED = 500;
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
		this.button = new Button;

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

		this.clickSound?.play();

		this.spinner.deactivate( );
		
		Spinner.SPEED = random([-1,1]) * THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 0, 50 ); 
		
		var tunnels = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 1, 8 ) - random([0,1]) ),
			n = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 6, 12 ) );
//console.log('tunnels',tunnels,'n',n);

		// 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
		// e e m m m d d
		// e=easy m=medium h=hard
		this.spinner.box.T = {x: 0, y:0, z:0};
		for( var i=0; i<tunnels; i++ )
			this.spinner.box.T[random(['x','y','z'])]++;
		
		this.spinner.box.N = n; //numbed of grid units

		this.spinner.box.regenerateBox( );

		new TWEEN.Tween( this.spinner )
			.to( {state:1}, Playground.START_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		return true;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 ),
			maxError = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 6, 4 );
			
		var box = playground.spinner.box,
			error = Math.abs( THREE.MathUtils.clamp( box.F-box.E+box.V, -6, 6 ) - playground.slider.euler);
		
		var score = THREE.MathUtils.mapLinear( error, 0, maxError, 1, 0 );
			score = THREE.MathUtils.clamp( score, 0, 1 );
		
//console.log('score',score,'error',error);

		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		this.clackSound?.play();

		this.spinner.activate( );
		
		// based on TWEEN.Easing.Elastic.Out
		function myElasticOut( amount )
		{
			if( amount === 0 ) return 0;
			if( amount === 1 ) return 1;
			return Math.pow(2, -2-10 * amount) * Math.sin((amount - 0.1) * 6 * Math.PI) + 1;
		}
		
		new TWEEN.Tween( this.spinner )
			.to( {state:0}, Playground.END_SPEED )
			.easing( myElasticOut )
			.start( );

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
		this.slideOnSound = new PlaygroundAudio( 'sounds/slide-on.mp3', 0.08, 8 );
		this.slideOffSound = new PlaygroundAudio( 'sounds/slide-off.mp3', 0.12 );
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound, this.slideOnSound, this.slideOffSound );
		this.soundMelody.push( this.backgroundMelody );
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
