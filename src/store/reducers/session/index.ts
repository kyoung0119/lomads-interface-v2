import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
  return {
    selectedChainId: 5,
    web3AuthNetwork: "testnet",
    chain: "goerli",
    token: null,
    user: null
  };
}

const SessionReducer = (state: any = getInitialState(), action: any) =>
  produce(state, (draft: any) => {
    const { payload } = action;
    switch (action.type) {
      case actionTypes.SET_TOKEN_ACTION: {
        draft.token = payload?.token;
        break;
      }
      case actionTypes.SET_USER_ACTION: {
        draft.user = payload;
        break;
      }
      case actionTypes.SET_NETWORK_CONFIG : {
        draft.web3AuthNetwork = payload.web3AuthNetwork;
        draft.chain = payload.chain;
        draft.selectedChainId = payload.selectedChainId;
      }
    }
  });

export default SessionReducer;
