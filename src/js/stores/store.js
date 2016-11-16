// Store
var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/constants');
var assign = require('object-assign');

var _data_array = [];


var AppStore = assign({}, EventEmitter.prototype, {
  getTheData: function(){
    return _data_array;
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
    this.loadComponentData(endpoint).done(function(result){

      _data_array.push(result);

      AppStore.emitChange(AppConstants.CHANGE_EVENT);
      return;
    })
  }
});

AppDispatcher.register(function(payload){
  // Filter by actionType
  switch(payload.action.actionType){
    case 'REQUEST_END_POINT':
      AppStore.requestEndpoint(payload.action.data);
  }
});

module.exports = AppStore;
