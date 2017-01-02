"use strict";
var view_model_class_1 = require("./view-model-class");
var WatchMode;
(function (WatchMode) {
    WatchMode[WatchMode["remote"] = 0] = "remote";
    WatchMode[WatchMode["local"] = 1] = "local";
})(WatchMode = exports.WatchMode || (exports.WatchMode = {}));
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
    ApolloBind.subscribe = function (document, variables_propertyName, watchMode) {
        var _variables_propertyName;
        var _watchMode;
        if (watchMode) {
            _variables_propertyName = variables_propertyName;
            _watchMode = watchMode;
        }
        else {
            if (typeof variables_propertyName === 'string') {
                _variables_propertyName = variables_propertyName;
                _watchMode = WatchMode.remote;
            }
            else if (variables_propertyName !== undefined) {
                _variables_propertyName = undefined;
                _watchMode = variables_propertyName;
            }
            else {
                _variables_propertyName = undefined;
                _watchMode = WatchMode.remote;
            }
        }
        return function (viewModelPrototype, propertyName) {
            ApolloBind.initViewModel(viewModelPrototype, {
                type: QueryType.subscribe,
                name: ApolloBind.getQueryName(document),
                gql: document,
                propertyName: propertyName,
                variables_propertyName: _variables_propertyName,
                watchMode: _watchMode,
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
                watchMode: WatchMode.remote,
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
//# sourceMappingURL=apollo-bind.js.map