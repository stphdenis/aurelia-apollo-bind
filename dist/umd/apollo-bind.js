(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./view-model-class"], function (require, exports) {
    "use strict";
    var view_model_class_1 = require("./view-model-class");
    var QueryTypeEnum;
    (function (QueryTypeEnum) {
        QueryTypeEnum[QueryTypeEnum["subscribe"] = 0] = "subscribe";
        QueryTypeEnum[QueryTypeEnum["query"] = 1] = "query";
    })(QueryTypeEnum = exports.QueryTypeEnum || (exports.QueryTypeEnum = {}));
    ;
    function callApolloUpdate(propertyOwner, propertyName, newValue) {
        var oldValue = propertyOwner[propertyName];
        propertyOwner[propertyName] = newValue;
        console.info('ApolloBind - callApolloUpdate - propertyName, propertyOwner :', propertyName, propertyOwner);
        console.info('ApolloBind - callApolloUpdate - newValue, oldValue :', newValue, oldValue);
        var apolloUpdateToCall = propertyOwner['apolloUpdate'];
        if (apolloUpdateToCall) {
            apolloUpdateToCall.call(propertyOwner, propertyName, newValue, oldValue);
        }
    }
    exports.callApolloUpdate = callApolloUpdate;
    var ApolloBind = (function () {
        function ApolloBind() {
        }
        ApolloBind.subscribe = function (document, variables_propertyName) {
            return function (viewModelPrototype, propertyName) {
                ApolloBind.initViewModel(viewModelPrototype, {
                    type: QueryTypeEnum.subscribe,
                    name: ApolloBind.getQueryName(document),
                    gql: document,
                    propertyName: propertyName,
                    variables_propertyName: variables_propertyName,
                });
            };
        };
        ApolloBind.query = function (document, variables_propertyName) {
            return function (viewModelPrototype, propertyName) {
                ApolloBind.initViewModel(viewModelPrototype, {
                    type: QueryTypeEnum.query,
                    name: ApolloBind.getQueryName(document),
                    gql: document,
                    propertyName: propertyName,
                    variables_propertyName: variables_propertyName,
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
//# sourceMappingURL=apollo-bind.js.map