(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./view-model-instance"], function (require, exports) {
    "use strict";
    var view_model_instance_1 = require("./view-model-instance");
    var ViewModelClass = (function () {
        function ViewModelClass(viewModelPrototype) {
            this.viewModelPrototype = viewModelPrototype;
            this.viewModelInstances = new Map();
            this.viewModelQueries = [];
            // adds the call of 'subscribe(this)' to the created function of the target
            // -> to be done once <-
            // the 'created' function must exist in the ViewModel
            var that = this;
            var created = function (fn) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    that.viewModelInstances.set(this, new view_model_instance_1.ViewModelInstance(viewModelPrototype, this, that.viewModelQueries));
                    return fn && fn.apply(this, args);
                };
            };
            Object.defineProperty(viewModelPrototype, 'created', { value: created(viewModelPrototype['created']) });
            var unbind = function (fn) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var fnToApplied = fn && fn.apply(this, args);
                    var viewModelInstances = that.viewModelInstances.get(this);
                    that.viewModelInstances.delete(this);
                    if (viewModelInstances) {
                        viewModelInstances.destruct();
                    }
                    return fnToApplied;
                };
            };
            Object.defineProperty(viewModelPrototype, 'unbind', { value: unbind(viewModelPrototype['unbind']) });
        }
        ViewModelClass.prototype.addViewModelQueries = function (viewModelQuery) {
            this.viewModelQueries.push(viewModelQuery);
        };
        return ViewModelClass;
    }());
    exports.ViewModelClass = ViewModelClass;
});
//# sourceMappingURL=view-model-class.js.map