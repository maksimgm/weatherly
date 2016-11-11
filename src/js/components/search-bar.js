var React = require('react');

// Flux stuff
var AppActions = require('../actions/actions');
var AppStore = require('../stores/store');

// App Components

// React Class
var SearchBar = React.createClass({
  sayHello: function(){
    console.log('Hello There');
  },
  
  sayGoodbye: function(msg){
    console.log(msg);
  },

  render: function(){
    return (
      // navbar
      <div className="container">
        <div className="row">
          <div className="col-xs-12" className="col-md-12" className="col-lg-12">
            <div id="search-container" className="col-xs-12 col-md-12 col-lg-12">
              <form className="form-search form-inline">
                  <input type="text" className="search-query" placeholder="Search..." />
              </form>
              <button onClick={this.sayHello} type="submit" className="btn-default btn-primary">Submit</button>

              <button onClick={this.sayGoodbye.bind(this, 'goodbye')} type="submit" className="btn-default btn-danger">Fail</button>
            </div>
          </div>   
        </div>
      </div>
    )
  }
});

module.exports = SearchBar;