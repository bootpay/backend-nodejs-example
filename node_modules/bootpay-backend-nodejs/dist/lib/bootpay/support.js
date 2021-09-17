"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = exports.objectKeyToUnderscore = exports.toUnderscore = exports.presence = exports.isBlank = exports.isPresent = void 0;
var singleton_1 = require("./singleton");
var ValidateMethod = /** @class */ (function (_super) {
    __extends(ValidateMethod, _super);
    function ValidateMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateMethod.prototype.isBlank = function (value) {
        var valid = false;
        if (typeof value === 'string') {
            valid = value.length === 0;
        }
        else if (Array.isArray(value)) {
            valid = value.length === 0;
        }
        else {
            valid = value === undefined ||
                value === null ||
                (this.isType(value, 'object') && value.constructor === Object && Object.keys(value).length === 0);
        }
        return valid;
    };
    ValidateMethod.prototype.isType = function (value, type) {
        return (typeof value === type);
    };
    ValidateMethod.prototype.isPresent = function (value) {
        return !this.isBlank(value);
    };
    ValidateMethod.prototype.presence = function (value, defaultValue) {
        if (this.isBlank(value)) {
            return defaultValue;
        }
        else {
            return value;
        }
    };
    ValidateMethod.prototype.objectKeyToUnderscore = function (value) {
        var cloneObject = undefined;
        if ((0, exports.isPresent)(value)) {
            var _this_1 = this;
            if (Array.isArray(value)) {
                cloneObject = [];
                value.forEach(function (_value) {
                    var childObject = {};
                    Object.keys(_value).forEach(function (key) {
                        childObject[_this_1.toUnderscore(key)] = _value[key];
                    });
                    cloneObject.push(childObject);
                });
            }
            else {
                cloneObject = {};
                Object.keys(value).forEach(function (key) {
                    cloneObject[_this_1.toUnderscore(key)] = value[key];
                });
            }
        }
        return cloneObject;
    };
    ValidateMethod.prototype.toUnderscore = function (value) {
        return value.split(/(?=[A-Z])/).join('_').toLowerCase();
    };
    return ValidateMethod;
}(singleton_1.BootpaySingleton));
var ValidClass = ValidateMethod.currentInstance();
var isPresent = function (value) { return ValidClass.isPresent(value); };
exports.isPresent = isPresent;
var isBlank = function (value) { return ValidClass.isBlank(value); };
exports.isBlank = isBlank;
var presence = function (value, defaultValue) { return ValidClass.presence(value, defaultValue); };
exports.presence = presence;
var toUnderscore = function (value) { return ValidClass.toUnderscore(value); };
exports.toUnderscore = toUnderscore;
var objectKeyToUnderscore = function (value) { return ValidClass.objectKeyToUnderscore(value); };
exports.objectKeyToUnderscore = objectKeyToUnderscore;
var isType = function (value, type) { return ValidClass.isType(value, type); };
exports.isType = isType;
