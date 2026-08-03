//
//	class Playground( )
//

var SC = 5;
	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static START_SPEED = 800;
	static END_SPEED = 500;
	//static POINTER_MOVEMENT = 5;
	static POINTER_TIME = 250; // milliseconds
	
	static MARKER_SIZE = 0.4;
	
	constructor( )
	{
		super( Playground.MARKER_SIZE );

		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Euler grill',
				bg: 'Грил на Ойлер',
				jp: 'オイラーグリル'},
		] );
		
		this.light.intensity = 3;
		
		this.spinner = new Spinner;
		this.slider = new Slider;
		this.base = new Base;
		this.button = new Button;

		this.dragPlane = new THREE.Mesh(
			new THREE.PlaneGeometry( 3*Base.SIZE[0]/SC, 3*Base.SIZE[2]/SC ).rotateX( -Math.PI/2 ),
			new THREE.MeshBasicMaterial({ color: 'Crimson', transparent: true, opacity: 0.3 })
		);
		this.dragPlane.position.y = -14/SC;
		this.dragPlane.visible = false;
		suica.scene.add( this.dragPlane );
		
		orb.enabled = false;
		suica.lookAt( [0,4,16] );
		suica.controls.update();
//		orb.enabled = true;

		if( this.inVRMode )
		{
			this.vrDist = 12;
			this.vrBeta = 1.4;
			
			suica.vrCamera.updateMatrixWorld(true);

			var v = new THREE.Vector3();
			v.setFromSphericalCoords( this.vrDist, this.vrBeta, this.vrAlpha );
			suica.viewPoint.from = [...v];
					
			//this.allTracks.forEach( e => this.intersectables.push( e.threejs ) );
			this.intersectables.push( this.slider.threejs );
			this.intersectables.push( this.button.threejs );
			this.intersectables.push( this.dragPlane );

		}

//		this.pointerMovement = 0;
		this.pointerDownTime = Date.now();
		
	} // Playground.constructor

	

	// starts a new game 
	newGame( )
	{
		super.newGame( );

		this.clickSound?.play();

		this.spinner.deactivate( );
		
		Spinner.SPEED = random([-1,1]) * this.configRange( 5, 50 ); 

		// tunnels
		var tunnels = this.configRangeInt( 1.7, 8 ) - random([0,1]);
		this.spinner.box.T = {x: 0, y:0, z:0};
		for( var i=0; i<tunnels; i++ )
			this.spinner.box.T[random(['x','y','z'])]++;
		
		//numbed of grid units
		this.spinner.box.N = this.configRangeInt( 6, 12 );

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
		var points = this.maxPoints( ),
			maxError = this.configRange( 6, 4 );
			
		var box = playground.spinner.box,
			error = Math.abs( THREE.MathUtils.clamp( box.F-box.E+box.V, -6, 6 ) - playground.slider.euler);
		
		var score = THREE.MathUtils.mapLinear( error, 0, maxError, 1, 0 );
			score = THREE.MathUtils.clamp( score, 0, 1 );

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
			
		new TWEEN.Tween( this.slider )
			.to( {x:0}, Slider.PARK_SPEED )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
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
		this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.1, 1, true, false );
		
		this.soundEffects.push( this.clickSound, this.clackSound, this.slideOnSound, this.slideOffSound );
		this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	update( t, dT )
	{
		this.spinner.update( t, dT );

		// this.vrBeta = 0.7+0.7*Math.sin(t);
			// var v = new THREE.Vector3();
			// v.setFromSphericalCoords( this.vrDist, this.vrBeta, this.vrAlpha );
			// suica.viewPoint.from = [...v];

		orb.enabled = playground.inVR == false;
		orb.minPolarAngle = -0.2;
		orb.maxPolarAngle = 1.57;
			
		this.updateCameraLight();
		
	}
	
	
	
	// the slider is being dragged, this sends a ray from view point
	// to horizontal plane where the slider is, from coordinates of
	// intersection finds the new position of the slider
	dragX( event )
	{		
			if( playground.inVR ) {
//				console.log('a>',event.controller.marker.threejs.position.x)
				if( event?.controller?.marker )
					return event.controller.marker.threejs.position.x;
				else
					return 0;
			}

//				console.log('bb-nonVR')
		// sets this.raycastPointer
		suica.findPosition( event );

		// cast a ray and find intersection with all objects
		suica.raycaster.setFromCamera( suica.raycastPointer, suica.camera );
		
		var intersects = suica.raycaster.intersectObject( this.dragPlane );

		if( intersects.length )
		{
//			console.log( intersects[0].point.x );
			return intersects[0].point.x;
		}
		else
		{
	//		console.log( 0 );
			return 0;
		}
	}
	
	
} // class Playground
