//
//	class Track( )
//

	
class Track extends Group
{
	static RADIUS = 2;
	static RIFF = 0.7;
	
	constructor( radius )
	{
		super( suica );
		
		function torus( u )
		{
			var angle = 2*Math.PI*u;
			return [radius*Math.cos(angle), 0, radius*Math.sin(angle)]
		}
		
		// track
		this.track = tube( [0,0,0], torus, Track.RADIUS, [150,20] );
		var pos = this.track.threejs.geometry.getAttribute( 'position' );
		var nor = this.track.threejs.geometry.getAttribute( 'normal' );
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i )/2,
				z = pos.getZ( i ),
				nx = nor.getX( i ),
				ny = nor.getY( i ),
				nz = nor.getZ( i );
				
			if( y<0 )
			{
				y = y/2;
				ny = ny*2;
			}

			if( y>Track.RIFF ) 
			{
				y = y-2*Math.pow(y-Track.RIFF,1/2);
				nx = -nx;
				ny = ny/3;
				nz = -nz;
			}
			else
			{
				if( y>0 )
				{
					y = 0.3*y+0.7;
					nx = 0;
					ny = 1;
					nz = 0;
				}
			}

			pos.setXYZ( i, x, y, z );
			nor.setXYZ( i, nx, ny, nz );
		}
//		this.track.threejs.geometry.computeVertexNormals();
		
this.track.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'white',
						metalness: 0,
						roughness: 0.5,
						map: ScormUtils.image( 'metal_plate.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalScale: new THREE.Vector2( 1/2, 1/2 ),
					} );
					
		this.spinV = random( 0, 90 );
		this.spinH = random( 0, 360 );
		
		this.add( this.track );
		
		new TWEEN.Tween( this )
			.to( {spinV:0, spinH:0}, 10*this.spinV )
			.easing( TWEEN.Easing.Linear.None )
			.start( );

	} // Track.constructor
	
	

} // class Track

