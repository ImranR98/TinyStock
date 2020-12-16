// Contains functions related to data IO for use in funcs.ts
// References functions from crypto.ts

import fs from 'fs'
import path from 'path'

import { Item, Sale, AppErrorCodes, AppError, instanceOfEncryptedData, EncryptedData, instanceOfItems, instanceOfSales } from 'tinystock-models'

import { encrypt, decrypt, hashPassword } from './crypto'

const markerFileName = 'MarkerFile-DO_NOT_DELETE.json' // Data directory will be treated as empty if this does not exist
const markerFileContent = 'TinyStock' // Content used to test encryption password

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

export function validatePassword(dataDir: string, password: string) {
    createOrCheckDataDirectory(dataDir, password)
    let content = readEncryptedFile(path.join(dataDir, '/' + markerFileName), password)
    if (content != markerFileContent) throw new AppError(AppErrorCodes.WRONG_DECRYPTION_PASSWORD)
}

export function readItems(dataDir: string, password: string): Item[] {
    createOrCheckDataDirectory(dataDir, password)

    let itemsJSON: any

    try {
        itemsJSON = JSON.parse(readEncryptedFile(path.join(dataDir, '/items.json'), password))
    } catch (err) {
        throw new AppError(AppErrorCodes.CORRUPT_ITEMS_JSON)
    }

    if (!instanceOfItems(itemsJSON)) throw new AppError(AppErrorCodes.CORRUPT_ITEM_IN_JSON)

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

    if (!instanceOfSales(salesJSON)) throw new AppError(AppErrorCodes.CORRUPT_ITEM_IN_JSON)

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

export function changeEncryptionPassword(dataDir: string, password: string, newPassword: string) {
    const items = readItems(dataDir, password)
    const sales = readSales(dataDir, password)
    const marker = readEncryptedFile(path.join(dataDir, '/' + markerFileName), password)
    if (marker != markerFileContent) throw new AppError(AppErrorCodes.WRONG_DECRYPTION_PASSWORD)
    writeEncryptedFile(path.join(dataDir, '/' + markerFileName), markerFileContent, newPassword)
    writeItems(dataDir, items, newPassword)
    writeSales(dataDir, sales, newPassword)
}