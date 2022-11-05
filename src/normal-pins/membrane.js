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
	
	
	
	// construct the surface
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
				roughness: 1,
				metalness: 0,
				bumpMap: image('images/tile.png'),
				bumpScale: 0.8,
				sheen: 0,
				sheenColor: 'white',
				sheenRoughness: 0.15,
				side: THREE.DoubleSide,
		});
		its.threejs.receiveShadow = true;


		
		return surf;
		
	} // Membrane.constructSurface



	// generate a new coordinates of surface's control points
	randomize( )
	{
		// var scale = THREE.MathUtils.mapLinear( playground?.difficulty || 0, 10, 100, 1, 1.5 ),
			// threshold = (playground?.difficulty/100)**0.5;
		var scale = playground?.configRange( 1, 1.5 ) || 1,
			threshold = (playground?.difficulty/100)**0.5 || 0;
		
		// randomize control points
		for( var n in this.pi )
		{
			var i = this.pi[n],
				j = this.pj[n];

			if( random(0,1) > threshold )
				this.points[i][j][2] = 0;
			else
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

	

	// ease function for vibration, used in show() and hide()
	vibrate( k )
	{
		if( k <= 0 ) return 0;
		if( k >= 1 ) return 0;
		
		return Math.sin( 10*Math.PI*k ) * Math.exp( -5*k );
	} // Membrane.vibrate

	

	// move objects depending on vibration
	setVibroZ( z )
	{
		playground.ring.z = z;
		playground.membrane.z = z;
		for( var pin of playground.pins )
			pin.z = pin.originalZ+z;
	}
	
	
	
	// transforms the surface from 2D into 3D
	show(  )
	{
		this.randomize( );

		// vibrate
		new TWEEN.Tween( this )
			.to( {z:1}, Membrane.VIBRATE_SPEED )
			.easing( this.vibrate )
			.onUpdate( obj => obj.setVibroZ(obj.z) )
			.onComplete( obj => obj.setVibroZ(0) )
			.start( );
		
		// animate surface geometry
		new TWEEN.Tween( this.surface )
			.to( {depth:1}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );
				
		var that = this,
			mat = this.surface.threejs.material; // current material

		// animate surface color
		var color = hsl(0, 20, 100);
		new TWEEN.Tween( mat.color )
			.to( color, Membrane.SHOW_SPEED/2 )
			.easing( TWEEN.Easing.Linear.None )
			.start( );

		// target properties
		var k;
		if( random(0,1)**0.5 > playground.difficulty/100 )
		{	
			k = random( 0, 0.1 );
			playground.shadowLightA.castShadow = true;
			playground.shadowLightB.castShadow = true;
			for( let pin of playground.pins )
				pin.body.threejs.material.metalness = 0.8;
		}
		else
		{
			k = random( 0.7, 0.85 );
			playground.shadowLightA.castShadow = false;
			playground.shadowLightB.castShadow = false;
			for( let pin of playground.pins )
				pin.body.threejs.material.metalness = 0.2;
		}
			
		new TWEEN.Tween( mat )
			.to( {sheen:0.5*k, metalness:0.85*k, roughness:1-0.85*k, bumpScale:0.8-0.75*k }, Membrane.SHOW_SPEED/2 )
			.easing( TWEEN.Easing.Linear.None )
			.start( );

	} // Membrane.show

	

	// transforms the surface from 3D into 2D	
	hide(  )
	{
		// vibrate
		new TWEEN.Tween( this )
			.to( {z:1}, Membrane.VIBRATE_SPEED )
			.easing( this.vibrate )
			.onUpdate( obj => obj.setVibroZ(obj.z) )
			.onComplete( obj => obj.setVibroZ(0) )
			.start( );
		
		// animate surface geometry
		new TWEEN.Tween( this.surface )
			.to( {depth:0.0001}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );

	} // Membrane.hide
	
	
} // class Membrane

