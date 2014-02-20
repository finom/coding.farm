(function() {
    var counter = 0;
    var numbered;
    var source = document.getElementsByClassName('prettyprint source');

    if (source && source[0]) {
        source = source[0].getElementsByTagName('code')[0];

        numbered = source.innerHTML.split('\n');
        numbered = numbered.map(function(item) {
            counter++;
			document.styleSheets[0].insertRule(".line#line"+counter+"::before{content:'" + counter + "'}", 0)
            return '<a href="#line' + counter + '" id="line' + counter + '" class="line"></a>' + item;
        });

        source.innerHTML = numbered.join('\n');
    }
})();
