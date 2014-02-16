"use strict";
var app = app || {};
app.todos = new app.Todos();




app.Router = Class({
	on: function( route, callback, thisArg ) {
		routie( route, callback.bind( thisArg || this ) );
	},
	set: function( s ) {
		routie( s );
	}
});