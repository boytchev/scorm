//
//	class Carousel( )
//

	
class Carousel extends Group
{
	static PILLAR_HEIGHT = 20;
	static PILLAR_RADIUS = 7;
	static TOP_SIZE = [10,2,10];
	static BRANCH_SIZE = [2, Arena.DISTANCE+0.25, 6];
	static BRANCH_POS = [0,Carousel.PILLAR_HEIGHT,0];
	static END_SIZE = [2.5, 0.8];
	static SPEED = 300;
	static ACCELERATION_TIME = 1500;
	static DEACCELERATION_TIME = 500;
	static OUTWARD_ANGLE = 70;
	static VIBRO_SPEED = 4000;
	
	constructor( )
	{
		super( suica );

		this.cosys = [];
		this.speed = 0;
		this.maxSpeed = 0; // recorded
		this.vibroTime = 0;
		this.vibroSize = 0;
		this.vibroSpeed = random( 0.6, 1.4 );

		this.spinTween = null;
		
		this.constructPillar( );
		this.constructCoSys( );
		
		this.addEventListener( 'click', this.onClick );
		this.addEventListener( 'pointerdown', this.startSpinning );

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

		for( var i=0; i<6; i++ )
		{
			var branch = tube( [0,0,0], branchProfile, 1, [20,16], Carousel.BRANCH_SIZE );
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
			its.spinH = 360/12;
			its.spinV = 90;
			
			var branchEnd = prism( 6, [Carousel.BRANCH_SIZE[1],-0.75*Carousel.END_SIZE[1],0], Carousel.END_SIZE, 'black' );

			var branchGroup = group( );
				its.add( branch, branchEnd );
				its.center = Carousel.BRANCH_POS;
				its.spinH = i/6 * 360;
				
			this.add( branchGroup );
		}
		
		this.y = Base.POS_Y+Base.BASE_HEIGHT;
		
		this.add( pillar, top );
		
	} // Carousel.constructPillar



	constructCoSys( )
	{
		for( var i=0; i<6; i++ )
		{
			var angle = radians( i/6 * 360 ),
				x = Arena.DISTANCE * Math.cos( angle ),
				z = Arena.DISTANCE * Math.sin( angle );
			
			var cosys = new CoSys( random(1,71)|0 );
				cosys.center = [x, Carousel.BRANCH_POS[1], z];
				cosys.spinH = -i/6 * 360;

			this.cosys.push( cosys );
			this.add( cosys );
		}
		
	} // Carousel.constructCoSys
	
	
	
	// start carousel spinning
	startSpinning( )
	{
		if( this.spinTween )
			this.spinTween.stop( );
		
		this.spinTween = new TWEEN.Tween( this )
			.to( {speed:Carousel.SPEED}, Carousel.ACCELERATION_TIME )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	} // Carousel.startSpinning



	// stop carousel spinning
	stopSpinning( )
	{
		if( this.spinTween )
		{
			this.spinTween.stop( );
		}
		
		// vibro is the tiny swing when the carousel is stopped
		this.vibroTime = 0;
		this.vibroSize = this.speed/50;
		
		var vibroTween = null,
			that = this;
		
		this.spinTween = new TWEEN.Tween( this )
			.to( {speed:0}, Carousel.DEACCELERATION_TIME )
			.easing( TWEEN.Easing.Sinusoidal.In )
			.onUpdate( function(obj) {
				 if( obj.speed<10 && !vibroTween )
				 {
					vibroTween = new TWEEN.Tween( that )
						.to( {vibroTime:20, vibroSize:0}, Carousel.VIBRO_SPEED )
						.easing( TWEEN.Easing.Quadratic.Out/*Sinusoidal.InOut*/ )
						.start();
				 }
			} )
			.start( );
			
		

		//setTimeout( function(){vibroTween.start();}, Carousel.DEACCELERATION_TIME - Carousel.VIBRO_SPEED/3 );
		
	} // Carousel.stopSpinning



	update( t, dT )
	{
		this.spinH += this.speed*dT;
		for( var cosys of this.cosys )
		{
			//cosys.update( t, dT );
			cosys.swingOutward( Carousel.OUTWARD_ANGLE * (this.speed/Carousel.SPEED)**2 );
			cosys.swingForward( this.vibroSize*Math.sin(this.vibroTime*this.vibroSpeed) );
		}
	}
} // class Carousel

