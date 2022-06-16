//
// class Plate
//


class Plate extends Group
{
	static FLIP_SPEED = 700; // in ms
	
	constructor( center, spin )
	{
		super( suica );

		this.center = center;
		this.spinH = spin;
		
		var basePlate = convex( this.hexagonalGeometry, [10,1] );
			its.threejs.material = this.frameMaterial;
	
		var colorPlate = convex( this.hexagonalGeometry, [7,0.9] );
			its.image = 'hexagon.png';
			its.images = [3,5];
			its.y = 0.3;
			its.color = hsl( random(0,359), 100, 50 );
	
		this.add( basePlate, colorPlate );
		this.angle = 180;
		
	} // Plate.constructor


	get hexagonalGeometry( )
	{
		var geometry = [],
			x, z;
				
		for( var i=0; i<360; i+=60 )
		for( var j=-4; j<=4; j+=4 )
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
	
	
	flipOut( delay, flips=1  )
	{
		new TWEEN.Tween( {angle:this.angle, plate:this} )
				.to( {angle:this.angle+180*flips}, Plate.FLIP_SPEED*flips )
				.easing( TWEEN.Easing.Sinusoidal.InOut )
				.onUpdate( (state) => {
					state.plate.angle = state.angle % 360;
				})
				.delay( 1000*delay )
				.start( );
	}
	
	
	flipIn( delay, flips=1 )
	{
		new TWEEN.Tween( {angle:this.angle, plate:this} )
				.to( {angle:this.angle-180*flips}, Plate.FLIP_SPEED*flips )
				.easing( TWEEN.Easing.Sinusoidal.InOut )
				.onUpdate( (state) => {
					state.plate.angle = (state.angle+360) % 360;
				})
				.delay( 1000*delay )
				.start( );
	}
	
} // class Plate
