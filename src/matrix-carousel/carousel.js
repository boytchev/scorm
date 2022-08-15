//
//	class Carousel( )
//

	
class Carousel extends Group
{
	static PILLAR_HEIGHT = 20;
	static PILLAR_RADIUS = 7;
	static TOP_SIZE = [10,2,10];
	static BRANCH_SIZE = [3,Arena.DISTANCE+1,7];
	static BRANCH_POS = [0,Carousel.PILLAR_HEIGHT+0,0];
	
	constructor( )
	{
		super( suica );

//.//		this.arenas = [];	
		this.constructPillar( );
		
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
			var r1 = 1-0.9*u**0.3,
				r2 = (1-(1-u)**0.1)/2,
				r = THREE.MathUtils.mapLinear( u, 0, 1, r1, r2 );
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
			var r = 0.7*(1-0.98*u**0.1);
	
			// assumes u is:
			// 0.702...
			// 0.820...
			// 0.897...
			// 0.904...
			// 1.000
			if( u > 0.99 ) return [0,1,0,0.01];
			if( u > 0.91 ) return [0,1,0,0.02];
			if( u > 0.80 ) return [0,0.95,0,0.1];
			
			return [0,u,0,r];
		}
		var branch;
		for( var i=0; i<6; i++ )
		{
			branch = tube( Carousel.BRANCH_POS, branchProfile, 1, [10,8], Carousel.BRANCH_SIZE );
			var pos = branch.threejs.geometry.getAttribute( 'position' );
			for( var j=0; j<pos.count; j++ )
			{
				if( pos.getZ(j)<-0.2 ) pos.setZ( j, -0.2 );
			}
			its.threejs.material = material;
			its.spinH = i/6 * 360;
			its.spinV = 90;
			this.add( branch );
		}
		
		this.y = Base.POS_Y+Base.BASE_HEIGHT;
		
		this.add( pillar, top );
		
	} // Carousel.constructPillar




	update( dT )
	{
		this.spinH += 50*dT;
	}
} // class Carousel

