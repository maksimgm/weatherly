// Store
var AppActions = require('../actions/actions');
var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/constants');
var assign = require('object-assign');

var _component_data = [];

var _percentiles = {
  "low_percentile": 0,
  "high_percentile": 100
};

var AppStore = assign({}, EventEmitter.prototype, {
  getTheData: function() {
    return _component_data;
  },
  getPercentiles: function() {
    return _percentiles;
  },
  emitChange: function(change) {
    this.emit(change);
  },
  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },
  removeAllTrends: function() {
    // Remove all signals from UI
    for (var i=0; i<_component_data.length; i++) {
      d3.select('.trend' + i).remove();
    }
  },

  spliceData: function(index, howmany) {
    _component_data.splice(index, howmany);
    this.emitChange(AppConstants.CHANGE_EVENT);
  },
  requestStatsForTagName: function(endpoint) {
    // Query the /bq/stats endpoint for statistics about that tag name


  },

  requestEndpointRefreshAll: function(query_params) {
    // All signals need to be in the same time range, so 
    // we have to resubmit the queries for any signal on the page
    // with the date range of the latest signal being requested
    // by the user
    
    // So we request the first signal
    // this.requestEndpoint(query);

    // And now we loop through all the other signals in the tmp_data array and
    // change their start and end times to be the same as the signal the User just requested
    // TODO: Check that it isn't updating the item that was just queried
    
    _component_data.map(function(d, i){
      var url_components = AppStore.splitUrlIntoComponents(d['endpoint']);
      
      // Adjust the url components
      url_components['from_dateTime'] = query_params['from_dateTime'];
      url_components['to_dateTime'] = query_params['to_dateTime'];
      
      // Build the url out of the url components
      d['endpoint'] = AppStore.buildEndpointFromComponents(url_components);
      
      // And update the rest of the tags in the object
      d['from_dateTime'] = query_params['from_dateTime'];
      d['to_dateTime'] = query_params['to_dateTime'];

      // Replace the item in the main data array with the new datetimes
      _component_data[i] = d;
    });

    // Build a new signal item from the request
    var query = this.buildEndpointFromComponents(query_params);
    
    // So we request the first signal
    this.requestEndpoint(query);

    // Re-call every query in the main data array besides the last (newest) one 
    // which has just been called
    _component_data.map(function(d, i){
        AppStore.requestEndpoint(d['endpoint'], true, i);
    });
    // for (var i=0; i < _component_data.length; i++){
    //   AppStore.requestEndpoint(_component_data[i]['endpoint'], true, i);
    // }

  },
  loadComponentData: function(endpoint){
    // Retrieve sample data from a text file
    return $.ajax(endpoint, {
        // For text file, use: ./static/js/components/sample-data.txt
        dataType: 'text',
        success: function(data) {
        }.bind(this)
    });
  },
  requestEndpoint: function(endpoint, replace, array_index) {
    this.loadComponentData(endpoint).done(function(result){
      
      // By adding contextual data, we enable multiple components (e.g. trend viewer, table)
      // to have access to the same information for the same trend, which enables functionality
      // and joint communitcation

      // Split the endpoint (ep) into contextual components
      var data_with_contextual_info = AppStore.splitUrlIntoComponents(endpoint);

      // Fill the object with the result data
      data_with_contextual_info['data'] = result;

      // Check if tag already exists in main data array. If it does, simply
      // replace its information with the result from the query.
      var tag_exists = false;
      var tag_exists_index;
      var tag_exists_color;

      _component_data.map(function(d, i){
        if (d['tag_name'] == data_with_contextual_info['tag_name']) {
          tag_exists = true;
          tag_exists_index = i;
          tag_exists_color = d['color'];
        }
      });

      // If the signal already exists in the UI, then refresh it with the new
      // requested data, but don't change its color and don't add a new signal for it
      if (tag_exists == true) {
        // Add the object with contextual info to the main data array
        data_with_contextual_info['color'] = tag_exists_color;
        _component_data[tag_exists_index] = data_with_contextual_info;
      } else {
        // Pick a color for the signal
        var color = AppStore.pickColor();
        data_with_contextual_info['color'] = color;

        // Add the object with contextual info to the main data array
        if (replace == true) {
          _component_data[array_index] = data_with_contextual_info;
        } else {
          _component_data.push(data_with_contextual_info);
        }
      }

      // Emit a change to refresh the UI (i.e. render)
      AppStore.emitChange(AppConstants.CHANGE_EVENT);
      return;
    })
  },
  routeRequest: function(query_params) {
    // If percentile text boxes weren't left empty, set percentiles to the
    // values that the user specified in the sidebar
    if (query_params['low_percentile'] !== "") {
      _percentiles['low_percentile'] = query_params['low_percentile'];
    }
    if (query_params['high_percentile'] !== "") {
      _percentiles['high_percentile'] = query_params['high_percentile'];
    }

    // If there aren't any signals stored in the main data array, just process this request
    if (_component_data.length == 0) {
      var query = this.buildEndpointFromComponents(query_params);
      this.requestEndpoint(query);
      return;
    } else {
      this.requestEndpointRefreshAll(query_params);
      return;
    }
  }
});

AppDispatcher.register(function(payload){
  // Filter by actionType
  switch(payload.action.actionType){
    case 'loadComponentData':
      AppStore.loadComponentData(payload.action.data);
  }
});

module.exports = AppStore;
