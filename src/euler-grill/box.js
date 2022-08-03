//
//	class Box( )
//

	
class Box extends Group
{
	static SIZE = 20;
	
	constructor( )
	{
		super( suica );
	
		this.F = 0; // number of faces
		this.E = 0; // number of edges
		this.V = 0; // number or vertices

		this.T = {x:0,y:0,z:0}; // number of tunnels
		this.N = 6; //numbed of grid units
		this.space = null;
		
		this.size = Box.SIZE;
		
		this.fullBox = cube([0,0,0],1);
			its.threejs.material = new THREE.MeshPhysicalMaterial( {
						sheen: 2,
						sheenColor: 'Crimson',
						sheenRoughness: 0.2,
						color: 'Wheat',
						transparent: true,
						emissive: 'orange',
						emissiveIntensity: 0.7,
						opacity: 0.7,
						depthWrite: false,
					} );
		this.fullEdges = cube([0,0,0],1,'Sienna');
			its.wireframe = true;
			its.threejs.material.transparent = true;

		this.backBox = cube([0,0,0],1);
		this.backBox.threejs.material = new THREE.MeshPhysicalMaterial( {
						sheen: 2,
						sheenColor: 'Crimson',
						sheenRoughness: 0.2,
						color: 'Wheat',
						transparent: true,
						side: THREE.BackSide,
						emissive: 'orange',
						emissiveIntensity: 0.7,
						opacity: 0, //0.7,
						depthWrite: false,
					} );

		
		this.frontBox = this.backBox.clone;
		this.frontBox.threejs.material = this.backBox.threejs.material.clone();
		this.frontBox.threejs.material.side = THREE.FrontSide;
		
		this.edges = line();
		this.edges.threejs.material = new THREE.LineBasicMaterial( { 		color: 'Sienna',
				transparent: true,
				opacity: 0, //1,
		} );

		var angle = degrees( Math.acos(2/Math.sqrt(2)/Math.sqrt(3)) );
		this.spinH = 90-angle;
		this.spinV = 45;

		var dotted = drawing( 4, 1 );
			moveTo( 0, 0 );
			lineTo( 2, 0 );
		stroke( 'white', 2 );
		
		this.wrapper = cube( [0,0,0], 1, 'black' );
			its.wireframe = true;
			its.image = dotted;
			its.images = 60;
		
		this.add( this.fullBox, this.fullEdges, this.edges, this.backBox, this.frontBox, this.wrapper );

		this.state = 0; // must be after creating elements

		this.backBox.threejs.renderOrder = 1;
		this.frontBox.threejs.renderOrder = 2;
		this.edges.threejs.renderOrder = 0;
		this.wrapper.threejs.renderOrder = 3;
	
		
		this.regenerateBox( );

	} // Box.constructor
	
	

	regenerateBox( )
	{
		this.size = Box.SIZE/this.N

		// generate a new shape
		var that = this;
		function regenerate( )
		{
			that.generateSpace( );
			that.generateTunnels( );
			that.regenerateNonManifolds( );
			that.calculateEuler( );
		}
		
		// is it too easy? try another regenaration, several times times
		regenerate( );
		if( this.complexity-playground?.difficulty<-30 ) regenerate( );
		if( this.complexity-playground?.difficulty<-30 ) regenerate( );
		if( this.complexity-playground?.difficulty<-30 ) regenerate( );


		// update the geometries
		var geometry = this.generateGeometry( ).scale(1/this.N,1/this.N,1/this.N);
		
		this.backBox.threejs.geometry.dispose( );
		this.backBox.threejs.geometry = geometry;
		
		this.frontBox.threejs.geometry.dispose( );
		this.frontBox.threejs.geometry = geometry;
		
		this.edges.threejs.geometry.dispose( );
		this.edges.threejs.geometry = new THREE.EdgesGeometry( geometry );
		
	} // Box.regenerateBox

	
	
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
	
	
	
	generateTunnels( )
	{
		var N = this.N,
			T = this.T;
		
		var a1,a2,b1,b2,c1,c2;
		
		function punch()
		{	// generate random tunel
			function iRandom( a, b ) { return Math.floor(random(a,b+1)); }
			
			a1 = iRandom( 0, N-2 );
			a2 = iRandom( a1+1, N-1 );
			b1 = iRandom( 0, N-2 );
			b2 = iRandom( b1+1, N-1 );
			
			if( random(0,1)>-0.4 )
			{	// whole hole
				c1 = 0;
				c2 = N-1;
			}
			else
			{	// only dent
				if( random(0,1)>0.5 )
				{
					c1 = 0;
					c2 = iRandom( 0,N-2 );
				}
				else
				{
					c1 = iRandom( 1, N-1 );
					c2 = N-1;
				}
			}
		}
		
		//tunel XY
		for (var i=0; i<T.z; i++)
		{
			punch();
			
			for (var x=a1; x<=a2; x++)
			for (var y=b1; y<=b2; y++)
			for (var z=c1; z<=c2; z++)
				this.space[x][y][z] = 0;
		}

		//tunel YZ
		for (var i=0; i<T.x; i++)
		{
			punch();
			
			for (var y=a1; y<=a2; y++)
			for (var z=b1; z<=b2; z++)
			for (var x=c1; x<=c2; x++)
				this.space[x][y][z] = 0;
		}
		
		//tunel XZ
		for (var i=0; i<T.y; i++)
		{
			punch();
			
			for (var z=a1; z<=a2; z++)
			for (var x=b1; x<=b2; x++)
			for (var y=c1; y<=c2; y++)
				this.space[x][y][z] = 0;
		}	
	} // Box.generateTunnels
	
	

