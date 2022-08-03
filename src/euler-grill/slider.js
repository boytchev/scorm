//
//	class Slider( )
//

	
class Slider extends Group
{
	static SIZE = [5,2,2];
	static SHADOW_SIZE = [9,4.2];
	static OFFSET = 10;
	static PARK_SPEED = 200;
	static MARKER_Y = 0.3;
	static MARKER_SIZE = [0.2,1,3.5];
	static Y = -Base.PILLAR_SIZE[1]+Base.POS_Y;
	
	constructor( )
	{
		super( suica );

		this.inDrag = false;
		this.dragOffset = 0;

		this.euler = 0; // selected result [-6..6]
		
		// the slider geometry is complex, it start from a cube
		var geometry = new THREE.BoxGeometry( 1, 1, 1, 64, 16, 1 );
		var nor = geometry.getAttribute( 'normal' );
		var pos = geometry.getAttribute( 'position' );
		var uv = geometry.getAttribute( 'uv' );
		for( var i=0; i<nor.count; i++ )
		{
			var x = pos.getX( i ),
				y = 0.3+pos.getY( i ),
				z = pos.getZ( i );
			
			// deform the cube to be more like frustum
			var d = Math.sqrt( x*x+y*y+z*z );
			x = x/d;
			y = y/d;
			z = 2*z/(1+Math.sqrt( x*x+z*z )/2);
			
			// add grooves on the top
			if( y>0 )
			{
				x = x*(1-y/2);
				y = 0.1+y-0.6*Math.cos(4*x);
				if( y>0.3 ) y += 0.03*Math.cos(96*x);
			}
			
			pos.setXYZ( i, x, y, z );
			
			// texture
			uv.setXY( i, 1/2+pos.getZ(i), 1/2+pos.getY(i) );
		}
		geometry.computeVertexNormals( );

		var frontMarker = cube( [0,Slider.Y+Slider.MARKER_Y,Slider.OFFSET], Slider.MARKER_SIZE, 'black' ),
			backMarker = cube( [0,Slider.Y+Slider.MARKER_Y,-Slider.OFFSET], Slider.MARKER_SIZE, 'black' );


		// slider material
		var material = new THREE.MeshStandardMaterial( {
			color: 'Linen',
			metalness: 0,
			roughness: 0.42,
		} );	
			
		// front slider
		this.frontSlider = cube( [0,Slider.Y,Slider.OFFSET], Slider.SIZE, 'linen' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;

		var frontShadow = square( [0,Slider.Y+0.01,Slider.OFFSET], Slider.SHADOW_SIZE, 'black' );
			its.spinV = 90;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.5;
			its.threejs.material.alphaMap = ScormUtils.image( 'slider_ao.jpg' );

		this.backSlider = cube( [0,Slider.Y,-Slider.OFFSET], Slider.SIZE, 'linen' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;

		var backShadow = frontShadow.clone;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.5;
			its.threejs.material.alphaMap = ScormUtils.image( 'slider_ao.jpg' );
			its.z = -its.z;

		this.add( this.frontSlider, this.backSlider, frontShadow, backShadow, frontMarker, backMarker );

		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerdown', this.onPointerDown );

	} // Slider.constructor



	// handles clicks on the box
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the slider will start it
		if( !playground.gameStarted )
			playground.newGame( );
		
	} // Slider.onClick



	onPointerDown( event )
	{
		if( playground.gameStarted )
		{
			this.inDrag = true;
			this.dragOffset = playground.dragX(event) - this.x;
			orb.enableRotate = false;
		}
		else
		{
			playground.newGame( );
		}
	} // Slider.onPointerDown
	

	slideTo( x )
	{
		x = x - this.dragOffset;
		
		// restrict slider to groove
		var limit = Base.GROOVE_SIZE[0]/2;
		x = THREE.MathUtils.clamp( x, -limit, limit );
		
		// find closest park slot
		var step = 2*limit / 6;
		var xPark = Math.round((x+limit)/step)*step - limit,
			xOldPark = Math.round((this.x+limit)/step)*step - limit;
	
		// glue x to park slot
		x = 0.6*x + 0.4*xPark;
		
		this.x = x;
		
		if( xPark!=xOldPark )
			playground.slideOnSound.play( );
	} // Slider.slideTo
	


	slideEnd( )
	{
		playground.slideOffSound.play( );
		
		// restrict slider to groove
		var limit = Base.GROOVE_SIZE[0]/2;
		
		// find closest park slot
		var step = 2*limit / 6,
			xPark = Math.round((this.x+limit)/step)*step - limit;
			
		this.euler = Math.round( 2*xPark/step );

		new TWEEN.Tween( this )
			.to( {x:xPark}, Slider.PARK_SPEED )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	} // Slider.slideEnd
	
} // class Slider

