'use strict'

const { crypto } = require('@arkecosystem/client')

const container = require('@arkecosystem/core-container')
const config = container.resolvePlugin('config')
const state = container.resolvePlugin('blockchain').getState()

const { Transaction } = require('@arkecosystem/client').models

/**
 * Turns a "transaction" object into a generic object.
 * @param  {Object} model
 * @return {Object}
 */
module.exports = (model) => {
  const lastBlock = state.lastBlock
  const data = Transaction.deserialize(model.serialized.toString('hex'))

  return {
    id: data.id,
    blockid: model.blockId,
    type: data.type,
    timestamp: data.timestamp,
    amount: data.amount,
    fee: data.fee,
    recipientId: data.recipientId,
    senderId: crypto.getAddress(data.senderPublicKey, config.network.pubKeyHash),
    senderPublicKey: data.senderPublicKey,
    signature: data.signature,
    asset: data.asset,
    confirmations: lastBlock ? lastBlock.data.height - model.block.height : 0
  }
}
