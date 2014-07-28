"use strict";
// Как и требует спецификация TodoMVC, присваиваем соответствующим переменным коды клавиш. После этого ждем загрузки DOM дерева.
var ENTER_KEY = 13;
var ESC_KEY = 27;

$( function() {
	// Создаем кастомный привязчик (binder), который будет синхронизировать значение свойства с видимостью элемента, с помощью метода [jQuery.fn.toggle](http://api.jquery.com/toggle/).
	// ```js
	// this.bindElement( 'x', element, MK.binders.display() );
	// this.x = false; // элемент не видим (display:none)
	// this.x = true; // элемент видим```
	MK.binders.display = function() {
		return {
			setValue: function( v ) {
				$( this ).toggle( !!v );
			}
		};
	};
	// Инициализируем приложение.
	window.app = new Todos();
});
