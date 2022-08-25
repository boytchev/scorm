//
//	class Arena( )
//

	
class Arena extends Group
{
	static SIZE = 8;
	static DISTANCE = 11.5;
	static S = 128; // canvas size
	static H = 1.25; // horizontal scale
	
	constructor( i )
	{
		super( suica );

		this.i = i;
		this.setMatrix( 0 );
		
		this.matrixImage = drawing( Arena.S, Arena.S, 'white' );
			this.matrixImage.context.scale( Arena.H, 1 );
			fillText( 60, 10, 'R', 'black', 'bold 20px Arial' );

		var angle = i/6 * 2*Math.PI,
			x = Arena.DISTANCE * Math.cos( angle ),
			z = Arena.DISTANCE * Math.sin( angle );
		
		this.arena = circle( [x,Base.POS_Y+Base.BASE_HEIGHT+0.01,z], Arena.SIZE, 'white' );
			its.image = this.matrixImage;
			its.spinV = -90;
			its.spinH = 90-i*60;
			its.threejs.material.polygonOffset = true;
			its.threejs.material.polygonOffsetFactor = -2;
			its.threejs.material.polygonOffsetUnits = -2;
			
		this.add( this.arena );
		
		this.regenerateTexture( 0 );
	} // Arena.constructor



	setMatrix( idx )
	{
		this.matrixIdx = idx;
		this.matrixData = Matrix.allMatrixData[idx].matrix;
	}
	
	
	
	regenerateTexture( opacity=1 )
	{
		this.matrixImage.context.globalAlpha = 1;
		this.matrixImage.clear( 'white' );	

		this.matrixImage.context.textAlign = 'center';

		var matrixData = this.matrixData,
			identity = Matrix.allMatrixData[0].matrix;
		
		var color, font;
		

		for( var i=0; i<4; i++ )
			for( var j=0; j<4; j++ )
			{
				var value = matrixData[i][j],
					x = Arena.S/2/Arena.H+Arena.S/5*(j-1.5)/Arena.H,
					y = 0.43*Arena.S-Arena.S/6*(i-1.5);

				// draw a middle dot
				// color = 'black';
				// font = 'bold 18px Arial';
				// this.matrixImage.context.globalAlpha = 1-opacity;
				// this.matrixImage.fillText(
					// x,
					// y,
					// '·',
					// color,
					// font );


				// draw the actual digit
				
				this.matrixImage.context.globalAlpha = opacity;

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

		this.matrixImage.context.globalAlpha = 1-opacity;
		this.matrixImage.clear( 'black' );	

		this.arena.threejs.material.map.needsUpdate = true;
		
	} // Arena.generateTexture
	
} // class Arena

