"use strict";
MK.Hash = Class({// http://jsbin.com/OXuhApi/1/
	'extends': MK.Object,
	constructor: function( keys ) {
		if( MK.Hash.instance ) {
			return MK.Hash.instance;
		}
		
		MK.Hash.instance = this
			.initMK()
			.events()
			.jset( this.parse( document.location.hash ), {
				silent: true
			})
		;
		
		if( keys ) {
			this.addJSONKeys( keys );
		}
	},
	// taken from trick.js
	procrastination: function ( f, d, context ) {
		var timeout;
		if( typeof d !== 'number' ) {
			context = d;
			d = 0;
		}
		return function() {
			var args = arguments,
				self = this;
			clearTimeout( timeout );
			timeout = setTimeout( function() {
				f.apply( context || self, args );
			}, d || 0 );
		};
	},
	events: function() {
		$( window ).on( 'hashchange', function() {
			this.setProperties( this.parse( document.location.hash ) );
		}.bind( this ) );
		
		return this.on( 'modify', this.procrastination( this.setHash, this ) );
	},
	setProperties: function( parts ) {
		return
			this.each( function( value, key ) {
				if( parts[ key ] === null || parts[ key ] === undefined ) {
					this[ key ] = null;
				}
			}, this )
			.jset( parts )
		;
	},
	setHash: function() {
		document.location.hash = this.stringify();
		return this;
	},
	parse: function( hash ) {
		var result = {};
		hash = hash.replace( '#', '' );
		if( hash ) {
			hash = unescape( hash ).split( '&' );
			hash.length && hash.forEach( function( part ) {
				var splitted = part.split( '=' );
				result[ splitted[ 0 ] ] = splitted[ 1 ];
			});
		}
		return result;
	},
	stringify: function() {
		var result = [],
			value;
		
		this.each( function( value, key ) {
			if( value !== null && value !== undefined ) {
				result.push( key + '=' + value );
			}
		});
				
		return '#' + result.join( '&' );
	},
	each: function( callback, thisArg ) {
		var _keys = this._keys;
		for( var p in _keys ) if( _keys.hasOwnProperty( p ) && this[ p ] !== null && this[ p ] !== undefined ) {
			callback.call( thisArg, this[ p ], p, this );
		}
		return this;
	},
	toJSON: function() {
		var JSON = {};
		this.each( function( v, p ) {
			JSON[ p ] = v;
		});
		return JSON;
	}
});