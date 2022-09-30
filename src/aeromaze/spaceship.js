//
//	class Spaceship
	


class Spaceship extends Group
{
	static TURN_SPEED = 300;
	static MOVE_SPEED = 500;
	static END_GAME_SPEED = 1000;
	static GOTO_PLATFORM_SPEED = 1000;
	static GOTO_CENTER_SPEED = 1000;

	static SCALE = 1/2;
	
	constructor( )
	{
		super( suica );

		this.ring = this.generateRing( );

		this.flightCommands = '';
		
		this.model = model( 'models/craft_speederA.glb' );
			its.size = Spaceship.SCALE;
			its.x = -2*Spaceship.SCALE;
			its.y = -0.25*Spaceship.SCALE;
			its.z = -1.5*Spaceship.SCALE;
			
		// function to recursively make model element cast shadow
		function traverse( obj )
		{
			obj.castShadow = true;
			if( obj.material ) obj.material.color.multiplyScalar( 0.65 );
			
			for( var i=0; i<obj.children.length; i++ )
				traverse( obj.children[i] );
		}

		this.model.addEventListener( 'load', function(obj){traverse(obj.threejs);} );
		this.add( this.model );
	} // Spaceship.constructor



	// generate commands ring
	generateRing( )
	{
		var that = this;
		
		function setEventHandler( label, command )
		{
			element( label ).command = command;
			element( label ).addEventListener( 'click', that.command );
		}

		setEventHandler( 'button_up', 'U' );
		setEventHandler( 'button_down', 'D' );

		setEventHandler( 'button_left', 'L' );
		setEventHandler( 'button_right', 'R' );
		
		setEventHandler( 'button_roll_left', 'A' );
		setEventHandler( 'button_roll_right', 'C' );
		
		setEventHandler( 'button_forward', 'F' );
		setEventHandler( 'button_start', '!' );

		return element( 'ring' );
	} // Spaceship.generateRing
	
	
	
	// initialize buttons - visibility and position
	initButtons( commands )
	{
		const POS = {
			U: [  0, 80],
			D: [  0,-80],
			L: [-70, 40],
			R: [ 70, 40],
			A: [-70,-40],
			C: [ 70,-40],
			F: [  0,  0]
		};

		var lowestCommand = 'U';
		
		function setPos( label, command )
		{
			var style = element( label ).style;
			
			// find a place for the start button
			if( commands.indexOf(command) > -1 )
			{
				style.left = (-80/2+POS[command][0])+'px';
				style.top = (-80/2-POS[command][1])+'px';
				style.display = 'block';
			}
			else
			if( command == '!' )
			{
				style.left = (-80/2+POS[lowestCommand][0])+'px';
				style.top = (-80/2-POS[lowestCommand][1])+'px';
				style.display = 'block';
			}
			else
			{
				style.display = 'none';
				if( POS[command][1] <= POS[lowestCommand][1] )
					lowestCommand = command;
			}
		}

		setPos( 'button_up', 'U' );
		setPos( 'button_down', 'D' );

		setPos( 'button_left', 'L' );
		setPos( 'button_right', 'R' );
		
		setPos( 'button_roll_left', 'A' );
		setPos( 'button_roll_right', 'C' );
		
		setPos( 'button_forward', 'F' );
		setPos( 'button_start', '!' );

		element( 'counter_start' ).innerHTML = playground.attemptsHTML( );
	}
	
	// generate a tween for rotation around axis
	rotateTween( method, sign )
	{
		var lastK = 0;
		
		return new TWEEN.Tween( {k:0, model:this.threejs} )
			.to( {k:Math.PI/2}, Spaceship.TURN_SPEED )
			.easing( TWEEN.Easing.Linear.None )
			.onUpdate( function(obj){
				obj.model[method]( sign*(obj.k-lastK) );
				lastK = obj.k;
			} )
			.onComplete( function(obj){
				obj.model[method]( sign*(Math.PI/2-lastK) );
				// fix rotation angles
				var rx = Math.PI/2 * Math.round(obj.model.rotation.x/(Math.PI/2)),
					ry = Math.PI/2 * Math.round(obj.model.rotation.y/(Math.PI/2)),
					rz = Math.PI/2 * Math.round(obj.model.rotation.z/(Math.PI/2));
				obj.model.rotation.set( rx, ry, rz );
			} );
	}
	
	
	
