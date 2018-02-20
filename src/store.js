import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage'
// import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from './reducers' // where reducers is an object of reducers

const config = {
  key: 'root',
  whitelist: [
    'account',
    'accounts',
    'preferences',
  ],
  storage,
}

const reducer = persistCombineReducers(config, reducers)

export function configureStore(initialState) {
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });
  middleware.push(logger);

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      // actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);
  const store = createStore(reducer, initialState, enhancer);
  const  persistor = persistStore(store)
  return { persistor, store }
}

// export default { configureStore };

// const configureStore = (initialState: ?accountStateType) => {
//   // Redux Configuration
//   const middleware = [];
//   const enhancers = [autoRehydrate()];
//
//   // Thunk Middleware
//   middleware.push(thunk);
//
//   // Logging Middleware
//   const logger = createLogger({
//     level: 'info',
//     collapsed: true
//   });
//   middleware.push(logger);
//
//   // Router Middleware
//   const router = routerMiddleware(history);
//   middleware.push(router);
//
//   // Redux DevTools Configuration
//   const actionCreators = {
//     ...accountActions,
//     ...routerActions,
//   };
//   // If Redux DevTools Extension is installed use it, otherwise use Redux compose
//   /* eslint-disable no-underscore-dangle */
//   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
//       actionCreators,
//     })
//     : compose;
//   /* eslint-enable no-underscore-dangle */
//
//   // Apply Middleware & Compose Enhancers
//   enhancers.push(applyMiddleware(...middleware));
//   const enhancer = composeEnhancers(...enhancers);
//
//   // Create Store
//   const store = createStore(rootReducer, initialState, enhancer);
//
//   if (module.hot) {
//     module.hot.accept('../reducers', () =>
//       store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
//     );
//   }
//
//   return store;
// };
