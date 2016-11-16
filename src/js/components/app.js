var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');


// App Components
var NavBar = require('./nav-bar.js');
var SearchBar = require('./search-bar.js');
var SearchResults = require('./search-results.js');

function getStateData(){
  return AppStore.getTheData();
}

// React Class
var TopLevelComponent = React.createClass({
  getInitialState: function() {
    return {data: getStateData()};
  },
  componentDidMount: function(){
    AppStore.addChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState({data: getStateData()});
  },
  render: function(){
    var data = this.state.data;
    var uv = data[0];
    console.log(uv);
    
    return (
      <div className="container-fluid">
        <NavBar />
        <SearchBar />
        <SearchResults />
        
      </div>
    )
  }
});

module.exports = TopLevelComponent;

