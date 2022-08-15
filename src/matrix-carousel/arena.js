//
//	class Arena( )
//

	
class Arena extends Group
{
	static SIZE = 8;
	static DISTANCE = 11.5;
	static S = 128; // canvas size
	
	constructor( idx )
	{
		super( suica );

		this.idx = idx;
		
		this.matrixImage = drawing( Arena.S, Arena.S, 'white' );
			fillText( 60, 10, 'R', 'black', 'bold 20px Arial' );

		var angle = idx/6 * 2*Math.PI,
			x = Arena.DISTANCE * Math.cos( angle ),
			z = Arena.DISTANCE * Math.sin( angle );
		
		var arena = circle( [x,Base.POS_Y+Base.BASE_HEIGHT+0.01,z], Arena.SIZE, 'white' );
			its.image = this.matrixImage;
			its.spinV = -90;
			its.spinH = 90-idx*60;
			its.threejs.material.polygonOffset = true;
			its.threejs.material.polygonOffsetFactor = -2;
			its.threejs.material.polygonOffsetUnits = -2;
			
		this.add( arena );
		
		this.generateTexture( random(Matrix.allMatrixData) );
//		this.generateTexture( Matrix.allMatrixData[0] );
	} // Arena.constructor



	generateTexture( matrixData )
	{
		
		console.log( matrixData );
		
		var S = Arena.S,	// canvas size
			D = S/5,		// digit size
			H = 1.25;		// horizontal scale

		this.matrixImage.clear( 'white' );	
		this.matrixImage.context.textAlign = 'center';
		this.matrixImage.context.scale( H, 1 );
//	ctx.font = "bold 18px Arial";

		for( var i=0; i<4; i++ )
			for( var j=0; j<4; j++ )
			{
				var color = matrixData.matrix[i][j] ? 'crimson' : 'lightgray',
					font = matrixData.matrix[i][j] ? 'bold 18px Arial' : '18px Arial';
				
				this.matrixImage.fillText(
					S/2/H+S/5*(j-1.5)/H, // x
					( 0.43*S-S/6*(i-1.5)), // y
					matrixData.matrix[i][j], // text
					color,
					font );
			}

	} // Arena.generateTexture
	
} // class Arena

