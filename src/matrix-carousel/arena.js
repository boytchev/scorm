//
//	class Arena( )
//

	
class Arena extends Group
{
	static SIZE = 8;
	static DISTANCE = 11.5;
	
	constructor( idx )
	{
		super( suica );

		this.idx = idx;
		
		var img = drawing(128,128,'white');
			fillText( 60, 10, 'R', 'black', 'bold 20px Arial' );

		var angle = idx/6 * 2*Math.PI,
			x = Arena.DISTANCE * Math.cos( angle ),
			z = Arena.DISTANCE * Math.sin( angle );
		
		var arena = circle( [x,Base.POS_Y+Base.BASE_HEIGHT+0.01,z], Arena.SIZE, 'white' );
			its.image = img;
			its.spinV = -90;
			its.spinH = 90-idx*60;
			its.threejs.material.polygonOffset = true;
			its.threejs.material.polygonOffsetFactor = -2;
			its.threejs.material.polygonOffsetUnits = -2;
			
		this.add( arena );
		
	} // Arena.constructor

} // class Arena

