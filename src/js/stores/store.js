// Store
var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/constants');
var assign = require('object-assign');

var _data_array = [];
var tenDayForecast={};

var AppStore = assign({}, EventEmitter.prototype, {
  getTheData: function(){
    return tenDayForecast;
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
  loadComponentData: function(endpoint){
    return $.ajax(endpoint, {
        dataType: 'json',
        success: function(data) {
        }.bind(this)
    });
  },
  requestEndpoint: function(endpoint) {
    this.loadComponentData(endpoint)
      .done(function(result){
        storeData(result);
        
        // storeData();
        // console.log(_data_array);
        AppStore.emitChange(AppConstants.CHANGE_EVENT);
        return;
    });
  },
});

  function storeData(result){
    var i = 1;
    while(i<11){
      
      _data_array.push(tenDayForecast[result.forecast.txt_forecast.forecastday[i]['title']]);
      // _data_array.push(result.forecast.txt_forecast.forecastday[i]['fcttext']);
      // _data_array.push(result.forecast.txt_forecast.forecastday[i]['fcttext']);
      i++;
    }
    
    
  }

AppDispatcher.register(function(payload){
  // Filter by actionType
  switch(payload.action.actionType){
    case 'REQUEST_END_POINT':
      AppStore.requestEndpoint(payload.action.data);
  }
});

module.exports = AppStore;
