"use strict";
// experimental stuff
MK.DOMArray = Class({
	'extends': MK.Array,
	initMK: function() {
		MK.DOMArray.parent.initMK( this );
		return this
			.on( 'push', function( evt ) {
				if( evt ) {
					for( var i = this.length - evt.arguments.length; i < this.length; i++ ) {
						this.doItem( this[ i ] ).$el( this.__id ).appendTo( this.$el() );
					}
				}
			})
			.on( 'pop', function( evt ) {
				if( evt && evt.returns ) {
					evt.returns.$el( this.__id ).remove()
					this.killItem( evt.returns );
				}
			})
			.on( 'unshift', function( evt ) {
				if( evt ) {
					for( var i = evt.arguments.length - 1; i + 1; i-- ) {
						this.doItem( this[ i ] ).$el( this.__id ).prependTo( this.$el() );
					}
				}
			})
			.on( 'shift', function( evt ) {
				if( evt && evt.returns ) {
					evt.returns.$el( this.__id ).remove()
					this.killItem( evt.returns );
				}
			})
			.on( 'sort reverse', function() {
				for( var i = 0; i < this.length; i++ ) {
					this[ i ].$el( this.__id ).appendTo( this.$el() );
				}
			})
			.on( 'splice', function( evt ) {
				for( var i = 0; i < evt.returns.length; i++ ) {
					evt.returns[ i ].$el( this.__id ).remove()
					this.killItem( evt.returns[ i ] );
				}
				for( var i = 0; i < this.length; i++ ) {
					this.doItem( this[ i ] ).$el( this.__id ).appendTo( this.$el() );
				}
			})
		;
	},
	doItem: function( item ) {
		var __id = this.__id,
			el,
			$el;
			
		if( !item[ __id ] ) {
			item[ __id ] = this;
		}

		if( this.renderer ) {
			if( !item.el( __id ) ) {
				item
					.bindElement( item, $( this.renderer( item ) ) )
					.trigger( 'render' )
				;
			}
		}
		
		return item;
	},
	killItem: function( item ) {
		return item.remove( this.__id, {
			silent: true
		});
	}
});