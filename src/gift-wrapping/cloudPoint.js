//
//	class CloudPoint



class CloudPoint extends Group
{
	static POINT_SIZE = 3;
	static MOVE_SPEED = [300, 1000];
	static HIDE_SPEED = [300, 1000];
	
	constructor( )
	{
		super( suica );

		var	point = sphere( [0,0,0], CloudPoint.POINT_SIZE );

		this.size = 0;
		this.add( point );
	} // CloudPoint.constructor



	// animate trasition to a new location
	moveTo( pos )
	{
		var that = this;
		
		new TWEEN.Tween( {center:this.center, size:this.size} )
			.to( {center:pos, size:1}, random(...CloudPoint.MOVE_SPEED) )
			.onUpdate( function( obj ) {
				that.center = obj.center;
				that.size = obj.size;
			} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	} // CloudPoint.moveTo



	// animate trasition to a hidden point
	hide( )
	{
		var that = this;
		
		new TWEEN.Tween( {size:this.size} )
			.to( {size:0}, random(...CloudPoint.HIDE_SPEED) )
			.onUpdate( function( obj ) {
				that.size = obj.size;
			} )
			.easing( TWEEN.Easing.Cubic.Out )
			.start( );
	} // CloudPoint.hide
	
	
} // class CloudPoint
