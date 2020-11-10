import { Adjustment, AppError, AppErrorCodes, Item, Sale } from 'tinystock-models'
import { readItems, readSales, writeItems, writeSales } from './io'

export function test() {
    return 'test'
}

export function createTestData(itemsNum: number = 30, salesNum: number = 10, maxItemsPerSale: number = 10, chanceOfAdjustment: number = 0.6): { items: Item[], sales: Sale[] } {
    let items: Item[] = []
    for (let i = 1; i <= itemsNum; i++) {
        items.push({
            code: `ITEM${i}`,
            description: `Test item ${i}`,
            quantity: Math.round(Math.random() * 200),
            setQuantity: Math.random() < 0.7 ? null : Math.round(Math.random() * 10),
            category: "Test Category",
            price: i * 1000
        })
    }

    let sales: Sale[] = []
    for (let i = 1; i <= salesNum; i++) {
        let saleItems: Item[] = []
        let saleItemsNum: number = Math.round(Math.random() * maxItemsPerSale)
        if (!saleItemsNum) saleItemsNum++
        for (let i = 0; i < saleItemsNum; i++) {
            let saleItem = JSON.parse(JSON.stringify(items[Math.round(Math.random() * (items.length - 1))]))
            let saleQuantity = Math.round(Math.random() * saleItem.quantity)
            if (!saleQuantity) saleQuantity++
            saleItem.quantity = saleQuantity
            saleItems.push(saleItem)
        }
        sales.push({
            id: `SALE${i}`,
            date: new Date(),
            items: saleItems,
            adjustments: Math.random() < chanceOfAdjustment ? [] : [
                new Adjustment(`Test Adjustment ${i}`, Math.random() < 0.5 ? Math.round(Math.random() * 100) : Math.round(Math.random() * 100) * -1)
            ]
        })
    }

    return { items, sales }
}

export function addItem(dataDir: string, newItem: Item) {
    let items = readItems(dataDir)
    let existingItem = items.find(item => (item.code == newItem.code && item.setQuantity == newItem.setQuantity))
    if (existingItem) throw new AppError(AppErrorCodes.ITEM_EXISTS)
    items.push(newItem)
    writeItems(dataDir, items)
}

export function findItem(dataDir: string, code: string, setQuantity: number | null) {
    let items = readItems(dataDir)
    let item = items.find(item => (item.code == code.trim() && item.setQuantity == setQuantity))
    if (!item) throw new AppError(AppErrorCodes.ITEM_NOT_FOUND, { code, setQuantity })
    return item
}

function findItemIndex(items: Item[], code: string, setQuantity: number | null) {
    let itemIndex = items.findIndex(item => (item.code == code.trim() && item.setQuantity == setQuantity))
    if (itemIndex == -1) throw new AppError(AppErrorCodes.ITEM_NOT_FOUND, { code, setQuantity })
    return itemIndex
}

export function makeSale(dataDir: string, saleItems: Item[], adjustments: Adjustment[]) {
    let items = readItems(dataDir)
    let sales = readSales(dataDir)
    saleItems.forEach(saleItem => {
        let itemIndex = findItemIndex(items, saleItem.code, saleItem.setQuantity)
        if (items[itemIndex].quantity < saleItem.quantity) throw new AppError(AppErrorCodes.QUANTITY_TOO_LOW, { saleItem, item: items[itemIndex] })
        items[itemIndex].quantity -= saleItem.quantity
    })
    sales.push(new Sale(null, new Date(), saleItems, adjustments))
    writeItems(dataDir, items)
    writeSales(dataDir, sales)
}