(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./apollo-bind"], function (require, exports) {
    "use strict";
    var apollo_bind_1 = require("./apollo-bind");
    exports.ApolloBind = apollo_bind_1.ApolloBind;
    exports.SubscriptionMode = apollo_bind_1.SubscriptionMode;
});
//# sourceMappingURL=index.js.map