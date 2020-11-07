import fs from 'fs'
import path from 'path'

import { Item, Sale, instanceOfConfig, instanceOfItem, instanceOfSale, AppErrorCodes, AppError, Config } from './models'

export function checkDataDirectory(dataDir: string) {
    if (!fs.existsSync(dataDir)) throw new AppError(AppErrorCodes.MISSING_DIRECTORY)
    if (!fs.existsSync(path.join(dataDir, '/items.json'))) throw new AppError(AppErrorCodes.MISSING_ITEMS_FILE)
    if (!fs.existsSync(path.join(dataDir, '/sales.json'))) throw new AppError(AppErrorCodes.MISSING_SALES_FILE)
}

export function loadConfig(): Config {
    if(!fs.existsSync(path.join(__dirname, `../config.json`))) throw new AppError(AppErrorCodes.MISSING_CONFIG_FILE)
    let configJSON: any
    try {
        configJSON = JSON.parse(fs.readFileSync(path.join(__dirname, `../config.json`)).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_CONFIG_JSON)
    }
    if (!instanceOfConfig(configJSON)) throw new AppError(AppErrorCodes.CORRUPT_CONFIG, configJSON)
    try {
        configJSON.dataDir = path.resolve(configJSON.dataDir)
    } catch (err) {
        throw new AppError(AppErrorCodes.INVALID_DIRECTORY_PATH)
    }
    return configJSON
}

export function readData(dataDir: string): { items: Item[], sales: Sale[] } {
    checkDataDirectory(dataDir)

    let itemsJSON: any
    let salesJSON: any

    try {
        itemsJSON = JSON.parse(fs.readFileSync(path.join(dataDir, '/items.json')).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_ITEMS_JSON)
    }
    try {
        salesJSON = JSON.parse(fs.readFileSync(path.join(dataDir, '/sales.json')).toString())
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

    return { items, sales }
}

export function writeItems(dataDir: string, items: Item[]) {
    checkDataDirectory(dataDir)

    fs.writeFileSync(path.join(dataDir, '/items.json'), JSON.stringify(items, null, '\t'))
}

export function writeSales(dataDir: string, sales: Sale[]) {
    checkDataDirectory(dataDir)

    fs.writeFileSync(path.join(dataDir, '/sales.json'), JSON.stringify(sales, null, '\t'))
}