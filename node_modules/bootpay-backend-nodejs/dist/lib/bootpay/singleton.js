"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootpaySingleton = void 0;
var BootpaySingleton = /** @class */ (function () {
    function BootpaySingleton() {
    }
    /**
     * Singleton Instance Return
     * Comment by rumi
     * @date: 2020-10-20
     * @param
     * @returns
     */
    BootpaySingleton.currentInstance = function () {
        if (!this.__instance) {
            this.__instance = new this();
        }
        return this.__instance;
    };
    return BootpaySingleton;
}());
exports.BootpaySingleton = BootpaySingleton;
