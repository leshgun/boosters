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
var item_1 = require("../item");
var items_json_1 = require("../json/items.json");
/**
 * Returns item dictionary from the file "json/items.json"
 * @returns item dictionary
 */
function getItems() {
    var items_dict = {};
    items_json_1["default"].forEach(function (item, i) {
        var item_type = item.itemType.toUpperCase();
        items_dict[i + 1] = new item_1["default"](__assign(__assign({}, item), { ID: i + 1, itemType: item_1.ITEMTYPE[item_type] }));
    });
    return items_dict;
}
exports["default"] = getItems;
