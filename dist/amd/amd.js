define("query-query", ["require", "exports", "apollo-client", "aurelia-framework", "apollo-bind"], function (require, exports, apollo_client_1, aurelia_framework_1, apollo_bind_1) {
    "use strict";
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
});
define("query-watch", ["require", "exports", "apollo-client", "aurelia-framework", "apollo-bind"], function (require, exports, apollo_client_2, aurelia_framework_2, apollo_bind_2) {
    "use strict";
    var QueryWatch = (function () {
        function QueryWatch(propertyOwner, viewModelQuery) {
            this.apolloClient = aurelia_framework_2.Container.instance.get(apollo_client_2.default);
            this.bindingEngine = aurelia_framework_2.Container.instance.get(aurelia_framework_2.BindingEngine);
            this.watchQuerySubscriptions = new Map();
            this.propertyObserverDisposables = new Set();
            var watchQuery = this.apolloClient.watchQuery({ query: viewModelQuery.gql });
            if (viewModelQuery.subscriptionMode === apollo_bind_2.SubscriptionMode.remote) {
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
                    apollo_bind_2.callApolloUpdate(propertyOwner, viewModelQuery.propertyName, response.data[viewModelQuery.name]);
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
define("view-model-instance", ["require", "exports", "apollo-bind", "query-query", "query-watch"], function (require, exports, apollo_bind_3, query_query_1, query_watch_1) {
    "use strict";
    var ViewModelInstance = (function () {
        function ViewModelInstance(viewModelPrototype, propertyOwner, viewModelQueries) {
            var _this = this;
            this.viewModelPrototype = viewModelPrototype;
            this.propertyOwner = propertyOwner;
            this.queries = new Set();
            viewModelQueries.forEach(function (viewModelQuery) {
                switch (viewModelQuery.type) {
                    case apollo_bind_3.QueryType.subscribe:
                        _this.queries.add(new query_watch_1.QueryWatch(propertyOwner, viewModelQuery));
                        break;
                    case apollo_bind_3.QueryType.query:
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
define("view-model-class", ["require", "exports", "view-model-instance"], function (require, exports, view_model_instance_1) {
    "use strict";
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
define("apollo-bind", ["require", "exports", "view-model-class"], function (require, exports, view_model_class_1) {
    "use strict";
    var SubscriptionMode;
    (function (SubscriptionMode) {
        SubscriptionMode[SubscriptionMode["remote"] = 0] = "remote";
        SubscriptionMode[SubscriptionMode["local"] = 1] = "local";
    })(SubscriptionMode = exports.SubscriptionMode || (exports.SubscriptionMode = {}));
    ;
    var QueryType;
    (function (QueryType) {
        QueryType[QueryType["subscribe"] = 0] = "subscribe";
        QueryType[QueryType["query"] = 1] = "query";
    })(QueryType = exports.QueryType || (exports.QueryType = {}));
    ;
    function callApolloUpdate(propertyOwner, propertyName, newValue) {
        var oldValue = propertyOwner[propertyName];
        propertyOwner[propertyName] = newValue;
        var apolloUpdateToCall = propertyOwner['apolloUpdate'];
        if (apolloUpdateToCall) {
            apolloUpdateToCall.call(propertyOwner, propertyName, newValue, oldValue);
        }
    }
    exports.callApolloUpdate = callApolloUpdate;
    var ApolloBind = (function () {
        function ApolloBind() {
        }
        ApolloBind.subscribe = function (document, variables_propertyName, subscriptionMode) {
            var _variables_propertyName;
            var _subscriptionMode;
            if (subscriptionMode) {
                _variables_propertyName = variables_propertyName;
                _subscriptionMode = subscriptionMode;
            }
            else {
                if (typeof variables_propertyName === 'string') {
                    _variables_propertyName = variables_propertyName;
                    _subscriptionMode = SubscriptionMode.remote;
                }
                else if (variables_propertyName !== undefined) {
                    _variables_propertyName = undefined;
                    _subscriptionMode = variables_propertyName;
                }
                else {
                    _variables_propertyName = undefined;
                    _subscriptionMode = SubscriptionMode.remote;
                }
            }
            return function (viewModelPrototype, propertyName) {
                ApolloBind.initViewModel(viewModelPrototype, {
                    type: QueryType.subscribe,
                    name: ApolloBind.getQueryName(document),
                    gql: document,
                    propertyName: propertyName,
                    variables_propertyName: _variables_propertyName,
                    subscriptionMode: _subscriptionMode,
                });
            };
        };
        ApolloBind.query = function (document, variables_propertyName) {
            return function (viewModelPrototype, propertyName) {
                ApolloBind.initViewModel(viewModelPrototype, {
                    type: QueryType.query,
                    name: ApolloBind.getQueryName(document),
                    gql: document,
                    propertyName: propertyName,
                    variables_propertyName: variables_propertyName,
                    subscriptionMode: SubscriptionMode.remote,
                });
            };
        };
        ApolloBind.getQueryName = function (document) {
            return document.definitions[0]['name'].value;
        };
        ApolloBind.initViewModel = function (viewModelPrototype, viewModelQuery) {
            var viewModelClass = ApolloBind.viewModelClasses.get(viewModelPrototype);
            if (viewModelClass === undefined) {
                viewModelClass = new view_model_class_1.ViewModelClass(viewModelPrototype);
                ApolloBind.viewModelClasses.set(viewModelPrototype, viewModelClass);
            }
            // registers the property to be binded at creation time of the ViewModel
            viewModelClass.addViewModelQueries(viewModelQuery);
        };
        return ApolloBind;
    }());
    ApolloBind.viewModelClasses = new Map();
    exports.ApolloBind = ApolloBind;
});
define("index", ["require", "exports", "apollo-bind"], function (require, exports, apollo_bind_4) {
    "use strict";
    exports.ApolloBind = apollo_bind_4.ApolloBind;
    exports.SubscriptionMode = apollo_bind_4.SubscriptionMode;
});
//# sourceMappingURL=amd.js.map