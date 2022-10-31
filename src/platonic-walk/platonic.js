//
//	class Platonic( center, spin )
//
	
//	no	name			rad			V			vertices
//	0	tetrahedron		1/sq(6)		sq(8)/3
//	1	cube			1			8
//	2	octahedron		sq(2/3)		sq(128)/3
//	3	dodecahedron	f^2/sq(3-f)	20f^3/(3-f)
//	4	ocpsahedron		f^2/sq(3)	20f^2/3
//
//	f = (1+sq(5))/2

class Platonic extends Group
{
	static SHOW_SPEED = 700;
	static HIDE_SPEED = 300;
	static ROT = new THREE.Matrix4( ).makeRotationX( Math.PI );
	
	constructor( n )
	{
		super( suica );

		var VOLUME = 10**3;
		
		this.plates = [];
		this.spots = [];
		this.spotPlate = [];
		
		this.nextSpot = [];
		this.prevSpot = [];
		this.twinSpot = [];
		
		switch( n )
		{
			case 0 : this.hexahedron( VOLUME ); break;
			case 1 : this.tetrahedron( VOLUME ); break;
			case 2 : this.octahedron( VOLUME ); break;
			case 3 : this.icosahedron( VOLUME ); break;
			case 4 : this.dodecahedron( VOLUME ); break;
		}

		this.addEventListener( 'click', this.onClick );

		// this.addLabels( this.spots );
		// this.addLabels( this.plates );

		this.visible = false;
		this.y = 10000;
		
	} // Platonic.constructor


	static constructTexture( n, crosses = true )
	{
		var img = drawing( 512, 512, 'Black' );
			img.context.lineJoin = 'round';
	
		var cx = 256,
			cy = 256,
			r = 200;

		var angle = 2*Math.PI/n*0+(n==4?Math.PI/4:Math.PI/2);
		moveTo( cx+r*Math.cos(angle), cy+r*Math.sin(angle) );
		for( var i=0; i<=n+1; i++ )
		{
			let angle = 2*Math.PI/n*i+(n==4?Math.PI/4:Math.PI/2);
			lineTo( cx+r*Math.cos(angle), cy+r*Math.sin(angle) );
		}

		if( crosses )
		{
			var dist = r*Math.cos(Math.PI/n);
			for( var i=0; i<=n; i++ )
			{
				let angle = 2*Math.PI/n*(i+0.5)+(n==4?Math.PI/4:Math.PI/2);
				moveTo( cx+dist*Math.cos(angle), cy+dist*Math.sin(angle) );
				lineTo( cx+2*r*Math.cos(angle), cy+2*r*Math.sin(angle) );
			}
		}

		fill( 'DarkSeaGreen' );
		stroke( 'Black', 34 );
		//stroke( 'Gold', 30 );
		stroke( 'White', 30 );

		return img;
	}


	
	

	onClick( event )
	{
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT )
			return;
		
		Plate.select( Plate.selected/*, true*/ );
		
