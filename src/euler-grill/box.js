//
//	class Box( )
//

	
class Box extends Group
{
	static SIZE = 20;
	
	constructor( )
	{
		super( suica );
	
		this.N = 7;
		this.space = null;
		
		this.generateSpace( );
		this.generateTunnels( {x:1,y:1,z:1} );
		this.calculateEuler( );

		this.backBox = cube([0,0,0],1);
		this.backBox.threejs.geometry = this.generateGeometry( );
		this.backBox.threejs.material = new THREE.MeshPhysicalMaterial( {
						// clearcoat: 1,
						// clearcoatRoughness: 0,
						sheen: 2,
						sheenColor: 'Crimson',
						sheenRoughness: 0.2,
						color: 'Wheat',
						transparent: true,
						side: THREE.BackSide,
						emissive: 'orange',
						emissiveIntensity: 0.7,
						opacity: 0.7,
						polygonOffset: true,
						polygonOffsetUnits: 1,
						polygonOffsetFactor: 1,
					} );

		
		this.frontBox = this.backBox.clone;
		this.frontBox.threejs.geometry = this.backBox.threejs.geometry;
		this.frontBox.threejs.material = this.backBox.threejs.material.clone();
		this.frontBox.threejs.material.side = THREE.FrontSide;
		

		this.edges = line();
		this.edges.threejs.geometry = new THREE.EdgesGeometry( this.backBox.threejs.geometry );
		this.edges.threejs.material = new THREE.LineBasicMaterial( { color: 'Sienna', side: THREE.DoubleSide } );

		this.add( this.edges, this.backBox, this.frontBox );
		
		this.addEventListener( 'click', this.onClick );
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
		
	} // Box.onClick

	
	
	generateSpace( )
	{
		var N = this.N;
		
		// create cube matrix NxNxN with
		// one extra cell from all sides
		this.space = [];
		for( var x=-1; x<N+1; x++ )
		{
			this.space[x]=[];
			for( var y=-1; y<N+1; y++ )
			{
				this.space[x][y]=[];
				for( var z=-1; z<N+1; z++ )
				{
					this.space[x][y][z] = (x>-1 && y>-1 && z>-1 && x<N && y<N && z<N)?1:0;
				}
			}
		}
	} // Box.generateSpace
	
	
	
	generateTunnels( T )
	{
		var N = this.N;
		
		
		function punch()
		{	// generate random tunel
			function iRandom( a, b ) { return Math.floor(random(a,b+1)); }
			
			var p = {};
			p.a1 = iRandom( 0, N-1 );
			p.a2 = iRandom( p.a1, N-1 );
			p.b1 = iRandom( 0, N-1 );
			p.b2 = iRandom( p.b1, N-1 );
			
			if( iRandom(0,1)>0.4 )
			{	// whole hole
				p.c1 = 0;
				p.c2 = N-1;
			}
			else
			{	// only dent
				if( iRandom(0,1)>0.5 )
				{
					p.c1 = 0;
					p.c2 = iRandom( 0,N-2 );
				}
				else
				{
					p.c1 = iRandom( 1, N-1 );
					p.c2 = N-1;
				}
			}
			return p;
		}
		
		//tunel XY
		for (var i=0; i<T.z; i++)
		{
			var p = punch();
			
			for (var x=p.a1; x<=p.a2; x++)
			for (var y=p.b1; y<=p.b2; y++)
			for (var z=p.c1; z<=p.c2; z++)
				this.space[x][y][z] = 0;
		}

		//tunel YZ
		for (var i=0; i<T.x; i++)
		{
			var p = punch();
			
			for (var y=p.a1; y<=p.a2; y++)
			for (var z=p.b1; z<=p.b2; z++)
			for (var x=p.c1; x<=p.c2; x++)
				this.space[x][y][z] = 0;
		}
		
		//tunel XZ
		for (var i=0; i<T.y; i++)
		{
			var p = punch();
			
			for (var z=p.a1; z<=p.a2; z++)
			for (var x=p.b1; x<=p.b2; x++)
			for (var y=p.c1; y<=p.c2; y++)
				this.space[x][y][z] = 0;
		}	
	} // Box.generateTunnels
	
	

	calculateEuler( )
	{
		this.F = 0;
		this.E = 0;
		this.V = 0;
		for( var x=0; x<this.N; x++ )
		for( var y=0; y<this.N; y++ )
		for( var z=0; z<this.N; z++ )
			if (this.space[x][y][z])
			{
//cube( [5*x-5*(this.N/2-1),5*y-5*(this.N/2-1),5*z-5*(this.N-1)/2], 4.5 );				
				if (!this.space[x+1][y][z] ) this.F++;
				if (!this.space[x-1][y][z] ) this.F++;
				if (!this.space[x][y+1][z] ) this.F++;
				if (!this.space[x][y-1][z] ) this.F++;
				if (!this.space[x][y][z+1] ) this.F++;
				if (!this.space[x][y][z-1] ) this.F++;
			}		
		for( var x=-1; x<this.N; x++ )
		for( var y=-1; y<this.N; y++ )
		for( var z=-1; z<this.N; z++ )
			{
				// a box of 2x2x2 cubes around each vertex
				// if 0 cubes - no vertex (external vertex)
				// if 8 cubes - no vertex (internal vertex)
				var count = 0;
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y+1][z]+this.space[x+1][y+1][z];
				count += this.space[x][y][z+1]+this.space[x+1][y][z+1];
				count += this.space[x][y+1][z+1]+this.space[x+1][y+1][z+1];
				if (0<count && count<8 ) this.V++;
				
				var count = 0; // XY
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y+1][z]+this.space[x+1][y+1][z];
				if (0<count && count<4 ) this.E++;
				
