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
		this.speed = random(0.1,0.3);
		this._pos = 0;
		this.selected = false;

		// create track
		this.track = tube( [0,0,0], spline(this.trajectory,radius,0), Track.RADIUS, [100,15] );
		this.reshapeTrack();
		this.track.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'lightgray',
						metalness: 0,
						roughness: 0.5,
						map: ScormUtils.image( 'metal_plate.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 10*Math.round(Math.max(1,radius/5)), 4, 0.25 ),
						normalScale: new THREE.Vector2( 1/2, 1/2 ),
					} );

		this.ballLight = new THREE.SpotLight( 'white', -1, 3*Track.BALL_SIZE, 1.2, 1 );
		this.ballLight.position.y = 0.1;
		
		// create ball
		var target = new THREE.Object3D();
			target.position.set( 0, -2, 0 );
		this.ballLight.target = target;
		
		this.subball = sphere( [0,0,0], Track.BALL_SIZE );
		this.subball.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'white',
						metalness: 0.,
						roughness: 0,
						map: ScormUtils.image( 'marble.jpg', 1, 1 ),
						emissive: 'orange',
						emissiveIntensity: 0,
					} );
		this.subball.spinV = random( 0, 90 );
		this.subball.spinH = random( 0, 360 );

		this.trueball = group( this.subball );
		this.ball = group( this.trueball );
		this.ball.threejs.add( this.ballLight, target );
		this.ball.size = 0;

		this.pos = random(0,1);

		this.spinV = 180;
		this.spinH = 0;
		
		this.add( this.track, this.ball );
		
		this.addEventListener( 'click', this.onClick );

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

			pos.setXYZ( i, x, y, z );
			nor.setXYZ( i, nx, ny, nz );
		}
	} // Track.reshapeTrack
	
	
	
	moveBall( dT )
	{
		this.pos += this.speed*dT;
	} // Track.moveBall
	
	
	
	// handles clicks on a track
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
			this.toggle( );
		}
		else
			playground.newGame( );
		
		playground.clickSound?.play();
		
	} // Track.onClick
	
	
	
	// selects a track on click
	toggle( )
	{
		this.selected = !this.selected;
		
		if( this.selected )
		{
			this.track.threejs.material.color.setRGB( 0.2, 0.2, 0.2 );
			this.subball.color = 'orange';
			this.subball.threejs.material.emissiveIntensity = 0.6;
			this.ballLight.color.set( 'orange' );
			this.ballLight.intensity = 3;
			this.ballLight.position.y = 4;
		}
		else
		{
			this.track.color = 'lightgray';
			this.subball.color = 'white';
			this.subball.threejs.material.emissiveIntensity = 0;
			this.ballLight.color.set( 'white' );
			this.ballLight.intensity = -1;
			this.ballLight.position.y = 0.1;
		}
	} // Track.onMark

	
} // class Track

