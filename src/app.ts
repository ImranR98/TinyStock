import { loadConfig, checkDataDirectory } from './io'
import { AppError } from './models'
import { prompt } from './funcs'

const app = async () => {
    const config = loadConfig()
    checkDataDirectory(config.dataDir)

    
}

app().then(() => console.log('Done')).catch(err => {
    if (err instanceof AppError) {
        err.print()
    } else {
        console.error('ERROR:')
        console.error(err)
    }
})