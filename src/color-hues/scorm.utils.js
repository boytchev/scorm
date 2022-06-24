//
//	library SCORM Utils
//
//	getLanguage( )
//	translate( dictionary )
//	isSoundOn( )
//	setSound( )
//	toggleSound( )



// get the language for the user interface, currently supported languages
// are English (en), Bulgarian (bg) and Japanese (jp)

function getLanguage( )
{
	// get language parameter from the URL,
	// if omitted, use time zone of the OS
	
	var urlParams = new URLSearchParams( window.location.search );

	if( urlParams.has('lang') )
		return urlParams.get('lang');

	// https://stackoverflow.com/a/70870895
	var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		
	// https://codepen.io/diego-fortes/pen/YzEPxYw
	switch( timeZone )
	{
		case 'Europe/Sofia': return 'bg';
		case 'Asia/Tokyo':   return 'jp';
		default:             return 'en';
	}
} // getLanguage



// translate user interface elements using a custom dictionary
function translate( dictionary )
{
	var language = getLanguage( );
	
	for( var string of dictionary )
	{
		if( string[language] )
		{
			var elem = element( string.id );
			if( elem ) elem.innerHTML = string[language] || string.en;
		}
	}
} // translate
	
	
	
// set sound button on/off depending on previous user's setting (if any)
function setSound( )
{
	var elem = element( 'sound-on-off' );
	if( !elem ) return;

	if( isSoundOn() )
	{
		elem.src = setSound.SOUND_ON;
		playground?.unmute( );
	}
	else
	{
		elem.src = setSound.SOUND_OFF;
		playground?.mute( );
	}
}
setSound.SOUND_ON = 'images/sound-on.png';
setSound.SOUND_OFF = 'images/sound-off.png';
	
	
	
// toggle sound button on/off
function toggleSound( )
{
	var elem = element( 'sound-on-off' );
	if( !elem ) return;

	if( isSoundOn() )
	{
		elem.src = setSound.SOUND_OFF;
		playground?.mute( );
		localStorage.setItem( 'sound', 'off' );
	}
	else
	{
		elem.src = setSound.SOUND_ON;
		playground?.unmute( );
		localStorage.setItem( 'sound', 'on' );
	}
}
	
	
	
// get the status of the sound - either on or off (default)
function isSoundOn( )
{
	return localStorage.getItem( 'sound' ) == 'on';
}

