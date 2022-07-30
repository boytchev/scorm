//
//	class Slider( )
//

	
class Slider extends Group
{
	static SIZE = [5,2,2];
	static SHADOW_SIZE = [9,4.2];
	static OFFSET = 10;
	
	constructor( )
	{
		super( suica );

		var geometry = new THREE.BoxGeometry( 1, 1, 1, 64, 16, 1 );
		var nor = geometry.getAttribute( 'normal' );
		var pos = geometry.getAttribute( 'position' );
		var uv = geometry.getAttribute( 'uv' );
		for( var i=0; i<nor.count; i++ )
		{
			var x = pos.getX( i ),
				y = 0.3+pos.getY( i ),
				z = pos.getZ( i );
				
			var d = Math.sqrt( x*x+y*y+z*z );
			x = x/d;
			y = y/d;
			z = 2*z/(1+Math.sqrt( x*x+z*z )/2);
			
			if( y>0 )
			{
				x = x*(1-y/2);
				y = 0.1+y-0.6*Math.cos(4*x);
				if( y>0.3 ) y += 0.03*Math.cos(96*x);
			}
			
			pos.setXYZ( i, x, y, z );
			if( Math.abs(x)<0.1 ) nor.setXYZ( i, 0, 0, 0 );
			
			// texture
			uv.setXY( i, 1/2+pos.getZ(i), 1/2+pos.getY(i) );
		}
		geometry.computeVertexNormals( );

		for( var i=0; i<nor.count; i++ )
		{
			var x = pos.getX( i );
			var y = pos.getY( i );
				
			if( Math.abs(x)<1/62 && y>0.2 ) nor.setXYZ( i, 0, 0, 0 );
		}


		// pillar material
		var material = new THREE.MeshStandardMaterial( {
			color: 'Linen',
			metalness: 0,
			roughness: 0.42,
		} );	
			
		// front slider
		this.frontSlider = cube( [0,-Base.PILLAR_SIZE[1]+Base.SIZE[1]+2,Slider.OFFSET], Slider.SIZE, 'linen' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;

		var frontShadow = square( [0,-Base.PILLAR_SIZE[1]+Base.SIZE[1]+2.01,Slider.OFFSET], Slider.SHADOW_SIZE, 'black' );
			its.spinV = 90;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.5;
			its.threejs.material.alphaMap = ScormUtils.image( 'slider_ao.jpg' );

		this.backSlider = cube( [0,-Base.PILLAR_SIZE[1]+Base.SIZE[1]+2,-Slider.OFFSET], Slider.SIZE, 'linen' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;

		var backShadow = frontShadow.clone;
			its.threejs.material.transparent = true;
			its.threejs.material.opacity = 0.5;
			its.threejs.material.alphaMap = ScormUtils.image( 'slider_ao.jpg' );
			its.z = -its.z;

		this.add( this.frontSlider, this.backSlider, frontShadow, backShadow );



		
		this.addEventListener( 'click', this.onClick );

	} // Slider.constructor



	// handles clicks on the box
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
//			this.toggle( );
		}
		else
			playground.newGame( );
		
		playground.clickSound?.play();
		
	} // Slider.onClick
	
	
} // class Slider

