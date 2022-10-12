//
//	class Cloud



class Cloud extends Group
{
	static HULL_SPEED = 500;
	static MAX_POINTS = 20;
	static SIZE = 30;
	static MIN_SIZE = 20;
	static HULL_OPACITY = 0.9;
	
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
		
		this.fullHull = convex( [] );
		its.visible = false;
		
		this.hull = convex( [] );
		
//		its.threejs.renderOrder = 10;
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				roughness: 1,
				metalness: 0,
				
// transmission: 5,
// thickness: 0,
// roughness: 0,
				
				map: ScormUtils.image( 'paper.jpg', 1/5, 1/5 ),
//				transparent: true,
				opacity: 0,
				side: THREE.DoubleSide,
				polygonOffset: true,
				polygonOffsetFactor: 2,
				polygonOffsetUnits: 2,
		});

		this.hullFrame = cube( [0,0,0], [1,1,1] );
		its.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'black',
				wireframe: true,
		});
		
		this.add( this.hull, this.hullFrame );
		
	} // Cloud.constructor
	


	// create a cloud in the shape of a cube
	// cubePoints( )
	// {
		// var that = this;
		// new TWEEN.Tween( {k: 0} )
					// .to( {k: 1}, random(...CloudPoint.MOVE_SPEED) )
					// .easing( TWEEN.Easing.Cubic.Out )
					// .onUpdate( obj => that.hull.threejs.material.opacity = obj.k )
					// .start( );
			
		// var i = 0,
			// size = Cloud.SIZE/3;
		
		// for( var x=-1; x<2; x+=2 )
		// for( var y=-1; y<2; y+=2 )
		// for( var z=-1; z<2; z+=2 )
		// {
			// this.points[i++].center = [x*size, y*size, z*size];
		// }
		
		// for( let i=8; i<Cloud.MAX_POINTS; i++ )
			// this.points[i].hide( );
		
		// this.pointIndex = 8;
		
	// } // Cloud.cubePoints
	
	
	
	// set some points to be visible and animate them to new positions
	randomizePoints( count, inCount = 0 )
	{
		var that = this;
		new TWEEN.Tween( {k: 1} )
					.to( {k: 0}, CloudPoint.HULL_SPEED )
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
			
			if( i < inCount )
				this.sphere.size = Cloud.MIN_SIZE;
			else
				this.sphere.size = Cloud.SIZE;
			this.points[i].moveTo( randomOn(this.sphere) );
		}
		
		for( let i=count; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = count;
		
	} // Cloud.randomizePoints
	
	
	
	
	// toggle all points
	toggleAllPoints( )
	{
		for( var i=0; i<this.pointIndex; i++ )
			this.points[i].toggle( );
	} // CloudPoint.toggleAllPoints
	
	
	
	// get a list of selected points
	selectedPoints( )
	{
		var points = [];
		for( var i=0; i<this.pointIndex; i++ )
			if( this.points[i].selected )
				points.push( this.points[i].center );
			
		return points;
	} // Cloud.selectedPoints
	
	
	
	// get a list of all used points
	allPoints( )
	{
		var points = [];
		for( var i=0; i<this.pointIndex; i++ )
			points.push( this.points[i].center );
			
		return points;
	} // Cloud.allPoints
	
	
	
	// show convex hull
	showConvexHull( )
	{
		this.fullHull.src = this.allPoints( );
		this.hull.src = this.selectedPoints( );
		this.hullFrame.threejs.geometry = this.hull.threejs.geometry;
		
		var that = this;
		new TWEEN.Tween( {k: 0} )
					.to( {k: Cloud.HULL_OPACITY}, random(...CloudPoint.MOVE_SPEED) )
					.easing( TWEEN.Easing.Cubic.Out )
					.onUpdate( function(obj) {
						that.hull.threejs.material.opacity = obj.k;
						that.hullFrame.threejs.material.opacity = obj.k;
					} )
					.start( );
	}
	
	
	
	// update rotation of points in the cloud
	update( t, dT )
	{
		for( var i = 0; i<this.pointIndex; i++ )
			this.points[i].spin = [10*t-30*i, 12*t+40*i, 13*t+35*i]
	}
	
	
} // class Cloud
