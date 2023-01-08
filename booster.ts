import Item, { ITEMTYPE, RARITY } from "./item"
import { IInventory } from "./inventory"
import MyRandom, { MyRandomSeed } from "./utils/random"




// Тип бустера
export enum BOOSTERTYPE {
    BOOSTER,
    LUCKBOOSTER,
    UNIFORMBOOSTER,
    COLLECTIONBOOSTER
}

// Настройки простого бустера
interface IBoosterSettings {
    items_num_range ?: [number, number] | number,
    rarity ?: RARITY,
    rarity_guarant ?: number,
    random_seed ?: string,
    items_available : {[ID: number]: Item},
}

// Настройки бустера удачи
interface ILuckBoosterSettings extends IBoosterSettings {
    rarity_upgrade_chance ?: number
}

// Настройки равномерного бустера
interface IUniformBoosterSettings extends ILuckBoosterSettings {}

// Настройки коллекционного бустера
interface ICollectionBoosterSettings extends IUniformBoosterSettings {
    new_item_chance_mul ?: number
}



/**
 * Common booster class
 */
export default class Booster implements IBoosterSettings {
        
    rarity : RARITY;
    rarity_guarant ?: number;
    items_num_range : [number, number] = [1, 5];
    items_available : {[ID: number]: Item};
    random_seed : string;

    protected random: MyRandom;
    protected booster_loot: Item[] = [];
    protected player_inventory: IInventory = {};
    

    /**
     * @param rarity - the maximum rarity (before a possible upgrade) of
     *  booster items
     * @param rarity_guarant - guaranteed number of items of the maximum rarity
     *  of this booster.
     * @param items_num_range - the number or the range of the possible number 
     *  of "dropped" booster items
     * @param items_available - list of items that can drop from the booster
     * @param random_seed - seed for setting a certain distribution of 
     *  randomness in testing
     */
    constructor (settings: IBoosterSettings) {
        this.random_seed = settings.random_seed || '';
        this.rarity = settings.rarity || RARITY.COMMON;
        this.rarity_guarant = settings.rarity_guarant;
        this.items_available = settings.items_available;
        this.items_num_range = this.validate_items_num (
            settings.items_num_range || 0
        );

        this.random = new MyRandom();
        if (settings.random_seed)
            this.random = new MyRandomSeed(settings.random_seed);

    }

    /**
     * Validation of the number of dropped items from the booster.
     * @param num Number or range of numbers
     * @returns valid range of numbers
     */
    protected validate_items_num (num: [number, number] | number) 
    : [number, number] {
        let [min, max] = (typeof num === "number") ? [num, num] : num;
        min = (min < 0) ? 0 : min;
        max = (max == undefined || max < min) ? min : max;
        return [min, max];
    }


    /**
     * @param playerInventory Inventory of the user on which the dropped items
     * of the booster will depend (not necessary)
     * @returns Some list of items
     */
    public getBoosterLoot (playerInventory ?: IInventory) : Item[] {
        if (!Object.keys(this.items_available).length)
            return [];
        this.player_inventory = playerInventory || {};
        const items_num = this.getRandomItemsNum(); // n1 + n2
        for (let i = 0; i < items_num; i++ )
            this.booster_loot.push(this.getRandomItem());
        this.player_inventory = {};
        return this.booster_loot;
    }

    /**
     * @returns The *id* of a random available item 
     */
    protected getRandomId () : number {
        const ids = Object.keys(this.items_available);
        return parseInt(ids[Math.round(
            this.random.random_int(0, ids.length - 1)
        )]);
    }

    /**
     * @returns Some item with random rarity
     */
    protected getRandomItem () : Item {
        const random_item_id = this.getRandomId();
        return new Item ({
            ...this.items_available[random_item_id],
            rarity: this.getRandomRarity()
        });
    }

    /**
     * @returns Random number of items. Depends on the *items_num_range* 
     * parameter
     */
    protected getRandomItemsNum (): number {
        return Math.round(this.random.random_int(...this.items_num_range));
    }

    /**
     * @return A random rarity, but no more than a booster rarity
     */
    protected getRandomRarity (): RARITY {
        if (this.rarity <= 0)
            return RARITY.COMMON;
        if (this.rarity_guarant === undefined)
            return Math.round(
                this.random.random_int(this.rarity-1, this.rarity)
            );
        if (this.rarity_guarant > 0) {
            this.rarity_guarant -= 1;
            return this.rarity;
        };
        return this.rarity - 1;
    }

}



/** 
 * A little bit more lucky booster
 */
export class LuckBooster extends Booster implements ILuckBoosterSettings {
    
    rarity_upgrade_chance : number;

