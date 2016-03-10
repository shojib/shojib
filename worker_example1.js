var App = angular.module('App', []);
App.factory("Factory", function($http) {
  var url ='http://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=20000101&end_date=20140214&sort=newest&fl=headline%2Clead_paragraph%2Cweb_url%2Cmultimedia%2Cpub_date&page=100&api-key=5445ed010346db7ab31fc33e55049350:8:68807489';
  return {
      get: function() {
        return $http.get(url);
      },
    getWorker: function() {
      this.onmessage = function(e) {
        postMessage([0,1,2,3,4,5,6,7,8,9,10]);
      };
    }      
  };
});
App.service("WorkerService", function() {
  function WorkerService(factory) {
    this.worker = null;
    this.factory = null;
    this.isWorker = window.Worker ? true : false;
    this.isURL = (window.URL || window.webkitURL) ? true : false;
  }
  WorkerService.prototype = {
    create: function(factory) {
      var blob = new Blob(['('+factory.getWorker.toString()+')()']);
      if (this.isWorker && this.isURL) {
        var url = window.URL.createObjectURL(blob);
        var worker = new Worker(url);
        worker.onerror = this.errorHandler;   
        return {
         then: function(callback) {
          worker.onmessage = function(e) {
            callback(e);
          };
          worker.postMessage([]);
           return this;
         },
          error: function() {
           return this;
         }
        };
       } else {
         return {
         then: function() {
           return this;
         },
          error: function(callback) {
           callback(factory);
           return this;
         }
        };
      }         
    },
    stop: function() {
      this.worker.terminate();
    },
    errorHandler: function(e) {}
  };
  return WorkerService;
});

  
App.controller('Ctrl', function($scope, WorkerService, Factory) {
  var workerService = new WorkerService();
  workerService.create(Factory)
    .then(function(e) {
    $scope.nums = e.data;
    $scope.$digest();
    })
    .error(function(factory) {
    console.log(factory)
  });
  Factory.get().then(function(data) {
    $scope.articles = data;
    $scope.$digest();
  });
});
