//
//	class Base( )
//

	
class Base extends Group
{
	static POS_Y = 6;
	static SIZE = [48,4,28];
	static PILLAR_SIZE = [2,20,12];
	static PILLAR_POS = Spinner.ROTOR_POS+1.05;
	static SCALE_SIZE = [32,0.1,4*20/64];
	static SCALE_Y = -Base.PILLAR_SIZE[1];
	static GROOVE_SIZE = [28,0.5];
	
	constructor( )
	{
		super( suica );

		this.constructPillars( );
		this.constructBase( );
		this.constructScale( );
		
		this.y = Base.POS_Y;
		
	} // Box.constructor



	// handles clicks on the box
	onClick( )
	{
		// avoid fake onClicks -- this is when the pointer is dragged
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT ) return;
			
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
//			this.toggle( );
		}
		else
			playground.newGame( );
		
		playground.clickSound?.play();
		
	} // Spinner.onClick
	
	
	
	// construct the base
	constructBase( )
	{
		var map = ScormUtils.image( 'metal_plate.jpg', Base.SIZE[0]/4, Base.SIZE[2]/4 ),
			normalMap = ScormUtils.image( 'metal_plate_normal.jpg', Base.SIZE[0]/4, Base.SIZE[2]/4 ),
			lightMap = ScormUtils.image( 'base_antilight.jpg', 1, 1 );
		var material = new THREE.MeshStandardMaterial( {
			color: 'white',
			metalness: 0,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			lightMap: lightMap,
			lightMapIntensity: -0.7,
		} );	

		var base = cube( [0,-Base.PILLAR_SIZE[1]-Base.SIZE[1]/2,0], Base.SIZE );
			its.threejs.material = material;
		ScormUtils.addUV2( base );
			
		var border = cube( [0,-Base.PILLAR_SIZE[1]-Base.SIZE[1]/2-0.01,0], [Base.SIZE[0]+0.02,Base.SIZE[1],Base.SIZE[2]+0.02], 'black' );
		var groove1 = square( [0,-Base.PILLAR_SIZE[1]+0.01,Slider.OFFSET], Base.GROOVE_SIZE, 'black' );
			its.spinV = 90;
		var groove2 = square( [0,-Base.PILLAR_SIZE[1]+0.01,-Slider.OFFSET], Base.GROOVE_SIZE, 'black' );
			its.spinV = 90;
		
		this.add( base, border, groove1, groove2 );
	}
	
	
	
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
			color: 'white',
			metalness: 0,
			roughness: 0.42,
			map: map,
			normalMap: normalMap,
			normalScale: new THREE.Vector2( 0.5, 0.5 ),
			lightMap: lightMap,
			lightMapIntensity: -1,
		} );	
			
		// right pillar
		var pillar = cube( [Base.PILLAR_POS,-Base.PILLAR_SIZE[1]/2,0], Base.PILLAR_SIZE, 'white' );
			its.solidMesh.geometry = geometry;
			its.solidMesh.material = material;
			ScormUtils.addUV2( pillar );
		this.add( pillar );
		
		// left pillar
		pillar = pillar.clone;
		pillar.solidMesh.geometry = geometry;
		pillar.solidMesh.material = material;
		pillar.x = -Base.PILLAR_POS;
		pillar.spin = 180;
		this.add( pillar );
	}
	
	
	
	
	// construct scale
	constructScale( )
	{

		var material, scale, alphaMap;
		
		// front scale
		alphaMap = ScormUtils.image( 'scale_alpha.png', 1, 20/64, 0, 0 );
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
	


	update( )
	{

	} // Base.update
	
} // class Base

