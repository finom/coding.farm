import MK from 'matreshka';
import $ from 'balalaika';
let q = (s, c) => $(s, c)[0] || null;

describe('MK.Array#renderer', () => {
	let container = $.create('div', {
			attributes: {
				role: 'parent'
			}
		}),
		n = 10,
		arr,
		index = 0;


	class Model extends MK.Object {
		constructor(...args) {
			super(...args);
			this
				.on('render', evt => this.bindNode('x', ':sandbox span', MK.binders.innerHTML()));
		}
	}

	class Arr extends MK.Array {
		Model = Model;
		itemRenderer = () => `<div role="child" index="${index++}"><span></span></div>`;
		constructor(...args) {
			super(...args);
			this.bindNode('sandbox', container)
		}
	}

	arr = new Arr;


	it('renders', () => {
		for (let i = 0; i < n; i++) {
			arr.push({
				x: i
			});
		}

		expect(arr.length).toEqual(n);
		expect(index).toEqual(n);
		expect(arr.sandbox.children.length).toEqual(n);
	});


	it('forces rendering', () => {
		arr.rerender({
			forceRerender: true
		});

		expect(arr.length).toEqual(n);
		expect(index).toEqual(n * 2);
		expect(arr.sandbox.children.length).toEqual(n);
	});


	it('rerenders when rendered is changed', () => {
		arr.itemRenderer = () => `<div role="child2" index="${index++}"><span></span></div>`;

		expect(arr.length).toEqual(n);
		expect(index).toEqual(n * 3);
		expect(arr.sandbox.children.length).toEqual(n);
	});


	it('removes rendered nodes', () => {
		arr.recreate();

		expect(arr.length).toEqual(0);
		expect(index).toEqual(n * 3);
		expect(arr.sandbox.children.length).toEqual(0);
	});


	it('renders if silent: true', () => {
		for (let i = 0; i < n; i++) {
			arr.push_({
				x: i
			}, {
				silent: true
			});
		}

		expect(arr.length).toEqual(n);
		expect(index).toEqual(n * 4);
		expect(arr.sandbox.children.length).toEqual(n);
	});


	it('uses bindings parser', () => {


		arr.itemRenderer = () => `<div role="child3" index="${index++}"><span attr="hey {{x}}"></span></div>`;

		expect(q( '[attr]', arr[5].sandbox ).getAttribute('attr')).toEqual('hey ' + 5);
		expect(arr.length).toEqual(n);
		expect(index).toEqual(n * 5);
		expect(arr.sandbox.children.length).toEqual(n);
	});
});
