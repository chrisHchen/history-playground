import React, {Component} from 'react';
import ReactDOM from 'react-dom';

let notListened = true
let currentActiveIndex = 0
let historyList = []
const pushHistory = function(state){
  if(currentActiveIndex == historyList.length - 1){
    historyList.push(state)
  }else{
    historyList.splice(currentActiveIndex + 1, historyList.length - currentActiveIndex, state)
  }
}

const replaceHistory = function(state){
  historyList.splice(currentActiveIndex, 1, state)
}

const findCurrentHistoryIndex = function(state){
  if(!state) return currentActiveIndex = 0
  historyList.some((h, index) => {
    if(h.id == state.id){
      currentActiveIndex = index
      return true
    }
  })
}

class Route extends Component{
  constructor(props){
    super(props)
  }

  render(){
    const {
      children,
      path,
      currentPath
    } = this.props

    return path === currentPath ?
      React.cloneElement(children,{
        path:path
      }) : null
  }
}

class Link extends Component{
  componentWillMount(){
    if(notListened){
      window.addEventListener('popstate', (event) => {
        const state = event.state
        findCurrentHistoryIndex(state)
        this.props.callback(state ? state.path : null)
      })
      notListened = false
    }
  }
  handleClick = (event) => {
    event.preventDefault()
    const {title, to, callback, replace} = this.props
    const stateObj = {
      path:to,
      id: Date.now()
    }
    if(replace){
      history.replaceState(stateObj, title, to);
      replaceHistory(stateObj)
    }else{
      history.pushState(stateObj, title, to);
      pushHistory(stateObj)
    }
    findCurrentHistoryIndex(stateObj)
    callback(to)
  }
  render(){
    const {children} = this.props
    return (
      <a href="" onClick={this.handleClick}>{children}</a>
    )
  }
}

const generateComp = (name) => {
  return ({path}) => {
    return <div>{name} at:{path}</div>
  }
}

const Home = generateComp('Home')
const About = generateComp('About')
const Hello = generateComp('Hello')
const Welcome = generateComp('Welcome')

class App extends Component{
  state = {
    path:''
  }
  componentWillMount(){
    const path = window.location.pathname
    this.setState({
      path:path
    })
  }

  callback = (to) => {
    this.setState({
      path:to
    })
  }

  render(){
    return (
      <div>
        <Link to='/test/hello' callback={this.callback}>Hello</Link>
        <br/>
        <Link to='/test/about' callback={this.callback}>About</Link>
        <br/>
        <Link to='/test/welcome' callback={this.callback} replace>Welcome(replace)</Link>
        <br/>
        <Link to='/test/home' callback={this.callback}>Home</Link>
        <Route path='/test/hello' currentPath={this.state.path}>
          <Hello></Hello>
        </Route>
        <Route path='/test/about' currentPath={this.state.path}>
          <About></About>
        </Route>
        <Route path='/test/welcome' currentPath={this.state.path}>
          <Welcome></Welcome>
        </Route>
        <Route path='/test/home' currentPath={this.state.path}>
          <Home></Home>
        </Route>
        <br/>
        <br/>
        <h2>History List</h2>
        {
          historyList.map((h, index) => <div style={{color:currentActiveIndex == index ? 'red':'black'}} key={h.id}>{h.path}</div>)
        }
      </div>
    )
  }
}
ReactDOM.render(
  <App/>, document.getElementById( 'app' ))

export default App
