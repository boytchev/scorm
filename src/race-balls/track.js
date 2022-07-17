//
//	class Track( )
//

	
class Track extends Group
{
	static RADIUS = 2;
	static DEPTH = 2;
	static RIFF = 0.7;
	static BALL_SIZE = 3;
	static BALL_Y = 1.3;
	
	constructor( radius )
	{
		super( suica );
	
		this.radius = radius;
		this.speed = random(0.1,0.3)///radius//random(1,2)/radius;
		this._pos = 0;

		// create track
		this.track = tube( [0,0,0], spline(this.trajectory,radius,0), Track.RADIUS, [150,20] );
		this.reshapeTrack();
		this.track.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'lightgray',
						metalness: 0,
						roughness: 0.5,
						map: ScormUtils.image( 'metal_plate.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalScale: new THREE.Vector2( 1/2, 1/2 ),
					} );

		var ballLight = new THREE.SpotLight( 'white', -1, 3*Track.BALL_SIZE, 1.2, 1 );
			ballLight.position.y = 0.1;
		
		// create ball
		var target = new THREE.Object3D();
			target.position.set( 0, -2, 0 );
			ballLight.target = target;
		
		this.subball = sphere( [0,0,0], Track.BALL_SIZE );
		this.subball.threejs.material = new THREE.MeshPhysicalMaterial( {
						color: 'white',
						metalness: 0.,
						roughness: 0,
						sheen: 1/2,
						sheenColor: 'blue',
						sheenRoughness: 0.5,
						map: ScormUtils.image( 'marble.jpg', 1, 1 ),
					} );
		this.subball.spinV = random( 0, 90 );
		this.subball.spinH = random( 0, 360 );

		this.trueball = group( this.subball );
		this.ball = group( this.trueball );
		this.ball.threejs.add( ballLight, target );

		this.pos = random(0,1);

					
		this.spinV = 180;
		this.spinH = random( 0, 360 );
		
		this.add( this.track, this.ball );
		
		new TWEEN.Tween( this )
			.to( {spinV:random(-90,90), spinH:random(0,360), spinT:random(0,360)}, 30*this.spinV )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );

	} // Track.constructor
	
	


	get pos( )
	{
		return this._pos;
	}
	set pos( u )
	{
		this._pos = u;
		this.ball.center = this.trajectory( u, this.radius, Track.BALL_Y );
		this.trueball.spinH = -360*u;
		this.trueball.spinV = u*this.radius*200;
	} // Track.pos
	
	
	
	trajectory( u, radius, dY )
	{
		var angle = 2*Math.PI*u;
		return [radius*Math.cos(angle), dY, radius*Math.sin(angle)]
	} // Track.trajectory



	reshapeTrack( )
	{
		var pos = this.track.threejs.geometry.getAttribute( 'position' ),
			nor = this.track.threejs.geometry.getAttribute( 'normal' );
			
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i )/2,
				z = pos.getZ( i );
				
			var	nx = nor.getX( i ),
				ny = nor.getY( i ),
				nz = nor.getZ( i );
				
			// flatten the bottom
			if( y<0 )
			{
				y = y/2;
				ny = ny*2;
			}

			// make a groove at the top
			if( y>Track.RIFF ) 
			{
				// the groove itself
				y = y-Track.DEPTH*Math.pow(y-Track.RIFF,1/2);
				nx = -nx;
				ny = ny/3;
				nz = -nz;
			}
			else
			{
				// flatten the edges around the groove
				if( y>0 )
				{
					y = 0.3*y+0.7;
					nx = 0;
					ny = 1;
					nz = 0;
				}
			}

			// var angle = Math.atan2( z, x );
			// var r = Math.round( 1+Math.sqrt(x*x+z*z)/35);
			// y += 0.8*Math.sin( 2*r*angle )+0.5*Math.sin( 5*r*angle )+0.3*Math.sin( 11*r*angle );
			
			pos.setXYZ( i, x, y, z );
			nor.setXYZ( i, nx, ny, nz );
		}
	} // Track.reshapeTrack
	
	moveBall( dT )
	{
		this.pos += this.speed*dT;
	}
} // class Track