	// generate a tween for translation along axes
	translateTween( method, sign )
	{
		var lastK = 0;
		
		return new TWEEN.Tween( {k:0, model:this.threejs, spaceship:this} )
			.to( {k:1/*Planet.GRID_SCALE*/}, Spaceship.MOVE_SPEED )
			.easing( TWEEN.Easing.Linear.None )
			.onUpdate( function(obj){
				obj.model[method]( sign*(obj.k-lastK) );
				if( !playground.maze.onTrack( obj.spaceship.center, 0.01 ) )
				{
					obj.spaceship.x = Math.round( obj.spaceship.x ) + random( -0.05, 0.05);
					obj.spaceship.y = Math.round( obj.spaceship.y ) + random( -0.05, 0.05);
					obj.spaceship.z = Math.round( obj.spaceship.z ) + random( -0.05, 0.05);
				}
				lastK = obj.k;
			} )
			.onComplete( function(obj){
				obj.model[method]( sign*(1/*Planet.GRID_SCALE*/-lastK) );

				obj.spaceship.x = Math.round( obj.spaceship.x );
				obj.spaceship.y = Math.round( obj.spaceship.y );
				obj.spaceship.z = Math.round( obj.spaceship.z );
			} );
	}
	
	
	
	// perform fly commands
	fly( )
	{
		
		playground.clackSound.play( );

		// hide the ring of buttons
		//this.ring.style.display = 'none';

		// reduce the number of left starts
		
		if( playground.attempts < 1 )
		{
			playground.attempts += playground.bonusAttempts;
			playground.bonusAttempts = 0;
			if( playground.attempts>1 )
			{
				playground.bonusAttempts = playground.attempts-1;
				playground.attempts = 1;
			}
		}
		
		playground.attempts--;
		
		if( playground.attempts < 1 )
		{
//			element( 'button_start' ).style.display = 'none';
		}
		element( 'counter_start' ).innerHTML = playground.attemptsHTML( );

		var tween,
			firstTween = null,
			lastTween = null;
			
		for( var ch of this.flightCommands )
		{
			
			switch( ch )
			{
				case 'U': //up
					tween = this.rotateTween( 'rotateX', 1 );
					break;
				case 'D': // down
					tween = this.rotateTween( 'rotateX', -1 );
					break;
				case 'L': // left
					tween = this.rotateTween( 'rotateY', 1 );
					break;
				case 'R': // right
					tween = this.rotateTween( 'rotateY', -1 );
					break;
				case 'A': // roll anticlockwise
					tween = this.rotateTween( 'rotateZ', 1 );
					break;
				case 'C': // roll clockwise
					tween = this.rotateTween( 'rotateZ', -1 );
					break;
				case 'F': // forward
					// go forward only if there is a line from to there
					tween = this.translateTween( 'translateZ', -1 );
					break;
				default:
					throw 'Unknown fly command'
			}
			
			if( lastTween )
			{
				lastTween.chain( tween );
				lastTween = tween;
			}
			else
			{
				firstTween = lastTween = tween;
			}
		}
		
		// create one empty tween, used only to detect
		// the end of the chain execution
		tween = new TWEEN.Tween( {} )
				.to( {}, 1 )
				.easing( TWEEN.Easing.Linear.None )
				.onComplete( function( )
					{
						if( playground.canEndGame() )
							playground.endGame() 
					} );
				
		lastTween.chain( tween );
		
		firstTween?.start( );
		this.flightCommands = '';
	}
	
	
	
	// adds a new command
	command( event )
	{
		//console.log('play');
		playground.buttonSound.play( );
		
		//console.dir( event.target );
		var spaceship = playground.spaceship,
			command = event.target.command;
			
		if( command == '!' )
		{
			if( spaceship.flightCommands.length > 0 )
				spaceship.fly( );
		}
		else
		{
			spaceship.flightCommands += command;
		}

	} // Spaceship.command
	
	
	
	// move the spaceship to platform A
	goToPlatformA( )
	{
		this.flightCommands = '';

		var that = this;
		
		new TWEEN.Tween( {center:this.center, spin:this.spin} )
			.to( {center:playground.platformA.center, spin:playground.platformA.spin}, Spaceship.GOTO_PLATFORM_SPEED )
			.onUpdate( function( obj ) {
					that.center = obj.center;
					that.spin = obj.spin;
				} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	}
	
	
	
	// move the spaceship to the center
	goToCenter( )
	{
		var that = this;
				
		new TWEEN.Tween( {center:this.center, spin:this.spin} )
			.to( {center:[0,0,0], spin:[0,0,0]}, Spaceship.GOTO_CENTER_SPEED )
			.onUpdate( function( obj ) {
					that.center = obj.center;
					//that.spin = obj.spin;
				} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	}
	
	
	
	// handles clicks on a plate (called from main HTML file)
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( !playground.gameStarted )
			playground.newGame( );
	} // Spaceship.onClick
	
		
	
	// moves the spaceship and/or its ring of buttons
	update( t, dT )
	{
		if( !playground.gameStarted )
		{
			// f(x) in [-180,180)
			function f(x) { x %= 360; return x>=180 ? x-360 : x; }
			this.spin = [ f(this.spinH+26.9*dT), f(this.spinV+23.5*dT), f(this.spinT+31.7*dT)];
		}
		
	} // Spaceship.updateRing

	
} // class Spaceship


