"use strict";
var app = app || {};
app.Todos = Class({
	'extends': MK.Array,
	storage: new ObjectStorage(),
	constructor: function() {
		this
			.initMK()
			.set({
				router: new app.Router
			})
			.bindings()
			.events()
		;
	},
	bindings: function() {
		return this
			.bindElement( this, '#todoapp' )
			.bindElement({
				list: '#todo-list',
				newTodo: '#new-todo',
			})
			.bindElement({
				count: this.$( '.count' ),
				completed: this.$( '.completed' )
			}, MK.htmlp )
		;
	},
	events: function() {
		this.$el( 'newTodo' ).on( 'pressenter', function() {
			if( this.newTodo ) {
				this.addOne({
					title: this.newTodo.trim()
				});
				this.newTodo = '';
			}
		}.bind( this ) );
		
		this.$( '#clear-completed' ).on( 'click', this.removeCompleted.bind( this ) );
		
		this.router.on( '/:state', function( state ) {
			this.state = state;
		}, this );
		
		this
			.on( 'modify', function() {
				this.$( '#main, #footer' ).toggleClass( 'hide', !this.length );
				this.count = this.getUncompleted().length;
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
			.on( 'change:count', function() {
				this.completed = this.length - this.count;
				this.$( '.item-plural_singular' ).html( this.count === 1 ? 'item' : 'items' );
				this.$( '#clear-completed' ).toggleClass( 'hide', !this.completed );
			})
		;
	},
	addOne: function( todo ) {
		todo = new app.Todo( todo )
			.on( 'modify', function() {
				this.trigger( 'modify' );
			}, this )
			.on( 'readytodie', function() {
				this.removeOne( todo );
			}, this )
		;
		this.push( todo );
	},
	removeOne: function( todo ) {
		return this.splice( this.indexOf( todo ), 1 );
	},
	removeCompleted: function() {
		return this.getCompleted().forEach( function( todo ) {
			this.removeOne( todo );
		}, this );
	},
	save: function() {
		this.storage.local = this.toJSON();
		return this;
	},
	getCompleted: function() {
		return this.filter( function( item ) {
			return item.completed;
		});
	},
	getUncompleted: function() {
		return this.filter( function( item ) {
			return !item.completed;
		});
	}
});