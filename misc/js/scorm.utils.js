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

	switch( getSound() )
	{
		case 'on':
			elem.src = setSound.SOUND_ON;
			playground?.unmute( true );
			break;
		case 'fx':
			elem.src = setSound.SOUND_FX;
			playground?.unmute( false );
			break;
		case 'off':
		default:
			elem.src = setSound.SOUND_OFF;
			playground?.mute( );
			break;
	}
}
setSound.SOUND_ON = 'images/sound-on.png';
setSound.SOUND_FX = 'images/sound-fx.png';
setSound.SOUND_OFF = 'images/sound-off.png';
	
	
	
// toggle sound button on/off
function toggleSound( )
{
	var elem = element( 'sound-on-off' );
	if( !elem ) return;

	switch( getSound() )
	{
		case 'fx':
			localStorage.setItem( 'sound', 'on' );
			elem.src = setSound.SOUND_ON;
			playground?.unmute( true );
			break;
		case 'off':
			localStorage.setItem( 'sound', 'fx' );
			elem.src = setSound.SOUND_FX;
			playground?.unmute( false );
			break;
		case 'on':
		default:
			localStorage.setItem( 'sound', 'off' );
			elem.src = setSound.SOUND_OFF;
			playground?.mute( );
			break;
	}
}
	
	
	
// get the status of the sound - either on or off (default)
function getSound( )
{
	return localStorage.getItem( 'sound' ) || 'off';
}

