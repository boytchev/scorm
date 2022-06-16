//
// class Playground
//


class Playground
{
	constructor( )
	{
		this.masterPlate = new Plate( [0,0,0], 0 );

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
				
			this.plates.push( new Plate( [x,0,z], 90-spin ) );
		}
		
		this.plates[0].flipOut( 0.5 );
		this.plates[1].flipOut( 0.6 );
		this.plates[2].flipOut( 0.7 );
		this.plates[3].flipOut( 0.8 );
		this.plates[4].flipOut( 0.9 );
		this.plates[5].flipOut( 1.0 );
		
	} // Playground.constructor
	
} // class Playground
