(function( window, document, $, i, j, k, fn ) {
	if( document.documentMode < 9 ) {
		fn = $.i[ j = 'prototype' ];

		$.i = function( s, context ) {
			k = !s ? fn : s && s.nodeType || s === window ? [s] : "" + s === s ? /</.test( s ) ? ( ( i = document.createElement( 'div' ) ).innerHTML = s, i.children ) : (context&&$(context)[0]||document).querySelectorAll(s) : /f/.test(typeof s) ? /c/.test(document.readyState) ? s() : !function r(f){/in/(document.readyState)?setTimeout(r,9,f):f()}(s): s;
		
			j = []; for (i = k ? k.length : 0; i--; j[i] = k[i]) {}
			
			fn.push.apply( this, j );
		};
		
		$.i[ j ] = fn;
		if( !$( 'html' ).is( 'html' ) ) {
			fn.is = function( s ) {
				var el = this[ 0 ],
					is,
					b_b = 'b_b',
					selected;
				if( !el || !s || !el.setAttribute ) return false;
				el.setAttribute( b_b, b_b );
				selected = document.querySelector( s + '[b_b="b_b"]' );
				is = selected === el;
				el.removeAttribute( b_b, b_b );
				return is;
			};
		}
	}
	return $;
})( window, document, $b ); 
