var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');

// App Components

// React Class
var NavBar = React.createClass({
  render: function(){
    return (
      // navbar
      <div className="container">
        <div className="row">
          <div className="col-xs-12" className="col-md-12" className="col-lg-12">
            <div id="navbar">
              <nav className="navbar navbar-default">
                <div className="container-fluid">
                  <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                      <li><a href="#">Foo</a></li>
                      <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Bar<span class="caret"></span></a>
                        <ul className="dropdown-menu">
                          <li role="separator" className="divider"></li>
                          <li><a href="#">Foo</a></li>
                          <li role="separator" className="divider"></li>
                          <li><a href="#">Bar Toggle</a></li>
                          <li role="separator" className="divider"></li>
                          <li><a href="#">Baz</a></li>
                        </ul>
                      </li>
                      <li><a href="#">Baz</a></li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>   
          </div>
        </div>
      </div>
    )
  }
});

module.exports = NavBar;