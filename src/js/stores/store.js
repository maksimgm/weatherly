// Store
var AppActions = require('../actions/actions');
var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/constants');
var assign = require('object-assign');

var _trend_colors = [
  ["A63494", false],
  ["98A634", false],
  ["FE7202", false],
  ["D3B5E0", false],
  ["72686D", false],
  ["8C6A0E", false],
  ["2C6BA2", false],
  ["2CA0A2", false]
];

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
  pickColor: function() {
    // Loop through the _trend_colors object
    // Find a color that hasn't been used (false), and then mark it as having been used (true)
    
    var color;

    for (var i=0; i < _trend_colors.length; i++){
      // If you're at the end of the array...
      if (i == _trend_colors.length - 1) {
        // ...reset everything back to false
        for (var i=0; i < _trend_colors.length; i++){
          _trend_colors[i][1] = false;
        }
        // ...besides the first color, which you will now use
        _trend_colors[0][1] = true;
        color = _trend_colors[0][0];
        break;
      }
      
      // Check for unused color, then mark it as used
      if (_trend_colors[i][1] == false){
        _trend_colors[i][1] = true;
        color = _trend_colors[i][0];
        break;
      }
    }

    return color;
  },
  spliceData: function(index, howmany) {
    _component_data.splice(index, howmany);
    this.emitChange(AppConstants.CHANGE_EVENT);
  },
  requestStatsForTagName: function(endpoint) {
    // Query the /bq/stats endpoint for statistics about that tag name


  },
  splitUrlIntoComponents: function(endpoint) {
    // Splits the URL into it's different components 
    // and returns those components as named items in an object

    // Split up the endpoint into key val pairs
    var query_string = endpoint.split("?");
    var query_params = query_string[1].split("&");

    // Get from DateTime
    var url_from_dateTime = query_params[0].split("=");
    var from_dateTime = url_from_dateTime[1];

    // Get to DateTime
    var url_to_dateTime = query_params[1].split("=");
    var to_dateTime = url_to_dateTime[1];

    // Get tag name
    var url_tag_name = query_params[2].split("=");
    var tag_name = url_tag_name[1];

    // Get was downsampled - false for now, until we decide to implement
    var url_was_downsample = query_params[3].split("=");
    var was_downSampled = false;

    // Build the object with contextual data
    var data_with_contextual_info = {
      "endpoint": endpoint,
      "tag_name": tag_name,
      "from_dateTime": from_dateTime,
      "to_dateTime": to_dateTime,
      "was_downSampled": was_downSampled
    };

    return data_with_contextual_info;

  },
  buildEndpointFromComponents: function (components){
    // Build an endpoint with the parameters you want to query
    var endpoint =  'http://8.34.215.28:8080' + // Change qualifier here
                    '/bq/display?start=' + 
                    components['from_dateTime'] + // e.g. 2015-08-08T13:00:00Z
                    '&end=' + 
                    components['to_dateTime'] + // e.g. 2015-08-08T13:42:00Z
                    '&tag=' + //e.g. [SUMMITVILLE_MINE]FLOW_TO_MIXING_TANK_SCL
                    components['tag_name'] + 
                    '&buckets=0';

    return endpoint;
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
    case 'REQUEST_END_POINT':
      AppStore.routeRequest(payload.action.data);
  }
});

module.exports = AppStore;
