//
//	class Maze



class Maze extends Group
{
	static POINT_SIZE = 3;
	
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
	
	
	
	// check whether [a1,a2] crosses [b1,b2]
	// note: a1 is open side of interval
	crossedLines( a1, a2, b1, b2 )
	{
		function between( x, y1, y2 )
		{
			return Math.min(y1,y2)<x && x<Math.max(y1,y2);
		}
		
		var goodX = ( between(a1[0],b1[0],b2[0]) && between(a2[0],b1[0],b2[0]) ) ||
				    ( between(b1[0],a1[0],a2[0]) && between(b2[0],a1[0],a2[0]) );

		var goodY = ( between(a1[1],b1[1],b2[1]) && between(a2[1],b1[1],b2[1]) ) ||
				    ( between(b1[1],a1[1],a2[1]) && between(b2[1],a1[1],a2[1]) );
					
		var goodZ = ( between(a1[2],b1[2],b2[2]) && between(a2[2],b1[2],b2[2]) ) ||
				    ( between(b1[2],a1[2],a2[2]) && between(b2[2],a1[2],a2[2]) );

		return goodX && goodY && goodZ;
	} // Maze.crossedLines
	
	
	
	// check whether a line crosses any existing line
	crossingExistingLines( a1, a2 )
	{
		for( var i=0; i<this.lineIdx; i++ )
			if( this.crossedLines(a1,a2,this.lines[i][0],this.lines[i][1]) )
				return true;
		return false;
	} // Maze.crossingExistingLines
	
	
	
	// check whether any point from FROM+1 to TO
	// is the same as existing points
	goodLine( from, to, check=true )
	{
		var points = [];
		
		// i - coordinate index
		for( var i=0; i<3; i++ )
		{
			var dist = to[i]-from[i],
				step = Math.sign( dist ); // must be 1 or -1, never 0
		
			if( dist == 0 ) continue;
			
			for( var t=1; t<=Math.abs(dist); t++ )
			{
				var mid = [...from];
					mid[i] += step*t;

				if( check )
				{
					for( var j=0; j<this.pointIdx; j++ )
						if( mid[0]==this.points[j].x && 
							mid[1]==this.points[j].y &&
							mid[2]==this.points[j].z )
							return false;
				}
				
				points.push( mid );
			}
		}
		
		return points;
	} // Maze.goodLine
	
	
	
	// creates a direct route between two points
	// the route may have up to 3 segments - one
	// for each coordinate that is different
	addRoute( from, to, prematureExit = false )
	{
		
		// mangle the order of coordintes
		var coords = [0,1,2].sort(()=>random(-1,1));

		// try to make lines that do not cross existing lines
		for( var i=0; i<coords.length; i++ )
		{
			// if equal coordinates - try next coordinate
			if( from[i] == to[i] )
				continue;
			
			// find a corner point
			let corner = [...from];
				corner[i] = to[i];

			// if outside planet - try next coordinate
			if( !this.allowed( corner ) )
				continue;
			
			// if it is not a good line - try next coordinate
			let midPoints = this.goodLine( from, corner, true );
			if( !midPoints )
				continue;
							
			// add a line
			this.addLine( from, corner );
			
			// add points along the line
			for( var j=0; j<midPoints.length; j++ )
				this.addPoint( midPoints[j] );
			
			from = corner;
		} // for( var i=0; i<coords.length; i++ )

		if( prematureExit ) return;
		
		// second attemps - the same efforts, but do not care
		// about crossing the existing path

		// mangle again the order of coordintes
		coords = [0,1,2].sort(()=>random(-1,1));

		for( var attempt=0; attempt<3; attempt++ )
		{
			for( var i=0; i<coords.length; i++ )
			{
				// if equal coordinates - try next coordinate
				if( from[i] == to[i] )
					continue;
				
				// find a corner point
				let corner = [...from];
					corner[i] = to[i];

				// if outside planet - try next coordinate
				if( !this.allowed( corner ) )
					continue;
				
				// if it is not a good line - just use the points
				let midPoints = this.goodLine( from, corner, false );
								
				// add a line
				this.addLine( from, corner );
				
				// add points along the line
				for( var j=0; j<midPoints.length; j++ )
					this.addPoint( midPoints[j] );

				from = corner;
			}
		}
		
	} // Maze.addRoute

	
	
	// clear (hide) all points but do not forget them
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
	
	
	
	// clear (hide) all lines but do not forget them
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
	
	

	// regenerate a new maze - recycling points and lines from previous maze
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
			
			this.addRoute( from, via, false );
			from = via;
		}
		this.addRoute( from, to );
		
		// add random routes
		for( let i=0; i<randomRoutesCount; i++ )
		{
			from = this.points[ Math.round(random(0,this.pointIdx-1)) ].center;
			to = this.findVertex( );
			this.addRoute( from, to, true );
		}

	} // Maze.regenerate
	
	
	
	// pick a vertex that is not forbidden
	findVertex( from )
	{
		while( true )
		{
			// get a random point
			var x = Math.round( random( -this.GRID+1, this.GRID-1) );
			var y = Math.round( random( -this.GRID+1, this.GRID-1) );
			var z = Math.round( random( -this.GRID+1, this.GRID-1) );

			var point = [x, y, z];
			
			point[ random([0,1,2]) ] = random( [-this.GRID,this.GRID] );
			
			// if not legal, try again
			if( !this.allowed( point ) ) continue;

			// if FROM is provided, check whether the line from 
			// FROM to the new point crosses any existing line
			if( from !== undefined )
				if( this.crossingExistingLines( from, point ) )
					continue;
				
			return point;
		}
	} // Maze.findVertex
	
	
	
	// check whether the spaceship is on the allowed track
	// this is called from spaceship.js
	onTrack( pos, epsilon )
	{
		var ax = pos[0],
			ay = pos[1],
			az = pos[2];
		
		// check whether pos belonga to a line
		for( var i=0; i<this.lineIdx; i++ )
		{
			var line = this.lines[i];

			if( 
				line.min[0]-epsilon<=ax && ax<=line.max[0]+epsilon &&
				line.min[1]-epsilon<=ay && ay<=line.max[1]+epsilon &&
				line.min[2]-epsilon<=az && az<=line.max[2]+epsilon    ) return true;
		}
		
		return false;
	} // Maze.onTrack
	
	
	
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
	} // Maze.allowed
	
} // class Maze
