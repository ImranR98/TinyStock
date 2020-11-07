import { Adjustment, AppError, AppErrorCodes, Item, Sale } from './models'
import { writeItems, writeSales } from './io'

export function createTestData(): { items: Item[], sales: Sale[] } {
    let items: Item[] = []
    for (let i = 1; i <= 30; i++) {
        items.push({
            code: `ITEM${i}`,
            description: `Test item ${i}`,
            quantity: Math.round(Math.random() * 20),
            setQuantity: Math.random() < 0.7 ? null : Math.round(Math.random() * 10),
            category: "Test Category",
            price: i * 1000
        })
    }

    let sales: Sale[] = []
    for (let i = 1; i <= 10; i++) {
        sales.push({
            id: `SALE${i}`,
            date: new Date(),
            items: [
                items[Math.round(Math.random() * (items.length - 1))],
                items[Math.round(Math.random() * (items.length - 1))],
                items[Math.round(Math.random() * (items.length - 1))]
            ],
            adjustments: Math.random() < 0.6 ? [] : [
                new Adjustment(`Test Adjustment ${i}`, Math.random() < 0.5 ? Math.round(Math.random() * 100) : Math.round(Math.random() * 100) * -1)
            ]
        })
    }

    return { items, sales }
}

export function addItem(dataDir: string, items: Item[], newItem: Item) {
    let existingItem = items.find(item => (item.code == newItem.code && item.setQuantity == newItem.setQuantity))
    if (existingItem) throw new AppError(AppErrorCodes.ITEM_EXISTS)
    items.push(newItem)
    writeItems(dataDir, items)
}

export function findItemIndex(items: Item[], code: string, setQuantity: number | null) {
    let itemIndex = items.findIndex(item => (item.code == code.trim() && item.setQuantity == setQuantity))
    if (!itemIndex) throw new AppError(AppErrorCodes.ITEM_NOT_FOUND, { code, setQuantity })
    return itemIndex
}

export function makeSale(dataDir: string, items: Item[], sales: Sale[], saleItems: Item[], adjustments: Adjustment[]) {
    saleItems.forEach(saleItem => {
        let itemIndex = findItemIndex(items, saleItem.code, saleItem.setQuantity)
        if (items[itemIndex].quantity < saleItem.quantity) throw new AppError(AppErrorCodes.QUANTITY_TOO_LOW, { saleItem, item: items[itemIndex] })
        items[itemIndex].quantity -= saleItem.quantity
    })
    sales.push(new Sale(null, new Date(), saleItems, adjustments))
    writeItems(dataDir, items)
    writeSales(dataDir, sales)
}