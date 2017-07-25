import React, {Component} from 'react';
import ReactDOM from 'react-dom';

let notListened = true

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
        this.props.callback(state ? state.path : null)
      })
      notListened = false
    }
  }
  handleClick = (event) => {
    const {title, to, callback} = this.props
    const stateObj = {
      path:to
    }
    history.pushState(stateObj, title, to);
    callback(to)
  }
  render(){
    const {to} = this.props
    return <button onClick={this.handleClick}>{to}</button>
  }
}

const Hello = ({path}) => {
  return (
    <div>Hello at: {path}</div>
  )
}

const About = ({path}) => {
  return (
    <div>About at: {path}</div>
  )
}

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
        <Link to='/test/hello' callback={this.callback}></Link>
        <br/>
        <Link to='/test/about' callback={this.callback}></Link>
        <Route path='/test/hello' currentPath={this.state.path}>
          <Hello></Hello>
        </Route>
        <Route path='/test/about' currentPath={this.state.path}>
          <About></About>
        </Route>
      </div>
    )
  }
}
ReactDOM.render(
  <App/>, document.getElementById( 'app' ))

export default App
