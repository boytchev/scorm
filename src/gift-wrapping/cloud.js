//
//	class Cloud



class Cloud extends Group
{
	static MAX_POINTS = 20;
	static SIZE = 30;
	
	constructor( )
	{
		super( suica );

		this.pointIdx = 0;
		this.points = [];
		
		this.sphere = sphere( [0,0,0], Cloud.SIZE );
			its.hidden = true;
			
		
		// create all points in advance
		for( var i=0; i<Cloud.MAX_POINTS; i++ )
			this.points.push( new CloudPoint() );
		
		this.hull = convex( [] );
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				roughness: 1,
				metalness: 0,
				map: ScormUtils.image( 'paper.jpg', 1/5, 1/5 ),
				transparent: true,
				opacity: 0,
		});
		this.add( this.hull );
		
	} // Cloud.constructor
	


	// create a cloud in the shape of a cube
	cubePoints( )
	{
		var that = this;
		new TWEEN.Tween( {k: 1} )
					.to( {k: 0}, random(...CloudPoint.MOVE_SPEED) )
					.easing( TWEEN.Easing.Cubic.Out )
					.onUpdate( obj => that.hull.threejs.material.opacity = obj.k )
					.start( );
			
		var i = 0,
			size = Cloud.SIZE/3;
		
		for( var x=-1; x<2; x+=2 )
		for( var y=-1; y<2; y+=2 )
		for( var z=-1; z<2; z+=2 )
		{
			this.points[i++].moveTo( [x*size, y*size, z*size] );
		}
		
		for( let i=8; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = 8;
		
	} // Cloud.cubePoints
	
	
	
	// set some points to be visible and animate them to new positions
	randomizePoints( count )
	{
		var that = this;
		new TWEEN.Tween( {k: 1} )
					.to( {k: 0}, random(...CloudPoint.MOVE_SPEED) )
					.easing( TWEEN.Easing.Cubic.Out )
					.onUpdate( obj => that.hull.threejs.material.opacity = obj.k )
					.start( );
			
		for( let i=0; i<count; i++ )
		{
			if( i>=this.pointIdx && this.pointIdx>0 )
			{
				// index of shown point
				var j = Math.floor(random(0,this.pointIdx));
				
				this.points[i].center = [...this.points[j].center];
			}
			
			this.points[i].moveTo( randomOn(this.sphere) );
		}
		
		for( let i=count; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = count;
		
	} // Cloud.randomizePoints
	
	
	
	// show convex hull
	showConvexHull( )
	{
		var points = [];
		for( var i=0; i<this.pointIndex; i++ )
		{
			console.log( this.points[i].center );
			points.push( this.points[i].center );
		}
		
		this.hull.src = points;
		var that = this;
		new TWEEN.Tween( {k: 0} )
					.to( {k: 1}, random(...CloudPoint.MOVE_SPEED) )
					.easing( TWEEN.Easing.Cubic.Out )
					.onUpdate( obj => that.hull.threejs.material.opacity = obj.k )
					.start( );

	}
	
} // class Cloud
