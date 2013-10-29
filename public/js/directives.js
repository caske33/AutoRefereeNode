var App = window.app;

App.directive('ngTimeDifference', function($timeout, dateFilter) {
  // return the directive link function. (compile function not needed)
  return function(scope, element, attrs) {
    var startTime, // the time to start the difference
        endTime, // time to stop the difference
        now,
        timeoutId; // timeoutId, so that we can cancel the time updates

    // used to update the UI
    function updateTime() {
      if(now)
        endTime = new Date();

      var diff = (endTime - startTime);
      diff = Math.floor(diff/1000);

      negative = false;
      if(diff < 0){
        negative = true;
        diff = -diff;
      }

      var seconds = diff % 60;
      diff = Math.floor(diff/60);
      var minutes = diff % 60;
      hours = Math.floor(diff/60);

      text = " ";
      if(negative)
        text += "-";
      element.text(text + (hours !== 0 ? (hours +  " hours, ") : "") + minutes +" minutes, " + seconds + " seconds ");
    }

    // watch the expression, and update the UI on change.
    scope.$watch(attrs.ngStartTime, function(value) {
      startTime = new Date(value);
      updateTime();
    });

    scope.$watch(attrs.ngEndTime, function(value){
      if(value === "now")
        now = true;
      else{
        now = false;
        endTime = new Date(value);
      }
    });

    // schedule update in one second
    function updateLater() {
      // save the timeoutId for canceling
      timeoutId = $timeout(function() {
        updateTime(); // update DOM
        updateLater(); // schedule another update
      }, 1000);
    }

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time after the DOM element was removed.
    element.on('$destroy', function() {
      $timeout.cancel(timeoutId);
    });

    updateLater(); // kick off the UI update process.
  };
});