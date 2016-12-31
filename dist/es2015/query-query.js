"use strict";
var apollo_client_1 = require("apollo-client");
var aurelia_framework_1 = require("aurelia-framework");
var apollo_bind_1 = require("./apollo-bind");
var QueryQuery = (function () {
    function QueryQuery(propertyOwner, viewModelQuery) {
        var _this = this;
        this.apolloClient = aurelia_framework_1.Container.instance.get(apollo_client_1.default);
        this.bindingEngine = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
        this.propertyObserverDisposables = new Set();
        if (viewModelQuery.variables_propertyName) {
            this.apolloClient.query({
                query: viewModelQuery.gql,
                variables: { id: propertyOwner[viewModelQuery.variables_propertyName] },
            }).then(function (response) {
                apollo_bind_1.callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
            })
                .catch(function (error) { return console.error(viewModelQuery.name + ' - Query error(error) :', error); });
            this.propertyObserverDisposables.add(this.bindingEngine.propertyObserver(propertyOwner, viewModelQuery.variables_propertyName)
                .subscribe(function (newVariables, oldVariables) {
                _this.apolloClient.query({ query: viewModelQuery.gql, variables: { id: newVariables } })
                    .then(function (response) {
                    var data = response.data[viewModelQuery.name];
                    apollo_bind_1.callApolloUpdate(propertyOwner, viewModelQuery.propertyName, data);
                })
                    .catch(function (error) { return console.error(viewModelQuery.name + ' - Query error(error) :', error); });
            }));
        }
        else {
            this.apolloClient.query({ query: viewModelQuery.gql })
                .then(function (response) {
                apollo_bind_1.callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
            })
                .catch(function (error) { return console.error(viewModelQuery.name + ' - Query error(error) :', error); });
        }
    }
    QueryQuery.prototype.destruct = function () {
        this.propertyObserverDisposables.forEach(function (disposable) { return disposable.dispose(); });
    };
    return QueryQuery;
}());
exports.QueryQuery = QueryQuery;
//# sourceMappingURL=query-query.js.map