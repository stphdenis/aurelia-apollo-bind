System.register("query-query", ["apollo-client", "aurelia-framework", "apollo-bind"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var apollo_client_1, aurelia_framework_1, apollo_bind_1, QueryQuery;
    return {
        setters: [
            function (apollo_client_1_1) {
                apollo_client_1 = apollo_client_1_1;
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (apollo_bind_1_1) {
                apollo_bind_1 = apollo_bind_1_1;
            }
        ],
        execute: function () {
            QueryQuery = (function () {
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
            exports_1("QueryQuery", QueryQuery);
        }
    };
});
System.register("query-watch", ["apollo-client", "aurelia-framework", "apollo-bind"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var apollo_client_2, aurelia_framework_2, apollo_bind_2, QueryWatch;
    return {
        setters: [
            function (apollo_client_2_1) {
                apollo_client_2 = apollo_client_2_1;
            },
            function (aurelia_framework_2_1) {
                aurelia_framework_2 = aurelia_framework_2_1;
            },
            function (apollo_bind_2_1) {
                apollo_bind_2 = apollo_bind_2_1;
            }
        ],
        execute: function () {
            QueryWatch = (function () {
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
            exports_2("QueryWatch", QueryWatch);
        }
    };
});
System.register("view-model-instance", ["apollo-bind", "query-query", "query-watch"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var apollo_bind_3, query_query_1, query_watch_1, ViewModelInstance;
    return {
        setters: [
            function (apollo_bind_3_1) {
                apollo_bind_3 = apollo_bind_3_1;
            },
            function (query_query_1_1) {
                query_query_1 = query_query_1_1;
            },
            function (query_watch_1_1) {
                query_watch_1 = query_watch_1_1;
            }
        ],
        execute: function () {
            ViewModelInstance = (function () {
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
            exports_3("ViewModelInstance", ViewModelInstance);
        }
    };
});
System.register("view-model-class", ["view-model-instance"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var view_model_instance_1, ViewModelClass;
    return {
        setters: [
            function (view_model_instance_1_1) {
                view_model_instance_1 = view_model_instance_1_1;
            }
        ],
        execute: function () {
            ViewModelClass = (function () {
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
            exports_4("ViewModelClass", ViewModelClass);
        }
    };
});
System.register("apollo-bind", ["view-model-class"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function callApolloUpdate(propertyOwner, propertyName, newValue) {
        var oldValue = propertyOwner[propertyName];
        propertyOwner[propertyName] = newValue;
        var apolloUpdateToCall = propertyOwner['apolloUpdate'];
        if (apolloUpdateToCall) {
            apolloUpdateToCall.call(propertyOwner, propertyName, newValue, oldValue);
        }
    }
    exports_5("callApolloUpdate", callApolloUpdate);
    var view_model_class_1, SubscriptionMode, QueryType, ApolloBind;
    return {
        setters: [
            function (view_model_class_1_1) {
                view_model_class_1 = view_model_class_1_1;
            }
        ],
        execute: function () {
            (function (SubscriptionMode) {
                SubscriptionMode[SubscriptionMode["remote"] = 0] = "remote";
                SubscriptionMode[SubscriptionMode["local"] = 1] = "local";
            })(SubscriptionMode || (SubscriptionMode = {}));
            exports_5("SubscriptionMode", SubscriptionMode);
            ;
            (function (QueryType) {
                QueryType[QueryType["subscribe"] = 0] = "subscribe";
                QueryType[QueryType["query"] = 1] = "query";
            })(QueryType || (QueryType = {}));
            exports_5("QueryType", QueryType);
            ;
            ApolloBind = (function () {
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
            exports_5("ApolloBind", ApolloBind);
        }
    };
});
System.register("index", ["apollo-bind"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (apollo_bind_4_1) {
                exports_6({
                    "ApolloBind": apollo_bind_4_1["ApolloBind"],
                    "SubscriptionMode": apollo_bind_4_1["SubscriptionMode"]
                });
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=system.js.map