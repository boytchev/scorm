//
//	class Cloud



class Cloud extends Group
{
	static HULL_SPEED = 500;
//	static HULL_SHOW_SPEED = 200;
	
	static MAX_POINTS = 20;
	static MIN_PLANE_DIST = 3;
	static SIZE = 30;
//	static HULL_OPACITY = 1;
	
	constructor( )
	{
		super( suica );

		this.pointIdx = 0;
		this.points = [];
		
		this.sphere = sphere( [0,0,0], Cloud.SIZE );
			its.hidden = true;
		this.subSphere = sphere( [0,0,0], Cloud.SIZE );
			its.hidden = true;
			
// var ruler = cube( [10,0,0], [Cloud.MIN_PLANE_DIST,0.2,0.2] );
// this.add( ruler );
		
		// create all points in advance
		for( var i=0; i<Cloud.MAX_POINTS; i++ )
			this.points.push( new CloudPoint() );
		
		this.fullHullVertices = [];
		this.fullHull = convex( this.fullHullVertices );
		
		its.visible = false;
		//its.threejs.material.wireframe = true;
		
		this.hull = convex( [] );
		
//		its.threejs.renderOrder = 10;
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				roughness: 1,
				metalness: 0,
				
transmission: 0.2,
thickness: 0.2,
roughness: 0.5,
				
				map: ScormUtils.image( 'paper.jpg', 1/5, 1/5 ),
				transparent: true,
				opacity: 0.8,
				side: THREE.DoubleSide,
				polygonOffset: true,
				polygonOffsetFactor: 2,
				polygonOffsetUnits: 2,
		});

		this.hullFrame = cube( [0,0,0], [1,1,1] );
		its.threejs.material = new THREE.MeshBasicMaterial( {
				// transparent: true,
				color: 'black',
				wireframe: true,
		});
		
		this.addEventListener( 'click', this.onClick );
		
		this.add( this.hull, this.hullFrame );
		
	} // Cloud.constructor
	
	

	// set some points to be visible and animate them to new positions
	randomizePoints( count, outCount, displacement )
	{
		// var that = this;
		// new TWEEN.Tween( {k: 1} )
					// .to( {k: 0}, Cloud.HULL_SPEED )
					// .easing( TWEEN.Easing.Cubic.Out )
					// .onUpdate( obj => that.hull.threejs.material.opacity = obj.k )
					// .start( );

		this.fullHullVertices = [];
		
		// set positions of points
		for( let i=0; i<count; i++ )
		{			
			var newPos = this.randomPos(i,outCount);
			this.points[i].moveTo( newPos );
			this.points[i].colorSphere.threejs.material.displacementScale = CloudPoint.MAX_DISPLACEMENT*displacement;
			
			this.fullHullVertices.push( newPos );
			this.fullHull.src = this.fullHullVertices;
		}
		
		for( let i=count; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = count;
		
	} // Cloud.randomizePoints
	
	

	// calculate the minimal distance from point pos
	// to the planes on the faces of the full hull
	distanceToHull( pos, checkIndex )
	{
		var dist = Infinity,
			v0 = new THREE.Vector3( ...pos ),
			v1 = new THREE.Vector3( ),
			v2 = new THREE.Vector3( ),
			v3 = new THREE.Vector3( );

		var verts = this.fullHull.threejs.geometry.getAttribute( 'position' );
		
		if( verts.count == 1 )
		{
			// the hull is a point
			v1.set( verts.getX(0), verts.getY(0), verts.getZ(0) );
			dist = v1.distanceTo( v0 );
		}
		else
		if( verts.count == 2 )
		{
			// the hull is a line
			var line  = new THREE.Line3( v1, v2 );
			
			v1.set( verts.getX(0), verts.getY(0), verts.getZ(0) );
			v2.set( verts.getX(2), verts.getY(2), verts.getZ(2) );
			
			line.closestPointToPoint( v0, true, v3 );
			
			dist = v0.distance( v3 );
		}
		else
		{
			// the hull is a 3d object
			var plane = new THREE.Plane( );
			
			for( let i=0; i<verts.count; i+=3 )
			{
				v1.set( verts.getX(i+0), verts.getY(i+0), verts.getZ(i+0) );
				v2.set( verts.getX(i+1), verts.getY(i+1), verts.getZ(i+1) );
				v3.set( verts.getX(i+2), verts.getY(i+2), verts.getZ(i+2) );
				
				plane.setFromCoplanarPoints( v1, v2, v3 );
				
				dist = Math.min( dist, Math.abs( plane.distanceToPoint(v0) ) );
			}
		}
		
		// now update distance to all points
		// this is to avoid bulbing points in the center
		v1.set( 0, 0, 0 );
		dist = Math.min( dist, 0.5*v1.distanceTo( v0 ) ); // distance to (0,0,0) it twice more sensitive
		for( let i=0; i<checkIndex; i++ )
		{
			v1.set( ...this.points[i].target );
			dist = Math.min( dist, v1.distanceTo( v0 ) );
		}
		
		
		return dist;
	}


	
	// pick a random point without any restriction on distance
	rawRandomPos( checkIndex, outCount )
	{
		var pos = checkIndex >= outCount ? randomIn( this.subSphere ) : randomOn( this.sphere );

		// the first 6 points are gluee to the sides of a cube
		switch( checkIndex )
		{
			case 0: pos[0] =  Cloud.SIZE/2; break;
			case 1: pos[0] = -Cloud.SIZE/2; break;
			case 2: pos[1] =  Cloud.SIZE/2; break;
			case 3: pos[1] = -Cloud.SIZE/2; break;
			case 4: pos[2] =  Cloud.SIZE/2; break;
			case 5: pos[2] = -Cloud.SIZE/2; break;
		}
		
		return pos;
	}



	// get random position different from all points up to checkIndex
	randomPos( checkIndex, outCount )
	{
		var bestPos = this.rawRandomPos( checkIndex, outCount ),
			bestDist = 0;

		// is it the first point, no need to check it
		if( checkIndex == 0 )
			return bestPos;

		for( var attempt=0; attempt<30; attempt++ ) 
		{
			var pos = this.rawRandomPos( checkIndex, outCount ),
				dist = this.distanceToHull( pos, checkIndex );
			
			// the point is good, no need to make the rest attempts
			if(  dist > Cloud.MIN_PLANE_DIST )
			{
				bestDist = dist;
				bestPos = pos;
				break;
			}

			// remember the best position (the biggest distance from the hull)
			if( dist > bestDist )
			{
				bestDist = dist;
				bestPos = pos;
			}
		}
		
//console.log(`\t#${checkIndex} -> ${bestDist.toFixed(3)} '(${(bestDist/Cloud.MIN_PLANE_DIST*100)|0}%) attempts=${attempt}`);
		return bestPos;
	}
	
	
	
	// get a list of selected points
	selectedPoints( )
	{
		var points = [];
		for( var i=0; i<this.pointIndex; i++ )
			if( this.points[i].selected )
				points.push( this.points[i].center );
			
		return points;
	} // Cloud.selectedPoints
	
	
	
	// shrink selected points
	// shrinkPoints( )
	// {
		// for( var i=0; i<this.pointIndex; i++ )
		// {
			// this.points[i].shrink( );
		// }
	// } // Cloud.shrinkSelectedPoints
	
	
	
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
//		console.log('showing');

//		this.fullHull.src = this.allPoints( );
		this.hull.src = this.selectedPoints( );
		this.hullFrame.threejs.geometry = this.hull.threejs.geometry;

		this.hull.size = 1;
		this.hullFrame.size = 1;
		
//		this.hull.threejs.material.opacity = Cloud.HULL_OPACITY;
//		this.hullFrame.threejs.material.opacity = Cloud.HULL_OPACITY;
		
		// var that = this;
		// new TWEEN.Tween( {k: 0} )
			// .to( {k: 1}, Cloud.HULL_SHOW_SPEED )
			// .easing( TWEEN.Easing.Cubic.In )
			// .onUpdate( function(obj) {
				// that.hull.threejs.material.opacity = obj.k*Cloud.HULL_OPACITY;
				// that.hullFrame.threejs.material.opacity = obj.k*Cloud.HULL_OPACITY;

				// that.hull.size = obj.k;
				// that.hullFrame.size = obj.k;
			// } )
			// .onComplete( function(obj) {
				// that.hull.threejs.material.opacity = Cloud.HULL_OPACITY;
				// that.hullFrame.threejs.material.opacity = Cloud.HULL_OPACITY;

				// that.hull.size = 1;
				// that.hullFrame.size = 1;
		// console.log('shown');
			// } )
			// .start( );
	}
	
	

	// hide convex hull
	hideConvexHull( )
	{
//		console.log('hiding');

		this.hull.size = 0;
		this.hullFrame.size = 0;
		
//		this.hull.threejs.material.opacity = Cloud.HULL_OPACITY;
//		this.hullFrame.threejs.material.opacity = Cloud.HULL_OPACITY;

		// var that = this;
		// new TWEEN.Tween( {k: 1} )
			// .to( {k: 0}, Cloud.HULL_SHOW_SPEED )
			// .easing( TWEEN.Easing.Cubic.In )
			// .onUpdate( function(obj) {
				// that.hull.threejs.material.opacity = obj.k*Cloud.HULL_OPACITY;
				// that.hullFrame.threejs.material.opacity = obj.k*Cloud.HULL_OPACITY;

				// that.hull.size = obj.k;
				// that.hullFrame.size = obj.k;
			// } )
			// .onComplete( function(obj) {
				// that.hull.threejs.material.opacity = 0;
				// that.hullFrame.threejs.material.opacity = 0;

				// that.hull.size = 0;
				// that.hullFrame.size = 0;
		// console.log('hidden');
			// } )
			// .start( );
	}
	
	

	// clicking on the cloud hull while the game is off
	// starts a new game
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Cloud.onclick



	// update rotation of points in the cloud
	update( t, dT )
	{
		for( var i = 0; i<this.pointIndex; i++ )
			this.points[i].spin = [10*t-30*i, 12*t+40*i, 13*t+35*i]
	}
	
	
} // class Cloud
