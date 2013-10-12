"use strict";
var app = app || {};
$( document ).on( 'keydown', 'input, textarea, [contenteditable]', function( evt ) {
	if( evt.which === 13 ) {
		$( this ).trigger( 'pressenter' );
	}
});

app.Router = Class({
	on: function() {
		routie
	},
	set: function( s ) {
		routie( s );
	}
});

$( function() {
	app.todos = new app.Todos();
});