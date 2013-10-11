"use strict";
var app = app || {};
app.Todos = Class({
	'extends': MK.Array,
	storage: new ObjectStorage(),
	constructor: function() {
		this
			.initMK()
			.bindings()
			.events()
		;
	},
	bindings: function() {
		return this
			.bindElement( this, '#todoapp' )
			.bindElement({
				list: '#todo-list',
				newTodo: '#new-todo'
			})
		;
	},
	events: function() {
		this.$el( 'newTodo' ).on( 'pressenter', function() {
			this.addOne({
				title: this.newTodo
			});
		}.bind( this ) );
		
		this
			.on( 'modify', function() {
				this.$( '#main, #footer' ).toggleClass( 'hide', !this.length );
			})
			.on( 'push', function( evt ) {
				for( var i = 0; i < evt.arguments.length; i++ ) {
					this.$el( 'list' ).append( evt.arguments[ i ].$el() );
				}
			})
			.on( 'splice', function( evt ) {
				for( var i = 0; i < evt.returns.length; i++ ) {
					evt.returns[ i ].$el().remove();
				}
			})
		;
	},
	addOne: function( todo ) {
		this.push( new app.Todo( todo ) );
	},
	removeOne: function( todo ) {
		this.splice( this.indexOf( todo ), 1 );
	},
	save: function() {
		this.storage.local = this.toJSON();
	}
});