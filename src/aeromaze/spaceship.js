//
//	class Spaceship
	


class Spaceship extends Group
{
	static TURN_SPEED = 300;
	static MOVE_SPEED = 500;
	
	constructor( modelName = 'craft_speederA' )
	{
		super( suica );

		this.model = model( 'models/' + modelName + '.glb' );
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

		this.model.addEventListener( 'load', obj=>traverse(obj.threejs) );

		this.add( this.model );
		
	} // Spaceship.constructor



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
	
	
	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
			playground.newGame( 0 );
	} // Spaceship.onClick
	
		
} // class Spaceship
