"use strict";
( function( $, window ) {
	var jQData,
		trim = function( s ) { return s.replace(/^\s+|\s+$/g, ''); };
	var at = window.aTemplate = function( o ) {
		var template = o.template || at.getTemplateByName( o.name ),
			
			f;
			
		if( template === null ) {
			throw Error( 'There is no template' );
		}
		
		template = template.innerHTML ? template.innerHTML : template;
		
		f = "var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with({at: methods}){"
				+"with(this){p.push('" 
				+ template
				.replace( /(<%#each\s*)\(?\s*\)?\s*(%>)/g, '$1(this)$2' )
				.replace( /(<%#each\s*)\(\s*(\S+)\s*\)\s*(%>)/g, '$1($2,_item)$3' ) 
				.replace( /(<%#each\s*)\(\s*(\S+)\s*,\s*(\w+)\s*\)\s*(%>)/g, '$1($2,$3,_key)$4' ) 
				.replace( /<%#each\s*\(\s*(\S+)\s*,\s*(\w+)\s*,\s*(\w+)\s*\)\s*%>/g,
					'<%for(var $3 in $1)if($1.hasOwnProperty($3)&&($3!=="length"))with($1[$3]){var $2=$1[$3];%>' )
				.replace( /<%#\/each\s*%>/g, '<%}/*endeach*/;%>' )
				.replace( /<%#\/\s*%>/g, '<%}/*endeach*/;%>' ) // short "each" closing
				.replace( '[%', '<%' ) // for using in XML
				.replace( '%]', '%>' )
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'") + "');}}; return p.join('');";
		console.log( f )
		f = new Function( 'methods', f );
		
		return 'data' in o ? trim( f.call( o.data, at.methods ) ) : function( data ) {
			return trim( f.call( data, at.methods ) )
		};
	};
	
	at.getTemplateByName = function( name ) {
		var node = document.querySelector ? document.querySelector( '[data-atemplate="'+name+'"]' ) : ( function( name ) {
			var all = document.getElementsByTagName( '*' );
			for( var i = 0; i < all.length; i++ ) {
				if( all[ i ].getAttribute( 'data-atemplate' ) === name ) {
					return all[ i ];
				}
			}
			return null;
		})( name );
		
		return node ? node.innerHTML : null;
	};
	
	at.dataMap = {};
	
	at.methods = {
		bindData: function( data ) {
			var id = 'at.'+Math.random()+Math.random();
			at.dataMap[ id ] = data;
			return id;
		},
		getBindedData: function( n ) {
			var id = typeof n === 'string' ? n : null;
			if( !id ) {
				n = n.length && n[ 0 ] ? n[ 0 ] : n;
				id = n && n.getAttribute ? n.getAttribute( 'data-abind' ) : null;
			}
			return at.dataMap[ id ];
		}
	};
	
	at.getBindedData = at.methods.getBindedData;
	
	if( $ ) {
		$.fn.outerHtml = function() {
			return $( '<div/>' ).append( this.clone() ).html();
		};
		
		jQData = $.fn.data;
		$.aTemplate = at;
		$.fn.aTemplate = function( data ) {
			var atResult = at({
				template: this.outerHtml()
					.replace( /&lt;%/g, '<%' )
					.replace( /%&gt;/g, '%>' )
			});
			return data ? $( atResult( data ) ) : function( data ) {
				return $( atResult( data ) );
			};
		};
		
		$.fn.aTemplateData = function() {
			return at.getBindedData( this );
		};
		
		$.fn.data = function() {
			var bindedData = at.getBindedData( this );
			if( bindedData ) {
				jQData.call( this, 'aTemplate', bindedData );
			}
			return jQData.apply( this, arguments );
		}
	}
})( window.jQuery, window );