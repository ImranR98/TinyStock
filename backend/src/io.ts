import fs from 'fs'
import path from 'path'

import { Item, Sale, instanceOfItem, instanceOfSale, AppErrorCodes, AppError } from 'tinystock-models'

export function checkDataDirectory(dataDir: string) {
    if (!fs.existsSync(dataDir)) throw new AppError(AppErrorCodes.MISSING_DIRECTORY)
    if (!fs.existsSync(path.join(dataDir, '/items.json')))
        fs.writeFileSync(path.join(dataDir, '/items.json'), '[]')
    if (!fs.existsSync(path.join(dataDir, '/sales.json')))
        fs.writeFileSync(path.join(dataDir, '/sales.json'), '[]')
}

export function readItems(dataDir: string): Item[] {
    checkDataDirectory(dataDir)

    let itemsJSON: any

    try {
        itemsJSON = JSON.parse(fs.readFileSync(path.join(dataDir, '/items.json')).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_ITEMS_JSON)
    }

    if (typeof itemsJSON?.length !== 'number') throw new AppError(AppErrorCodes.MISSING_ITEMS_ARRAY)

    let itemsValid = true
    for (let i = 0; i < itemsJSON.length; i++) {
        if (!instanceOfItem(itemsJSON[i])) itemsValid = false
        if (!itemsValid) throw new AppError(AppErrorCodes.CORRUPT_ITEM_IN_JSON, itemsJSON[i])
    }

    let items: Item[] = itemsJSON

    return items
}

export function readSales(dataDir: string): Sale[] {
    checkDataDirectory(dataDir)

    let salesJSON: any

    try {
        salesJSON = JSON.parse(fs.readFileSync(path.join(dataDir, '/sales.json')).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_SALES_JSON)
    }

    if (typeof salesJSON?.length !== 'number') throw new AppError(AppErrorCodes.MISSING_SALES_ARRAY)

    let salesValid = true
    for (let i = 0; i < salesJSON.length; i++) {
        if (!instanceOfSale(salesJSON[i])) salesValid = false
        if (!salesValid) throw new AppError(AppErrorCodes.CORRUPT_SALE_IN_JSON, salesJSON[i])
    }

    let sales: Sale[] = salesJSON

    return sales
}

export function writeItems(dataDir: string, items: Item[]) {
    checkDataDirectory(dataDir)

    fs.writeFileSync(path.join(dataDir, '/items.json'), JSON.stringify(items, null, '\t'))
}

export function writeSales(dataDir: string, sales: Sale[]) {
    checkDataDirectory(dataDir)

    fs.writeFileSync(path.join(dataDir, '/sales.json'), JSON.stringify(sales, null, '\t'))
}