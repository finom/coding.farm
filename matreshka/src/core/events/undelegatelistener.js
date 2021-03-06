define([
	'matreshka_dir/core/var/core',
	'matreshka_dir/core/var/sym'
], function(core, sym) {
	"use strict";
	var _undelegateListener = core._undelegateListener = function(object, path, name, callback, context, evtData) {
		if (!object || typeof object != 'object') return object;

		var executed = /([^\.]+)\.(.*)/.exec(path),
			firstKey = executed ? executed[1] : path,
			events,
			i,
			p = path;

		path = executed ? executed[2] : '';

		if (firstKey) {
			if (firstKey == '*') {
				if (object.isMKArray) {
					if (callback) {
						_undelegateListener(object, path, 'add', callback, context, evtData);
					} else {
						events = object[sym].events.add || [];
						for (i = 0; i < events.length; i++) {
							if (events[i].path == p) {

								_undelegateListener(object, path, 'add', events[i].callback);
							}
						}
					}

					object.forEach(function(item) {
						item && _undelegateListener(item, path, name, callback, context);
					});
				} else if (object.isMKObject) {
					if (callback) {
						_undelegateListener(object, path, 'change', callback, context);
					} else {
						events = object[sym].events.change || [];
						for (i = 0; i < events.length; i++) {
							if (events[i].path == p) {
								_undelegateListener(object, path, 'change', events[i].callback);
							}
						}
					}

					object.each(function(item) {
						item && _undelegateListener(item, path, name, callback, context);
					});
				}
			} else {
				if (callback) {
					core._removeListener(object, 'change:' + firstKey, callback, context, evtData);
				} else {
					events = object[sym].events['change:' + firstKey] || [];
					for (i = 0; i < events.length; i++) {
						if (events[i].path == p) {
							core._removeListener(object, 'change:' + firstKey, events[i].callback);
						}
					}
				}
				if (typeof object[firstKey] == 'object') {
					_undelegateListener(object[firstKey], path, name, callback, context, evtData);
				}
			}
		} else {
			core._removeListener(object, name, callback, context, evtData);
		}
	};
});
