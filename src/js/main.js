var React = require('react');
var ReactDOM = require('react-dom');

// App Components
var NavBar = require('./components/nav-bar.js');
var SearchBar = require('./components/search-bar.js');
var SearchResults = require('./components/search-results.js');

ReactDOM.render(
  <div>  
    <NavBar />,
    <SearchBar />,
    <SearchResults />,
  </div>,
  document.getElementById('main')
);
