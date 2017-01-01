(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./apollo-bind", "./query-query", "./query-watch"], function (require, exports) {
    "use strict";
    var apollo_bind_1 = require("./apollo-bind");
    var query_query_1 = require("./query-query");
    var query_watch_1 = require("./query-watch");
    var ViewModelInstance = (function () {
        function ViewModelInstance(viewModelPrototype, propertyOwner, viewModelQueries) {
            var _this = this;
            this.viewModelPrototype = viewModelPrototype;
            this.propertyOwner = propertyOwner;
            this.queries = new Set();
            viewModelQueries.forEach(function (viewModelQuery) {
                switch (viewModelQuery.type) {
                    case apollo_bind_1.QueryType.subscribe:
                        _this.queries.add(new query_watch_1.QueryWatch(propertyOwner, viewModelQuery));
                        break;
                    case apollo_bind_1.QueryType.query:
                        _this.queries.add(new query_query_1.QueryQuery(propertyOwner, viewModelQuery));
                        break;
                    default:
                        throw new Error('ApolloBind only accept query or subscribe');
                }
            });
        }
        ViewModelInstance.prototype.destruct = function () {
            this.queries.forEach(function (query) { return query.destruct(); });
        };
        return ViewModelInstance;
    }());
    exports.ViewModelInstance = ViewModelInstance;
});
//# sourceMappingURL=view-model-instance.js.map