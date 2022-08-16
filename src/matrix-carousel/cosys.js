//
//	class CoSys( )
//

	
class CoSys extends Group
{
//	static ROPE_SIZE = [0.2, 10];
	static ROPE_SIZE = [2, 30];
	static BALL_SIZE = 2;
	
	constructor( )
	{
		super( suica );

		//this.constructRope( );
		this.constructBall( );

	} // Arena.constructor


	
	constructRope( )
	{
		var alphaMap = ScormUtils.image( 'rope_alpha.jpg', 1, 10 );
			alphaMap.rotation = 0.025;
			
		var material = new THREE.MeshBasicMaterial({
			color: 'navy',
			alphaMap: alphaMap,
			transparent: true,
			side: THREE.DoubleSide,
		});

		var rope = cone( [0,0,0], CoSys.ROPE_SIZE, 'yellow' );
			//its.threejs.material = material;
			//its.spinV = 180;
			
		this.add( rope );
		
	} // CoSys.constructRope


	
	constructBall( )
	{
		var ball = sphere( [0,0,0], 10, 'yellow' );
		var ball2 = cube( [15,15,15], 5, 'red' );

		this.add( ball, ball2 );
		console.log( 'b1',ball );
		console.log( 'b2',ball2 );
	} // CoSys.constructBall
	
	
} // class CoSys

