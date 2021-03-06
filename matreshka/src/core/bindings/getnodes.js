define([
	'matreshka_dir/core/var/core',
	'matreshka_dir/core/var/sym',
	'matreshka_dir/core/initmk',
	'matreshka_dir/core/util/common'
], function(core, sym, initMK, util) {
	"use strict";

	var selectAll, boundAll;

	/**
	 * @private
	 * @summary selectNodes selects nodes match to custom selectors such as :sandbox and :bound(KEY)
	 */

	function selectNodes(object, selectors) {
		var result = core.$(),
			execResult,
			$bound,
			node,
			selector,
			i, j,
			random;

		if(!object || !object[sym]) return result;

		// replacing :sandbox to :bound(sandbox)
		selectors = selectors.split(',');

		for (i = 0; i < selectors.length; i++) {
			selector = selectors[i];

			if (execResult = /\s*:bound\(([^(]*)\)\s*([\S\s]*)\s*|\s*:sandbox\s*([\S\s]*)\s*/.exec(selector)) {
				var key = execResult[3] !== undefined ? 'sandbox' : execResult[1],
					subSelector = execResult[3] !== undefined ? execResult[3] : execResult[2];

				// getting KEY from :bound(KEY)
				$bound = object[sym].special[key] && object[sym].special[key].$nodes;
				if(!$bound || !$bound.length) {
					continue;
				}

				// if native selector passed after :bound(KEY) is not empty string
				// for example ":bound(KEY) .my-selector"
				if (subSelector) {
					// if native selector contains children selector
					// for example ":bound(KEY) > .my-selector"
					if (subSelector.indexOf('>') === 0) {
						// selecting children
						for (j = 0; j < $bound.length; j++) {
							node = $bound[j];
							random = core.randomString();
							node.setAttribute(random, random);
							result = result.add($('[' + random + '="' + random + '"]' + subSelector, node));
							node.removeAttribute(random);
						}

					} else {
						// if native selector doesn't contain children selector
						result = result.add($bound.find(subSelector));
					}
				} else {
					// if native selector is empty string
					result = result.add($bound);
				}
				// if it's native selector
			} else {
				result = result.add(selector);
			}
		}


		return result;
	}

	selectAll = core.selectAll = function(object, s) {
		var $sandbox;

		if (!object || !object[sym] || typeof s != 'string') return core.$();

		if (/:sandbox|:bound\(([^(]*)\)/.test(s)) {
			return selectNodes(object, s);
		} else {
			$sandbox = object && object[sym] && object[sym].special;
			$sandbox = $sandbox && $sandbox.sandbox && $sandbox.sandbox.$nodes;
			return $sandbox && $sandbox.find(s);
		}
	},

	core.select = function(object, s) {
		var sandbox;

		if (!object || !object[sym] || typeof s != 'string') return core.$();

		if (/:sandbox|:bound\(([^(]*)\)/.test(s)) {
			return selectNodes(object, s)[0] || null;
		} else {
			sandbox = object && object[sym] && object[sym].special;
			sandbox = sandbox && sandbox.sandbox && sandbox.sandbox.$nodes && sandbox.sandbox.$nodes[0];
			return sandbox && sandbox.querySelector(s);
		}
	};

	boundAll = core.boundAll = function(object, key) {
		var $ = core.$,
			special, keys, $nodes, i;
		if (!object || typeof object != 'object') return $();

		initMK(object);

		special = object[sym].special,

			key = !key ? 'sandbox' : key;
		keys = typeof key == 'string' ? key.split(/\s+/) : key;
		if (keys.length <= 1) {
			return keys[0] in special ? special[keys[0]].$nodes : $();
		} else {
			$nodes = $();

			for (i = 0; i < keys.length; i++) {
				$nodes = $nodes.add(special[keys[i]].$nodes);
			}

			return $nodes;
		}
	};

	core.$bound = function(object, key) {
		return boundAll(object, key);
	};

	core.bound = function(object, key) {
		if (!object || typeof object != 'object') return null;

		initMK(object);

		var special = object[sym].special,
			keys,
			i;

		key = !key ? 'sandbox' : key;
		keys = typeof key == 'string' ? key.split(/\s+/) : key;
		if (keys.length <= 1) {
			return keys[0] in special ? special[keys[0]].$nodes[0] || null : null;
		} else {
			for (i = 0; i < keys.length; i++) {
				if (keys[i] in special && special[keys[i]].$nodes.length) {
					return special[keys[i]].$nodes[0];
				}
			}
		}

		return null;
	};


	core._getNodes = function(object, s) {
		return typeof s == 'string' && !/</.test(s) && /:sandbox|:bound\(([^(]*)\)/.test(s) ? selectNodes(object, s) : core.$(s);
	};
});