    /**
     * @extends Booster
     * @param rarity_upgrade_chance - The chance of increasing the rarity of
     * the dropped item from the booster
     */
    constructor (settings: ILuckBoosterSettings) {
        super(settings);
        this.rarity_upgrade_chance = settings.rarity_upgrade_chance || .1;
    }

    /**
     * @returns Some item whose rarity can be upgraded
     */
    protected getRandomItem(): Item {
        const item : Item = super.getRandomItem();
        const rarity_range = Object.keys(RARITY).length/2 - 1;
        for (let i = 1; i <= rarity_range - item.rarity; i++) {
            if (this.isRarityUpgradable(i)) {
                item.rarity += i;
                break;
            }
        };
        return item;
    }

    /**
     * Randomness function to improve item rarity
     * 
     * @param level - The level at which to attempt to improve the item's
     * rarity with a chance of *rarity_upgrade_chance*
     * @returns *Boolean*
     */
    protected isRarityUpgradable (level: number): boolean {
        if (level < 0 || level > Object.keys(ITEMTYPE).length/2)
            return false;
        const probability_range = this.rarity_upgrade_chance ** level;
        return this.random.random_coin(probability_range);
    }

}



/**
 * Booster with certain conditions for dropped items
 */
export class UniformBooster extends LuckBooster 
    implements IUniformBoosterSettings {

    protected booster_loot: Item[] = [];

    /**
     * @extends LuckBooster
     * @param items_num_range - the number or the range [min, max] of the 
     *  possible number of "dropped". Can't be less than the size of *ITEM*
     */
    constructor (settings: IUniformBoosterSettings) {
        super(settings);
        const min_items_number_range = Math.max(
            Object.keys(ITEMTYPE).length / 2 - 1,
            this.items_num_range[0]
        );
        this.items_num_range = [min_items_number_range, 
            Math.max(...this.items_num_range, min_items_number_range)]
    }

    /**
     * Items of all types will drops at first, and then it will be randomly.
     * @returns A random available item 
     */
    protected getRandomItem(): Item {
        const used_types = new Set(this.booster_loot.map(i => i.itemType));

        // Filter available items until items of all types drop.
        let items_available = this.items_available;
        if (used_types.size !== Object.keys(ITEMTYPE).length/2 - 1){
            const ids = Object.keys(this.items_available).filter(i => 
                !used_types.has(this.items_available[parseInt(i)].itemType)
            ).map(i => parseInt(i));
            this.items_available = {};
            ids.forEach(i => this.items_available[i] = items_available[i]);
        }

        const rand_item = super.getRandomItem();
        this.items_available = items_available;

        return rand_item;
    }
    
}



/**
 * Booster that depends on the player's inventory
 */
export class CollectionBooster extends UniformBooster 
    implements ICollectionBoosterSettings {

    new_item_chance_mul : number;

    /**
     * @extends UniformBooster
     * @param new_item_chance_mul - can be tweaked to increase the chance of
     *  new items dropping
     */
    constructor (settings: ICollectionBoosterSettings) {
        super(settings);
        this.new_item_chance_mul = settings.new_item_chance_mul || 1;

        if (this.new_item_chance_mul < 1)
            this.new_item_chance_mul = 1;
    }

    /**
     * @param playerInventory Inventory of the user on which the dropped items
     * of the booster will depend
     * @returns Some list of items
     */
    public getBoosterLoot(playerInventory : IInventory): Item[] {
        return super.getBoosterLoot(playerInventory);
    }

    /**
     * The drop chance of an item is inversely proportional to its quantity
     * in the inventory and booster.
     * @returns The *id* of a random available item 
     */
    protected getRandomId(): number {
        const items_ids = Object.keys(this.items_available);

        // The quantities of all available items in the inventory and booster
        let items : IInventory = {};

        // Fill quantities with zeros
        items_ids.forEach(i => items[parseInt(i)] = 0);

        // Search for the quantities in the player's inventory and booster.
        Object.keys(this.player_inventory).forEach(i => {
            if (items_ids.includes(i))
                items[parseInt(i)] = this.player_inventory[parseInt(i)]
        });
        this.booster_loot.forEach(x => {
            if (items_ids.includes(x.ID + ''))
                items[x.ID] += 1
        });

        // Inverse items quantities
        // Ex.: [0, 3, 2, 4] => [5, 2, 3, 1]
        const items_values : number[] = Object.values(items);
        // So that the weights are not zero, we add 1.
        const max_num : number = Math.max(...items_values) + 1;
        const sum = items_values.reduce((x, y) => 
            x + (max_num - y) * this.new_item_chance_mul,
        0);
        const weights = items_values.map(i => 
            (max_num - i) * this.new_item_chance_mul / sum
        );

        return parseInt(Object.keys(items)[
            this.random.random_distribution(weights)
        ]);
    }

}
