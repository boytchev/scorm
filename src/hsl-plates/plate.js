//
// class Plate
//


class Plate extends Group
{
	static FLIP_SPEED = 700; // in ms
	static TOGGLE_SPEED = 300; // in ms
	
	static blockInteraction = 0;
	
	constructor( playground, center, spin )
	{
		super( suica );

		this.playground = playground;
		this.center = center;
		this.spinH = spin;
		this.index = 0;
		
		this.basePlate = convex( this.hexagonalGeometry, [10,1] );
			its.y = 0.5;
			its.threejs.material = this.frameMaterial;
	
		this.colorPlate = convex( this.hexagonalGeometry, [7,0.9] );
			its.image = 'hexagon.png';
			its.images = [3,5];
			its.y = 0.8;
	
		this.addEventListener( 'click', this.onClick );
		
		this.add( this.basePlate, this.colorPlate );
		this.angle = 180;
		this._hue = 0;
		this.selected = false;
		this.isMasterPlate = false;
	} // Plate.constructor


	get hexagonalGeometry( )
	{
		var geometry = [],
			x, z;
				
		for( var i=0; i<360; i+=60 )
		for( var j=-2; j<=2; j+=4 )
		{
			x = Math.cos( radians(i+j) ),
			z = Math.sin( radians(i+j) );
			geometry.push( [x,-0.5,z], [x,0.5,z] );
			x *= 0.975;
			z *= 0.975;
			geometry.push( [x,-0.6,z], [x,0.6,z] );
		}
		
		return geometry;
		
	} // Plate.hexagonalGeometry

	
	get frameMaterial( )
	{
		const SCALE = 1.5;
		
		var material = new THREE.MeshPhongMaterial({
				color: 'linen',
				shininess: 150,
				map: image( 'metal_plate.jpg' ),
				normalMap: image( 'metal_plate_normal.jpg' ),
				normalScale: new THREE.Vector2( 0.2, 0.2 ),
			});
			
		material.map.repeat.set( SCALE, SCALE );
		material.map.offset.set( 0.5, 0.5 );
		
		material.normalMap.repeat.set( SCALE, SCALE );
		material.normalMap.offset.set( 0.5, 0.5 );
		
		return material;
	} // Plate.frameMaterial

	
	get angle( )
	{
		return this.spinV;
	}
	
	
	set angle( angle )
	{
		this.spinV = angle;
	}
	
	
	get hue( )
	{
		return this._hue;
	}
	
	
	set hue( hue )
	{
		this._hue = hue;
		
		// correct hue
		hue = hue + 7*Math.sin(radians(3*hue))
		
		this.colorPlate.color = hsl( hue, 100, 50 );
	}
	
	
	flipOut( delay=0, flips=1  )
	{
		Plate.blockInteraction++;
		
		new TWEEN.Tween( {angle:this.angle, plate:this} )
				.to( {angle:this.angle+180*flips}, Plate.FLIP_SPEED*flips )
				.easing( TWEEN.Easing.Sinusoidal.InOut )
				.onUpdate( (state) => {
					state.plate.angle = state.angle % 360;
				})
				.onComplete( () => {Plate.blockInteraction--} )
				.delay( 1000*delay )
				.start( );
	}
	
	
	flipIn( delay=0, flips=1 )
	{
		Plate.blockInteraction++;

		new TWEEN.Tween( {angle:this.angle, plate:this} )
				.to( {angle:this.angle-180*flips}, Plate.FLIP_SPEED*flips )
				.easing( TWEEN.Easing.Sinusoidal.InOut )
				.onUpdate( (state) => {
					state.plate.angle = (state.angle+360) % 360;
				})
				.onComplete( () => {Plate.blockInteraction--} )
				.delay( 1000*delay )
				.start( );
	}
	
		
	toggle( )
	{		
		var plate = this;

		plate.selected = !plate.selected;

		Plate.blockInteraction++;
		
		new TWEEN.Tween( {h:plate.selected?1:18} )
				.to( {h:plate.selected?18:1}, Plate.TOGGLE_SPEED )
				.easing( TWEEN.Easing.Cubic.InOut )
				.onUpdate( (state) => {
					plate.height = state.h;
					if( !plate.isMasterPlate )
					{
						plate.angle = -(state.h-1)*0.55;
					}
				})
				.onComplete( () => {Plate.blockInteraction--} )
				.start( );
	}
	
		
	retract( )
	{		
		var plate = this;

		plate.selected = false;

		Plate.blockInteraction++;

		new TWEEN.Tween( {a:plate.angle,h:plate.height} )
				.to( {a: 180,h:1}, Plate.FLIP_SPEED )
				.easing( TWEEN.Easing.Cubic.InOut )
				.onUpdate( (state) => {
					plate.height = state.h;
					plate.angle = (state.a+360) % 360;
				})
				.onComplete( () => {Plate.blockInteraction--} )
				.start( );
	}
	
	
	onClick( )
	{
		if( Plate.blockInteraction > 0 ) return;
		
		// if game is not started, click on any plate will start it
		if( this.playground.gameStarted )
		{
			if( this.isMasterPlate )
				this.playground.endGame( );
			else
				this.toggle( );
		}
		else
		{
			this.playground.newGame( 0 );
		}
	} // Plate.onClick
	
} // class Plate
