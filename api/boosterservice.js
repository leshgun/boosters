"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getBoosters = void 0;
var item_1 = require("../item");
var booster_1 = require("../booster");
var booster_2 = require("../booster");
var boosters_json_1 = require("../json/boosters.json");
/**
 * Create an instance of the Booster class.
 * @param type - a *Booster*'s type
 * @param props - parameters for the class instance
 * @returns an instance of the Booster class
 */
function createBooster(type, props) {
    return new type(__assign(__assign({}, props), { rarity: item_1.RARITY[props.rarity.toUpperCase()
            || "COMMON"] }));
}
/**
 * Translation of a string into a class type.
 * @param _type - name of the *type* (string)
 * @returns type of class
 */
function getBoosterType(_type) {
    _type = _type.toLowerCase();
    if (_type === "collectionbooster")
        return booster_2.CollectionBooster;
    if (_type === "uniformbooster")
        return booster_2.UniformBooster;
    if (_type === "luckbooster")
        return booster_2.LuckBooster;
    return booster_1["default"];
}
/**
 * Returns booster dictionary from the file "json/boosters.json"
 * @param props common parameters for the class instances
 * @returns booster dictionary
 */
function getBoosters(props) {
    var booster_base = {};
    var boosetrs = boosters_json_1["default"];
    var keys = Object.keys(boosters_json_1["default"]);
    var _id = 1;
    keys.forEach(function (t) {
        boosetrs[t].forEach(function (booster) {
            booster_base[_id] = createBooster(getBoosterType(t), __assign(__assign({}, booster), props));
            _id += 1;
        });
    });
    return booster_base;
}
exports.getBoosters = getBoosters;
/**
 * "Open" the booster.
 * @param booster - some booster
 * @param playerInventory - dictionary of items of player inventory
 * @returns an array of items
 */
function getBoosterLoot(booster, playerInventory) {
    return booster.getBoosterLoot(playerInventory);
}
exports["default"] = getBoosterLoot;
