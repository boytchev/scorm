//
//	class Cloud



class Cloud extends Group
{
	static HULL_SPEED = 500;
//	static HULL_SHOW_SPEED = 200;
	
	static MAX_POINTS = 20;
	static MIN_POINT_DIST = 5;
	static MIN_PLAME_DIST = 5;
	static SIZE = 35;
//	static HULL_OPACITY = 1;
	
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
				// transparent: true,
				// opacity: 0,
				// side: THREE.DoubleSide,
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
	randomizePoints( count, inCount, insideFrom, insideTo, displacement )
	{
		var that = this;
		new TWEEN.Tween( {k: 1} )
					.to( {k: 0}, Cloud.HULL_SPEED )
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
				this.sphere.size = Cloud.SIZE * random( insideFrom, insideTo );
			else
				this.sphere.size = Cloud.SIZE;
			
			this.points[i].moveTo( this.randomPos(i) );
			this.points[i].colorSphere.threejs.material.displacementScale = CloudPoint.MAX_DISPLACEMENT*displacement;
		}
		
		for( let i=count; i<Cloud.MAX_POINTS; i++ )
			this.points[i].hide( );
		
		this.pointIndex = count;
		
	} // Cloud.randomizePoints

	
	
	
	// get random position different from all points up to checkIndex
	randomPos( checkIndex )
	{
		// pick a random point without any restriction
		function rawRandomPos( sphere )
		{
			var pos = randomIn( sphere );

			// the first 6 points are glues to the sides of a cube
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
		
		// minimal distance to existing points
		function minimalDistanctToPoints( points )
		{
			var min = Infinity;

			for( var i=0; i<checkIndex; i++ )
			{
				var pnt = points[i].target,
					dist = Math.sqrt( (pos[0]-pnt[0])**2 + (pos[1]-pnt[1])**2 + (pos[2]-pnt[2])**2);
				
				min = Math.min( min, dist );
			}
			
			return min;
		}
		
		// minimal distance to existing planes
		function minimalDistanctToPlanes( points )
		{
//			points.push( {target:pos} );
			
			var min = Infinity,
				plane = new THREE.Plane( ),
				v0 = new THREE.Vector3( ...pos ),
				v1 = new THREE.Vector3( ),
				v2 = new THREE.Vector3( ),
				v3 = new THREE.Vector3( );

			if( checkIndex >= 3 )
//			for( var i0=0; i0<checkIndex-3; i0++ )
//			{
//				v0.set( ...points[i0].target );
				
				//for( var i1=i0+1; i1<checkIndex-2; i1++ )
				for( var i1=0; i1<checkIndex-2; i1++ )
				{
					v1.set( ...points[i1].target );
					
					for( var i2=i1+1; i2<checkIndex-1; i2++ )
					{
						v2.set( ...points[i2].target );
						
						for( var i3=i2+1; i3<checkIndex; i3++ )
						{
							v3.set( ...points[i3].target );
							plane.setFromCoplanarPoints( v1, v2, v3 );
							
							var dist = Math.abs( plane.distanceToPoint( v0 ) );
//							console.log('\t',i1,i2,i3,'<-',dist);
					
							min = Math.min( min, dist );
						}
					}
				}
//			}
			
//			points.pop( );
			
			return min;
		}

		
		var bestPos = randomOn( this.sphere ),
			bestMin = 0;

		// the first point, no need to check it
		if( checkIndex == 0 )
			return bestPos;
console.log('---new pnt');
		for( var attempt=0; attempt<30; attempt++ ) 
		{
			var pos = rawRandomPos( this.sphere ),
				minPoint = minimalDistanctToPoints( this.points ),
				minPlane = minimalDistanctToPlanes( this.points );
				
			var min = minPoint/20 + minPlane;
			
console.log('\t#'+attempt,minPoint.toFixed(3),minPlane.toFixed(3),'->',min.toFixed(3));
			
			if( minPoint>Cloud.MIN_POINT_DIST && minPlane>Cloud.MIN_POINT_DIST )
				return pos;
			
			
			if( min > bestMin )
			{
				bestMin = min;
				bestPos = pos;
			}
		}
		
console.log('\tbest ->',bestMin.toFixed(3));
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

		this.fullHull.src = this.allPoints( );
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
