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
	} // Arena.constructor



	generateTexture( matrixData )
	{
		var S = Arena.S,	// canvas size
			H = 1.25;		// horizontal scale

		this.matrixImage.clear( 'white' );	
		this.matrixImage.context.textAlign = 'center';
		this.matrixImage.context.scale( H, 1 );

		var identity = Matrix.allMatrixData[0].matrix;
		
		var color, font;
		
		for( var i=0; i<4; i++ )
			for( var j=0; j<4; j++ )
			{
				var value = matrixData.matrix[i][j],
					x = S/2/H+S/5*(j-1.5)/H,
					y = 0.43*S-S/6*(i-1.5);
				
				if( value == 0.5 )
				{	// 1/2
					color = 'crimson';
					font = 'bold 24px Arial';
					value = '½';
					y -= 2;
				}
				else if( value != identity[i][j] )
				{	// different from identity
					color = 'crimson';
					font = 'bold 18px Arial';
				}
				else if( value != 0 )
				{	// non zero
					color = 'black';
					font = 'bold 18px Arial';
				}
				else
				{	// zero
					color = 'lightgray';
					font = 'normal 15px Arial';
				}
				
				this.matrixImage.fillText(
					x,
					y,
					value, // text
					color,
					font );
			}

	} // Arena.generateTexture
	
} // class Arena

