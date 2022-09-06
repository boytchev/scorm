//
//	class Membrane( )
//

	
class Membrane extends Group
{
	
	static GRID = 10;
	static VERTICES = 100;
	
	static NON_FLAT = 0.7; // ratio
	static SHOW_SPEED = 1200;
	static HIDE_SPEED = 500;
	static VIBRO_SPEED = 50;
	static BUMP_HEIGHT = 10;
	
	constructor( )
	{
		super( suica );

		this.pi = [];
		this.pj = [];
		this.pd = [];
		this.points = [];

		this.surface = this.constructSurface( );
		this.randomize( );

		this.add( this.surface );

		this.addEventListener( 'click', this.onClick );

	} // Membrane.constructor



	// handles clicks on the membrane
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Ring.POINTER_USED ) return;
			
		// if game is not started, click on the ring will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Membrane.onClick
	
	
	
	// construct the ring
	constructSurface( )
	{
		for( let i=0; i<Membrane.GRID; i++ )
			this.points.push( [] );
		
		var v = new THREE.Vector3();
		
		for( let i=0; i<Membrane.GRID; i++ )
		for( let j=0; j<Membrane.GRID; j++ )
		{
			v.x = 2*Ring.SIZE*i/(Membrane.GRID-1)-Ring.SIZE;
			v.y = 2*Ring.SIZE*j/(Membrane.GRID-1)-Ring.SIZE;
			v.z = 0;
			
			v.setLength( Math.max( Math.abs(v.x), Math.abs(v.y) ) );
			
			var dist = v.length();
			if( dist < Membrane.NON_FLAT*Ring.SIZE )
			{
				this.pi.push( i );
				this.pj.push( j );
				this.pd.push( dist );
			}
			
			this.points[i][j] = [v.x, v.y, 0];
		}


		var surf = surface( [0,0,0], this.points, Membrane.VERTICES );

		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'white',
				clearcoat: 2,
				clearcoatRoughness: 1,
				roughness: 1,
				metalness: 0,
				bumpMap: image('images/tile.png'),
				bumpScale: 0.8,
				sheen: 0,	// 1.5
				sheenColor: 'white',
				sheenRoughness: 0.1,
				side: THREE.DoubleSide,
		});


		
		return surf;
		
	} // Membrane.constructSurface



	randomize( )
	{
		var scale = THREE.MathUtils.mapLinear( playground?.difficulty || 0, 0, 100, 0.5, 2 );
		
		// randomize control points
		for( var n in this.pi )
		{
			var i = this.pi[n],
				j = this.pj[n];

			this.points[i][j][2] = scale * Membrane.BUMP_HEIGHT * random(-1,1);
		}

		// make the surface flat
		this.surface.depth = 0.0001;
		
		// regenerate surface
		this.surface.curve = this.points;

		// make square texture that ignores circular shape
		var pos = this.surface.threejs.geometry.getAttribute( 'position' ),
			uv = this.surface.threejs.geometry.getAttribute( 'uv' );
		for( var i=0; i<pos.count; i++ )
		{
			uv.setXY( i, 2*pos.getX( i ), 2*pos.getY( i ) );
		}	
	} // Membrane.randomize

	
	
	vibrate( k )
	{
		if( k <= 0 ) return 0;
		if( k >= 1 ) return 0;
		
		return Math.sin( 10*Math.PI*k ) * Math.exp( -5*k );
	} // Membrane.vibrate

	
	
	show(  )
	{
		this.randomize( );

		// vibrate
		new TWEEN.Tween( this )
			.to( {z:1}, Membrane.VIBRATE_SPEED )
			.easing( this.vibrate )
			.onUpdate( obj => playground.ring.z = obj.z )
			.start( );
		
		// animate surface geometry
		new TWEEN.Tween( this.surface )
			.to( {depth:1}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );
				
		var that = this,
			mat = this.surface.threejs.material; // current material

		// animate surface color
		var color = hsl(random(0,360), 20, 100);
		new TWEEN.Tween( mat.color )
			.to( color, Membrane.SHOW_SPEED/2 )
			.easing( TWEEN.Easing.Linear.None )
			.start( );

		// target properties
		var k;
		if( random(0,1)**0.5 > playground.difficulty/100 )
			k = random( 0, 0.1 )
		else
			k = random( 0.7, 0.85 );
			
		new TWEEN.Tween( mat )
			.to( {sheen:0.5*k, metalness:0.85*k, roughness:1-0.85*k, bumpScale:0.8-0.75*k }, Membrane.SHOW_SPEED/2 )
			.easing( TWEEN.Easing.Linear.None )
			.start( );

	} // Membrane.show

	
	
	hide(  )
	{
		// vibrate
		new TWEEN.Tween( this )
			.to( {z:1}, Membrane.VIBRATE_SPEED )
			.easing( this.vibrate )
			.onUpdate( obj => playground.ring.z = obj.z )
			.start( );
		
		// animate surface geometry
		new TWEEN.Tween( this.surface )
			.to( {depth:0.0001}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );

		// target properties
//		var that = this,
//			mat = this.surface.threejs.material; // current material

		// animate surface material
		// new TWEEN.Tween( {r:mat.color.r, g:mat.color.g, b:mat.color.b, s:mat.sheen, m:mat.metalness, f:mat.roughness} )
			// .to( {r:1, g:1, b:1, s:0, m:0, f:1 }, Membrane.SHOW_SPEED/2 )
			// .easing( TWEEN.Easing.Linear.None )
			// .onUpdate( obj => {
				// mat.color.setRGB( obj.r, obj.g, obj.b );
				// mat.sheen = obj.s;
				// mat.metalness = obj.m;
				// mat.roughness = obj.f;
			// })
			// .start( );

	} // Membrane.hide
	
	
	
	update( t, dT )
	{
		// vibrate ring

		return;
	/*	
		this.surface.depth = 1+1*Math.sin(3*t)*Math.cos(3.3*t)*Math.cos(4.1*t);
	
	t=t/2;
		*/
	} // Membrane.update
	
} // class Membrane

