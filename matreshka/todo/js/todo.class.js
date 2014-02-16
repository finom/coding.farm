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
			.on( 'render', function( evt ) {
				this
					.bindElement( this, evt.element )
					.bindings()
					.events()
				;
			})
		;
	},
	bindings: function() {
		return this
			.bindElement({
				completed: this.select( '.toggle' ),
				title: this.select( '.edit' )
			})
			.bindElement( 'completed', this.bound(), MK.binders.className( 'completed' ) )
			.bindElement( 'hidden', this.bound(), MK.binders.className( 'hide' ) )
			.bindElement( 'title', this.select( 'label' ), MK.binders.innerHTML() )
		;
	},
	events: function() {
		return this
			.on( 'click::__this__', function( evt ) {
				if( evt.target.classList.contains( 'destroy' ) ) {
					this.trigger( 'readytodie' );
				}
			})
			.on( 'dblclick::title', function() {
				this.bound().classList.add( 'editing' );
				this.savedTitle = this.title;
				this.bound( 'title' ).focus();
			})
			.on( 'pressEsc::title', function() {
				this.bound().classList.remove( 'editing' );
				this.title = this.savedTitle;
			})
			.on( 'blur::title pressEnter::title', function() {
				if( !this.title ) {
					this.trigger( 'readytodie' );
				} else {
					this.bound().classList.remove( 'editing' );
				}
			})
		;
	}
});