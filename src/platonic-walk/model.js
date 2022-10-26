//
//	class THREEJSModel( )
//

	

class THREEJSModel extends THREE.Group
{
	static SIZE = 10; // of ground
	static HEIGHT = 6; // of ground
	static NAME = 'Look Around Claire.fbx';
	
	constructor( )
	{
		super( );
		
		this.matrixAutoUpdate = false;
		
		this.loadModel( );
		this.createGround( );

		suica.scene.add( this );
			
	} // THREEJSModel.constructor

	

	// loads Mixamo model (character & animation )
	loadModel( name )
	{
		var that = this;
		var loader = new THREE.FBXLoader( );
			loader.load( 'models/'+THREEJSModel.NAME, objectLoaded );
				
		function objectLoaded( object )
		{
			// object.traverse( function ( child )
			// {
				// if( child.material )
				// {
					// child.material.emissive = new THREE.Color( 'white' );
					// child.material.emissiveIntensity = 0.1;
				// }
			// } );				
			
			object.rotation.set( -Math.PI/2, 0, 0 );
			object.scale.set( 0.05, 0.05, 0.05 );
			that.add( object );
			
			// анимация
			that.animator = new THREE.AnimationMixer( object );
			that.animator.clipAction( object.animations[0] ).play();

			that.moveModelToCenter( );
		}
	} // THREEJSModel.loadModel
	
	
	
	// create ground for the model
	createGround( )
	{
			
		var geometry = new THREE.CylinderGeometry( THREEJSModel.SIZE, THREEJSModel.SIZE, THREEJSModel.HEIGHT, 6 );
		
		var img = Platonic.constructTexture( 6, false ),
			map = new THREE.CanvasTexture( img.canvas ),
			material = new THREE.MeshLambertMaterial( {map: map} );

		// adjust the texture (because it is made for a normal plate)
		material.map.repeat.set( 0.9, 0.9 );
		material.map.center.set( 0.5, 0.5 );
		material.map.rotation = Math.PI/6;
		
		
		// now create the ground for the model
		this.ground = new THREE.Mesh( geometry, material );
		
		
		// change the sape and the uv mapping
		var pos = geometry.getAttribute( 'position' ),
			nor = geometry.getAttribute( 'normal' ),
			uv = geometry.getAttribute( 'uv' );
			
		for( var i=0; i<pos.count; i++ )
		{
			// change the shape (make the bottom sharp)
			if( pos.getY(i)>0 && pos.getX(i)**2+pos.getZ(i)**2>0.01  )
				pos.setY( i, 1-THREEJSModel.HEIGHT/2 );
			
			// make the side completely black byte
			// setting uv to black area of texture)
			if( nor.getY(i)**2 < 0.1 )
				uv.setXY( i, 0, 0 );
		}
		
		// recalculate normals
		geometry.computeVertexNormals();
		
		// move the ground just below the model feet
		this.ground.position.z = THREEJSModel.HEIGHT / 2;
		this.ground.rotation.set( Math.PI/2, 0, 0 );
		
		this.add( this.ground );
		
	} // THREEJSModel.createGround
	
	
	
	// move the model to the center of the screen
	moveModelToCenter( )
	{
		this.matrix.makeRotationX( Math.PI/2 );
		this.matrix.setPosition( new THREE.Vector3(0,0,0) );
	}
	
	
/*	
	// move the model to spot n and make it
	// it stand on the sirface of the plate
	moveModelToSpot( n )
	{
		var plateIdx = this.solid.spotPlate[ n ],
			plate = this.solid.plates[ plateIdx ];
console.log('plateidx',plateIdx);
console.log('spot pos',this.solid.spots[n]);
			
console.log(this.solid.size);			
		// get position from the spot, but orientation from the plate
		this.model.matrix.copy( plate.threejs.matrix );
		this.model.matrix.setPosition( new THREE.Vector3( ...this.solid.spots[n] ).multiplyScalar(this.solid.size) );
	}
*/	
	
	
	// update the model
	update( t, dT )
	{
		if( this.animator ) this.animator.update( dT );
	} // THREEJSModel.update
	
} // class THREEJSModel
