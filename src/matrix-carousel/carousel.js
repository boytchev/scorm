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
//	static DEACCELERATION_TIME = 500;
	static OUTWARD_ANGLE = 70;
//	static VIBRO_TIME = 1000;
	static VIBRO_ANGLE = Carousel.SPEED/40;
	static VIBRO_TIME_ANGLE = 15;
	static NEW_GAME_TIME = 1000;
	static END_GAME_TIME = 300;
	static GAME_DELAY_TIME = 200;
	
	// phases
	static STOPPED = 0;		// the carousel is still
	static SPINNING = 1;	// the carousel is accellerating or spinning at max speed
	static STOPPING = 2;	// the carousel is decelerating

	
	constructor( )
	{
		super( suica );

		this.cosys = [];
		this.speed = 0;
		this.speed = 0;
		this.maxSpeed = 0; // recorded
		this.vibroTime = 0;
		this.vibroSize = 0;

		this.spinTween = null;
		this.vibroTween = null;
		this.phase = Carousel.STOPPED;
		
		this.constructPillar( );
		this.constructCoSys( );
		
//		this.addEventListener( 'pointerdown', this.onPointerDown );

	} // Carousel.constructor


/*
	// handles clicks on the base
	onClick( )
	{
		// avoid fake onClicks
		//console.log(Playground.POINTER_USED, playground.pointerMovement);
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( Playground.POINTER_USED ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
		
	} // Carousel.onClick


	onPointerDown( )
	{
		if( playground.gameStarted )
		{
			//console.log(Playground.POINTER_USED, playground.pointerMovement);
			if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			this.startSpinning( );
		}
	}
*/
	
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
		
		this.pillar = pillar;
		this.pillarTop = top;
	} // Carousel.constructPillar



	constructCoSys( )
	{
		for( var i=0; i<6; i++ )
		{
			var angle = radians( i/6 * 360 ),
				x = Arena.DISTANCE * Math.cos( angle ),
				z = Arena.DISTANCE * Math.sin( angle );
			
			var cosys = new CoSys( 0 );
				cosys.center = [x, Carousel.BRANCH_POS[1], z];
				cosys.spinH = -i/6 * 360;

			this.cosys.push( cosys );
			this.add( cosys );
		}
		
	} // Carousel.constructCoSys
	
	
	
	// start carousel spinning
	startSpinning( )
	{
		this.phase = Carousel.SPINNING;

		playground.carouselSound.setVolume( 0 );
		console.log('carouselSound.play');
		playground.carouselSound.play( );
		playground.swingSound.stop( );
		
		if( this.spinTween )
			this.spinTween.stop( );
		if( this.vibroTween )
			this.vibroTween.stop( );
		
		this.spinTween = new TWEEN.Tween( this )
			.to( {speed:Carousel.SPEED, vibroSize:Carousel.VIBRO_ANGLE, }, Carousel.ACCELERATION_TIME )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	} // Carousel.startSpinning



	// stop carousel spinning
	stopSpinning( )
	{
		if( this.phase == Carousel.STOPPED ) return;
		
		this.phase = Carousel.STOPPING;

		if( this.spinTween )
			this.spinTween.stop( );
		
		// calculate actual stopping position
		var finalH = 60*Math.ceil( this.spinH/60 ) + 60*( Math.round(this.speed/200) );
		
		var time = 10*(finalH-this.spinH);
		
		this.vibroTime = 0;
		
		this.spinTween = new TWEEN.Tween( this )
			.to( {spinH:finalH, speed:0}, time )
			.easing( TWEEN.Easing.Quadratic.Out )
			.onComplete( (obj)=>{
					obj.phase = Carousel.STOPPED;
					playground.carouselSound.setVolume( 0 );
					playground.carouselSound.stop( );
				} )
			.start( );

		this.vibroTween = new TWEEN.Tween( this )
			.to( {vibroSize:0, vibroTime: Carousel.VIBRO_TIME_ANGLE*random(0.8,1.2)}, 3*time )
			.easing( TWEEN.Easing.Quadratic.InOut )
			.start( );

		console.log('swingSound.play');
		playground.swingSound?.stop( );
		playground.swingSound?.play( );
		
	} // Carousel.stopSpinning
	
	
	
	
	newGame( )
	{
console.log('---');
		for( var i in this.cosys )
		{	
			var cosys = this.cosys[i];
			
			cosys.idx = random(1,71)|0;
			playground.base.arenas[i].setMatrix( cosys.idx );
			
console.log(cosys.idx,Matrix.allMatrixData[cosys.idx].id);


			new TWEEN.Tween( cosys )
				.to( {}, random(0, Carousel.GAME_DELAY_TIME ) )
				.chain(
					new TWEEN.Tween( cosys )
						.to( {size:1}, Carousel.NEW_GAME_TIME )
						.easing( TWEEN.Easing.Bounce.Out )
						.onUpdate( (obj)=>{
							for( var label of obj.labels ) label.size = CoSys.LABEL_SIZE*obj.size;
							for( var arena of playground.base.arenas ) arena.regenerateTexture( obj.size );
						} )
				)
				.start();
		}
	} // Carousel.newGame




	endGame( )
	{
		for( var cosys of this.cosys )
		{	
			new TWEEN.Tween( cosys )
				.to( {size:0}, Carousel.END_GAME_TIME )
				.delay( random(0, CoSys.GAME_DELAY_TIME ) )
				.easing( TWEEN.Easing.Quadratic.In )
				.onUpdate( (obj)=>{
					for( var label of obj.labels ) label.size = CoSys.LABEL_SIZE*obj.size;
					for( var arena of playground.base.arenas ) arena.regenerateTexture( obj.size );
				} )
				.start( );
		}
	} // Carousel.endGame





	update( t, dT )
	{
		//console.log('vibroSize',this.vibroSize.toFixed(1));
		// process spinning
		if( this.phase == Carousel.SPINNING )
		{
			// when stopping spinH is controlled by a tween
			// but when spinning, it is controlled here
			this.spinH = (this.spinH+this.speed*dT) % 360;
		}
		
		playground.carouselSound?.setVolume( 0.1*this.speed/Carousel.SPEED );
		playground.swingSound?.setVolume( 0.2*this.vibroSize/Carousel.VIBRO_ANGLE );
		
		for( var cosys of this.cosys )
		{	
			cosys.update( t, dT );
			cosys.swingOutward( Carousel.OUTWARD_ANGLE * (this.speed/Carousel.SPEED)**3 );
			cosys.swingForward( this.vibroSize*Math.sin(this.vibroTime) );
		}
	}
} // class Carousel

