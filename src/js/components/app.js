var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');


// App Components
var NavBar = require('./nav-bar.js');
var SearchBar = require('./search-bar.js');
var SearchResults = require('./search-results.js');

// React Class
var TopLevelComponent = React.createClass({
  render: function(){
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

