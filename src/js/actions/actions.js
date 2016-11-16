var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');

var AppActions = {
    requestEndPoint: function(endpoint) {
      AppDispatcher.handleViewAction({
        actionType: AppConstants.REQUEST_END_POINT,
        data: endpoint
      })
    }
}



module.exports = AppActions
