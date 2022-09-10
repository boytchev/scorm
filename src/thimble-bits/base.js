//
//	class Base( )
//

	
class Base extends Group
{
	static POS_Y = -6;
	static SIZE = [30,1,30];
	
	constructor( )
	{
		super( suica );

		this.lines = 2;
		this.bumps = [];
		this.zones = [];
		this.codes = [];
		
		this.generateBumpsPositions( );
		this.constructBase( );
		
		this.y = Base.POS_Y;
		
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



	// construct the base
	constructBase( )
	{
		// main body of the base
		var map = ScormUtils.image( 'metal_plate.jpg', 10, 10/Base.SIZE[0] ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg' );
			//lightMap = ScormUtils.image( 'base_antilight.jpg', 1, 1 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			polygonOffset: true,
			polygonOffsetUnits: 2,
			polygonOffsetFactor: 2,
			//lightMap: lightMap,
			//lightMapIntensity: -0.7,
		} );	

		var base = cube( [0,-Base.SIZE[1]/2,0], Base.SIZE );
			its.threejs.material = material;
		
		
		// shadow under the base
		var shadow = square( [0,-Base.SIZE[1],0], [Base.SIZE[0]+1.5,Base.SIZE[2]+1.5] );
			its.spinV = -90;
			its.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'black',
				alphaMap: ScormUtils.image( 'floor_shadow_alpha.jpg' ),
				transparent: true,
			});
			its.threejs.renderOrder = -10;


		// top surface with 4 supports
		var top = square( [0,0,0], [Base.SIZE[0],Base.SIZE[2]] );
			top.threejs.geometry = new THREE.PlaneGeometry( 1, 1, 61, 61 );
			top.spinV = -90;
			
		var pos = top.threejs.geometry.getAttribute( 'position' );
		// vertical alignment
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i );
			var y = pos.getY( i );
			
			var p = (x*x+y*y)**0.5;
			if( 0.5>p && p>0.1 )
			{
				var angle = Math.atan2(y,x);
				var height = 0.2*Math.cos(2*angle)**4;
				
				height = height * Math.cos(9.5*p)**8;
				
				pos.setXYZ( i, x*(1-1.1*height), y*(1-1.1*height), height );
			}
		}
		top.threejs.geometry.computeVertexNormals();
	
		var map2 = ScormUtils.image( 'metal_plate.jpg', 10, 10 );
		var aoMap = ScormUtils.image( 'floor_ao.jpg', 1, 1 );
		top.threejs.material = new THREE.MeshStandardMaterial( {
					color: new THREE.Color( 1.5, 1.5, 1.5 ),
					metalness: 0.3,
					roughness: 0.5,
					map: map2,
					normalMap: normalMap,
					normalScale: new THREE.Vector2( 0.5, 0.5 ),
					aoMap: aoMap,
					aoMapIntensity: 1.2,
			});
		ScormUtils.addUV2( top );
		 
	
		this.add( base, shadow, top );
	} // Base.constructBase

	
} // class Base

