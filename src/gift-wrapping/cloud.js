//
//	class Cloud



class Cloud extends Group
{
	static MAX_POINTS = 20;
	
	constructor( )
	{
		super( suica );

		this.pointIdx = 0;
		this.points = [];
		
		// create all points in advance
		for( var i=0; i<Cloud.MAX_POINTS; i++ )
			this.points.push( new CloudPoint() );
		
	} // Cloud.constructor
	

	// set some points to be visible and animate them to new positions
	randomizePoints( count )
	{

		for( let i=0; i<count; i++ )
		{
			if( i>=this.pointIdx && this.pointIdx>0 )
			{
				// index of shown point
				var j = Math.floor(random(0,this.pointIdx));
				
				this.points[i].center = [...this.points[j].center];
			}
			
			this.points[i].moveTo( [random(-20,20), random(-20,20), random(-20,20)] );
		}
		
		for( let i=count; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = count;
		
	} // Cloud.randomizePoints
	
	
} // class Cloud
