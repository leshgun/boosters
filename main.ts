import Item, { RARITY } from "./item";
import Booster from "./booster"
import { IInventory } from "./inventory";

import getBoosterLoot, { getBoosters } from "./api/boosterservice"
import getItems from "./api/itemservice";

import MyRandom, { MyRandomSeed } from "./utils/random";



// База предметов
let itemsBase: {[ID: number]: Item} = {}

// Коллекция экземпляров бустерпаков
let boosterBase: {[ID: number]: Booster} = {}



/**
 * Handle print
 * @param props - anything to log in the console
 */
function hprint (...props : any) : void {
    console.log("||", ...props);
}

/**
 * Print the loot in the boosters.
 * You can set a seed of randomness for debugging.
 * @param sortBy - to sort the output of items of the oppened booster
 * @param random_seed - a seed of randomness to get the same random values
 */
function openAndPrintBoosters (
    sortBy : keyof Item = "name",
    random_seed ?: string
    ) : void {

    let mrand = new MyRandom();
    if (random_seed)
        mrand = new MyRandomSeed(random_seed);

    let inventory : IInventory = {};
    for (let i = 1; i < mrand.random_int(3, 16); ++i)
        inventory[i] = <number> Math.round(mrand.random_int(1, 5));

    console.log('='.repeat(80));
    hprint("Seed:", random_seed);
    hprint("Inventory:");
    hprint(inventory);
    console.log('='.repeat(80));

    Object.keys(boosterBase).forEach((_id : string) => {
        const booster = boosterBase[parseInt(_id)];
        hprint(`Booster pack (${booster.constructor.name}):`);
        hprint(`Settings:`);
        hprint(`--- Rarity: ${RARITY[booster.rarity]}`);
        hprint(`--- Rarity garant: ${booster.rarity_guarant}`);
        if (Object.keys(booster).includes("rarity_upgrade_chance")){
            const _b : any = booster;
            hprint(`--- Rarity upgrade chance: ` + 
            `${_b.rarity_upgrade_chance * 100 || 0}%`);
        }
        hprint(`--- Item count range: ${booster.items_num_range.join("-")}`);
        let item_list = getBoosterLoot(booster, inventory);
        item_list = item_list.sort((x, y) => x.name.localeCompare(y.name));
        if (typeof item_list[0][sortBy] == "number")
            item_list = item_list.sort((x : Item, y : Item) => 
                <number>x[sortBy] - <number>y[sortBy]
            );
        item_list.forEach((item : Item, i : number) => 
            hprint(`(${i+1}):`, item)
        );
        hprint();
    })

    console.log('='.repeat(80));
}



// Tests
function main () {

    const random_seed = ""

    itemsBase = getItems();
    boosterBase = getBoosters({
        random_seed,
        items_available: itemsBase,
    });

    // boosterBase[4] = new CollectionBooster({
    //     random_seed,
    //     rarity: RARITY.RARE,
    //     rarity_guarant: 10,
    //     rarity_upgrade_chance: .45,
    //     items_num_range: [1, 2],
    //     items_available: itemsBase,
    // })

    openAndPrintBoosters ("rarity", random_seed);

}

main();
