var Example = Class({ // http://jsbin.com/eQomoJe/5/
	'extends': MK.DOMArray,
	constructor: function() {
		this
			// инициализируем Матрешку
			.initMK()
			// Привязываем элементы
			.bindElement( this, 'table tbody' )
			.bindElement( 'log', '#log' )
		;
	},
	renderer: function( object ) {
		// Возвращает строку с пустыми тегами. Значения ячеек обновятся автоматически, при привязке
		return '<tr><td class="a"></td><td class="b"></td><td class="c"></td></tr>';
	},
	// Метод выполняет и выводит код, содержащийся в функциях, являющихся вторым и последующими аргументами. duration — задержка выполнения каждой функции 
	demo: function( duration ) {
		var functions = Array.prototype.slice.call( arguments, 1 ),
			i = 0;
		( function callee( f ) {
			setTimeout( function() {
				this.log( f.toString().replace( /function\s*\(\)\s*\{(\s*[\s\S]+\s*)\}/, '$1' ) );
				f.call( this );
				if( ++i < functions.length ) {
					callee.call( this, functions[ i ] );
				}
			}.bind( this ), duration );
		}).call( this, functions[ i ] );
		
		return this;
	},
	log: function( text ) {
		this.$el( 'log' ).html( prettyPrintOne( removeExtraTabs( text ) ) );
	}
});

var ExampleObject = Class({
	'extends': MK.Object,
	constructor: function( o ) {
		this
			.initMK()
			.jset( o )
			// MK.DOMArray генерирует событие render и передаёт отрендеренный элемент в объекте события
			.on( 'render', function( evt ) {
				// this привязывается при рендеринге
				// после генерации события привязываем необходимые элементы
				this.bindElement( this, evt.$el ).bindElement({
					a: this.$( '.a' ),
					b: this.$( '.b' ),
					c: this.$( '.c' )
				}, MK.htmlp );
			})
		;
	}
});

window.example = new Example().demo( 4000,
	function () {
		this.push( new ExampleObject({
			a: 1,
			b: 2,
			c: 3
		}) );
	},
	function () {
		this[0].a = 'xxx';
	},
	function () {
		this.unshift( new ExampleObject({
			a: 4,
			b: 5,
			c: 6
		}) );
	},
	function () {
		this.push( new ExampleObject({
			a: 7,
			b: 8,
			c: 9
		}), new ExampleObject({
			a: 10,
			b: 11,
			c: 12
		}) );
	},
	function () {
		this.pop();
	},
	function () {
		this.shift();
	},
	function () {
		this.splice(1, 2, new ExampleObject({
			a: 13,
			b: 14,
			c: 15
		}), new ExampleObject({
			a: 'a',
			b: 'b',
			c: 'c'
		}) );
	},
	function () {
		this[0].a = 111;
		this[1].c = 333;
		this[2].b = 222;
	},
	function () {
		this.unshift( new ExampleObject({
			a: 16,
			b: 17,
			c: 18
		}), new ExampleObject({
			a: 19,
			b: 20,
			c: 21
		}) );
	},
	function () {
		this.sort(function (x, y) {
			return x.a > y.a ? 1 : -1;
		});
	});

function removeExtraTabs( string ) {
	var lines = string.split( '\n' ),
		tabsLength,
		minTabsLength = Infinity,
		tabsReg;
		
	for( var i = 0; i < lines.length; i++ ) {
		if( lines[ i ].replace( /\s/g, '' ).length ) {
			tabsLength = lines[ i ].length - lines[ i ].replace( /\t*(.*)/, '$1' ).length;
			minTabsLength = Math.min( minTabsLength, tabsLength );
		}
	}
	minTabsLength = minTabsLength | 0;
	tabsReg = new RegExp( new Array( minTabsLength + 1 ).join( '\t' ) );
	for( i = 0; i < lines.length; i++ ) {
		lines[ i ] = lines[ i ].replace( tabsReg, '' );
	}
	
	return lines.join( '\n' );
}