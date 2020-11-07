import { loadConfig, checkDataDirectory } from './io'
import { AppError } from './models'
import { prompt } from './funcs'

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
                console.log('\x1b[33m%s\x1b[0m', 'Bye!')
                loop = false
                break;
            case '1':
                console.log('\x1b[36m%s\x1b[0m', 'Adding Item.')
                break;
            case '2':
                console.log('\x1b[32m%s\x1b[0m', 'Making Sale.')
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