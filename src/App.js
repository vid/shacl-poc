"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_hot_loader_1 = require("react-hot-loader");
var react_1 = __importDefault(require("react"));
var App = function () {
    var _a = react_1.default.useState(0), count = _a[0], setCount = _a[1];
    react_1.default.useEffect(function () {
        var interval = setInterval(function () {
            setCount(function (count) { return count + 1; });
        }, 500);
        return function () { return clearInterval(interval); };
    }, []);
    function displayCount(message) {
        return message;
    }
    return react_1.default.createElement("h2", null, displayCount("Testing Count: " + count));
};
exports.default = react_hot_loader_1.hot(module)(App);
