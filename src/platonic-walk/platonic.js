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
	static ROT = new THREE.Matrix4( ).makeRotationX( Math.PI );

	constructor( n )
	{
		super( suica );

		var VOLUME = 10**3;
		
		switch( n )
		{
			case 0 : this.tetrahedron( VOLUME ); break;
			case 1 : this.hexahedron( VOLUME ); break;
			case 2 : this.octahedron( VOLUME ); break;
			case 3 : this.dodecahedron( VOLUME ); break;
			case 4 : this.icosahedron( VOLUME ); break;
		}
	
	} // Platonic.constructor


	verticesLabels( vertices )
	{
		for( var i=0; i<vertices.length; i++ )
		{
			// var x = vertices[i][0];
			// var y = vertices[i][1];
			// var z = vertices[i][2];
			
			var texture = drawing( 32 );
				arc( 16, 16, 16 );
				fill( 'crimson' );
				fillText( 8, 8, i, 'white' );		
		
			this.add( point(vertices[i],5,'white') );
			its.image = texture;
		}
	}
	
	
	plate( vertices, face, size )
	{
		// plate is n-gon
		var n = face.length;
		
		// calculate coordinate system of the face
		var ox, oy, oz;
		{
			let a = new THREE.Vector3( ...vertices[face[0]] ),
				b = new THREE.Vector3( ...vertices[face[1]] ),
				c = new THREE.Vector3( ...vertices[face[2]] );

			ox = b.sub( a ).normalize( );
			oy = c.sub( a );
			oz = new THREE.Vector3().crossVectors( ox, oy ).normalize( );
			
			oy.crossVectors( ox, oz ).normalize( ); 
		}
		
		// calculate center
		var center = new THREE.Vector3();
		for( var f=0; f<n; f++ )
		{
			center.x += vertices[face[f]][0]/n;
			center.y += vertices[face[f]][1]/n;
			center.z += vertices[face[f]][2]/n;
		}

		// prepare matrix
		var mat = new THREE.Matrix4( ).makeBasis( ox, oy, oz ).multiply( Platonic.ROT ).setPosition( center );
		
		// construct plate object
		var face = polygon( n, [0,0,0], size );
			its.image = ScormUtils.image( 'grid.png' );
			its.images = 1;

		var plate = group( );
			plate.add( face );
			plate.threejs.matrixAutoUpdate = false;
			plate.threejs.matrix = mat;
		
		return plate;
	}
	

	
	// generate a tetrahedron platonic solid
	tetrahedron( volume )
	{
		var vertices = [[1,1,1], [1,-1,-1], [-1,1,-1], [-1,-1,1]],
			faces = [[0,1,2], [0,2,3], [0,1,3], [1,2,3]],
			scale = 10;

		this.verticesLabels( vertices );
		
		for( var f=0; f<faces.length; f++ )
			this.add( this.plate( vertices, faces[f], Math.sqrt(8/3)*2 ) );
		
		this.size = scale;
	} // Platonic.tetrahedron
	

	
	// generate a hexahedron (cube) platonic solid
	hexahedron( volume )
	{
		var vertices = [[1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1], [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1]],
			faces = [[0,4,6,2], [0,1,5,4], [0,2,3,1], [2,6,7,3], [1,3,7,5], [4,5,7,6]],
			scale = 9;

		this.verticesLabels( vertices );
		
		this.verticesLabels( vertices );
		
		for( var f=0; f<faces.length; f++ )
			this.add( this.plate( vertices, faces[f], Math.sqrt(8) ) );
		
		this.size = scale;
	} // Platonic.hexahedron
	
	
	
	// generate an octahedron platonic solid
	octahedron( volume )
	{
		var vertices = [[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]],
			faces = [[0,1,2], [5,1,0], [3,1,5], [2,1,3], [2,3,4], [0,2,4], [5,0,4], [3,5,4]],
			scale = 15;

		this.verticesLabels( vertices );
		
		for( var f=0; f<faces.length; f++ )
			this.add( this.plate( vertices, faces[f], Math.sqrt(8/3) ) );

		this.size = scale;
	} // Platonic.octahedron
	

	
	// generate an dodecahedron platonic solid
	dodecahedron( volume )
	{
		var Φ = (1+Math.sqrt(5))/2;
		
		var vertices = [[1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1], [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1], [0,1/Φ,Φ], [0,1/Φ,-Φ], [0,-1/Φ,Φ], [0,-1/Φ,-Φ], [1/Φ,Φ,0], [1/Φ,-Φ,0], [-1/Φ,Φ,0], [-1/Φ,-Φ,0], [Φ,0,1/Φ], [-Φ,0,1/Φ], [Φ,0,-1/Φ], [-Φ,0,-1/Φ]],
			faces = [[3,13,15,7,11], [1,9,5,14,12], [5,9,11,7,19], [2,10,6,15,13], [2,13,3,18,16], [1,18,3,11,9], [0,16,18,1,12], [0,8,10,2,16], [0,12,14,4,8], [6,17,19,7,15], [4,17,6,10,8], [4,14,5,19,17]],
			scale = 8;

		this.verticesLabels( vertices );

		for( var f=0; f<faces.length; f++ )
			this.add( this.plate( vertices, faces[f], Math.sqrt(31/7) ) );
		
		this.size = scale;
	} // Platonic.dodecahedron
	

	
	// generate an icosahedron platonic solid
	icosahedron( volume )
	{
		var Φ = (1+Math.sqrt(5))/2;
		
		var vertices = [[0,1,Φ], [0,1,-Φ], [0,-1,Φ], [0,-1,-Φ], [1,Φ,0], [1,-Φ,0], [-1,Φ,0], [-1,-Φ,0], [Φ,0,1], [-Φ,0,1], [Φ,0,-1], [-Φ,0,-1]],
			faces = [[0,2,8], [4,8,10], [1,4,10], [1,6,4], [0,8,4], [0,4,6], [5,10,8], [1,10,3], [1,3,11], [1,11,6], [0,6,9], [6,11,9], [3,7,11], [3,10,5], [0,9,2], [7,9,11], [3,5,7], [2,9,7], [2,5,8], [2,7,5]],
			scale = 8;

		this.verticesLabels( vertices );
		
		for( var f=0; f<faces.length; f++ )
			this.add( this.plate( vertices, faces[f], Math.sqrt(16/3) ) );

		this.size = scale;
	} // Platonic.icosahedron
	
} // class Platonic
