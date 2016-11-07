var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');

// App Components

// React Class
var TopLevelComponent = React.createClass({
  getInitialState: function() {
    var data = {data: [1, 2, 3]}
    return data;
  },
  render: function(){
    return (
      <div className="container-fluid">
        <h1>{this.state.data}</h1>
      </div>
    )
  }
});

module.exports = TopLevelComponent;

