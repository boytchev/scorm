//
//	class Maze
	

// complexity
//
//	PLATES	 Ver	 Lin
//	    3	  81	 180
//	    5	 275	 690
//	    7	 637	1680
//	    9	1215	3294
//	   11	2057	5676

class Maze extends Group
{
/*	static GRID = 2 + Planet.PLATES>>1;
	*/
	constructor( planet )
	{
		super( suica );

		this.lines = [];
		this.update( planet );

	} // Maze.constructor
	
		
		
	update( planet )
	{
		this.GRID = 2 + planet.PLATES>>1;
		this.GRID2 = this.GRID ** 2;
		this.size = planet.GRID_SCALE;
	} // Maze.update
	
	
	
	// creates a route between two points
	addRoute( from, to )
	{
		// mangle order of coordintes
		var coords = [0,1,2].sort(()=>random(-1,1));

		for( var i=0; i<coords.length; i++ )
		{
			// if equal coordinates - exit
			if( from[i] == to[i] )
				continue;
			
			// find a mid point
			var mid = [...from];
				mid[i] = to[i];

			if( !this.allowedTheoretically( mid ) )
				continue;
			
			// add a route to the mid point
			this.lines.push( [from, mid] );
			
			// continue to the target
			this.addRoute( mid, to );
			break;
		}
	} // Maze.addRoute
	
	
	
	// return the number of different coordinates
	diff( a, b )
	{
		return (a[0]==b[0]?0:1) + (a[1]==b[1]?0:1) + (a[2]==b[2]?0:1);
	} // Maze.diff
	
	

	// return the number of different coordinates
	lerp( a, b )
	{
		const k = 0.98;
		
		return [
			a[0]*k + (1-k)*b[0],
			a[1]*k + (1-k)*b[1],
			a[2]*k + (1-k)*b[2]
		];
	} // Maze.lerp
	
	

	// dump segments
	dump( )
	{
		for( var i = 0; i<this.lines.length; i++ )
		{
			var a = this.lines[i][0],
				b = this.lines[i][1];
				
			console.log( `${i}.\t`, `[${a.join(',')}]-[${b.join(',')}]`, `len=${Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])}` );
		}
	}
	
	
	
	regenerate( midPointsCount = 0 )
	{
		var x, y, z;
		
		var platformA = playground.platformA,
			platformB = playground.platformB;

		this.lines = [];
		
//		this.addRoute( platformA.center, platformB.center );
		
//		console.log( 'initial segments', this.lines.length );
//		this.dump( );
		
		var midPoints = []; // list of middle points
		
		console.log('from',platformA.center);
		
		// pick midpoints and put them between platforms A and B
		midPoints.push( platformA.center );
		midPoints.push( platformB.center );
		for( let i=0; i<midPointsCount; i++ )
		{
			var vertex = this.findVertex( midPoints );
		console.log(' mid',vertex);
			midPoints.pop(); // remove B
			midPoints.push( vertex ); // add new point
			midPoints.push( platformB.center ); // add again B
		}
		
		console.log('  to',platformB.center);
		
		// create a route through all midpoints
		for( let i=1; i<midPoints.length; i++ )
			this.addRoute( midPoints[i-1], midPoints[i] );

		for( var i = 0; i<this.lines.length; i++ )
			this.add( line( 
				this.lerp(this.lines[i][0], this.lines[i][1] ),
				this.lerp(this.lines[i][1], this.lines[i][0] ),
				) );
		
		console.log( 'initial segments', this.lines.length );
		this.dump( );

/*
		var vertices = [];
		var lines = [];

		function hash( x, y, z ) { return `${x},${y},${z}` }
		function dehash( str ) { return str.split(',') }
		
		for( var x = -this.GRID; x<=this.GRID; x++ )
		for( var y = -this.GRID; y<=this.GRID; y++ )
		for( var z = -this.GRID; z<=this.GRID; z++ )
			if( this.allowedTheoretically(x,y,z) )
			{
				vertices.push( hash(x,y,z) );
				//this.add( cube([x,y,z],0.1) );
				
				if( this.allowedTheoretically(x+1,y,z) )
				{
					lines.push( [hash(x,y,z), hash(x+1,y,z)] );
					//this.add( line([x,y,z],[x+1,y,z]) );
				}
				
				if( this.allowedTheoretically(x,y+1,z) )
				{
					lines.push( [hash(x,y,z), hash(x,y+1,z)] );
					//this.add( line([x,y,z],[x,y+1,z]) );
				}
				
				if( this.allowedTheoretically(x,y,z+1) )
				{
					lines.push( [hash(x,y,z), hash(x,y,z+1)] );
					//this.add( line([x,y,z],[x,y,z+1]) );
				}
			}
		lines.sort( ()=>random(-1,1) );
		for( var ln of lines )
		{
			this.add( line( dehash(ln[0]), dehash(ln[1]) ) );
		}
console.log(lines)
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
			if( !this.allowedTheoretically( [x,y,z] ) ) continue;
			
			// if it is on any of the forbidden, try again
			for( var i=0; i<forbidden.length; i++ )
			{
				if( forbidden.x==x ||
					forbidden.y==y ||
					forbidden.z==z ) continue;
			}

			// if it is between any two successive forbidden vertices, try again
			var fail = false;
			for( var i=0; i<forbidden.length-1; i++ )
			{
				var a = forbidden[i],
					b = forbidden[i+1];
					
				fail = a.x==b.x && a.x==x & a.y==b.y && a.y==y && Math.min(a.z,b.z)<=z && z<=Math.max(a.z,b.z);
				if( fail ) break;
					
				fail = a.x==b.x && a.x==x & a.z==b.z && a.z==z && Math.min(a.y,b.y)<=y && y<=Math.max(a.y,b.y);
				if( fail ) break;
					
				fail = a.y==b.y && a.y==y & a.z==b.z && a.z==z && Math.min(a.x,b.x)<=x && x<=Math.max(a.x,b.x);
				if( fail ) break;
			}
			if( fail ) continue;
				
			return [x, y, z];
		}
	}
	
	
	
	// return true if grid position [x,y,z] is theoretically allowed
	allowedTheoretically( pos )
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
