//
//	class Platform
	


class Platform extends Group
{
	static DISTANCE = Planet.PLATES/2+1;
	
	constructor( )
	{
		super( suica );

		this.model = model( 'models/platform_large.glb' );
			its.size = Planet.PLATFRORM_SCALE;
			its.x = -2*Planet.PLATFRORM_SCALE;
			its.y = 0;
			its.z = -1.5*Planet.PLATFRORM_SCALE;

		// function to recursively make model element cast shadow
		function traverse( obj )
		{
			obj.receiveShadow = true;
			for( var i=0; i<obj.children.length; i++ )
				traverse( obj.children[i] );
		}

		this.model.addEventListener( 'load', obj=>traverse(obj.threejs) );

		this.visible = false;

		this.add( this.model );
		
	} // Platform.constructor



	// set the platform on random position
	randomize( side )
	{
		// important:  x|0 truncates towards 0, so 3.9|0=3 and -3.0|0=-3
		var u = random( -Maze.GRID+0.01, Maze.GRID-0.01 ) | 0,
			v = random( -Maze.GRID+0.01, Maze.GRID-0.01 ) | 0,
			d = 1 + (Planet.PLATES>>1);
		
		switch( side )
		{
			case 0: // bottom
				this.spin = [0,0,0];
				this.center = [u, -Platform.DISTANCE, v];
				this.gridPos = [u, -d, v];
				break;
			case 1: // top
				this.spin = [0,180,0];
				this.center = [u, Platform.DISTANCE, v];
				this.gridPos = [u, d, v];
				break;
			case 2: // left
				this.spin = [90,90,90];
				this.x = -Platform.DISTANCE;
				this.center = [-Platform.DISTANCE, u, v];
				this.gridPos = [-d, u, v];
				break;
			case 3: // right
				this.spin = [90,-90,90];
				this.center = [Platform.DISTANCE, u, v];
				this.gridPos = [d, u, v];
				break;
			case 4: // front
				this.spin = [0,-90,0];
				this.center = [u, v, Platform.DISTANCE];
				this.gridPos = [u, v, d];
				break;
			case 5: // back
				this.spin = [0,90,0];
				this.center = [u, v, -Platform.DISTANCE];
				this.gridPos = [u, v, -d];
				break;
			default:
				throw 'Unknown side';
		}
		
		this.visible = true;
		
	} // Platform.randomize
	
	
	
	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
			playground.newGame( 0 );
	} // Platform.onClick
	
		
} // class Platform
