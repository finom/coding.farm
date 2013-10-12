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
				title: this.$( '.edit' )
			})
			.bindElement( 'completed', this.el(), function( v ) {
				$( this ).toggleClass( 'completed', v );
			})
			.bindElement( 'hidden', this.el(), function( v ) {
				$( this ).toggleClass( 'hide', v );
			})
			.bindElement( 'title', this.$( 'label' ), MK.htmlp )
		;
	},
	events: function() {
		this.$el().on( 'click', '.destroy', this.trigger.bind( this, 'readytodie' ) );
		
		this.$( 'label' ).on( 'dblclick', function() {
			this.$el().addClass( 'editing' );
			this.$( '.edit' ).focus();
		}.bind( this ) );
		
		this.$( '.edit' ).on( 'blur pressenter', function() {
			if( !this.title.length ) {
				this.trigger( 'readytodie' );
			} else {
				this.$el().removeClass( 'editing' );
			}
		}.bind( this ) );
		
		return this;
	},
	render: function() {
		return document.getElementById( 'item-template' ).innerHTML;
	}
});