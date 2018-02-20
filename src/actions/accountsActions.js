import * as types from './actionTypes';
import steem from 'steem'
import store from 'store'
import Noty from 'noty'

export function removeAccount() {
  return {
    type: types.ACCOUNTS_REMOVE
  }
}

export function removeAccounts() {
  return {
    type: types.ACCOUNTS_REMOVE_ALL
  }
}

export function addAccount(account, key, data) {
  let payload = {
    account: account,
    key: key,
    data: data
  }
  return {
    type: types.ACCOUNTS_ADD,
    payload: payload
  }
}

// export functions swapAccount(account, key)
