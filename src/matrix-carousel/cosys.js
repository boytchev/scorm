//
//	class CoSys( )
//

	
class CoSys extends Group
{
	static ROPE_SIZE = [0.2, 10];
	static BALL_SIZE = [2, 1];
	
	constructor( )
	{
		super( suica );

		this.constructRope( );
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
			its.spinV = 180;

		var ball = prism( 6, [0,-CoSys.BALL_SIZE[1]/2,0], CoSys.BALL_SIZE, 'black' );

		this.add( rope, ball );
		
	} // CoSys.constructRope


	
	constructBall( )
	{
	} // CoSys.constructBall
	
	
} // class CoSys

