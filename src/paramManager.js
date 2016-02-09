/*
var paramManager = require("paramManager");
paramManager.only(["param1", "param2"]);
paramManager.only(["param1", "param2"], "your own url");
paramManager.without(["param1", "param2"]);
paramManager.without(["param1", "param2"], "your own url");
*/

//简易模块管理
(function() {
	var _pool = {};
	window.define = function(name, fn) {
		_pool[name] = fn();
	}
	window.require = function(name) {
		return _pool[name];
	}
})();



define("paramManager", function() {
	var mod, _mod;
	mod = {
		only: function(list, url) { // list形式为["#hash", "?query"], 前者表示'#'后面的参数, 后者表示作为'?'后面的参数
			var oParams = _mod.url2obj(url),
				p1 = [],
				p2 = []; //p1是?开头的参数, p2是#开头的参数

			list.forEach(function(name) {
				if (name.match(/^\?/)) {
					oParams[name.slice(1)] && p1.push(oParams[name.slice(1)]);
				} else if (name.match(/^#/)) {
					oParams[name.slice(1)] && p2.push(oParams[name.slice(1)]);
				} else {
					oParams[name] && p2.push(oParams[name]); // 默认是hash参数
				}
			});

			return [(p1.length ? "?" + p1.join("&") : ""),
					(p2.length ? "#" + p2.join("&") : "")].join("");
		},
		without: function(list, url) {
			url = url || "http://www.qq.com/index.html?a=1&b=2#c=3?d=4&e=5??d=6#?#s=7?" || location.href;
			list.forEach(function(name) {
				var regex = new RegExp("([?#&])" + name + "(=[^?#&]*)?([?#&]|$)", "g"); 
				//todo: 当出现"?a=1&a=1"的情况时会有问题,会漏掉一个
				//如果把正则最后面改为(?=[?#&]|$),则会带来额外的&号
				url = url.replace(regex, "$1");
			})
			return url;
		},
		set: function() {

		}
	}
	window.mod = mod; //@debug

	_mod = {
		url2obj: function(url) {
			var aParams, oParams = {};
			url = url || "http://www.qq.com/index.html?a=1&b=2#c=3?d=4&e=5??d=6#?#s=7?" || location.href;
			aParams = url.split(/[?#&]/).slice(1).filter(function(v) {
				return !!v
			});
			aParams.forEach(function(el) {
				var name = el.match(/([^=]*)=/);
				if (name && name[1]) {
					oParams[name[1]] = el; //value是key=value整个字符串
				} else {
					oParams[el] = el;
				}
			})

			return oParams;
		},
		obj2str: function(obj) {
			for (key in obj) {

			}
		}
	}
	return mod;
})