//
//	class Thimble( )
//

	
class Thimble extends Group
{
	static RADIUS = 8;
	static HEIGHT = 22.5;
	static FADEOUT_SPEED = 300;
	
	constructor( )
	{
		super( suica );

		this.lines = 0;
		this.extraBumps = 0;
		this.shownHints = 0;
		
		this.bumps = [];
		this.zones = [];
		this.codes = [];
		
		this.plates = [];

		this.userZone = -1;
		
		this.insideThimble = null;
		this.outsideThimble = null;
		this.threadMaterial = null;
		this.threads = [];
		this.bumpPoints = [];
		
		// executed once
		this.constructThreads( );
		this.constructThimble( );
		this.constructPlates( );
		
		// executed for every game
		this.generateBumpsPositions( );
		this.regenerateThimble( );
		this.regenerateThreads( )
		
		var light = new THREE.SpotLight( 'azure', 1.5, 30, Math.PI/2, 1 );
			light.position.set( 0, Thimble.HEIGHT, 0 );
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
		var map = ScormUtils.image( 'metal_plate.jpg', 9, 12, 1/2, 0 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', 9, 12, 1/2, 0 ),
			lightMap = ScormUtils.image( 'thimble_light.jpg' );

		var outsideMaterial = new THREE.MeshPhysicalMaterial( {
			color: 'lightgray',
			clearcoat: 0.5,
			clearcoatRoughness: 0.2,
			metalness: 0.7,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 1, 1 ),
			lightMap: lightMap,
			lightMapIntensity: 2,
			side: THREE.FrontSide,
		} );	
		
		var insideMaterial = new THREE.MeshPhysicalMaterial( {
			color: new THREE.Color( 0.5, 0.6, 1.2 ),
			clearcoat: 1,
			clearcoatRoughness: 0.3,
			metalness: 0.1,
			roughness: 0.2,
			map: map,
//			normalMap: normalMap,
//			normalScale: new THREE.Vector2( 1/2, 2 ),
			emissive: 'cornflowerblue',
			emissiveIntensity: 0.5,
			side: THREE.BackSide,
		} );	

		
		// construct the outside thimble
		this.outsideThimble = tube( [0,0,0], [[0,0,0], [0,0,0]], 0, [60,120], Thimble.HEIGHT );
			its.threejs.material = outsideMaterial;

		this.add( this.outsideThimble );
		
		// construct the inside thimble
		this.insideThimble = tube( [0,0,0], [[0,0,0], [0,0,0]], 0, [60,120], [Thimble.HEIGHT*0.95,Thimble.HEIGHT,Thimble.HEIGHT*0.95] );
			its.threejs.material = insideMaterial;

		this.add( this.insideThimble );

	} // Thimble.constructThimble
	
	
	
	// construct the plates
	constructPlates( )
	{
		for( var i=0; i<2*Playground.MAX_BITS; i++ )
			this.plates.push( new Plate );
	} // Thimble.constructPlates

	
	
	// constructs threds as geometries, that are reused
	constructThreads( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', 4, 1/2, 0, 0.25  ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg' );

