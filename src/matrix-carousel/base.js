//
//	class Base( )
//

	
class Base extends Group
{
	static FLOOR_SIZE = 40;
	static BASE_SIZE = 30;
	static BASE_HEIGHT = 4;
	
	constructor( )
	{
		super( suica );

		this.constructBase();
		
		this.addEventListener( 'click', this.onClick );

	} // Base.constructor



	// handles clicks on the base
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Base.onClick

	
	
	// construct the base
	constructBase( )
	{
		// main body of the base
		var map = ScormUtils.image( 'metal_plate.jpg', 30, 3 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 30, 3 ),
			aoMap = ScormUtils.image( 'base_ao.jpg', 1, 1 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0.3,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			aoMap: aoMap,
			aoMapIntensity: 0.7,
		} );	

		var base = prism( 240, [0,0,0], [Base.BASE_SIZE,Base.BASE_HEIGHT] );
			its.threejs.geometry = new THREE.CylinderGeometry( 1/2, 1/2, 1, 240, 10 ).translate(0,1/2,0);
			its.threejs.material = material;
		ScormUtils.addUV2( base );
			
		// update the geometry
		var pos = base.threejs.geometry.getAttribute( 'position' ),
			uv = base.threejs.geometry.getAttribute( 'uv' );
		for( let i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i );
				
			var x1,z1,x2,z2;

				x2 = x*1.5;
				z2 = z*1.5;

			if( Math.abs(x)>0.1 || Math.abs(z)>0.1 )
			{
				var angle = Math.atan2( z, x );
					x = Math.cos( angle );
					z = Math.sin( angle );
					
				var radius=0;
					radius = 1/2*(1+0.1*Math.cos(6*angle));
					x1 = x*radius;
					z1 = z*radius;
					
				var k = y*y;
				pos.setXYZ( i, x2*(1-y)+x1*y, y**6-0.01, z2*(1-y)+z1*y );
			}
			
			uv.setY( i, Math.pow(y,1.5) );
			
		}	
		base.threejs.geometry.computeVertexNormals()		
		
		// black top surface
		var top = polygon( 240, [0,Base.BASE_HEIGHT,0], Base.BASE_SIZE, 'black' );
			its.spinV = 90;
			its.threejs.material.polygonOffset = true;
			its.threejs.material.polygonOffsetFactor = -2;
			its.threejs.material.polygonOffsetUnits = -1;
		
		var pos = top.threejs.geometry.getAttribute( 'position' );
		for( let i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				z = pos.getY( i ),
				y = pos.getZ( i );
				
			var angle = Math.atan2( z, x );
			
			if( x*x+z*z > 0.1 )
			{
				x = Math.cos(angle);
				z = Math.sin(angle);
				var radius = 1/2*(1+0.1*Math.cos(6*angle));
				x *= radius;
				z *= radius;
				pos.setXYZ( i, x, z, y );
			}
		}

		this.add( base, top );
	} // Base.constructBase
	
} // class Base

