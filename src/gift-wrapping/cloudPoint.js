//
//	class CloudPoint



class CloudPoint extends Group
{
	static SIZE = [2, 3]; // unselected, selected
	static COLOR = ['gray', new THREE.Color(0,1,2)]; // unselected, selected
	
	static MOVE_SPEED = [300, 1000];
	static HIDE_SPEED = [300, 1000];
	
	constructor( )
	{
		super( suica );

		this.colorSphere = sphere( [0,0,0], CloudPoint.SIZE[1] );
		its.threejs.material = new THREE.MeshPhysicalMaterial( {
				color: 'black',
				clearcoat: 2,
				clearcoatRoughness: 0.8,
				metalness: 0,
				roughness: 0,
				
				map: ScormUtils.image( 'marble2.jpg' ),
				//transparent: true,
			} );

		this.selected = 1;
		
		this.size = 0;
		this.add( this.colorSphere );
		
		this.addEventListener( 'click', this.toggle );
		
	} // CloudPoint.constructor



	// animate trasition to a new location
	moveTo( pos )
	{
		var that = this;
		
		this.select( );
		
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
	
	
	
	// toggle point selection status
	toggle( )
	{
		this.selected = 1-this.selected;
		this.colorSphere.color = CloudPoint.COLOR[this.selected];
		this.colorSphere.size = CloudPoint.SIZE[this.selected];
//		this.colorSphere.threejs.material.opacity = this.selected ? 1 : 0.5;
	} // CloudPoint.toggle
	
	
	
	// select point selection status
	select( )
	{
		this.selected = 0;
		this.toggle( );
	} // CloudPoint.select
	
	
} // class CloudPoint