		this.threadMaterial = new THREE.MeshPhysicalMaterial( {
			color: new THREE.Color( 1.5, 1.5, 1.5 ),
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			metalness: 0.5,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 1, 1 ),
			emissive: 'cornflowerblue',
			emissiveIntensity: 0.3,
			side: THREE.FrontSide,
		} );	

		for( var i=0; i<Playground.MAX_BITS; i++ )
		{
			var thread = tube( [0,0,0], [[0,0,0], [0,0,0]], 0.01, [40,16], Thimble.HEIGHT );
				its.threejs.material = this.threadMaterial;
				its.visible = false;
				
			this.threads.push( thread );
			this.add( thread );
		}
	} // Thimble.constructThreads
	
	
	
	// regenerate the thimble with new set of bumps
	regenerateThimble( )
	{
		// main body of the thimble
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
		this.bumpsPoints = [];
		
		var dist = (Thimble.RADIUS+0.5)/Thimble.HEIGHT,
			y = 1-Tile.HEIGHT/Thimble.HEIGHT,
			angle;
			
		// bumps for lines
		for( let i=0; i<2*this.lines; i++ )
		{
			angle = this.bumps[i]/12*Math.PI*2;
			this.bumpsPoints.push( new THREE.Vector3(
				dist*Math.cos(angle),
				y,
				dist*Math.sin(angle)
			) );
			if( i%2 ) y -= Tile.HEIGHT/Thimble.HEIGHT;
		}

		// extra bumps
		y = 1-Tile.HEIGHT/Thimble.HEIGHT;
		for( let i=0; i<this.extraBumps; i++ )
		{
			angle = random([0,1,2,3,4,5,6,7,8,9,10,11])/12*Math.PI*2;
			
			var pos = new THREE.Vector3(
				dist*Math.cos(angle),
				y - Tile.HEIGHT*random([0,1,2,3,4,5])/Thimble.HEIGHT,
				dist*Math.sin(angle)
			);

			var minDistance = 1;
			for( var j=0; j<this.bumpsPoints.length; j++ )
				minDistance = Math.min( minDistance, pos.distanceTo(this.bumpsPoints[j]) );
			
			if( minDistance > 0.05 )
				this.bumpsPoints.push( pos );
		}

		// makes the bumps
		var that = this;
		function makeBumps( geometry, scale, topRimScale )
		{
			var subScale = (scale+1)/2;
			
			var q = new THREE.Vector3( ),
				pos = geometry.getAttribute( 'position' );
			for( let i=0; i<pos.count; i++ )
			{
				q.set( pos.getX(i), pos.getY(i), pos.getZ(i) );
				//console.log(q.x.toFixed(2), q.y.toFixed(2), q.z.toFixed(2))
				for( let j=0; j<that.bumpsPoints.length; j++ )
				{
					// for bumps on the inner side, if they are not
					// for lines, but extra bumps, reduce their height
					var s;
					if( scale>1 && j>=2*that.lines )
						s = subScale;
					else
						s = scale;
					
					dist = q.distanceTo(that.bumpsPoints[j]);
					//console.log( dist.toFixed(3), 2/Thimble.HEIGHT );
					if( dist < 0.04*scale**2 )
					{
						var k = 1-0.000003*s**2.5/dist**2.5;
						
						q.x *= k;
						q.z *= k;
					}
				}
				
				if( q.y==1 )
				{
					q.x *= topRimScale;
					q.z *= topRimScale;
				}
				
				pos.setXYZ( i, q.x, q.y, q.z );
			}
	
			geometry.computeVertexNormals();
		}

		// regenerate the outside thimble
		this.outsideThimble.curve = thimbleProfile;
		makeBumps( this.outsideThimble.threejs.geometry, 1, 1 );
		ScormUtils.addUV2( this.outsideThimble );

		// construct the inside thimble
		this.insideThimble.curve = thimbleProfile;
		makeBumps( this.insideThimble.threejs.geometry, 2, 1/0.97 );
		ScormUtils.addUV2( this.insideThimble );

	} // Thimble.regenerateThimble



	// regenerate threads depending on bumps and make them visible again
	regenerateThreads( )
	{
		// construct threads
		var scale1  = 0.85,
			scale2 = 0.65;

		for( var i=0; i<Playground.MAX_BITS; i++ )
		{
			// this thread is hidden
			if( i >= this.lines )
			{
				this.threads[i].visible = false;
				continue;
			}
			
			var v1 = [ 	scale1*this.bumpsPoints[2*i].x,
						       this.bumpsPoints[2*i].y,
						scale1*this.bumpsPoints[2*i].z ],
						
				v2 = [	scale2*this.bumpsPoints[2*i].x,
						       this.bumpsPoints[2*i].y,
						scale2*this.bumpsPoints[2*i].z ],
						
				v3 = [	(this.bumpsPoints[2*i].x+this.bumpsPoints[2*i+1].x)/4.5,
						 this.bumpsPoints[2*i].y,
						(this.bumpsPoints[2*i].z+this.bumpsPoints[2*i+1].z)/4.5 ],
						
				v4 = [	scale2*this.bumpsPoints[2*i+1].x,
						       this.bumpsPoints[2*i+1].y,
						scale2*this.bumpsPoints[2*i+1].z ],
						
				v5 = [	scale1*this.bumpsPoints[2*i+1].x,
						       this.bumpsPoints[2*i+1].y,
						scale1*this.bumpsPoints[2*i+1].z ];

			var threadSpline = spline( [v1,v1,v2,v3,v4,v5,v5], false, false );

			function threadCurve( u )
			{
				// get x,y,z
				var p = threadSpline( u );
			
				// calculate radius
				var r = 0.025* (0.6 + 0.4*Math.cos( 2*Math.PI * u ) );
				
				p.push( r );
				
				return p;
			}
			
			
			this.threads[i].curve = threadCurve;
			this.threads[i].visible = true;
		}
		
	} // Thimble.regenerateThreads
	
	
	
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

	
//		console.log( 'bumps',this.bumps );
//		console.log( 'zones',this.zones );
//		console.log( 'codes',this.codes );
		
	} // Thimble.generateBumpsPositions



	regenerate( )
	{
		this.generateBumpsPositions( );
		this.regenerateThimble( );
		this.regenerateThreads( )
		
		this.userZone = Math.floor( random( 0, this.zones.length-1.1 ) );

//console.log('code',this.codes[this.userZone]);

		// first hide all plates
		for( var plate of this.plates )
			plate.hide( );

		var toBeShownZones = [];
		
		// then show one plate per zone
		for( var i=0; i<this.zones.length-1; i++ )
		{
			var isUserZone = (i==this.userZone);
			
			// if this zone is not the user zone but it has the same
			// code as the user zone, then do not show this plate
			if( !isUserZone && this.codes[i]==this.codes[this.userZone] )
				continue;
			
			var to = this.zones[i],
				from = this.zones[i+1];
			var idx = Math.floor( random(from,to)/2+random(from,to)/2 );
			this.plates[i].showAt( idx+0.5, this.codes[i], isUserZone );
			
			if( !isUserZone )
			{
				toBeShownZones.push( i );
				toBeShownZones.sort( ()=>random(-10,10) );
			}
		}
		
		// show the user zone
		if( this.userZone >= 0 )
		{
			this.plates[this.userZone].visible = true;
			
			var showZones = THREE.MathUtils.clamp( this.shownHints*toBeShownZones.length, 1, toBeShownZones.length );

			for( var i=0; i<showZones; i++ )
				this.plates[toBeShownZones[i]].visible = true;
		}

	} // Thimble.newGame

	
} // class Thimble

