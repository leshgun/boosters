import Item, { RARITY } from "../item";
import Booster from "../booster";
import { CollectionBooster, LuckBooster, UniformBooster } from "../booster";
import { IInventory } from "../inventory";
import boosters_json from "../json/boosters.json";



/**
 * Create an instance of the Booster class.
 * @param type - a *Booster*'s type
 * @param props - parameters for the class instance
 * @returns an instance of the Booster class
 */
function createBooster (type : typeof Booster, props : any) : Booster {
    return new type({
        ...props,
        rarity: RARITY[<keyof typeof RARITY>props.rarity.toUpperCase() 
            || "COMMON"]
    });
}

/**
 * Translation of a string into a class type.
 * @param _type - name of the *type* (string)
 * @returns type of class
 */
function getBoosterType (_type : string) {
    _type = _type.toLowerCase();
    if (_type === "collectionbooster")
        return CollectionBooster;
    if (_type === "uniformbooster")
        return UniformBooster;
    if (_type === "luckbooster")
        return LuckBooster;
    return Booster;
}

/**
 * Returns booster dictionary from the file "json/boosters.json"
 * @param props common parameters for the class instances
 * @returns booster dictionary
 */
export function getBoosters (props: {}) : {[ID: number]: Booster} {
    let booster_base: {[ID: number]: Booster} = {};
    const boosetrs : {[type: string]: any} = boosters_json;

    const keys = Object.keys(boosters_json);
    let _id = 1;
    keys.forEach((t : string) => {
        boosetrs[t].forEach((booster : {}) => {
            booster_base[_id] = createBooster(getBoosterType(t), {
                ...booster,
                ...props
            });
            _id += 1;
        });
    });
    
    return booster_base;
}

/**
 * "Open" the booster.
 * @param booster - some booster
 * @param playerInventory - dictionary of items of player inventory
 * @returns an array of items
 */
function getBoosterLoot (booster: Booster, playerInventory: IInventory) : Item[] {
    return booster.getBoosterLoot(playerInventory);
}

export default getBoosterLoot;
