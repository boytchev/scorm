//
//	class Plate( )
//

	

class Plate extends Group
{
	static selected = null;
	static GREENERY_CIRCLE;
	
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
		this.face = polygon( n, [0,0,0], size, 'lightgray' );
			its.threejs.material.map = new THREE.CanvasTexture( texture.canvas );
			its.threejs.material.trasparent = false;
			its.threejs.renderOrder = -20;
			its.threejs.receiveShadow = true;
			
// its.threejs.material.polygonOffset = true;
// its.threejs.material.polygonOffsetUnits = 20;
// its.threejs.material.polygonOffsetFactor = 20;

		this.add( this.face );
		this.threejs.matrixAutoUpdate = false;
		this.threejs.matrix = mat;
		
		var spot;// = this.objectPosition( [0,0,-0.1] );
		this.spots = [];

		for( var i=0; i<n; i++ )
		{
			var angle = 2*Math.PI*(i+spotOffset)/n,
				r = spotRadius,
				pos = [r*Math.cos(angle),r*Math.sin(angle),0];
				
			spot = this.objectPosition( pos );
			
			this.spots.push( spot );
		}
		
	} // Plate.constructor



	// create a random objects - a tree, a bush, ...
	generateGreenery( r, platonicIdx )
	{
		if( !Plate.GREENERY_CIRCLE )
		{
			Plate.GREENERY_CIRCLE = circle( [0,0,0], 0 );
			its.visible = false;
		}
		

		var object, p, h;
		
		switch( random([0,0,1]) )
		{
			case 0: // generate a stone
				p = [];
				h = random( 0.02, 0.2 );
				for( var i=0; i<random(10,30); i++ )
					p.push( [random(-0.2,0.2),random(-h,h),random(-0.2,0.2)] );
				
				object = convex( p, 1, 'BurlyWood' );
				its.spinV = -90;
				its.threejs.castShadow = true;
				its.plate = this;
				break;
			case 1: // generate a tree
				object = group();
				h = random( 1, 2.5 );
				
	
				var posTop = [random(-1/4,1/4),random(-1/4,1/4),-h,0.03],
					posMid = [random(-1/15,1/15),random(-1/15,1/15),-h/3,0.05];
				var stem = tube( [0,0,0], [[0,0,0.2,0.2],posMid,posTop], 1, [12,6], 1, 'Peru' );
					stem.threejs.castShadow = true;
					stem.plate = this;

				var Φ = (1+Math.sqrt(5))/2;
				p = [[0,1,Φ], [0,1,-Φ], [0,-1,Φ], [0,-1,-Φ], [1,Φ,0], [1,-Φ,0], [-1,Φ,0], [-1,-Φ,0], [Φ,0,1], [-Φ,0,1], [Φ,0,-1], [-Φ,0,-1]];
				for( var i=0; i<p.length; i++ )
				{
					p[i][0] += random(-0.4,0.4);
					p[i][1] += random(-0.4,0.4);
					p[i][2] += random(-0.4,0.4);
				}

				var crown = convex( p, random(0.1,0.3), 'DarkSeaGreen' );
					crown.center = posTop;
					crown.threejs.castShadow = true;
					crown.plate = this;
					
				
				object.add( crown, stem );
				its.threejs.castShadow = true;
				its.spinV = -90;
				its.plate = this;
				break;
		}

		Plate.GREENERY_CIRCLE.size = 2*0.8*r;
		object.center = Plate.GREENERY_CIRCLE.randomIn;
		object.size = [1,1,0.7,1,1][platonicIdx];
		
		this.add( object );
	}
	
	
	
	// select/unselect plate
	static select( object/*, hard=false*/ )
	{
		if( Plate.selected )
		{
			Plate.selected.color = 'LightGray';
			Plate.selected = null;
		}
		
		if( object )
		{
			// if plate is a tree or a bush, then it has
			// property plate that is the actual plate
			if( object.plate ) object = object.plate.face;
			
			Plate.selected = object;
			Plate.selected.color = 'WhiteSMoke';
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