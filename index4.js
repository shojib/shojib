var App = angular.module('App', []);
App.factory("Factory", function() {
	return {
      get: function() {
        return [0,1,2,3,4,5,6,7,8,9,10];
      },
  	getWorker: function() {
      function HttpClient(Url) {
        HttpRequest = new XMLHttpRequest();
        HttpRequest.onreadystatechange = function () {
        if (HttpRequest.readyState == 4 && HttpRequest.status == 200) {
                console.log(HttpRequest.responseText.length);
                postMessage(HttpRequest.responseText);
            }              
        }        
        HttpRequest.open("GET", Url, true);
        HttpRequest.send(null);
    }

      this.onmessage = function(e) {
        HttpClient('http://api.nytimes.com/svc/search/v2/articlesearch.json?q=economy&begin_date=20160101&end_date=20160311&sort=newest&fl=headline%2Clead_paragraph%2Cweb_url%2Cmultimedia%2Cpub_date&page=100&api-key=5445ed010346db7ab31fc33e55049350:8:68807489');
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
    $scope.articles = JSON.parse(e.data).response.docs;
    console.log(JSON.parse(e.data).response.docs);
    $scope.$digest();
    })
    .error(function(factory) {
    console.log(factory)
  });
  window.ws = workerService;
});
