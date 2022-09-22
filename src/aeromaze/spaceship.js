//
//	class Spaceship
	


class Spaceship extends Group
{
	static TURN_SPEED = 300;
	static MOVE_SPEED = 500;
	static GOTO_PLATFORM_SPEED = 1000;

	
	
	constructor( )
	{
		super( suica );

		this.ring = this.generateRing( );

		this.model = model( 'models/craft_speederA.glb' );
			its.size = Planet.SPACESHIP_SCALE;
			its.x = -2*Planet.SPACESHIP_SCALE;
			its.y = -0.25*Planet.SPACESHIP_SCALE;
			its.z = -1.5*Planet.SPACESHIP_SCALE;
			

		// function to recursively make model element cast shadow
		function traverse( obj )
		{
			obj.castShadow = true;
			for( var i=0; i<obj.children.length; i++ )
				traverse( obj.children[i] );
		}

		this.addEventListener( 'load', obj=>traverse(obj.threejs) );
		this.add( this.model );
	} // Spaceship.constructor



	// generate commands ring
	generateRing( )
	{
		// function setPos( label, angle, distScale = 1 )
		// {
			// var dist = 120*distScale,
				// dx = Math.round( dist*Math.cos(radians(angle)) ),
				// dy = Math.round( dist*Math.sin(radians(angle)) );
			// var elem = element( label );
			
			// console.log(elem,elem.clientWidth,elem.clientHeight)
			
			// elem.style.left = (-80/2+dx)+'px';
			// elem.style.top = (-80/2-dy)+'px';
		// }

		// setPos( 'lt', 180 );
		// setPos( 'rt', 0 );
		// setPos( 'up', 90 );
		// setPos( 'dn', 270 );
		// setPos( 'ac', 135 );
		// setPos( 'cw', 45 );
		// setPos( 'go1', -45 );
		// setPos( 'go2', -135 );

		function setPos( label, dx, dy )
		{
			var elem = element( label );
			
			elem.style.left = (-80/2+dx)+'px';
			elem.style.top = (-80/2+dy)+'px';
		}

		setPos( 'lt', -110,   0 );
		setPos( 'rt',  110,   0 );
		setPos( 'up',   0, -110 );
		setPos( 'dn',   0,  110 );
		setPos( 'ac', -80, -80 );
		setPos( 'cw',  80, -80 );
		setPos( 'fd', -80,  80 );
		setPos( 'st',  80,  80 );

		return element( 'ring' );
	} // Spaceship.generateRing
	
	
	
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
		
		return new TWEEN.Tween( {k:0, model:this.threejs} )
			.to( {k:1/*Planet.GRID_SCALE*/}, Spaceship.MOVE_SPEED )
			.easing( TWEEN.Easing.Linear.None )
			.onUpdate( function(obj){
				obj.model[method]( sign*(obj.k-lastK) );
				lastK = obj.k;
			} )
			.onComplete( function(obj){
				obj.model[method]( sign*(1/*Planet.GRID_SCALE*/-lastK) );
				// fix position
				// var px = Planet.GRID_SCALE * Math.round( obj.model.position.x/Planet.GRID_SCALE ),
					// py = Planet.GRID_SCALE * Math.round( obj.model.position.y/Planet.GRID_SCALE ),
					// pz = Planet.GRID_SCALE * Math.round( obj.model.position.z/Planet.GRID_SCALE );
				// obj.model.position.set( px, py, pz );
			} );
	}
	
	
	
	// perform fly commands
	fly( commands )
	{
		var firstTween = null,
			lastTween = null;
			
		for( var ch of commands )
		{
			var tween;
			
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
				case 'F': // fly
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
		
		firstTween?.start( );
	}
	
	
	
	// move the spaceship to platform A
	goToPlatformA( )
	{
		var that = this;
		
		new TWEEN.Tween( {center:this.center, spin:this.spin} )
			.to( {center:playground.platformA.gridPos, spin:playground.platformA.spin}, Spaceship.GOTO_PLATFORM_SPEED )
			.onUpdate( function( obj ) {
					that.center = obj.center;
					that.spin = obj.spin;
				} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	}
	
	
	
	// handles clicks on a plate (called from main HTML file)
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{	
	//console.log(this.ring.style.display);
			// toggle the ring
			if( this.ring.style.display=='block' )
				this.ring.style.display = 'none';
			else
				this.ring.style.display = 'block';
		}
		else
			playground.newGame( );
	} // Spaceship.onClick
	
		
	
	// moves the spaceship and/or its ring of buttons
	update( t, dT )
	{
		if( playground.gameStarted )
		{
			if( this.ring.style.display=='block' )
			{
				var pos = this.screenPosition( );

				this.ring.style.left = (pos[0]-this.ring.clientWidth/2)+'px';
				this.ring.style.top = (pos[1]-this.ring.clientHeight/2)+'px';
			}
		}
		else
		{
			// f(x) in [-180,180)
			function f(x) { x %= 360; return x>=180 ? x-360 : x; }
			this.spin = [ f(26.9*t), f(23.5*t), f(31.7*t)];
		}
		
	} // Spaceship.updateRing

	
} // class Spaceship


