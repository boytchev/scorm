//
//	class CoSys( )
//

	
class CoSys extends Group
{
	static ROPE_SIZE = [0.3, 13];
	static AXIS_SIZE = [0.1, 10];
	static ARROW_SIZE = [0.4, 1];
	static LABEL_SIZE = 2;
	static AXIS_COLOR = 'Tomato';
	static CUBE_SIZE = 4;
	static CUBE_SPEED = 0.3;
	
	constructor( idx )
	{
		super( suica );

		this.idx = idx; // matrix index
		
		this.rope = this.constructRope( );
		this.cosys = this.constructCoSys( );
		this.cube = this.constructCube( );
		
		this.ropeGroup = group();
			this.ropeGroup.spinH = 90;
		
		this.ropeGroup.add( this.rope, this.cosys );

		this.swingOutward( 0 );

		this.add( this.ropeGroup );

		this.size = 0;
	} // Arena.constructor


	
	constructRope( )
	{
		var alphaMap = ScormUtils.image( 'rope_alpha.jpg', 1, 8 );
			alphaMap.rotation = 0.025;
			
		var material = new THREE.MeshBasicMaterial({
			color: 'dimgray',
			alphaMap: alphaMap,
			transparent: true,
			side: THREE.DoubleSide,
			polygonOffset: true,
			polygonOffsetFactor: 5,
			polygonOffsetUnits: 5,
		});

		var rope = cone( [0,0,0], CoSys.ROPE_SIZE );
			its.threejs.material = material;

		return rope;
		
	} // CoSys.constructRope


	
	constructCoSys( )
	{
		var cosys = group();
			cosys.y = CoSys.ROPE_SIZE[1];
			cosys.spinH = random( [0,90,180,270] );
			cosys.spinV = random( [0,90,180,270] );
			cosys.spinS = random( [0,90,180,270] );
			
		var pos = CoSys.AXIS_SIZE[1]/2;
		
		// construct axes
		var axis = prism( 6, [0,-pos,0], CoSys.AXIS_SIZE, CoSys.AXIS_COLOR );
		cosys.add( axis );

		axis = axis.clone;
		axis.center = [0,0,-pos];
		axis.spinV = 90;
		cosys.add( axis );

		axis = axis.clone;
		axis.center = [-pos,0,0];
		axis.spinH = 90;
		cosys.add( axis );

		// arrows
		var arrow = pyramid( 6, [0,pos,0], CoSys.ARROW_SIZE, CoSys.AXIS_COLOR );
		cosys.add( arrow );
		
		arrow = arrow.clone;
		arrow.center = [0,0,pos];
		arrow.spinV = 90;
		cosys.add( arrow );
		
		arrow = arrow.clone;
		arrow.center = [pos,0,0];
		arrow.spinH = 90;
		cosys.add( arrow );
		
		// construct labels
		this.labels = [];

		this.labels.push( point( [pos+1.5,0,0], 0*CoSys.LABEL_SIZE, 'white') );
			its.image = drawing( 15 );
			its.image.fillText( 0, 0, 'X', CoSys.AXIS_COLOR, 'bold 20px Arial' );
		cosys.add( its );
		
		this.labels.push( point( [0,pos+1.5,0], 0*CoSys.LABEL_SIZE, 'white') );
			its.image = drawing( 15 );
			its.image.fillText( 0, 0, 'Y', CoSys.AXIS_COLOR, 'bold 20px Arial' );
		cosys.add( its );
		
		this.labels.push( point( [0,0,pos+1.5], 0*CoSys.LABEL_SIZE, 'white') );
			its.image = drawing( 15 );
			its.image.fillText( 0, 0, 'Z', CoSys.AXIS_COLOR, 'bold 20px Arial' );
		cosys.add( its );

		return cosys;
	} // CoSys.constructCoSys
	
	
	
	
	constructCube( )
	{
		var cubeGroup = group( );
		
		var material = new THREE.MeshPhysicalMaterial( {
						sheen: 2,
						sheenColor: 'Crimson',
						sheenRoughness: 0.2,
						color: 'Wheat',
						transparent: true,
						side: THREE.DoubleSide,
						emissive: 'orange',
						emissiveIntensity: 0.7,
						opacity: 0.7,
					} );
					
		var box = cube( [0,0,0], CoSys.CUBE_SIZE );
			its.threejs.material = material;
		
		var edges = cube( [0,0,0], CoSys.CUBE_SIZE, 'brown' );
			its.wireframe = true;
		
		cubeGroup.add( box, edges );
			
		this.cosys.add( cubeGroup );
		return cubeGroup;
	} // CoSys.constructCube
	
	
	
	swingForward( angle )
	{
		this.spinV = angle;
		this.ropeGroup.spinT = 0.5*angle;

	} // CoSys.swingForward



	swingOutward( angle )
	{
		this.ropeGroup.spinV = 180-angle;
	} // CoSys.swingOutward
	
	
	
	update( t, dT )
	{
		var k = 2*( (CoSys.CUBE_SPEED*t)%1)-0.5; // -0.5 .. +1.5
			k = THREE.MathUtils.clamp( k, 0, 1 );
		
		Matrix.setMatrix( this.cube, this.idx, k );
	}
	
} // class CoSys
