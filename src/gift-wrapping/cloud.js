//
//	class Cloud



class Cloud extends Group
{
	static HULL_SPEED = 500;
//	static HULL_SHOW_SPEED = 200;
	
	static MAX_POINTS = 20;
	static MIN_DIST = 5;
	static SIZE = 40;
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
		// the first point, no need to check it
		if( checkIndex == 0 )
			return randomOn(this.sphere);
//console.log('---------',checkIndex);
		var pos,
			tos, //target pos
			dist,
			minDist = 0,
			attempts = 20;
		while( minDist < Cloud.MIN_DIST && attempts > 0 )
		{
			attempts--;
			minDist = 2*Cloud.SIZE;
			pos = randomOn(this.sphere);
			
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
			
			for( var i=0; i<checkIndex; i++ )
			{
				tos = this.points[i].target;
				
				// console.log(pos)
				// console.log(tos)
				dist = Math.sqrt( (pos[0]-tos[0])**2 + (pos[1]-tos[1])**2 + (pos[2]-tos[2])**2);
			// console.log('\t',dist);
				minDist = Math.min( minDist, dist );
			}
	//		console.log('minDist =',minDist);
		}
		
	//		console.log('final minDist =',minDist);
		return pos;
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
