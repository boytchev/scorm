//
//	class Maze
	

class Maze extends Group
{
/*	static GRID = 2 + Planet.PLATES>>1;
	*/
	constructor( planet )
	{
		super( suica );

		this.points = [];	// list of vertices of the route
		this.lines = [];		// list of line segments of the route
		
		this.update( planet );

	} // Maze.constructor
	
		

	// update maze size & grid size depending on the planet
	update( planet )
	{
		this.GRID = 2 + planet.PLATES>>1;
		this.GRID2 = this.GRID ** 2;
		this.size = planet.GRID_SCALE;
	} // Maze.update
	
	
	
	// creates a direct route between two points
	// the route may have up to 3 segments - one
	// for each coordinate that is different
	addRoute( from, to )
	{
		// mangle order of coordintes
		var coords = [0,1,2].sort(()=>random(-1,1));

		for( var i=0; i<coords.length; i++ )
		{
			// if equal coordinates - exit
			if( from[i] == to[i] )
				continue;
			
			// find a corner point
			var corner = [...from];
				corner[i] = to[i];

			if( !this.allowed( corner ) )
				continue;
			
			// add a line
			this.lines.push( [from, corner] );
			
			// add points along the line
			var dist = corner[i]-from[i],
				step = Math.sign( dist ); // must be 1 or -1, never 0
				
			for( var t=0; t<Math.abs(dist); t++ )
			{
				var mid = [...from];
					mid[i] += step*t;
					
				this.points.push( mid );
			}
			
			// continue to the target
			return this.addRoute( corner, to );
		}
		
		this.points.push( to );
		
	} // Maze.addRoute
	
	
	
	// return the number of different coordinates
	// diff( a, b )
	// {
		// return (a[0]==b[0]?0:1) + (a[1]==b[1]?0:1) + (a[2]==b[2]?0:1);
	// } // Maze.diff
	
	

	// return the number of different coordinates
	// lerp( a, b )
	// {
		// const k = 0.96;
		
		// return [
			// a[0]*k + (1-k)*b[0],
			// a[1]*k + (1-k)*b[1],
			// a[2]*k + (1-k)*b[2]
		// ];
	// } // Maze.lerp
	
	

	// dump segments
	// dump( )
	// {
		// for( var i = 0; i<this.lines.length; i++ )
		// {
			// var a = this.lines[i][0],
				// b = this.lines[i][1];
				
			// console.log( `${i}.\t`, `[${a.join(',')}]-[${b.join(',')}]`, `len=${Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])}` );
		// }
	// }
	
	
	
	regenerate( midPointsCount = 0, randomRoutesCount = 0 )
	{
		var platformA = playground.platformA,
			platformB = playground.platformB;

		
		this.midPoints = [];
		this.lines = []; 
		
//		console.log('from',platformA.center);
		
		// pick midpoints and put them between platforms A and B
		//this.midPoints.push( platformA.center );
		
		var from = [...platformA.center],
			to = [...platformB.center];

		// create some middle points
		for( let i=0; i<midPointsCount; i++ )
		{
			var via = this.findVertex( this.points );
			
			this.addRoute( from, via );
			from = via;
		}
		this.addRoute( from, to );
		//this.points.push( to );

//		console.log('  to',platformB.center);
		
		// add random routes
		for( let i=0; i<randomRoutesCount; i++ )
		{
			from = random( this.points );
			to = this.findVertex( this.points );
			this.addRoute( from, to );
			//this.points.push( to );
		}

		for( var i = 0; i<this.lines.length; i++ )
		{
			this.add( line( 
				this.lines[i][0], this.lines[i][1]
				) );
		}
		
		for( var i = 0; i<this.points.length; i++ )
		{
			this.add( point( this.points[i], 2/playground.planet.SCALE ) );
		}
		
//		console.log( 'initial segments', this.lines.length );
//		this.dump( );

/*
		var vertices = [];
		var lines = [];

		function hash( x, y, z ) { return `${x},${y},${z}` }
		function dehash( str ) { return str.split(',') }
		
*/
	} // Maze.regenerate
	
	
	
	// pick a vertex that is not forbidden
	findVertex( forbidden )
	{
		while( true )
		{
			// get a random vert
			var x = Math.round( random( -this.GRID+1, this.GRID-1) );
			var y = Math.round( random( -this.GRID+1, this.GRID-1) );
			var z = Math.round( random( -this.GRID+1, this.GRID-1) );
			
			// if not legal, try again
			if( !this.allowed( [x,y,z] ) ) continue;
			
			// if it is on any of the forbidden, try again
			// for( var i=0; i<forbidden.length; i++ )
			// {
				// if( forbidden.x==x ||
					// forbidden.y==y ||
					// forbidden.z==z ) continue;
			// }

			// if it is between any two successive forbidden vertices, try again
			var fail = false;
			for( var i=0; i<forbidden.length-1; i++ )
			{
				var a = forbidden[i],
					b = forbidden[i+1];
					
				fail = a.x==b.x && a.x==x && a.y==b.y && a.y==y && Math.min(a.z,b.z)<=z && z<=Math.max(a.z,b.z);
				if( fail ) break;
					
				fail = a.x==b.x && a.x==x && a.z==b.z && a.z==z && Math.min(a.y,b.y)<=y && y<=Math.max(a.y,b.y);
				if( fail ) break;
					
				fail = a.y==b.y && a.y==y && a.z==b.z && a.z==z && Math.min(a.x,b.x)<=x && x<=Math.max(a.x,b.x);
				if( fail ) break;
			}
			if( fail ) continue;
				
			return [x, y, z];
		}
	}
	
	
	
	// return true if grid position [x,y,z] is theoretically allowed
	allowed( pos )
	{
		var x = pos[0] ** 2,
			y = pos[1] ** 2,
			z = pos[2] ** 2;
	
		if( x > this.GRID2 ) return false;
		if( y > this.GRID2 ) return false;
		if( z > this.GRID2 ) return false;
		
		if( x+y >= 2*this.GRID2 ) return false;
		if( x+z >= 2*this.GRID2 ) return false;
		if( y+z >= 2*this.GRID2 ) return false;
				
		return true;
	}
	
} // class Maze
