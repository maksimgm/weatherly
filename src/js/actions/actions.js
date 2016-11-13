var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');

var AppActions = {
    loadComponentData: function(){
      AppDispatcher.handleViewAction({
        actionType: AppConstants.LOAD_COMPONENT_DATA,
        data: 'http://api.wunderground.com/api/116a8410f0ee9229/conditions/q/CA/San_Francisco.json'
      });
    },
    requestEndPoint: function(endpoint) {
      AppDispatcher.handleViewAction({
        actionType:AppConstants.REQUEST_END_POINT,
        data: endpoint
      })
    },
    submitTodoForm: function(todo){
      AppDispatcher.handleViewAction({
        actionType:AppConstants.SUBMIT_TODO_FORM,
        data: todo
      })
    },
    deleteTodo: function(todo){
      AppDispatcher.handleViewAction({
        actionType:AppConstants.DELETE_TODO,
        data: todo
      })
    },
    updateTodo: function(todo){
      AppDispatcher.handleViewAction({
        actionType:AppConstants.UPDATE_TODO,
        data: todo
      })
    }
}



module.exports = AppActions
