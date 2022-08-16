//
//	class Carousel( )
//

	
class Carousel extends Group
{
	static PILLAR_HEIGHT = 20;
	static PILLAR_RADIUS = 7;
	static TOP_SIZE = [10,2,10];
	static BRANCH_SIZE = [2, Arena.DISTANCE+0.5, 6];
	static BRANCH_POS = [0,Carousel.PILLAR_HEIGHT,0];
	
	constructor( )
	{
		super( suica );

		this.cosys = [];

		this.constructPillar( );
		this.constructCoSys( );
		
		this.addEventListener( 'click', this.onClick );

	} // Carousel.constructor



	// handles clicks on the base
	onClick( )
	{
		// avoid fake onClicks
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Carousel.onClick

	
	
	// construct the pillar
	constructPillar( )
	{
		// main body of the pillar
		var map = ScormUtils.image( 'pillar.jpg', 1, 1 ),
			normalMap = ScormUtils.image( 'metric_plate_normal.jpg' );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0.2,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
		} );	

		function pillarProfile( u )
		{
			var r = 1-0.9*u**0.3;
			return [0,u,0,Carousel.PILLAR_RADIUS*r];
		}
		
		var pillar = tube( [0,0,0], pillarProfile, 1, [20,16], [1,Carousel.PILLAR_HEIGHT] );
			its.threejs.material = material;
		
		
		var top = sphere( [0,Carousel.PILLAR_HEIGHT+0.4,0], Carousel.TOP_SIZE )
			its.threejs.material = material.clone();
			its.threejs.material.color.set( 'black' );
		
		
		// branches
		function branchProfile( u )
		{
			var r = 0.1;
			return [0,u,0,r];
		}
		var branch;
		for( var i=0; i<6; i++ )
		{
			branch = tube( Carousel.BRANCH_POS, branchProfile, 1, [20,16], Carousel.BRANCH_SIZE );
			var pos = branch.threejs.geometry.getAttribute( 'position' );
			for( var j=0; j<pos.count; j++ )
			{
				var x = pos.getX( j ),
					y = pos.getY( j ),
					z = pos.getZ( j );
					
				x *= 0.1+0.9*(y+0.5)**4;
				z *= 0.2+0.8*(1.1-y)**10;
				
				if( z<-0.1 ) z = -0.1;
				if( z>0 ) z *= 4;
				
				pos.setXYZ( j, x, y, z );
			}
			its.threejs.material = material;
			its.spinH = i/6 * 360;
			its.spinV = 90;
			
			this.add( branch );
		}
		
		this.y = Base.POS_Y+Base.BASE_HEIGHT;
		
		this.add( pillar, top );
		
	} // Carousel.constructPillar



	constructCoSys( )
	{
		for( var i=0; i<1; i++ )
		{
			var angle = radians( (i+0.5)/6 * 360 ),
				x = Arena.DISTANCE * Math.cos( angle ),
				z = Arena.DISTANCE * Math.sin( angle );
			
			var cosys = new CoSys( );
				its.center = [x, Carousel.BRANCH_POS[1], z];
			
			this.cosys.push( cosys );
			this.add( cosys );
		}
		
	} // Carousel.constructCoSys
	
	
	
	update( dT )
	{
		this.spinH += 50*dT;
	}
} // class Carousel

