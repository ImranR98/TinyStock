import fs from 'fs'

import { Item, Sale, instanceOfItem, instanceOfSale, AppErrorCodes, AppError } from './models'

function checkDataDirectory(dataDir: string) {
    if (!fs.existsSync(dataDir)) throw new AppError(AppErrorCodes.MISSING_DIRECTORY)
    if (!fs.existsSync(`${dataDir}/items.json`)) throw new AppError(AppErrorCodes.MISSING_ITEMS_FILE)
    if (!fs.existsSync(`${dataDir}/sales.json`)) throw new AppError(AppErrorCodes.MISSING_SALES_FILE)
}

export async function readData(dataDir: string): Promise<{ items: Item[], sales: Sale[] }> {
    checkDataDirectory(dataDir)

    let itemsJSON: any
    let salesJSON: any

    try {
        itemsJSON = JSON.parse(fs.readFileSync(`${dataDir}/items.json`).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_ITEMS_JSON)
    }
    try {
        salesJSON = JSON.parse(fs.readFileSync(`${dataDir}/sales.json`).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_SALES_JSON)
    }

    if (typeof itemsJSON?.length !== 'number') throw new AppError(AppErrorCodes.MISSING_ITEMS_ARRAY)
    if (typeof salesJSON?.length !== 'number') throw new AppError(AppErrorCodes.MISSING_SALES_ARRAY)

    let itemsValid = true
    for (let i = 0; i < itemsJSON.length; i++) {
        if (!instanceOfItem(itemsJSON[i])) itemsValid = false
        if (!itemsValid) throw new AppError(AppErrorCodes.CORRUPT_ITEM_IN_JSON, itemsJSON[i])
    }

    let salesValid = true
    for (let i = 0; i < salesJSON.length; i++) {
        if (!instanceOfSale(salesJSON[i])) salesValid = false
        if (!salesValid) throw new AppError(AppErrorCodes.CORRUPT_SALE_IN_JSON, salesJSON[i])
    }

    let items: Item[] = itemsJSON
    let sales: Sale[] = salesJSON

    return {items, sales}
}

export async function writeData(dataDir: string, items: Item[], sales: Sale[]) {
    checkDataDirectory(dataDir)

    fs.writeFileSync(`${dataDir}/items.json`, JSON.stringify(items, null, '\t'))
    fs.writeFileSync(`${dataDir}/sales.json`, JSON.stringify(sales, null, '\t'))
}