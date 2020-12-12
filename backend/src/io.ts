import fs from 'fs'
import path from 'path'

import { Item, Sale, instanceOfItem, instanceOfSale, AppErrorCodes, AppError, instanceOfEncryptedData, EncryptedData } from 'tinystock-models'

import { encrypt, decrypt, hashPassword } from './crypto'

const markerFileName = 'MarkerFile-DO_NOT_DELETE.json' // Data directory will be treated as empty if this does not exist
const markerFileContent = 'TinyStock' // Content used to test encryption password

export function createOrCheckDataDirectory(dataDir: string, password: string) {
    if (!fs.existsSync(dataDir)) throw new AppError(AppErrorCodes.MISSING_DIRECTORY)
    if (fs.existsSync(path.join(dataDir, '/' + markerFileName))) {
        let content = readEncryptedFile(path.join(dataDir, '/' + markerFileName), password)
        if (content != markerFileContent) throw new AppError(AppErrorCodes.WRONG_DECRYPTION_PASSWORD)
    }
    else {
        writeEncryptedFile(path.join(dataDir, '/' + markerFileName), markerFileContent, password)
        writeEncryptedFile(path.join(dataDir, '/items.json'), '[]', password)
        writeEncryptedFile(path.join(dataDir, '/sales.json'), '[]', password)
    }
}

export function readEncryptedFile(path: string, password: string) {
    let encryptedJSON: any
    try {
        encryptedJSON = JSON.parse(fs.readFileSync(path).toString())
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_ENCRYPTED_JSON)
    }
    if (!instanceOfEncryptedData(encryptedJSON)) throw new AppError(AppErrorCodes.INVALID_ENCRYPTED_JSON)
    let encryptedData: EncryptedData = encryptedJSON
    let passwordHash = hashPassword(password)
    const data = decrypt(encryptedData, passwordHash)
    return data
}

export function writeEncryptedFile(path: string, data: string, password: string) {
    let passwordHash = hashPassword(password)
    let encryptedData: EncryptedData = encrypt(data, passwordHash)
    fs.writeFileSync(path, JSON.stringify(encryptedData, null, '\t'))
}

export function readItems(dataDir: string, password: string): Item[] {
    createOrCheckDataDirectory(dataDir, password)

    let itemsJSON: any

    try {
        itemsJSON = JSON.parse(readEncryptedFile(path.join(dataDir, '/items.json'), password))
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

export function readSales(dataDir: string, password: string): Sale[] {
    createOrCheckDataDirectory(dataDir, password)

    let salesJSON: any

    try {
        salesJSON = JSON.parse(readEncryptedFile(path.join(dataDir, '/sales.json'), password))
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

export function writeItems(dataDir: string, items: Item[], password: string) {
    createOrCheckDataDirectory(dataDir, password)
    writeEncryptedFile(path.join(dataDir, '/items.json'), JSON.stringify(items, null, '\t'), password)
}

export function writeSales(dataDir: string, sales: Sale[], password: string) {
    createOrCheckDataDirectory(dataDir, password)
    writeEncryptedFile(path.join(dataDir, '/sales.json'), JSON.stringify(sales, null, '\t'), password)
}