				var count = 0; // XZ
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y][z+1]+this.space[x+1][y][z+1];
				if (0<count && count<4 ) this.E++;
				
				var count = 0; // YZ
				count += this.space[x][y][z]+this.space[x][y+1][z];
				count += this.space[x][y][z+1]+this.space[x][y+1][z+1];
				if (0<count && count<4 ) this.E++;
			}		
		
		console.log('F =',this.F);
		console.log('E =',this.E);
		console.log('V =',this.V);
		console.log('F-E+V =',this.F-this.E+this.V);
	} // Box.calculateEuler
	
	
	generateGeometry = function(space)
	{
		var N = this.N;
		var M = N/2-1/2;

		var triangles = this.F*2;
		var vertices = triangles*3;

		// attribure arrays
		var posArr = new Float32Array(3*vertices);
		var norArr = new Float32Array(3*vertices);
		var texArr = new Float32Array(2*vertices);
		
		var index = 0;
		
		function set(x,y,z,nx,ny,nz,u,v)
		{
			posArr[3*index] = x-M;
			posArr[3*index+1] = y-M;
			posArr[3*index+2] = z-M;
			
			norArr[3*index] = nx;
			norArr[3*index+1] = ny;
			norArr[3*index+2] = nz;

			texArr[2*index] = u;
			texArr[2*index+1] = v;
			
			index++;
		}	
		
		// top plates (from Y+ -> Y-)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x][y+1][z] )
			{
				set( x,y+1,z,		0,1,0,	0,1 );
				set( x+1,y+1,z+1,	0,1,0,	1,0 );
				set( x+1,y+1,z,		0,1,0,	1,1 );

				set( x,y+1,z,		0,1,0,	0,1 );
				set( x,y+1,z+1,		0,1,0,	0,0 );
				set( x+1,y+1,z+1,	0,1,0,	1,0 );
			}
			
		// bottom plates (from Y- -> Y+)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x][y-1][z] )
			{
				set( x,y,z,		0,-1,0,	0,1 );
				set( x+1,y,z,	0,-1,0,	1,1 );
				set( x+1,y,z+1,	0,-1,0,	1,0 );

				set( x,y,z,		0,-1,0,	0,1 );
				set( x+1,y,z+1,	0,-1,0,	1,0 );
				set( x,y,z+1,	0,-1,0,	0,0 );
			}
		
		// front plates (from Z+ -> Z-)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x][y][z+1] )
			{
				set( x,y,z+1,		0,0,1,	0,1 );
				set( x+1,y,z+1,		0,0,1,	1,1 );
				set( x+1,y+1,z+1,	0,0,1,	1,0 );

				set( x,y,z+1,		0,0,1,	0,1 );
				set( x+1,y+1,z+1,	0,0,1,	1,0 );
				set( x,y+1,z+1,		0,0,1,	0,0 );
			}
		
		// back plates (from Z- -> Z+)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x][y][z-1] )
			{
				set( x,y,z,		0,0,-1,	0,1 );
				set( x+1,y+1,z,	0,0,-1,	1,0 );
				set( x+1,y,z,	0,0,-1,	1,1 );

				set( x,y,z,		0,0,-1,	0,1 );
				set( x,y+1,z,	0,0,-1,	0,0 );
				set( x+1,y+1,z,	0,0,-1,	1,0 );
			}
			
		// right plates (from X+ -> X-)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x+1][y][z] )
			{
				set( x+1,y,z,		1,0,0,	0,1 );
				set( x+1,y+1,z+1,	1,0,0,	1,0 );
				set( x+1,y,z+1,		1,0,0,	1,1 );

				set( x+1,y,z,		1,0,0,	0,1 );
				set( x+1,y+1,z,		1,0,0,	0,0 );
				set( x+1,y+1,z+1,	1,0,0,	1,0 );
			}
			
		// left plates (from X- -> X+)
		for( var x=0; x<N; x++ )
		for( var y=0; y<N; y++ )
		for( var z=0; z<N; z++ )
			if( this.space[x][y][z] && !this.space[x-1][y][z] )
			{
				set( x,y,z,		-1,0,0,	0,1 );
				set( x,y,z+1,	-1,0,0,	1,1 );
				set( x,y+1,z+1,	-1,0,0,	1,0 );

				set( x,y,z,		-1,0,0,	0,1 );
				set( x,y+1,z+1,	-1,0,0,	1,0 );
				set( x,y+1,z,	-1,0,0,	0,0 );
			}

		var geometry = new THREE.BufferGeometry();

		geometry.setAttribute( 'position', new THREE.BufferAttribute(posArr,3) );
		geometry.setAttribute( 'normal', new THREE.BufferAttribute(norArr,3) );
		geometry.setAttribute( 'uv', new THREE.BufferAttribute(texArr,2) );
			
		return geometry;
	} // Box.generateGeometry


} // class Box

