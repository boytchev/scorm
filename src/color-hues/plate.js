//
//	class Plate( center, spin )
//
//	public:
//		hue
//		flipIn( )
//		flipOut( )
//
//	internals:
//		angle
//		hexagonalGeometry( inset )
//		frameMaterial( )
//		toggle( )
//		yoyo( )
//		onClick( )
//		onMark( )
//		onUnmark( )
	


class Plate extends Group
{
	static FLIP_SPEED   = 700; // in ms
	static TOGGLE_SPEED = 300; // in ms
	static YOYO_SPEED   = 150; // in ms
	
	
	
	constructor( center, spin )
	{
		super( suica );

		this.center = center;
		this.spinH = spin;
		this.index = 0;
		
		this.basePlate = convex( this.hexagonalGeometry(0.93), [10,1] );
			its.y = 0.5;
			its.threejs.material = this.frameMaterial();
	
		this.colorPlate = convex( this.hexagonalGeometry(1), [7,0.9] );
			its.image = 'images/hexagon.jpg';
			its.images = [0.435,0.495];
			its.threejs.material.map.offset.set( 0.5, 0.5 );
			its.y = 0.8;
	
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'mouseenter', this.onMark );
		this.addEventListener( 'mouseleave', this.onUnmark );
		
		this.add( this.basePlate, this.colorPlate );
		this.angle = 180;
		this._hue = 0;
		this.selected = false;
		this.isMasterPlate = false;
	} // Plate.constructor



	// a general hexagonal plate with rounded edges
	hexagonalGeometry( inset )
	{
		var geometry = [],
			x, z;
				
		for( var i=0; i<360; i+=60 )
		for( var j=-2; j<=2; j+=4 )
		{
			x = Math.cos( radians(i+j) ),
			z = Math.sin( radians(i+j) );
			geometry.push( [x,-0.5,z], [x,0.5,z] );
			x *= inset;
			z *= inset;
			geometry.push( [x,-0.6,z], [x,0.6,z] );
		}
		
		return geometry;
		
	} // Plate.hexagonalGeometry


	
	// threejs shiny material for the plate base
	frameMaterial( )
	{
		const SCALE = 1.5;
		
		var map = image( 'images/metal_plate.jpg' );
			map.repeat.set( SCALE, SCALE );
			map.offset.set( 0.5, 0.5 );
		
		var normalMap = image( 'images/metal_plate_normal.jpg' );
			normalMap.repeat.set( SCALE, SCALE );
			normalMap.offset.set( 0.5, 0.5 );
		
		var material = new THREE.MeshPhongMaterial({
				color: 'linen',
				shininess: 150,
				map: map,
				normalMap: normalMap,
				normalScale: new THREE.Vector2( 0.2, 0.2 ),
			});

		return material;
		
	} // Plate.frameMaterial

	


	// the flipping angle of a plate
	get angle( )
	{
		return this.spinV;
	} // Plate.angle
	
	set angle( angle )
	{
		this.spinV = angle;
	} // Plate.angle
	
	
	
	// color hue of the plate - the hue is normalized 
	// in order to make percieved hues equally distributed
	get hue( )
	{
		return this._hue;
	} // Plate.hue

	set hue( hue )
	{
		this._hue = hue;

		var colorSpline = spline([
			[0],[18],[60],[72],[108],[140],[174],[210],[242],[268],[295],[332],[360]
		], false, true);

		function cos( base, x )
		{
			x = colorSpline( x/360 )[0];
			return 255*1.25*(Math.cos(radians( x )-radians(base))/2+0.5);
		}

		this.colorPlate.color = rgb(
				cos(0,hue),
				cos(120,hue),
				cos(240,hue) );
	} // Plate.hue
	
	
	
	// flips a plate so the front side is visible
	flipIn( )
	{
		new TWEEN.Tween( this )
			.to( {angle:0}, Plate.FLIP_SPEED )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	} // Plate.flipIn



	// flips out a plate so the back side is visible
	flipOut( )
	{
		this.selected = false;
		
		new TWEEN.Tween( this )
			.to( {angle:180, height:1}, Plate.FLIP_SPEED )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	} // Plate.flipOut( );
	
	
	
	// selects/unselects a plate
	toggle( )
	{		
		this.selected = !this.selected;

		playground.clickSound.play( );

		new TWEEN.Tween( this )
				.to( {
						height: this.selected?15:1,
						angle: (this.selected && !this.isMasterPlate)? -10 : 0
					}, Plate.TOGGLE_SPEED )
				.easing( TWEEN.Easing.Cubic.InOut )
				.start( );
	} // Plate.toggle
	
	
	
	// vibrate the plate
	yoyo( )
	{		
		playground.clickSound.play( );

		new TWEEN.Tween( this )
				.to( {y:-5}, Plate.YOYO_SPEED )
				.easing( TWEEN.Easing.Cubic.Out )
				.repeat( 1 )
				.yoyo( true )
				.start( );
	} // Plate.yoyo
	
	
	
	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
			if( this.isMasterPlate )
			{
				if( playground.canEndGame() )
					playground.endGame( );
				else
					this.yoyo( );
			}
			else
				this.toggle( );
		}
		else
			playground.newGame( 0 );
	} // Plate.onClick
	
	
	
	// marks a plate when the mouse pointer goes over it
	onMark( )
	{
		this.basePlate.color = 'gray';
	} // Plate.onMark
	
	
	
	// unmarks a plate when the mouse pointer goes out of it
	onUnmark( )
	{
		this.basePlate.color = 'linen';
	} // Plate.onUnmark
	
} // class Plate
