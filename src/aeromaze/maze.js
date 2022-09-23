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
		var coords = [0,1,2].sort((a,b)=>random(-1,1));
		
		for( var i in coords )
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
			this.add( line( from, mid ) )
			
			// continue to the target
			this.addRoute( mid, to );
			break;
		}
	} // Maze.addRoute
	
	
	
	
	regenerate( )
	{
		this.addRoute( playground.platformA.center, playground.platformB.center );
/*
var vertices = 0;
var lines = 0;
		
		for( var x = -this.GRID; x<=this.GRID; x++ )
		for( var y = -this.GRID; y<=this.GRID; y++ )
		for( var z = -this.GRID; z<=this.GRID; z++ )
			if( this.allowedTheoretically(x,y,z) )
			{
				vertices++;
				this.add( cube([x,y,z],0.1) );
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
*/
	} // Maze.regenerate
	
	
	
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
