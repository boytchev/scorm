//
//	class Maze
	

class Maze extends Group
{
	static POINT_SIZE = 3;
	
/*	static GRID = 2 + Planet.PLATES>>1;
	*/
	constructor( planet )
	{
		super( suica );

		this.pointIdx = 0;
		this.lineIdx = 0;
		
		this.points = [];	// list of vertices of the route
		this.lines = [];	// list of line segments of the route
		
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
			this.addLine( from, corner );
			
			// add points along the line
			var dist = corner[i]-from[i],
				step = Math.sign( dist ); // must be 1 or -1, never 0
				
			for( var t=0; t<Math.abs(dist); t++ )
			{
				var mid = [...from];
					mid[i] += step*t;
					
				this.addPoint( mid );
			}
			
			// continue to the target
			return this.addRoute( corner, to );
		}
		
		this.addPoint( to );
		
	} // Maze.addRoute

	
	
	// clear all points but do not forget them
	clearPoints( )
	{
		this.pointIdx = 0;
		for( let i=0; i<this.points.length; i++ )
			this.points[i].visible = false;
	} // Maze.clearPoints
	
	
	
	// reuse or create a point
	addPoint( center )
	{
		if( this.pointIdx >= this.points.length )
		{
			// create
			var newPoint = point( center, Maze.POINT_SIZE/playground.planet.SCALE );
				newPoint.threejs.castShadow = true;
			this.points.push( newPoint );
			this.add( newPoint );
		}
		else
		{	// reuse
			this.points[ this.pointIdx ].center = center;
			this.points[ this.pointIdx ].size = Maze.POINT_SIZE/playground.planet.SCALE;
			this.points[ this.pointIdx ].visible = true;
		}
		
		this.pointIdx++;
	} // Maze.addPoint
	
	
	
	// clear all lines but do not forget them
	clearLines( )
	{
		this.lineIdx = 0;
		for( let i=0; i<this.lines.length; i++ )
			this.lines[i].visible = false;
	} // Maze.clearPoints
	
	
	
	// reuse or create a line
	addLine( from, to )
	{
		var newLine;
		
		if( this.lineIdx >= this.lines.length )
		{
			// create
			newLine = line( from, to );
			newLine.threejs.castShadow = true;
			this.lines.push( newLine );
			this.add( newLine );
		}
		else
		{	// reuse
			newLine = this.lines[ this.lineIdx ];
			newLine.from = from;
			newLine.to = to;
			newLine.visible = true;
		}
		
		newLine.min = [];
		newLine.max = [];
		for( var i=0; i<3; i++ )
		{
			newLine.min[i] = Math.min( from[i], to[i] );
			newLine.max[i] = Math.max( from[i], to[i] );
		}

		this.lineIdx++;
	} // Maze.addLine
	
	

	// find whether pos is on any line
	onTrack( pos, epsilon )
	{
		var ax = pos[0],// / playground.maze.size,
			ay = pos[1],// / playground.maze.size,
			az = pos[2];// / playground.maze.size;
		
//		console.log('can be at',[ax,ay,az]);
		
		// check whether pos belonga to a line
		for( var i=0; i<this.lineIdx; i++ )
		{
			var line = this.lines[i];
//			console.log('  line',i,' min',line.min,'max',line.max);
			if( 
				line.min[0]-epsilon<=ax && ax<=line.max[0]+epsilon &&
				line.min[1]-epsilon<=ay && ay<=line.max[1]+epsilon &&
				line.min[2]-epsilon<=az && az<=line.max[2]+epsilon    ) return true;
		}
		
		return false;
	} // Maze.existsLine
	
	
	
	regenerate( midPointsCount = 0, randomRoutesCount = 0 )
	{
		var platformA = playground.platformA,
			platformB = playground.platformB;

		
		var from = [...platformA.center],
			to = [...platformB.center];

		// create some middle points
		for( let i=0; i<midPointsCount; i++ )
		{
			var via = this.findVertex( );
			
			this.addRoute( from, via );
			from = via;
		}
		this.addRoute( from, to );
		//this.points.push( to );

//		console.log('  to',platformB.center);
		
		// add random routes
		for( let i=0; i<randomRoutesCount; i++ )
		{
			from = random( this.points ).center;
			to = this.findVertex( );
			this.addRoute( from, to );
		}

		
//		console.log( 'initial segments', this.lines.length );
//		this.dump( );

	} // Maze.regenerate
	
	
	
	// pick a vertex that is not forbidden
	findVertex( )
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
			for( var i=0; i<this.pointIdx-1; i++ )
			{
				var a = this.points[i].center,
					b = this.points[i+1].center;
					
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
