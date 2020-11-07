import { Adjustment, Item, Sale } from './models'

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

