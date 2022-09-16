//
//	class Maze
	


class Maze extends Group
{
	
	constructor( )
	{
		super( suica );

		const n = 4;
		const s = Planet.SIZE;
		for( var x = -n; x<=n; x++ )
		for( var y = -n; y<=n; y++ )
		for( var z = -n; z<=n; z++ )
			if( Maze.allowedTheoretically(x,y,z) )
			{
			//	cube([s*x,s*y,s*z],0.2);
				
				// if( Maze.allowedTheoretically(x+1,y,z) )
					// line([s*x,s*y,s*z],[s*x+s,s*y,s*z]);
				
				// if( Maze.allowedTheoretically(x-1,y,z) )
					// line([s*x,s*y,s*z],[s*x-s,s*y,s*z]);
				
				// if( Maze.allowedTheoretically(x,y+1,z) )
					// line([s*x,s*y,s*z],[s*x,s*y+s,s*z]);
				
				// if( Maze.allowedTheoretically(x,y-1,z) )
					// line([s*x,s*y,s*z],[s*x,s*y-s,s*z]);
				
				// if( Maze.allowedTheoretically(x,y,z+1) )
					// line([s*x,s*y,s*z],[s*x,s*y,s*z+s]);
				
				// if( Maze.allowedTheoretically(x,y,z-1) )
					// line([s*x,s*y,s*z],[s*x,s*y,s*z-s]);
				
			}
	} // Maze.constructor
	
		
	// return true if grid position [x,y,z] is theoretically allowed
	
	static allowedTheoretically( x, y, z )
	{
		x = x*x;
		y = y*y;
		z = z*z;
	
		var nn = 4*4;
		
		if( x > nn ) return false;
		if( y > nn ) return false;
		if( z > nn ) return false;
		
		if( x+y+z > 20 ) return false;
		
		if( x+y+z == 4) return true;
		
		
		if( x > 4 ) return true;
		if( y > 4 ) return true;
		if( z > 4 ) return true;
		
		// if( x+y > 8 ) return false;
		// if( x+z > 8 ) return false;
		// if( y+z > 8 ) return false;

		return false;
	}
} // class Maze
