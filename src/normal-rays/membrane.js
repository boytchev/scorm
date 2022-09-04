//
//	class Membrane( )
//

	
class Membrane extends Group
{
	
	static GRID = 10;
	static NON_FLAT = 0.7; // ratio
	static SHOW_SPEED = 1000;
	static HIDE_SPEED = 500;
	static BUMP_HEIGHT = 15;
	
	constructor( )
	{
		super( suica );

		this.pi = [];
		this.pj = [];
		this.pd = [];
		this.points = [];
		
		this.surface = this.constructSurface( );
		this.init( 10 );
		
		this.add( this.surface );

// for( var i=0; i<10; i++ )
// {
	// var s = cone( this.surface.curve(random(0,1),random(0,1)), [0.2,10], 'black' );
	// s.spinV = 90;
	// this.add( s );
// }
	
		this.addEventListener( 'click', this.onClick );

	} // Membrane.constructor



	// handles clicks on the membrane
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
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


		var surf = surface( [0,0,0], this.points, [150,150] );

		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'tan',		// black
				// clearcoat: 0,
				// clearcoatRoughness: 0.2,
				roughness: 1,
				metalness: 0,
				bumpMap: image('images/tile.png'),
				bumpScale: 0.5,
				sheen: 0,	// 1.5
				sheenColor: 'white',
				sheenRoughness: 0.3,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.5,
		});


		
		return surf;
		
	} // Membrane.constructSurface



	init( difficulty )
	{
		var k = THREE.MathUtils.mapLinear( difficulty, 10, 100, 0, 1 );
		
		// randomize control points
		for( var n in this.pi )
		{
			var i = this.pi[n],
				j = this.pj[n];

			this.points[i][j][2] = Membrane.BUMP_HEIGHT * random(-1,1);
		}

		// set material
		this.surface.threejs.material.color.setRGB( 1-k, 1-k, 1-k );
		this.surface.threejs.material.sheen = 1.5*k;

		// make the surface flat
		this.surface.depth = 0.01;
		
		// regenerate surface
		this.surface.curve = this.points;

		// make square texture that ignores circular shape
		var pos = this.surface.threejs.geometry.getAttribute( 'position' ),
			uv = this.surface.threejs.geometry.getAttribute( 'uv' );
		for( var i=0; i<pos.count; i++ )
		{
			uv.setXY( i, 2*pos.getX( i ), 2*pos.getY( i ) );
		}
		
	}
	
	
	show(  )
	{
		this.init( playground.difficulty );

		// animate surface appearance
		new TWEEN.Tween( this.surface )
			.to( {depth:1}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );
		new TWEEN.Tween( this.surface.threejs.material )
			.to( {opacity:1}, Membrane.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );

	} // Membrane.inflate
	
	
	
	update( t, dT )
	{
		return;
	/*	
		this.surface.depth = 1+1*Math.sin(3*t)*Math.cos(3.3*t)*Math.cos(4.1*t);
	
	t=t/2;
		*/
	} // Membrane.update
	
} // class Membrane

