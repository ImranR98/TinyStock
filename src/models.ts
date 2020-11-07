export class Config { // In case an amount ever needs to be manually adjusted at time of sale
    dataDir: string;

    constructor(dataDir: string) {
        this.dataDir = dataDir
    }
}

export function instanceOfConfig(object: any): object is Config {
    let hasProps = (
        'dataDir' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.dataDir == 'string'
    )
    return goodPropTypes
}

export class Item {
    code: string;
    description: string;
    setQuantity: number | null; // If this is null, the item is not a set
    quantity: number;
    category: string;
    price: number;

    constructor(code: string, description: string, setQuantity: number | null, quantity: number, category: string, price: number) {
        this.code = code
        this.description = description
        this.setQuantity = setQuantity
        this.quantity = quantity
        this.category = category
        this.price = price
    }
}

export function instanceOfItem(object: any): object is Item {
    let hasProps = (
        'code' in object &&
        'description' in object &&
        'setQuantity' in object &&
        'quantity' in object &&
        'category' in object &&
        'price' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.code == 'string' &&
        typeof object.description == 'string' &&
        typeof object.quantity == 'number' &&
        typeof object.category == 'string' &&
        typeof object.price == 'number'
    )
    return goodPropTypes
}

export class Adjustment { // In case an amount ever needs to be manually adjusted at time of sale
    note: string;
    amount: number;

    constructor(note: string, amount: number) {
        this.note = note
        this.amount = amount
    }
}

function instanceOfAdjustment(object: any): object is Adjustment {
    let hasProps = (
        'note' in object &&
        'amount' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.note == 'string' &&
        typeof object.amount == 'number'
    )
    return goodPropTypes
}

export class Sale {
    id: string;
    date: Date;
    items: Item[];
    adjustments: Adjustment[];

    constructor(id: string | null, date: Date, items: Item[], adjustments: Adjustment[]) {
        this.id = id ? id : Math.round(Math.random() * 10000000000000000).toString(),
            this.date = date,
            this.items = items,
            this.adjustments = adjustments
    }
}

export function instanceOfSale(object: any): object is Sale {
    let hasProps = (
        'id' in object &&
        'date' in object &&
        'items' in object &&
        'adjustments' in object
    )
    if (!hasProps) return false
    let goodPropTypes = typeof object.id == 'string'
    if (goodPropTypes && typeof object.date == 'string') {
        try { new Date(object.date) } catch (err) { goodPropTypes = false }
    } else if (goodPropTypes && typeof object.date != 'object') {
        goodPropTypes = false
    }
    if (goodPropTypes && typeof object.items.length != 'number') goodPropTypes = false
    if (goodPropTypes && typeof object.adjustments.length != 'number') goodPropTypes = false
    for (let i = 0; i < object.items.length && goodPropTypes; i++) {
        if (!instanceOfItem(object.items[i])) goodPropTypes = false
    }
    for (let i = 0; i < object.adjustments.length && goodPropTypes; i++) {
        if (!instanceOfAdjustment(object.adjustments[i])) goodPropTypes = false
    }
    return goodPropTypes
}

export enum AppErrorCodes {
    MISSING_CONFIG_FILE,
    CORRUPT_CONFIG_JSON,
    CORRUPT_CONFIG,
    INVALID_DIRECTORY_PATH,
    MISSING_DIRECTORY,
    MISSING_ITEMS_FILE,
    MISSING_SALES_FILE,
    CORRUPT_ITEMS_JSON,
    CORRUPT_SALES_JSON,
    MISSING_ITEMS_ARRAY,
    MISSING_SALES_ARRAY,
    CORRUPT_ITEM_IN_JSON,
    CORRUPT_SALE_IN_JSON,
    ITEM_NOT_FOUND,
    QUANTITY_TOO_LOW,
    ITEM_EXISTS
}

export class AppError {
    code: AppErrorCodes;
    data: any;
    message: string

    print = () => console.error(
        `${this.message}\n${this.data ? 'Data:\n' + (typeof this.data == 'object' ? JSON.stringify(this.data, null, '\t') : this.data) : 'No further data available.'}`
    )

    constructor(code: AppErrorCodes, data: any = null) {
        this.code = code
        this.data = data
        switch (this.code) {
            case AppErrorCodes.MISSING_CONFIG_FILE:
                this.message = 'The configuration file is missing.'
                break;
            case AppErrorCodes.CORRUPT_CONFIG_JSON:
                this.message = 'The configuration file is not a valid JSON file.'
                break;
            case AppErrorCodes.CORRUPT_CONFIG:
                this.message = 'The configuration is invalid.'
                break;
            case AppErrorCodes.INVALID_DIRECTORY_PATH:
                this.message = 'The configured data directory path is not valid.'
                break;
            case AppErrorCodes.MISSING_DIRECTORY:
                this.message = 'The data directory is missing.'
                break;
            case AppErrorCodes.MISSING_ITEMS_FILE:
                this.message = 'The items file is missing.'
                break;
            case AppErrorCodes.MISSING_SALES_FILE:
                this.message = 'The sales file is missing.'
                break;
            case AppErrorCodes.CORRUPT_ITEMS_JSON:
                this.message = 'The items file is not a valid JSON file.'
                break;
            case AppErrorCodes.CORRUPT_SALES_JSON:
                this.message = 'The sales file is not a valid JSON file.'
                break;
            case AppErrorCodes.MISSING_ITEMS_ARRAY:
                this.message = 'The items file does not contain an array.'
                break;
            case AppErrorCodes.MISSING_SALES_ARRAY:
                this.message = 'The sales file does not contain an array.'
                break;
            case AppErrorCodes.CORRUPT_ITEM_IN_JSON:
                this.message = 'An item in the items file is invalid.'
                break;
            case AppErrorCodes.CORRUPT_SALE_IN_JSON:
                this.message = 'A sale in the sales file is invalid.'
                break;
            case AppErrorCodes.ITEM_NOT_FOUND:
                this.message = 'The item does not exist.'
                break;
            case AppErrorCodes.QUANTITY_TOO_LOW:
                this.message = 'The item\'s quantity is too low.'
                break;
            case AppErrorCodes.ITEM_EXISTS:
                this.message = 'This item already exists.'
                break;
            default:
                this.message = 'Unspecified error.'
                break;
        }
    }
}