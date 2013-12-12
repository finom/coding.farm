QUnit.init();
			test('to("number")', function () {
				strictEqual(to('number', '123'), 123, '"123"');
				strictEqual(to('number', 'abc'), 0, '"abc"');
			});
			test('to("object")', function () {
				var object = {},
					f = function () {},
					number = 123,
					string = 'abc';
				ok(to('object', object) === object, '{}');
				deepEqual(to('object', f), {
					handle: f
				}, 'function() {}');
				deepEqual(to('object', undefined), object, 'undefined');
				deepEqual(to('object', null), object, 'null');

				var objectNumber = to('object', number);
				ok(typeof objectNumber === 'object' && objectNumber.constructor === Number && objectNumber.valueOf() === number, '123');

				var objectString = to('object', string);
				ok(typeof objectString === 'object' && objectString.constructor === String && objectString.valueOf() === string, '"abc"');

				var objectBoolean = to('object', true);
				ok(typeof objectBoolean === 'object' && objectBoolean.constructor === Boolean && objectBoolean.valueOf() === true, 'true');
			});

			test('to("function")', function () {
				var f = function () {};
				ok(to('function', f) === f, 'function');

				ok(to('function', 123)() === 123, '123');
			});

			test('to("boolean")', function () {
				ok(to('boolean', 123), '123');
				ok(!to('boolean', ''), '""');
			});

			test('to("string")', function () {
				ok(to('string', 123) === '123', '123');
				ok(to('string', null) === 'null', 'null');
				ok(to('string', undefined) === 'undefined', 'undefined');
			});

			test('transpose', function () {
				deepEqual(transpose([
					[1, 2],
					[3, 4],
					[5, 6]
				]), [
					[1, 3, 5],
					[2, 4, 6]
				], '[[1,2],[3,4],[5,6]]');

			});

			test('SimpleSet', function () {
				var set = new SimpleSet(1, 2, 3); // set == [ 1, 2, 3 ]
				strictEqual(set.toString(), [1, 2, 3].toString(), 'initialize');
				set.push(1, 4, 3); // set == [ 1, 2, 3, 4 ]
				strictEqual(set.toString(), [1, 2, 3, 4].toString(), '.push');
				set.unshift(3, 4, 1, 5); // set == [ 5, 1, 2, 3, 4 ]
				strictEqual(set.toString(), [5, 1, 2, 3, 4].toString(), '.unshift');
				set.splice(1, 2, 6, 3, 3, 5); // set == [ 5, 6, 3, 4 ]
				strictEqual(set.toString(), [5, 6, 3, 4].toString(), '.splice');
			});
