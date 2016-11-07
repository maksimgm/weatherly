var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');

// App Components

// React Class
var SearchResults = React.createClass({
  render: function(){
    return (
      // navbar
      <div className="container">
        <div className="row">
          <div className="col-xs-10 col-md-10 col-lg-10 col-xs-offset-1 col-md-offset-1 col-lg-offset-1" id="search-result-container">
          </div>
        </div>
      </div>
    )
  }
});

module.exports = SearchResults;