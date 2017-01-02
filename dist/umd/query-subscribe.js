(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "apollo-client", "aurelia-framework"], function (require, exports) {
    "use strict";
    var apollo_client_1 = require("apollo-client");
    var aurelia_framework_1 = require("aurelia-framework");
    var QuerySubscribe = (function () {
        function QuerySubscribe(propertyOwner, viewModelQuery) {
            this.apolloClient = aurelia_framework_1.Container.instance.get(apollo_client_1.default);
            this.bindingEngine = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            var subscribeQuery;
            if (viewModelQuery.variables_propertyName) {
                subscribeQuery = this.apolloClient.subscribe({
                    query: viewModelQuery.gql,
                    variables: propertyOwner[viewModelQuery.variables_propertyName],
                });
            }
            else {
                subscribeQuery = this.apolloClient.subscribe({ query: viewModelQuery.gql });
            }
            var subscription = subscribeQuery.subscribe({
                next: function (response) {
                    console.error('subscribeQuery.subscribe - :', response.data);
                    //        callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
                },
                error: function (error) { console.error(viewModelQuery.name + 'Query error(error):', error); },
            });
            //    this.subscribeSubscriptions.set(viewModelQuery.propertyName, subscription);
        }
        QuerySubscribe.prototype.destruct = function () {
            //    this.subscribeSubscriptions.forEach(subscription => subscription.unsubscribe());
            //    this.propertyObserverDisposables.forEach(disposable => disposable.dispose());
        };
        return QuerySubscribe;
    }());
    exports.QuerySubscribe = QuerySubscribe;
});
//# sourceMappingURL=query-subscribe.js.map