	regenerateNonManifolds( )
	{
		// cheks all edges - if an edge is shared by two opposite cubes,
		// then this edge makes the shape non-manifold and is removed by
		// adding a cube
		var addedCubes = 1;
		while( addedCubes > 0 )
		{
			addedCubes = 0;
			
			for( var x=0; x<this.N; x++ )
			for( var y=0; y<this.N; y++ )
			for( var z=0; z<this.N; z++ )
			{
				// XY
				if( this.space[x][y][z] && this.space[x+1][y+1][z] && !this.space[x+1][y][z] && !this.space[x][y+1][z] )
				{
					this.space[x+1][y][z] = 1;
					addedCubes++;
				}
				if( !this.space[x][y][z] && !this.space[x+1][y+1][z] && this.space[x+1][y][z] && this.space[x][y+1][z] )
				{
					this.space[x][y][z] = 1;
					addedCubes++;
				}

				// XZ
				if( this.space[x][y][z] && this.space[x+1][y][z+1] && !this.space[x+1][y][z] && !this.space[x][y][z+1] )
				{
					this.space[x+1][y][z] = 1;
					addedCubes++;
				}
				if( !this.space[x][y][z] && !this.space[x+1][y][z+1] && this.space[x+1][y][z] && this.space[x][y][z+1] )
				{
					this.space[x][y][z] = 1;
					addedCubes++;
				}

				// YZ
				if( this.space[x][y][z] && this.space[x][y+1][z+1] && !this.space[x][y+1][z] && !this.space[x][y][z+1] )
				{
					this.space[x][y+1][z] = 1;
					addedCubes++;
				}
				if( !this.space[x][y][z] && !this.space[x][y+1][z+1] && this.space[x][y+1][z] && this.space[x][y][z+1] )
				{
					this.space[x][y][z] = 1;
					addedCubes++;
				}
			}
		}
	} // Box.regenerateNonManifolds
	
	
	calculateEuler( )
	{
		var count;
		
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
				count = 0;
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y+1][z]+this.space[x+1][y+1][z];
				count += this.space[x][y][z+1]+this.space[x+1][y][z+1];
				count += this.space[x][y+1][z+1]+this.space[x+1][y+1][z+1];
				if (0<count && count<8 ) this.V++;
				
				count = 0; // XY
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y+1][z]+this.space[x+1][y+1][z];
				if (0<count && count<4 ) this.E++;
				
				count = 0; // XZ
				count += this.space[x][y][z]+this.space[x+1][y][z];
				count += this.space[x][y][z+1]+this.space[x+1][y][z+1];
				if (0<count && count<4 ) this.E++;
				
				count = 0; // YZ
				count += this.space[x][y][z]+this.space[x][y+1][z];
				count += this.space[x][y][z+1]+this.space[x][y+1][z+1];
				if (0<count && count<4 ) this.E++;
			}		
		
		// console.log('F =',this.F);
		// console.log('E =',this.E);
		// console.log('V =',this.V);
		// console.log('F-E+V =',this.F-this.E+this.V);

		// calculate complecity
		this.complexity = 0;
		for( var x=-1; x<this.N; x++ )
		for( var y=-1; y<this.N; y++ )
		for( var z=-1; z<this.N; z++ )
		{
			count = 0;
			for( var dx=0; dx<2; dx++ )
			for( var dy=0; dy<2; dy++ )
			for( var dz=0; dz<2; dz++ )
				count += this.space[x+dx][y+dy][z+dz]
			this.complexity += count%2;
		}

	} // Box.calculateEuler
	
	
	generateGeometry = function(space)
	{
		var N = this.N;
		var M = N/2;

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

	
	
	// state: 0=stopped, 1=fully working
	set state( state )
	{
		this.size = Box.SIZE*state + 5*(1-state);
		
		this.fullBox.threejs.material.opacity   = 0.7 * (1-state);
		this.fullEdges.threejs.material.opacity = 1.0 * (1-state);
		
		this.backBox.threejs.material.opacity   = 0.5 * state;
		this.frontBox.threejs.material.opacity  = 0.5 * state;
		this.edges.threejs.material.opacity     = 1.0 * state;
		this.wrapper.threejs.material.opacity   = 0.3 * state;
		
		this.fullBox.threejs.material.visible   = state < 1;
		this.fullEdges.threejs.material.visible = state < 1;
		
		this.backBox.threejs.material.visible   = state > 0;
		this.frontBox.threejs.material.visible  = state > 0;
		this.edges.threejs.material.visible     = state > 0;
		this.wrapper.threejs.material.visible   = state > 0;
	}


} // class Box

