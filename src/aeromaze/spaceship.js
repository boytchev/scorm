//
//	class Spaceship
	


class Spaceship extends Group
{
	constructor( modelName = 'craft_speederA' )
	{
		super( suica );

		this.model = model( 'models/' + modelName + '.glb' );
			its.x = -2;
			its.y = -0.25;
			its.z = -1.75;

		// function to recursively make model element cast shadow
		function traverse( obj )
		{
			obj.castShadow = true;
			for( var i=0; i<obj.children.length; i++ )
				traverse( obj.children[i] );
		}

		this.model.addEventListener( 'load', obj=>traverse(obj.threejs) );

		this.add( this.model );
		
	} // Spaceship.constructor



	// handles clicks on a plate
	onClick( )
	{
		// if game is not started, click on any plate will start it
		if( playground.gameStarted )
		{
		}
		else
			playground.newGame( 0 );
	} // Spaceship.onClick
	
		
} // class Spaceship
