// Редкость
export enum RARITY {
    COMMON,
    RARE,
    EPIC,
    LEGENDARY
}

// Тип предмета
export enum ITEMTYPE {
    UNKNOWN,
    HELMET,
    WEAPON,
    SHIELD,
    ARMOR
}

// Настройки предмета
interface IItemSettings {
    ID: number,
    name: string,
    rarity?: RARITY,
    itemType: ITEMTYPE
}



// Класс предмета
export default class Item {

    readonly ID: number;
    name: string;
    rarity: RARITY;
    itemType: ITEMTYPE;

    constructor (settings: IItemSettings) {
        this.ID = settings.ID;
        this.name = settings.name;
        this.rarity = settings.rarity || RARITY.COMMON;
        this.itemType = settings.itemType;
    }

}
