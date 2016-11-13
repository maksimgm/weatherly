var React = require('react');
var ReactDOM = require('react-dom');

// App Components
var TopLevelComponent = require('./components/app.js');

ReactDOM.render(
    <TopLevelComponent />,
  document.getElementById('main')
);
