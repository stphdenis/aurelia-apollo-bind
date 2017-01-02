(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "apollo-client", "aurelia-framework", "./apollo-bind"], function (require, exports) {
    "use strict";
    var apollo_client_1 = require("apollo-client");
    var aurelia_framework_1 = require("aurelia-framework");
    var apollo_bind_1 = require("./apollo-bind");
    var QueryWatch = (function () {
        function QueryWatch(propertyOwner, viewModelQuery) {
            this.apolloClient = aurelia_framework_1.Container.instance.get(apollo_client_1.default);
            this.bindingEngine = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            this.watchQuerySubscriptions = new Map();
            this.propertyObserverDisposables = new Set();
            var watchQuery = this.apolloClient.watchQuery({ query: viewModelQuery.gql });
            if (viewModelQuery.watchMode === apollo_bind_1.WatchMode.remote) {
                watchQuery.startPolling(500);
            }
            if (viewModelQuery.variables_propertyName) {
                watchQuery.setVariables({ id: propertyOwner[viewModelQuery.variables_propertyName] });
                this.bindingEngine.propertyObserver(propertyOwner, viewModelQuery.variables_propertyName)
                    .subscribe(function (newValue, oldValue) {
                    watchQuery.refetch({ id: newValue });
                });
            }
            var subscription = watchQuery.subscribe({
                next: function (response) {
                    apollo_bind_1.callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
                },
                error: function (error) { console.error(viewModelQuery.name + 'Query error(error):', error); },
            });
            this.watchQuerySubscriptions.set(viewModelQuery.propertyName, subscription);
        }
        QueryWatch.prototype.destruct = function () {
            this.watchQuerySubscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
            this.propertyObserverDisposables.forEach(function (disposable) { return disposable.dispose(); });
        };
        return QueryWatch;
    }());
    exports.QueryWatch = QueryWatch;
});
//# sourceMappingURL=query-watch.js.map