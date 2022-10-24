//
//	class Plate( )
//

	

class Plate extends Group
{
	constructor( vertices, face, size, texture )
	{
		super( suica );

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
		var face = polygon( n, [0,0,0], size, 'white' );
			its.image = texture;

		this.add( face );
		this.threejs.matrixAutoUpdate = false;
		this.threejs.matrix = mat;
	} // Plate.constructor


	// verticesLabels( vertices )
	// {
		// for( var i=0; i<vertices.length; i++ )
		// {
			// var texture = drawing( 32 );
				// arc( 16, 16, 16 );
				// fill( 'crimson' );
				// fillText( 8, 8, i, 'white' );		
		
			// this.add( point(vertices[i],5,'white') );
			// its.image = texture;
		// }
	// }
	
} // class Plate