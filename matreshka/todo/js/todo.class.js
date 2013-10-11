"use strict";
var app = app || {};
app.Todo = Class({
	'extends': MK.Object,
	constructor: function( todo ) {
		this
			.initMK()
			.jset({
				title: '',
				completed: false
			})
			.set( todo )
			.bindings()
			.events()
		;
	},
	bindings: function() {
		return this
			.bindElement( this, this.render() )
			.bindElement({
				completed: this.$( '.toggle' ),
				title: this.$( 'label' )
			})
			.bindElement( 'completed', this.el(), {
				setValue: function( v ) {
					$( this ).toggleClass( 'completed', v );
				}
			})
			.bindElement( 'title', this.$( '.edit' ), MK.htmlp )
		;
	},
	events: function() {
		this.$el().on( 'click', '.destroy', function() {
			
		});
		return this;
	},
	render: function() {
		return document.getElementById( 'item-template' ).innerHTML;
	}
});