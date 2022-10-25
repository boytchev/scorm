//
//	class Plate( )
//

	

class Plate extends Group
{
	static selected = null;
	
	constructor( vertices, face, size, texture, spotOffset, spotRadius )
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
		
		this.midCenter = center;

		// prepare matrix
		var mat = new THREE.Matrix4( ).makeBasis( ox, oy, oz ).multiply( Platonic.ROT ).setPosition( center );
		
		// construct plate object
		this.face = polygon( n, [0,0,0], size, 'white' );
			its.image = texture;
its.threejs.material.polygonOffset = true;
its.threejs.material.polygonOffsetUnits = 20;
its.threejs.material.polygonOffsetFactor = 20;
		this.add( this.face );
		this.threejs.matrixAutoUpdate = false;
		this.threejs.matrix = mat;
		
		var spot;// = this.objectPosition( [0,0,-0.1] );
		this.spots = [];

		for( var i=0; i<n; i++ )
		{
			var angle = 2*Math.PI*(i+spotOffset)/n,
				r = spotRadius;
				
			spot = this.objectPosition( [r*Math.cos(angle),r*Math.sin(angle),0] );
			//this.add( cone( [r*Math.cos(angle),r*Math.sin(angle),0], [0.1,1], 'white' ) );
			//its.spinV = -90;
			this.spots.push( spot );
		}
		
	} // Plate.constructor



	// select/unselect plate
	static select( plate, hard=false )
	{
		if( Plate.selected )
		{
			Plate.selected.color = 'White';
			Plate.selected = null;
		}

		if( plate )
		{
			Plate.selected = plate;
			Plate.selected.color = hard ? 'Crimson' : 'Orange';
		}
	} // Plate.select



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