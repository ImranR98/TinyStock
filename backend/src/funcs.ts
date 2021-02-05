// Contains functions used by events.ts
// References functions from io.ts

import { Adjustment, AppError, AppErrorCodes, Item, Transaction, TransactionTypes } from 'tinystock-models'
import { readItems, readTransactions, writeItems, writeTransactions, createOrCheckDataDirectory, changeEncryptionPassword, validatePassword } from './io'

export function configure(dataDir: string, password: string) {
    return createOrCheckDataDirectory(dataDir, password)
}

export function items(dataDir: string, password: string) {
    return readItems(dataDir, password)
}

export function transactions(dataDir: string, password: string) {
    return readTransactions(dataDir, password)
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
    newItem.quantity = 0
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
    item.quantity = items[itemIndex].quantity
    items[itemIndex] = item
    writeItems(dataDir, items, password)
}

export function deleteItem(dataDir: string, code: string, setQuantity: number | null, password: string) {
    let items = readItems(dataDir, password)
    let itemIndex = findItemIndex(items, code, setQuantity)
    items.splice(itemIndex)
    writeItems(dataDir, items, password)
}

export function addTransaction(dataDir: string, transactionItems: Item[], adjustments: Adjustment[], type: TransactionTypes, password: string) {
    let items = readItems(dataDir, password)
    let transactions = readTransactions(dataDir, password)
    transactionItems.forEach(transactionItem => {
        let itemIndex = findItemIndex(items, transactionItem.code, transactionItem.setQuantity)
        if (type == TransactionTypes.SALE) {
            if (items[itemIndex].quantity < transactionItem.quantity) throw new AppError(AppErrorCodes.QUANTITY_TOO_LOW, { transactionItem: transactionItem, item: items[itemIndex] })
            items[itemIndex].quantity -= transactionItem.quantity
        } else items[itemIndex].quantity += transactionItem.quantity
    })
    let transaction = new Transaction(null, new Date(), transactionItems, adjustments, type)
    transactions.push(transaction)
    writeItems(dataDir, items, password)
    writeTransactions(dataDir, transactions, password)
    return transaction
}

export function changePassword(dataDir: string, password: string, newPassword: string) {
    changeEncryptionPassword(dataDir, password, newPassword)
}

export function importData(dataDir: string, password: string, items: Item[], transactions: Transaction[]) {
    validatePassword(dataDir, password)
    writeItems(dataDir, items, password)
    writeTransactions(dataDir, transactions, password)
}