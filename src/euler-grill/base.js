//
//	class Base( )
//


var SC = 5;
	
class Base extends Suica.Group
{
	static POS_Y = 6/SC;
	static SIZE = [48,1,28];
	static PILLAR_SIZE = [2,20,12];
	static PILLAR_POS = Spinner.ROTOR_POS+1.05;
	static SCALE_SIZE = [32,0.1,4*20/64];
	static SCALE_Y = -Base.PILLAR_SIZE[1];
	static GROOVE_SIZE = [28,0.5];
	
	constructor( )
	{
		super( suica );

		this.size = 1/SC;
		
		this.constructPillars( );
		this.constructBase( );
		this.constructScale( );
		
		this.y = Base.POS_Y;
		
		this.addEventListener( 'pointerup', this.onpointerup );
		this.addEventListener( 'pointerdown', this.onpointerdown );

	} // Base.constructor



	// handles clicks on the base
	onpointerup( )
	{
		// avoid fake onClicks
//		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
		if( !playground.inVR && (Date.now()-playground.pointerDownTime > Playground.POINTER_TIME) ) return;
			
		// if game is not started, click on the base will start it
		if( !playground.gameStarted )
		{
			playground.newGame( );
		}
	} // Base.onClick
	
	
	onpointerdown( event )
	{
		if( playground ) playground.pointerDownTime = Date.now();
	}
	
	
	// construct the base
	constructBase( )
	{
		// main body of the base
		var map = ScormUtils.image( 'metal_plate.jpg', Base.SIZE[0]/4, Base.SIZE[2]/4 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Base.SIZE[0]/4, Base.SIZE[2]/4 ),
			lightMap = ScormUtils.image( 'base_antilight.jpg', 1, 1 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'lightgray',
			metalness: 0,
			roughness: 0.5,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			lightMap: lightMap,
			lightMapIntensity: -2,
		} );	

		var base = square( [0,-Base.PILLAR_SIZE[1]-0*Base.SIZE[1]/2,0], [Base.SIZE[0],Base.SIZE[2]] );
			its.spinV = -90;
			its.threejs.material = material;
		ScormUtils.addUV2( base );
			
		// black border of the base
		var border = cube( [0,-Base.PILLAR_SIZE[1]-Base.SIZE[1]/2-0.01,0], [Base.SIZE[0]+0.02,Base.SIZE[1],Base.SIZE[2]+0.02], 'black' );
			its.threejs.material.polygonOffset = true;
			its.threejs.material.polygonOffsetFactor = 1;
			its.threejs.material.polygonOffsetUnits = 1;
			
		var groove1 = square( [0,-Base.PILLAR_SIZE[1]+0.02,Slider.OFFSET], Base.GROOVE_SIZE, 'black' );
			its.spinV = 90;
		var groove2 = square( [0,-Base.PILLAR_SIZE[1]+0.02,-Slider.OFFSET], Base.GROOVE_SIZE, 'black' );
			its.spinV = 90;
		
		// shadow under the base
		var shadow = square( [0,-Base.PILLAR_SIZE[1]-Base.SIZE[1],0], [Base.SIZE[0]+2,Base.SIZE[2]+2] );
			its.spinV = -90;
			its.threejs.material = new THREE.MeshBasicMaterial( {
				color: 'black',
				alphaMap: ScormUtils.image( 'floor_shadow_alpha.jpg' ),
				transparent: true,
			});
			its.threejs.renderOrder = -10;
		
		this.add( base, border, groove1, groove2, shadow );
	} // Base.constructBase
	
	
	
	// construct both pillars
	constructPillars( )
	{
		// pillar geometry
		var geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 16, 32 );
		var nor = geometry.getAttribute( 'normal' );
		var pos = geometry.getAttribute( 'position' );
		var uv = geometry.getAttribute( 'uv' );
		for( var i=0; i<nor.count; i++ )
		{
			// bottom curve
			if( pos.getY(i)<0 && pos.getX(i)<0 )
				pos.setX( i, -1/2-Math.pow(3*pos.getY(i),2) );
						
			// top ark
			if( pos.getY(i)>=1/2-0.01 )
			{
				pos.setZ( i, 0.5*Math.sin(Math.PI*pos.getZ(i)) );
				pos.setY( i, pos.getY(i) + Math.sqrt(1/4-pos.getZ(i)**2)*Base.PILLAR_SIZE[2]/Base.PILLAR_SIZE[1] );
			}

			// black border
			if( nor.getX(i)==0 )
				nor.setXYZ( i, 0, 0, 0 );

			// texture
			uv.setXY( i, 1/2+pos.getZ(i), 1/2+pos.getY(i) );
		}


		// pillar material
		var map = ScormUtils.image( 'metal_plate.jpg',Base.PILLAR_SIZE[2]/4, Base.PILLAR_SIZE[1]/4 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg',Base.PILLAR_SIZE[2]/4, Base.PILLAR_SIZE[1]/4 ),
			lightMap = ScormUtils.image( 'pillar_antilight.jpg', 1, 15/20, 0, 0 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'lightgray',
			metalness: 0,
			roughness: 0.42,
			side: THREE.FrontSide,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			lightMap: lightMap,
			lightMapIntensity: -0.5,
		} );	
			
		// right pillar
		var pillar = cube( [Base.PILLAR_POS,-Base.PILLAR_SIZE[1]/2,0], Base.PILLAR_SIZE, 'white' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;
			ScormUtils.addUV2( pillar );
		this.add( pillar );

		// add black border
		var uv2 = geometry.getAttribute( 'uv2' );
		for( var i=0; i<nor.count; i++ )
		{
			if( nor.getX(i)==0 )
				uv2.setXY( i, 0, 0 );
		}
		
		// left pillar
		pillar = pillar.clone;
		pillar.solidMesh.geometry = geometry;
		pillar.solidMesh.material = material;
		pillar.x = -Base.PILLAR_POS;
		pillar.spin = 180;
		this.add( pillar );
	} // Base.constructPillars
	
	
	
	
	// construct scale
	constructScale( )
	{

		var material, scale, alphaMap;
		
		// front scale
		alphaMap = ScormUtils.image( 'scale_alpha.png', 1, 20/64 );
		material = new THREE.MeshBasicMaterial( {
			color: 'Linen',
			alphaMap: alphaMap,
			transparent: true,
		} );	
			
		scale = cube( [0,Base.SCALE_Y,Slider.OFFSET+2.25*Base.SCALE_SIZE[2]], Base.SCALE_SIZE );
			its.solidMesh.material = material;
		this.add( scale );


		// back scale
		alphaMap = ScormUtils.image( 'scale_alpha.png', 1, 20/64, 0, 1-20/64 );
		material = new THREE.MeshBasicMaterial( {
			color: 'Linen',
			alphaMap: alphaMap,
			transparent: true,
		} );	
			
		scale = cube( [0,Base.SCALE_Y,-Slider.OFFSET-2.25*Base.SCALE_SIZE[2]], Base.SCALE_SIZE );
			its.solidMesh.material = material;
		this.add( scale );
		
	} // Base.constructScale
	
} // class Base

