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
	static GRID = 2 + Planet.PLATES>>1;
	
	constructor( )
	{
		super( suica );

var vertices = 0;
var lines = 0;
		
		for( var x = -Maze.GRID; x<=Maze.GRID; x++ )
		for( var y = -Maze.GRID; y<=Maze.GRID; y++ )
		for( var z = -Maze.GRID; z<=Maze.GRID; z++ )
			if( Maze.allowedTheoretically(x,y,z) )
			{
				vertices++;
				//this.add( cube([x,y,z],0.2) );
				
				// if( Maze.allowedTheoretically(x+1,y,z) )
					// this.add( line([x,y,z],[x+1,y,z]) ), lines++;
				// its.color = 'yellow'
				
				// if( Maze.allowedTheoretically(x,y+1,z) )
					// this.add( line([x,y,z],[x,y+1,z]) ), lines++;
				// its.color = 'yellow'
				
				// if( Maze.allowedTheoretically(x,y,z+1) )
					// this.add( line([x,y,z],[x,y,z+1]) ), lines++;
				// its.color = 'yellow'
				
			}
			
console.log(vertices,'vertices')
console.log(lines,'lines')
		this.size = Planet.GRID_SCALE;
	} // Maze.constructor
	
		
	// return true if grid position [x,y,z] is theoretically allowed
	
	static allowedTheoretically( x, y, z )
	{
		x = x*x;
		y = y*y;
		z = z*z;
	
		var nn = Maze.GRID*Maze.GRID;
		
		if( x > nn ) return false;
		if( y > nn ) return false;
		if( z > nn ) return false;
		
		if( x+y >= 2*nn ) return false;
		if( x+z >= 2*nn ) return false;
		if( y+z >= 2*nn ) return false;
				
		return true;
	}
} // class Maze
