//
//	class Connector( )
//

	
class Connector extends Group
{
	
	constructor( center, spinV=0 )
	{
		super( suica );

		this.center = center;
		this.spinV = spinV;
		
		var connSide = tube(
				[0,0,0],
				[ [0,-0.1,0,Pipe.RADIUS+2*Pipe.EXTRUDE],
				  [0,0.2,0,Pipe.RADIUS+Pipe.EXTRUDE],
				  ],
				 1, [1,32], 1
			);
			connSide.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'dimgray',
						metalness: 0.8,
						roughness: 0.3,
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 1/4, 2 ),
						normalScale: new THREE.Vector2( 0.5, 0.5 ),
					} );
					
		var connTop = circle( [0,0.2,0], 2*Pipe.RADIUS+2*Pipe.EXTRUDE );
			connTop.spinV = -90;
			connTop.threejs.material = new THREE.MeshStandardMaterial( {
						color: 'dimgray',
						metalness: 0.8,
						roughness: 0.3,
						normalMap: ScormUtils.image( 'metal_plate_normal.jpg', 1, 1 ),
						normalScale: new THREE.Vector2( 0.5, 0.5 ),
					} );
			
		this.add( connSide, connTop );

	} // Connector.constructor

} // Connector
