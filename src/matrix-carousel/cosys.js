//
//	class CoSys( )
//

	
class CoSys extends Group
{
	static ROPE_SIZE = [0.2, 10];
	
	constructor( )
	{
		super( suica );

		this.rope = this.constructRope( );
		
//		this.constructBall( );

	} // Arena.constructor


	
	constructRope( )
	{
		var alphaMap = ScormUtils.image( 'rope_alpha.jpg', 1, 5 );
			alphaMap.rotation = 0.025;
			
		var material = new THREE.MeshBasicMaterial({
			color: 'navy',
			alphaMap: alphaMap,
			transparent: true,
			side: THREE.DoubleSide,
		});

		var rope = cone( [0,0,0], CoSys.ROPE_SIZE );
			its.threejs.material = material;
			its.spinH = 90;
			its.spinV = 180;

		this.add( rope );
		return rope;
		
	} // CoSys.constructRope


	
	constructBall( )
	{
	} // CoSys.constructBall
	
	
	swingForward( angle )
	{
		this.spinV = angle;
	}

	swingOutward( angle )
	{
		this.rope.spinV = 180-angle;
	}
	
} // class CoSys