		//console.log( 'click on plate', Plate.selected.index );
		if( playground.canEndGame( ) )
			playground.endGame( );
	}
	
	
	addLabels( vertices )
	{
		for( var i=0; i<vertices.length; i++ )
		{
			var texture = drawing( 32 );
				arc( 16, 16, 16 );
				fill( 'crimson' );
				fillText( 6, 8, i, 'white' );		
		
			this.add( point(vertices[i].midCenter||vertices[i],4,'white') );
			its.image = texture;
		}
	}
	
	
	// generate texture and plates for general n-hedron
	hedron( vertices, faces, twins, size, scale, spotOffset, spotRadius )
	{
		var n = faces[0].length; // n-gon
		
		var texture;
		texture = Platonic.constructTexture( n );

		//this.verticesLabels( vertices );
		for( var t=0; t<twins.length; t++ )
		{
			this.twinSpot[twins[t][0]] = twins[t][1];
			this.twinSpot[twins[t][1]] = twins[t][0];
		}
		
		for( var f=0; f<faces.length; f++ )
		{
			
			// DCEL set prev & next
			var firstSpot = f*n;
			for( var j=0; j<n; j++ )
			{
				this.nextSpot[firstSpot+j] = firstSpot + (j+1)%n;
				this.prevSpot[firstSpot+j] = firstSpot + (j+n-1)%n;
				this.spotPlate[firstSpot+j] = f;
			}


			// create one of the plates
			var plate = new Plate( vertices, faces[f], scale, texture, spotOffset, spotRadius );
				plate.face.index = f;
				
			this.plates.push( plate );
			this.spots.push( ...plate.spots );
			
			this.add( plate );
		}
		
		this.size = size;
		this.defaultSize = size;
	}
	
	
	
	// generate a tetrahedron platonic solid
	tetrahedron( volume )
	{
		this.hedron(
			[[1,1,1], [1,-1,-1], [-1,1,-1], [-1,-1,1]],
			[[0,1,2], [0,2,3], [0,3,1], [1,3,2]],
			[[0,10], [1,5], [2,7], [3,9], [4,8], [6,11]],
			10,
			Math.sqrt(8/3)*2,
			0.25, 0.65,
		);
	} // Platonic.tetrahedron
	

	
	// generate a hexahedron (cube) platonic solid
	hexahedron( volume )
	{
		this.hedron(
			[[1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1], [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1]],
			[[0,4,6,2], [0,1,5,4], [0,2,3,1], [2,6,7,3], [1,3,7,5], [4,5,7,6]],
			[ [0,22], [1,15], [2,11], [3,6], [7,10], [8,14], [12,21], [5,23], [4,18], [17,20], [9,19], [13,16] ],
			9,
			Math.sqrt(8),
			0, 0.78,
		);
	} // Platonic.hexahedron
	
	
	
	// generate an octahedron platonic solid
	octahedron( volume )
	{
		this.hedron(
			[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]],
			[[0,1,2], [5,1,0], [3,1,5], [2,1,3], [2,3,4], [0,2,4], [5,0,4], [3,5,4]],
			[ [0,11], [1,17], [2,3], [4,20], [5,6], [7,23], [8,9], [10,14], [12,22], [13,15], [16,18], [19,21], ],
			15,
			Math.sqrt(8/3),
			0.25, 0.32,
		);
	} // Platonic.octahedron
	

	
	// generate an dodecahedron platonic solid
	dodecahedron( volume )
	{
		var Φ = (1+Math.sqrt(5))/2; //note:  Ф-1 = 1/Ф
		this.hedron(
			[ [1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1], [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1],
			  [0,Φ-1,Φ], [0,Φ-1,-Φ], [0,1-Φ,Φ], [0,1-Φ,-Φ], [Φ-1,Φ,0], [Φ-1,-Φ,0], [1-Φ,Φ,0], [1-Φ,-Φ,0], [Φ,0,Φ-1], [-Φ,0,Φ-1], [Φ,0,1-Φ], [-Φ,0,1-Φ]],
			[[3,13,15,7,11], [1,9,5,14,12], [5,9,11,7,19], [2,10,6,15,13], [2,13,3,18,16], [1,18,3,11,9], [0,16,18,1,12], [0,8,10,2,16], [0,12,14,4,8], [6,17,19,7,15], [4,17,6,10,8], [4,14,5,19,17]],
			[ [42,53], [39,43], [33,44], [7,40], [41,59], [35,52], [34,38], [8,32], [6,55], [54,58], [49,50], [15,51], [19,36], [23,37], [22,30], [29,31], [9,28], [5,14], [13,56], [45,57], [16,48], [0,17], [4,20], [1,47], [2,11], [3,26], [12,46], [10,27], [18,24], [21,25], ],
			8,
			Math.sqrt(31/7),
			-0.25, 0.67,
		);
	} // Platonic.dodecahedron
	

	
	// generate an icosahedron platonic solid
	icosahedron( volume )
	{
		var Φ = (1+Math.sqrt(5))/2; //note:  Ф-1 = 1/Ф
		this.hedron(
			[[0,1,Φ], [0,1,-Φ], [0,-1,Φ], [0,-1,-Φ], [1,Φ,0], [1,-Φ,0], [-1,Φ,0], [-1,-Φ,0], [Φ,0,1], [-Φ,0,1], [Φ,0,-1], [-Φ,0,-1]],
			[[0,2,8], [4,8,10], [1,4,10], [1,6,4], [0,8,4], [0,4,6], [5,10,8], [1,10,3], [1,3,11], [1,11,6], [0,6,9], [6,11,9], [3,7,11], [3,10,5], [0,9,2], [7,9,11], [3,5,7], [2,9,7], [2,5,8], [2,7,5]],
			[ [0,55], [1,14], [2,43], [3,18], [4,6], [5,12], [7,23], [8,10], [9,15], [11,28], [13,17], [16,32], [19,54], [20,39], [21,41], [22,26], [25,29], [24,37], [27,35], [30,34], [31,44], [52,59], [56,58], [48,57], [38,49], [36,46], [33,45], [42,53], [40,50], [47,51], ],
			8,
			Math.sqrt(16/3),
			0.25, 0.45,
		);
	} // Platonic.icosahedron
	
	
	
	// show specific platonic solid
	show( spotIdx )
	{
		this.visible = true;
		this.y = 0;
		this.size = 0;
		
		new TWEEN.Tween( this )
			.to( {size: playground.solid.defaultSize}, Platonic.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );
			
		playground.routeRing.size = 0;
		new TWEEN.Tween( playground.routeRing )
			.to( {size: 1}, Platonic.SHOW_SPEED )
			.easing( TWEEN.Easing.Elastic.Out )
			.start( );
		
	} // Platonic.show
	
	
	
	// hide specific platonic solid
	hide( )
	{
		var that = this;
		
		new TWEEN.Tween( this )
			.to( {size: 0}, Platonic.HIDE_SPEED )
			.easing( TWEEN.Easing.Cubic.In )
			.onComplete( function() {
				that.visible = false;
				that.y = 1000;
				that.size = 0;
				playground.solid = null;
			} )
			.start( );
			
		new TWEEN.Tween( playground.routeRing )
			.to( {size: 0}, Platonic.HIDE_SPEED )
			.easing( TWEEN.Easing.Cubic.In )
			.start( );
	} // Platonic.hide
	
	
} // class Platonic
