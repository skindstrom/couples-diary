import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRedirect } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import { buildUserFromToken } from './src/utils/jwt'

import reducers from './src/utils/reducers'
import LoginFormContainer from './src/features/login/LoginFormContainer'
import MonthContainer from './src/features/month/MonthContainer'

let store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)))

function App(props) {
  return (<div>{props.children}</div>)
}

let isTrapped = false
function requireAuth(nextState, replace) {
  if (!buildUserFromToken() && !isTrapped) {
    isTrapped = true
    replace({
      pathname: '/login',
      state: {nextPathName: nextState.location.pathname}
    })
  } 
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App} onEnter={requireAuth}>
        <IndexRedirect to='/diary'/>
        <Route path='/diary' component={MonthContainer}/>
        <Route path='/login' component={LoginFormContainer}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)