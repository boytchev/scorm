//
// class Plate
//


class Plate extends Group
{
	
	constructor( index = 0 )
	{
		super( suica );

		this.index = index;
		
		if( index > 0 )
		{
			this.x = 19 * Math.cos( radians(60*index-30) );
			this.z = 19 * Math.sin( radians(60*index-30) );
		}
		
		var frame = convex( this.geometry() );
			frame.threejs.material = this.material();
	
		var plate = convex( this.geometry() );
			plate.image = 'hexagon.png';
			plate.images = [0.3,0.5];
			plate.size = [0.7,1,0.7];
			plate.y = 0.2;
			//plate.color = random( ['orange','navy','lightsalmon'] );
			plate.color = hsl( random(0,359), 100, 50 );
	
		this.add( frame );
		this.add( plate );
		
		this.spinH = 120-60*index;
		
	} // Plate.constructor


	geometry( )
	{
		var geo = [],
			x, z,
			r = 10,
			h = 1;
				
		for( var i=0; i<360; i+=60 )
		for( var j=-4; j<=4; j+=4 )
		{
			x = r * Math.cos( radians(i+j) ),
			z = r * Math.sin( radians(i+j) );
			geo.push( [x,-h,z], [x,h,z] );
			x *= 0.975;
			z *= 0.975;
			geo.push( [x,-1.25*h,z], [x,1.25*h,z] );
		}
		
		return geo;
	}

	
	material( )
	{
		const SCALE = 1/5,
			  OFFSET = 0/2;
		
		var mat = new THREE.MeshPhongMaterial({
				color: 'linen',
				map: image( 'metal_plate.jpg' ),
				normalMap: image( 'metal_plate_normal.jpg' ),
				shininess: 150,
			});
		mat.map.repeat.set( SCALE, SCALE );
		mat.map.offset.set( OFFSET, OFFSET );
		mat.normalMap.repeat.set( SCALE, SCALE );
		mat.normalMap.offset.set( OFFSET, OFFSET );
		mat.normalScale.set( 0.2, 0.2 );
		
		return mat;
	}

	
	get angle( )
	{
		if( this.index > 0 ) return this.spinV;
		return 0;
	}
	
	
	set angle( angle )
	{
		if( this.index > 0 ) this.spinV = angle;
	}
	
} // class Plate
