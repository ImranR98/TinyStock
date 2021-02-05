// Contains functions directly accessed by main.ts
// References functions from funcs.ts

import { configure, addItem, findItem, addTransaction, editItem, deleteItem, changePassword, importData, items, transactions } from './funcs'
import { AppError, AppErrorCodes, instanceOfItem, instanceOfAdjustment, instanceOfItems, instanceOfTransactions, TransactionTypes } from 'tinystock-models'

export async function checkStandardArgs(obj: any) {
  if (obj.dataDir == undefined || obj.password == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (typeof obj.dataDir != 'string' || typeof obj.password != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  if (obj.password.length == 0) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
}

export async function configureEvent(body: any) {
  checkStandardArgs(body)
  return configure(body.dataDir, body.password)
}

export async function itemsEvent(body: any) {
  checkStandardArgs(body)
  return items(body.dataDir, body.password)
}

export async function transactionsEvent(body: any) {
  checkStandardArgs(body)
  return transactions(body.dataDir, body.password)
}

export async function addItemEvent(body: any) {
  checkStandardArgs(body)
  if (body.item == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (!instanceOfItem(body.item)) throw new AppError(AppErrorCodes.INVALID_ITEM)
  return addItem(body.dataDir, body.item, body.password)
}

export async function findItemEvent(body: any) {
  checkStandardArgs(body)
  if (body.code == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (typeof body.code != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  return findItem(body.dataDir, body.code, typeof body.setQuantity == 'number' ? body.setQuantity : null, body.password)
}

export async function editItemEvent(body: any) {
  checkStandardArgs(body)
  if (body.item == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (!instanceOfItem(body.item)) throw new AppError(AppErrorCodes.INVALID_ITEM)
  return editItem(body.dataDir, body.item, body.password)
}

export async function deleteItemEvent(body: any) {
  checkStandardArgs(body)
  if (body.code == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (typeof body.code != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  return deleteItem(body.dataDir, body.code, typeof body.setQuantity == 'number' ? body.setQuantity : null, body.password)
}

export async function makeTransactionEvent(body: any) {
  checkStandardArgs(body)
  if (body.transactionItems == undefined || body.adjustments == undefined || body.type == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (!Array.isArray(body.transactionItems)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  if (!Array.isArray(body.adjustments)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  if (!(body.type in TransactionTypes)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  for (let i = 0; i < body.transactionItems.length; i++)
    if (!instanceOfItem(body.transactionItems[i])) throw new AppError(AppErrorCodes.INVALID_ITEM)
  for (let i = 0; i < body.adjustments.length; i++)
    if (!instanceOfAdjustment(body.adjustments[i])) throw new AppError(AppErrorCodes.INVALID_ADJUSTMENT)
  return addTransaction(body.dataDir, body.transactionItems, body.adjustments, body.type, body.password)
}

export async function changePasswordEvent(body: any) {
  checkStandardArgs(body)
  if (body.newPassword == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (typeof body.newPassword != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
  changePassword(body.dataDir, body.password, body.newPassword)
}

export async function importDataEvent(body: any) {
  checkStandardArgs(body)
  if (body.items == undefined || body.transactions == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
  if (!instanceOfItems(body.items)) throw new AppError(AppErrorCodes.CORRUPT_ITEM_IN_JSON)
  if (!instanceOfTransactions(body.transactions)) throw new AppError(AppErrorCodes.CORRUPT_TRANSACTION_IN_JSON)
  importData(body.dataDir, body.password, body.items, body.transactions)
}