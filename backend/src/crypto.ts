// Contains functions related to password hashing and encryption for use in io.ts

import { randomBytes, createCipheriv, createDecipheriv, createHmac } from 'crypto'
import { EncryptedData } from 'tinystock-models'

const encryptionAlgorithm = 'aes-256-ctr'
const hashingAlgorithm = 'sha256'

export function encrypt(data: string, passwordHash: string) {
    passwordHash = passwordHash.slice(32) // Only the second half of hash is actually used for encryption - this is a limitation of the AES256 algorithm
    const iv = randomBytes(16)
    const cipher = createCipheriv(encryptionAlgorithm, passwordHash, iv)
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    return new EncryptedData(iv.toString('hex'), encrypted.toString('hex'))
}

export function decrypt(encryptedData: EncryptedData, passwordHash: string) {
    passwordHash = passwordHash.slice(32) // Only the second half of hash is actually used for encryption - this is a limitation of the AES256 algorithm
    const decipher = createDecipheriv(encryptionAlgorithm, passwordHash, Buffer.from(encryptedData.iv, 'hex'))
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedData.content, 'hex')), decipher.final()])
    return decrpyted.toString()
}

export function hashPassword(password: string) {
    let hash = createHmac(hashingAlgorithm, '')
    hash.update(password)
    let value = hash.digest('hex')
    return value
}