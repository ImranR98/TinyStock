import { loadConfig, checkDataDirectory } from './io'
import { Adjustment, AppError, AppErrorCodes, Item } from './models'
import { prompt, addItem, findItem, makeSale } from './funcs'

const choices = `
Pick an option:
0 - Exit
1 - Add Item
2 - Make Sale
`

const app = async () => {
    const config = loadConfig()
    checkDataDirectory(config.dataDir)

    let loop = true
    while (loop) {
        console.log(choices)
        let choice = await prompt('Enter the option number:')
        switch (choice.trim()) {
            case '0':
                console.log('\x1b[33m%s\x1b[0m', 'Bye.')
                loop = false
                break;
            case '1':
                console.log('\x1b[36m%s\x1b[0m', 'Adding Item.')
                try {
                    console.log('Enter item details:')
                    let code: string = await prompt('Code:')
                    let description: string = await prompt('Description:')
                    let isSet: boolean = (await prompt('Is this item part of a set? For NO, leave empty. For YES, type anything:')).trim().length > 0
                    let setQuantity = null
                    if (isSet) setQuantity = Number.parseInt(await prompt('Number of items in set:'))
                    let quantity: number = Number.parseInt(await prompt('Quantity:'))
                    let category: string = await prompt('Category:')
                    let price: number = Number.parseFloat(await prompt('Price:'))
                    let item = new Item(code, description, setQuantity, quantity, category, price)
                    addItem(config.dataDir, item)
                    console.log('\x1b[36m%s\x1b[0m', 'Item Added.')
                } catch (err) {
                    let handle = false
                    if (err instanceof AppError) if (err.code == AppErrorCodes.ITEM_EXISTS) handle = true
                    if (handle) err.print()
                    else throw err
                }
                break;
            case '2':
                console.log('\x1b[32m%s\x1b[0m', 'Making Sale.')
                let saleItems: Item[] = []
                let adjustments: Adjustment[] = []
                try {
                    let loop = true
                    while (loop) {
                        let code: string = await prompt('Code:')
                        let isSet: boolean = (await prompt('Is this item part of a set? For NO, leave empty. For YES, type anything:')).trim().length > 0
                        let setQuantity = null
                        if (isSet) setQuantity = Number.parseInt(await prompt('Number of items in set:'))
                        try {
                            let saleItem = findItem(config.dataDir, code, setQuantity)
                            let quantity = Number.parseInt(await prompt(`Quantity (currently ${saleItem.quantity}):`))
                            if (quantity > saleItem.quantity) console.log('\x1b[31m%s\x1b[0m', 'Not enough in stock - try again.')
                            else {
                                saleItem.quantity = quantity
                                saleItems.push(saleItem)
                                console.log(`Item Added: (${saleItem.code} ${saleItem.setQuantity == null ? '' : `- set of ${saleItem.setQuantity}`} - ${saleItem.quantity} @ ${saleItem.price} ea.)`)
                            }
                        } catch (err) {
                            let handle = false
                            if (err instanceof AppError) if (err.code == AppErrorCodes.ITEM_NOT_FOUND) handle = true
                            if (handle) err.print()
                            else throw err
                        }
                        loop = (await prompt('Add another item? For YES, leave empty. For NO, type anything:')).trim().length == 0
                    }
                    let total = 0
                    for (let i = 0; i < saleItems.length; i++) total += saleItems[i].price * saleItems[i].quantity
                    loop = (await prompt(`Your total is ${total}. Would you like to manually adjust this value? For NO, leave empty. For YES, type anything:`)).trim().length > 0
                    while (loop) {
                        let note: string = await prompt('Adjustment Note:')
                        let amount: number = Number.parseFloat(await prompt('Adjustment Amount (negative is discount):'))
                        adjustments.push(new Adjustment(note, amount))
                        total += amount
                        loop = (await prompt(`Your new total is ${total}. Make another adjustment? For NO, leave empty. For YES, type anything:`)).trim().length > 0
                    }
                    if ((await prompt(`Finalize this sale? For YES, leave empty. For NO, type anything:`)).trim().length == 0) {
                        makeSale(config.dataDir, saleItems, adjustments)
                        console.log('\x1b[32m%s\x1b[0m', 'Sale Saved.')
                    } else {
                        console.log('\x1b[32m%s\x1b[0m', 'Sale Cancelled.')
                    }
                } catch (err) {
                    let handle = false
                    if (err instanceof AppError) if (err.code == AppErrorCodes.ITEM_NOT_FOUND || err.code == AppErrorCodes.QUANTITY_TOO_LOW) handle = true
                    if (handle) err.print()
                    else throw err
                }
                break;
            default:
                console.log('\x1b[31m%s\x1b[0m', 'Invalid option - try again.')
                break;
        }
    }
}

app().catch(err => {
    if (err instanceof AppError) {
        err.print()
    } else {
        console.error('ERROR:')
        console.error(err)
    }
})