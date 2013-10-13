"use strict";
var app = app || {};
app.Todos = Class({
	'extends': MK.Array,
	storage: new ObjectStorage( 'todos' ),
	constructor: function() {
		this
			.initMK()
			.set({
				router: new app.Router
			})
			.bindings()
			.events()
			.restore()
		;
	},
	bindings: function() {
		return this
			.bindElement( this, '#todoapp' )
			.bindElement({
				list: this.$( '#todo-list' ),
				newTodo: this.$( '#new-todo' ),
				clearCompleted: this.$( '#clear-completed' )
			})
			.bindElement({
				activeLength: this.$( '.count' ),
				completedLength: this.$( '.completed' )
			}, MK.htmlp )
		;
	},
	events: function() {
		this.router.on( '/*', function( state ) {
			this.state = state === 'active' || state === 'completed' ? state : '';
		}, this );
		
		this.$el( 'newTodo' ).on( 'pressenter', this.createOne.bind( this ) );
		this.$el( 'clearCompleted' ).on( 'click', this.removeCompleted.bind( this ) );
		
		return this
			.on( 'modify', function() {
				this.$( '#main, #footer' ).toggleClass( 'hide', !this.length );
				this
					.set({
						activeLength: this.getUncompleted().length,
						completedLength: this.length - this.activeLength
					})
					.save()
				;
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
			.on( 'change:activeLength', function() {
				this.$( '.item-plural_singular' ).html( this.activeLength === 1 ? 'item' : 'items' );
			})
			.on( 'change:completedLength', function() {
				this.$( '#clear-completed' ).toggleClass( 'hide', !this.completedLength );
			})
			.on( 'change:state', function() {
				this.$( '#filters a' )
					.removeClass( 'selected' )
					.filter( '[href="#/' + this.state + '"]' )
					.addClass( 'selected' )
				;
			}, true )
			.on( 'change:state modify', function() {
				this.forEach( function( item ) {
					item.hidden = 
							this.state === 'completed' && !item.completed 
						||  this.state === 'active' && item.completed
					;
				}, this );
			}, true )
		;
	},
	createOne: function() {
		if( this.newTodo ) {
			this.addOne({
				title: this.newTodo.trim()
			});
			this.newTodo = '';
		}
		return this;
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
		return this.push( todo );
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
	restore: function() {
		MK.each( this.storage.local, this.addOne, this );
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