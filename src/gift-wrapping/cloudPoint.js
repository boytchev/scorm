//
//	class CloudPoint



class CloudPoint extends Group
{
	static SIZE = [5, 5]; // unselected, selected
	static COLOR = ['gray', new THREE.Color(0,1,2), new THREE.Color(1.73,0.16,0.47)]; // unselected, selected, wrong
	
	static MOVE_SPEED = [150, 1500];
	static HIDE_SPEED = [150, 1500];
	static SHRINK_SPEED = [100, 1000];
	static YOYO_SPEED = 150; // in ms
	static MAX_DISPLACEMENT = -0.3;
	
	static DBLCLICK_TIME = 300;

	static MATERIAL;
	
	constructor( )
	{
		super( suica );

		if( !CloudPoint.MATERIAL )
		
		this.colorSphere = sphere( [0,0,0], CloudPoint.SIZE[1] );
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
			color: 'black',
			// clearcoat: 1,
			// clearcoatRoughness: 0.3,
			metalness: 0,
			roughness: 0.15,
			map: ScormUtils.image( 'marble.jpg' ),
			displacementMap: ScormUtils.image( 'marble-displacement.jpg' ),
			displacementScale: 0,
			normalMap: ScormUtils.image( 'marble-normal.jpg' ),
//				normalScale: new THREE.Vector2( 1, 1 ),
			//bumpScale: 0.1,
		} );

		this.toggleTime = 0;
		this.selected = 1;
		
		this.size = 0;
		this.add( this.colorSphere );
		
		this.addEventListener( 'click', this.toggle );
		
	} // CloudPoint.constructor



	// animate trasition to a new location
	moveTo( pos )
	{
		var that = this;
		
		this.target = pos;
		this.unselect( );
		
		new TWEEN.Tween( {center:this.center, size:this.size} )
			.to( {center:pos, size:1}, random(...CloudPoint.MOVE_SPEED) )
			.onUpdate( function( obj ) {
				that.center = obj.center;
				that.size = obj.size;
			} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	} // CloudPoint.moveTo



	// animate transition to a hidden point
	hide( )
	{
		var that = this;
		
		new TWEEN.Tween( {size:this.size} )
			.to( {size:0}, random(...CloudPoint.HIDE_SPEED) )
			.onUpdate( function( obj ) {
				that.size = obj.size;
			} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	} // CloudPoint.hide



	// animate transition to a small point
	// shrink( )
	// {
		// var that = this;
		
		// new TWEEN.Tween( {size:this.size} )
			// .to( {size:0.1}, random(...CloudPoint.SHRINK_SPEED) )
			// .onUpdate( function( obj ) {
				// that.size = obj.size;
			// } )
			// .easing( TWEEN.Easing.Cubic.Out )
			// .start( );
	// } // CloudPoint.shrink
	
	
	
	// toggle point selection status
	toggle( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;

		if( !playground.gameStarted )
		{
			playground.newGame( );
			return;
		}

		playground.pingSound.play( );
		
		var that = this;
		
		new TWEEN.Tween( {k:1} )
				.to( {k: this.selected?0.9:1.1}, CloudPoint.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.onUpdate( obj => that.size=obj.k )
				.repeat( 1 )
				.yoyo( true )
				.start( );

		this.selected = 1-this.selected;
		this.colorSphere.color = CloudPoint.COLOR[this.selected];
		this.colorSphere.size = CloudPoint.SIZE[this.selected];
//		this.colorSphere.threejs.material.opacity = this.selected ? 1 : 0.5;

		// if it is a double click, toggle all points
		var time = Date.now();

		if( time-this.toggleTime < CloudPoint.DBLCLICK_TIME )
		{
			this.toggleTime = 0;
			for( var i=0; i<playground.cloud.pointIndex; i++ )
				playground.cloud.points[i].toggle( );
		}
		this.toggleTime = time;
	} // CloudPoint.toggle
	
	
	
	// select point selection status
	unselect( )
	{
		this.selected = 1;
		this.toggle( );
	} // CloudPoint.select
	
	
} // class CloudPoint
