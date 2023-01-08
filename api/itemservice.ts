import Item, { ITEMTYPE } from "../item";
import items_json from "../json/items.json"



/**
 * Returns item dictionary from the file "json/items.json"
 * @returns item dictionary
 */
function getItems (): {[ID: number]: Item} {
    let items_dict: {[ID: number]: Item} = {};
    items_json.forEach((item, i) => {
        const item_type = item.itemType.toUpperCase();
        items_dict[i+1] = new Item({
            ...item,
            ID: i+1,
            itemType: ITEMTYPE[<keyof typeof ITEMTYPE>item_type]
        });
    });
    return items_dict;
}

export default getItems;
