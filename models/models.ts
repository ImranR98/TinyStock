export class Item {
    code: string;
    description: string;
    setQuantity: number | null; // If this is null, the item is not a set
    quantity: number;
    category: string;
    price: number;

    constructor(code: string, description: string, setQuantity: number | null, quantity: number, category: string, price: number) {
        this.code = code.trim()
        this.description = description.trim()
        this.setQuantity = setQuantity
        this.quantity = quantity
        this.category = category.trim()
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
        typeof object.price == 'number' &&
        (typeof object.setQuantity == 'number' || object.setQuantity == null)
    )
    if (!goodPropTypes) return false
    let validProps = (
        object.code.trim() != '' &&
        object.description.trim != '' &&
        object.quantity >= 0 &&
        object.category.trim() != '' &&
        object.price >= 0 &&
        (object.setQuantity > 0 || object.setQuantity == null)
    )
    return validProps
}

export class Adjustment { // In case an amount ever needs to be manually adjusted at time of sale
    note: string;
    amount: number;

    constructor(note: string, amount: number) {
        this.note = note.trim()
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
    if (!goodPropTypes) return false
    let validProps = (
        object.note.trim() != ''
    )
    return validProps
}

export class Sale {
    id: string;
    date: Date;
    items: Item[];
    adjustments: Adjustment[];

    constructor(id: string | null, date: Date, items: Item[], adjustments: Adjustment[]) {
        this.id = id ? id.trim() : Math.round(Math.random() * 10000000000000000).toString(),
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
    if (goodPropTypes && object.id.trim() == '') goodPropTypes = false
    if (goodPropTypes && typeof object.date == 'string') {
        try { new Date(object.date) } catch (err) { goodPropTypes = false }
    } else if (goodPropTypes && !(object.date instanceof Date)) {
        goodPropTypes = false
    }
    if (goodPropTypes && !Array.isArray(object.items.length)) goodPropTypes = false
    if (goodPropTypes && !Array.isArray(object.adjustments.length)) goodPropTypes = false
    for (let i = 0; i < object.items.length && goodPropTypes; i++) {
        if (!instanceOfItem(object.items[i])) goodPropTypes = false
    }
    for (let i = 0; i < object.adjustments.length && goodPropTypes; i++) {
        if (!instanceOfAdjustment(object.adjustments[i])) goodPropTypes = false
    }
    return goodPropTypes
}

export enum AppErrorCodes {
    MISSING_DIRECTORY,
    CORRUPT_ITEMS_JSON,
    CORRUPT_SALES_JSON,
    MISSING_ITEMS_ARRAY,
    MISSING_SALES_ARRAY,
    CORRUPT_ITEM_IN_JSON,
    CORRUPT_SALE_IN_JSON,
    ITEM_NOT_FOUND,
    QUANTITY_TOO_LOW,
    ITEM_EXISTS,
    INVALID_ITEM,
    INVALID_SALE,
    MISSING_ARGUMENT,
    INVALID_ARGUMENT
}

export class AppError {
    code: AppErrorCodes;
    data: any;

    constructor(code: AppErrorCodes, data: any = null) {
        this.code = code
        this.data = data
    }
}

export function instanceOfAppError(object: any): object is AppError {
    let hasProps = (
        'code' in object &&
        'data' in object
    )
    if (!hasProps) return false
    let goodPropTypes = (
        typeof object.code == 'number' &&
        typeof object.data == 'object'
    )
    if (!goodPropTypes) return false
    let validProps = (
        object.code in AppErrorCodes
    )
    return validProps
}