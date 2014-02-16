"use strict";
var app = app || {};
app.Todos = Class({
	'extends': MK.Array,
	storage: new ObjectStorage( 'todos' ),
	constructor: function() {
		this
			.initMK()
			/*.set({
				router: new app.Router
			})*/
			.bindings()
			.events()
			.dependences()
			.restore()
		;
	},
	bindings: function() {
		return this
			.bindElement( this, '#todoapp' )
			.bindElement({
				container: this.select( '#todo-list' ),
				list: this.select( '#todo-list' ),
				newTodo: this.select( '#new-todo' ),
				clearCompleted: this.select( '#clear-completed' ),
				completedAll: this.select( '#toggle-all' )
			})
			.bindElement({
				activeLength: this.select( '#count' ),
				completedLength: this.select( '#completed' ),
				'item(s)': this.select( '#item-plural_singular' )
			}, MK.binders.innerHTML() )
			.bindElement({
				completedLength: this.select( '#clear-completed' ),
				length: this.selectAll( '#main, #footer' )
			}, MK.binders.className( '!hide' ) )
		;
	},
	events: function() {
		document.addEventListener( 'keydown', function( evt ) {
			var target = window.event ? event.srcElement : evt.target;
			if( target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.contenteditable ) {
				if( evt.which === 13 ) {
					target.dispatchEvent( new CustomEvent( 'pressEnter' ) );
				} else
				if( evt.which === 27 ) {
					target.dispatchEvent( new CustomEvent( 'pressEsc'   ) );
				}
			}
			
		});
		

		return this
			.on( 'pressEnter::newTodo', this.createOne )
			.on( 'click::clearCompleted', this.removeCompleted )
			.on( 'click::completedAll', function() {
				this
					.forEach( function( todo ) {
						todo.set( 'completed', this.completedAll, { silent: true });
					}, this )
					.trigger( 'modify' )
				;
			})
			.on( 'modify', this.save )
			.on( 'modify', function() {
				this.completed = this.filter( function( item ) {
					return item.completed;
				});
			}, true )
			
			/*.on( 'change:state', function() {
				this.$( '#filters a' )
					.removeClass( 'selected' )
					.filter( '[href="#/' + this.state + '"]' )
					.addClass( 'selected' )
				;
			}, true )*/
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
	dependences: function() {
		return this
			.addDependence( 'completedLength', 'completed', function() {
				return this.completed.length;
			})
			.addDependence( 'activeLength', 'completed', function() {
				return this.length - this.completed.length;
			})
			.addDependence( 'item(s)', 'activeLength', function() {
				return 'item' + ( this.activeLength !== 1 ? 's' : '' );
			})
			.addDependence( 'completedAll', 'completed', function() {
				return this.completed.length === this.length;
			})
		;
	},
	renderer: function() {
		 return document.getElementById( 'item-template' ).innerHTML;
	},
	createOne: function() {
		var newTodo = this.newTodo.trim();
		if( newTodo ) {
			this.addOne({
				title: newTodo
			});
			this.newTodo = '';
		}
		return this;
	},
	addOne: function( todo ) {
		return this.push( new app.Todo( todo )
			.on( 'modify', function() {
				this.trigger( 'modify' );
			}, this )
			.on( 'readytodie', function() {
				this.pull( this.indexOf( todo ) );
			}, this ) )
		;
	},
	removeCompleted: function() {
		return this.completed.forEach( function( todo ) {
			this.pull( this.indexOf( todo ) );
		}, this );
	},
	save: function() {
		this.storage.local = this.toJSON();
		return this;
	},
	restore: function() {
		MK.each( this.storage.local, this.addOne, this );
		return this;
	}
});