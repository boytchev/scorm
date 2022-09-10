//
//	class Thimble( )
//

	
class Thimble extends Group
{
	static RADIUS = 8;
	static HEIGHT = 25;
	static PLATE_HEIGHT = 2.5;
	
	constructor( )
	{
		super( suica );

		this.lines = 3;
		this.bumps = [];
		this.zones = [];
		this.codes = [];
		
		this.extra_bumps = 3;
		
		this.generateBumpsPositions( );
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
		var map = ScormUtils.image( 'metal_plate.jpg', 10/2, 12 ),
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
		
		
		// generate bumps points in 3D
		var bumpsPoints = [],
			dist = (Thimble.RADIUS+1)/Thimble.HEIGHT,
			y = 1-Thimble.PLATE_HEIGHT/Thimble.HEIGHT,
			angle;
			
		// bumps for lines
		for( let i=0; i<2*this.lines; i++ )
		{
			angle = this.bumps[i]/12*Math.PI*2;
			bumpsPoints.push( new THREE.Vector3(
				dist*Math.cos(angle),
				y,
				dist*Math.sin(angle)
			) );
			if( i%2 ) y -= Thimble.PLATE_HEIGHT/Thimble.HEIGHT;
		}
	
		// extra bumps
		y = 1-Thimble.PLATE_HEIGHT/Thimble.HEIGHT;
		for( let i=0; i<this.extra_bumps; i++ )
		{
			angle = random([0,1,2,3,4,5,6,7,8,9,10,11])/12*Math.PI*2;
			bumpsPoints.push( new THREE.Vector3(
				dist*Math.cos(angle),
				y - Thimble.PLATE_HEIGHT*random([0,1,2,3,4,5])/Thimble.HEIGHT,
				dist*Math.sin(angle)
			) );
		}

		// makes the bumps
		function makeBumps( geometry )
		{
			var q = new THREE.Vector3( ),
				pos = geometry.getAttribute( 'position' );
			for( let i=0; i<pos.count; i++ )
			{
				q.set( pos.getX(i), pos.getY(i), pos.getZ(i) );
				//console.log(q.x.toFixed(2), q.y.toFixed(2), q.z.toFixed(2))
				for( let j=0; j<bumpsPoints.length; j++ )
				{
					dist = q.distanceTo(bumpsPoints[j]);
					//console.log( dist.toFixed(3), 2/Thimble.HEIGHT );
					if( dist < 20/Thimble.HEIGHT )
					{
						var k = 1-1/dist/dist/Thimble.HEIGHT/Thimble.HEIGHT/5;
						
						q.x *= k;
						q.z *= k;
					}
				}
				pos.setXYZ( i, q.x, q.y, q.z );
			}
	
			geometry.computeVertexNormals();
		}
		// construct the outside thimble
		this.outsideThimble = tube( [0,0,0], thimbleProfile, 0, [40,120], Thimble.HEIGHT );
			makeBumps( its.threejs.geometry );
			its.threejs.material = outsideMaterial;
		ScormUtils.addUV2( this.outsideThimble );

		this.add( this.outsideThimble );
		
		// construct the inside thimble
		this.insideThimble = tube( [0,0,0], thimbleProfile, 0, [40,120], [Thimble.HEIGHT*0.97,Thimble.HEIGHT,Thimble.HEIGHT*0.97] );
			makeBumps( its.threejs.geometry );
			its.threejs.material = insideMaterial;
		ScormUtils.addUV2( this.insideThimble );

		this.add( this.insideThimble );
				
	} // Thimble.constructThimble

	
	
	// find positions for the bumps
	generateBumpsPositions( )
	{
		// pick bump positions, each two consequitive numbers are one pair
		this.bumps = [];
		for( var i=0; i<12; i++ )
		{
			this.bumps.push( i );
			this.bumps.sort( ()=>random(-10,10) );
		}
		this.bumps = this.bumps.slice( 0, 2*this.lines );
		
		// define zones boundaries, the last zone ends at the first bump + full cycle
		this.zones = [];
		this.zones.push( ...this.bumps) ;
		this.zones.sort( function( a, b ) {return a-b;} );
		this.zones.push( this.zones[0]+12 );
	
		// random bitmask codes
		this.codes = [];
		this.codes.push( Math.round(random(1024,65535)).toString(2).substr(2,this.lines));
		for( var i=1; i<this.zones.length-1; i++ )
		{
			// swich bit corresponding the line pair containing zones[i]
			var pair = this.bumps.indexOf(this.zones[i])>>1;
			
			var code = this.codes[i-1];
			code = code.substr(0,pair)+((code[pair]=='1')?'0':'1')+code.substr(pair+1);
			this.codes.push( code );
		}

	
		console.log( 'bumps',this.bumps );
		console.log( 'zones',this.zones );
		console.log( 'codes',this.codes );
		
	} // Thimble.generateBumpsPositions




} // class Thimble

