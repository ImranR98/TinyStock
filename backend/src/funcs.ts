// Contains functions used by events.ts
// References functions from io.ts

import { Adjustment, AppError, AppErrorCodes, Item, Sale } from 'tinystock-models'
import { readItems, readSales, writeItems, writeSales, createOrCheckDataDirectory, changeEncryptionPassword, validatePassword } from './io'

export function configure(dataDir: string, password: string) {
    return createOrCheckDataDirectory(dataDir, password)
}

export function items(dataDir: string, password: string) {
    return readItems(dataDir, password)
}

export function sales(dataDir: string, password: string) {
    return readSales(dataDir, password)
}

export function findItem(dataDir: string, code: string, setQuantity: number | null, password: string) {
    let items = readItems(dataDir, password)
    let item = items.find(item => (item.code == code.trim() && item.setQuantity == setQuantity))
    if (!item) throw new AppError(AppErrorCodes.ITEM_NOT_FOUND, { code, setQuantity })
    return item
}

function findItemIndex(items: Item[], code: string, setQuantity: number | null) {
    let itemIndex = items.findIndex(item => (item.code == code.trim() && item.setQuantity == setQuantity))
    if (itemIndex == -1) throw new AppError(AppErrorCodes.ITEM_NOT_FOUND, { code, setQuantity })
    return itemIndex
}

export function addItem(dataDir: string, newItem: Item, password: string) {
    let items = readItems(dataDir, password)
    try {
        findItemIndex(items, newItem.code, newItem.setQuantity)
        throw new AppError(AppErrorCodes.ITEM_EXISTS)
    } catch (err) {
        if (!(err instanceof AppError)) throw err
        if (err.code != AppErrorCodes.ITEM_NOT_FOUND) throw err
    }
    items.push(newItem)
    writeItems(dataDir, items, password)
}

export function editItem(dataDir: string, item: Item, password: string) {
    let items = readItems(dataDir, password)
    let itemIndex = findItemIndex(items, item.code, item.setQuantity)
    items[itemIndex] = item
    writeItems(dataDir, items, password)
}

export function deleteItem(dataDir: string, code: string, setQuantity: number | null, password: string) {
    let items = readItems(dataDir, password)
    let itemIndex = findItemIndex(items, code, setQuantity)
    items.splice(itemIndex)
    writeItems(dataDir, items, password)
}

export function makeSale(dataDir: string, saleItems: Item[], adjustments: Adjustment[], password: string) {
    let items = readItems(dataDir, password)
    let sales = readSales(dataDir, password)
    saleItems.forEach(saleItem => {
        let itemIndex = findItemIndex(items, saleItem.code, saleItem.setQuantity)
        if (items[itemIndex].quantity < saleItem.quantity) throw new AppError(AppErrorCodes.QUANTITY_TOO_LOW, { saleItem, item: items[itemIndex] })
        items[itemIndex].quantity -= saleItem.quantity
    })
    let sale = new Sale(null, new Date(), saleItems, adjustments)
    sales.push(sale)
    writeItems(dataDir, items, password)
    writeSales(dataDir, sales, password)
    return sale
}

export function changePassword(dataDir: string, password: string, newPassword: string) {
    changeEncryptionPassword(dataDir, password, newPassword)
}

export function importData(dataDir: string, password: string, items: Item[], sales: Sale[]) {
    validatePassword(dataDir, password)
    writeItems(dataDir, items, password)
    writeSales(dataDir, sales, password)
}