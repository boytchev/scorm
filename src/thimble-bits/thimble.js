//
//	class Thimble( )
//

	
class Thimble extends Group
{
	static RADIUS = 8;
	static HEIGHT = 25;
	
	constructor( )
	{
		super( suica );

		this.constructThimble( );
		
		var light = new THREE.PointLight( 'white', 1, Thimble.HEIGHT/2, 1 );
			light.position.set( 0, Thimble.HEIGHT/2, 0 );
		this.threejs.add( light );
			
		this.addEventListener( 'click', this.onClick );

		this.y = Base.POS_Y+0.1;
		
	} // Thimble.constructor



	// handles clicks on the thimble
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Thimble.onClick
	
	
	
	// construct the thimble
	constructThimble( )
	{
		// main body of the thimble
		var map = ScormUtils.image( 'metal_plate.jpg', 6, 12 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg' ),
			lightMap = ScormUtils.image( 'thimble_light.jpg' );
		var outsideMaterial = new THREE.MeshPhysicalMaterial( {
			color: 'dimgray',
			metalness: 0.3,
			roughness: 0.4,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 1, 1 ),
			// polygonOffset: true,
			// polygonOffsetUnits: 2,
			// polygonOffsetFactor: 2,
			lightMap: lightMap,
			lightMapIntensity: 2,
			side: THREE.FrontSide,
		} );	
		var insideMaterial = new THREE.MeshPhysicalMaterial( {
			color: 'cornflowerblue',
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			metalness: 0.5,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 1, 1 ),
			emissive: 'cornflowerblue',
			emissiveIntensity: 0.5,
			// polygonOffset: true,
			// polygonOffsetUnits: 2,
			// polygonOffsetFactor: 2,
			//lightMap: lightMap,
			//lightMapIntensity: 2,
			side: THREE.BackSide,
		} );	


		function thimbleProfile( u )
		{
			var r = Thimble.RADIUS/Thimble.HEIGHT;
				
			var curveHeight = 0.3;

			// the bottom spherical curve
			if( u <= curveHeight )
			{
				r *= Math.sqrt(1 - Math.pow(1-u/curveHeight,2));
			}

			// the top tiny outskirt
			if( u == 1 )
			{
				r = r + 0.6/Thimble.HEIGHT;
			}
			
			return [0, u, 0, r];
			
		} // thimbleProfile
		
		
		// construct the outside thimble
		this.outsideThimble = tube( [0,0,0], thimbleProfile, 0, [40,100], Thimble.HEIGHT );
			its.threejs.material = outsideMaterial;
		ScormUtils.addUV2( this.outsideThimble );

		this.add( this.outsideThimble );
		
		// construct the inside thimble
		this.insideThimble = tube( [0,0,0], thimbleProfile, 0, [40,100], [Thimble.HEIGHT*0.97,Thimble.HEIGHT,Thimble.HEIGHT*0.97] );
			its.threejs.material = insideMaterial;
		ScormUtils.addUV2( this.insideThimble );

		this.add( this.insideThimble );
				
	} // Thimble.constructThimble

	
} // class Thimble

