import path from 'path'
import { loadConfig, checkDataDirectory } from './io'
import { AppError } from './models'

try {
    const config = loadConfig()
    checkDataDirectory(config.dataDir)

    // ...

} catch (err) {
    if (err instanceof AppError) {
        err.print()
    } else {
        console.error('ERROR:')
        console.error(err)
    }
}