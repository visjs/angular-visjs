'use strict';

var ngVisApp = angular.module('ngVisApp', ['ngVis']);

ngVisApp.controller('appController', function ($scope, $location, $timeout) {

  $scope.count = 10000;

  $scope.logged = {};

  var now = moment().minutes(0).seconds(0).milliseconds(0);

  var items = new vis.DataSet({
    type: {start: 'ISODate', end: 'ISODate' }
  });

  function createData(value) {
    var count = parseInt(value) || 100;
    var newData = [];
    for (var i = 0; i < count; i++) {
      newData.push({id: i, content: 'item ' + i, start: now + 24 * 3600 * 1000 * i});
      // much much faster than now.clone add days
    }
    return newData;
  }

  $scope.setExample = function (example) {
    $scope.example = example;
    $location.hash(example);

    switch (example) {
      case 'basicUsage':
        items.clear();

        items.add([
          {id: 1, content: 'item 1', start: '2014-04-20'},
          {id: 2, content: 'item 2', start: '2014-04-14'},
          {id: 3, content: 'item 3', start: '2014-04-18'},
          {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
          {id: 5, content: 'item 5', start: '2014-04-25'},
          {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
        ]);

        $scope.data = items;

        $scope.options = {};
        break;

      case 'interactive':
        items.clear();

        items.add([
          {id: 1, content: 'item 1<br>start', start: '2014-01-23'},
          {id: 2, content: 'item 2', start: '2014-01-18'},
          {id: 3, content: 'item 3', start: '2014-01-21'},
          {id: 4, content: 'item 4', start: '2014-01-19', end: '2014-01-24'},
          {id: 5, content: 'item 5', start: '2014-01-28', type: 'point'},
          {id: 6, content: 'item 6', start: '2014-01-26'}
        ]);

        $scope.data = items;

        $scope.options = {
          start: '2014-01-10',
          end: '2014-02-10',
          orientation: 'top',
          height: '300px',
          editable: true,
          /* alternatively, enable/disable individual actions:
           editable: {
           add: true,
           updateTime: true,
           updateGroup: true,
           remove: true
           },
           */
          showCurrentTime: true
        };
        break;

      case 'aLotOfData':
        items.clear();
        items.add(createData());

        $scope.data = items;

        $scope.options = {
          editable: true,
          start: now.clone().add('days', -3),
          end: now.clone().add('days', 11),
          zoomMin: 1000 * 60 * 60 * 24,          // a day
          zoomMax: 1000 * 60 * 60 * 24 * 30 * 3  // three months
          //maxHeight: 300,
          //height: '300px',
          //orientation: 'top'
        };
        break;

      case 'htmlData':
        items.clear();

        items.add([
          {
            id: 1,
            content: '<div><i>item 1</i></div>',
            start: '2013-04-20'
          },
          {
            id: 2,
            content: '<div><span>item 2</span></div>',
            start: '2013-04-14'
          },
          {
            id: 3,
            content: '<div><span class="large">item 3</span></div>',
            start: '2013-04-18'
          },
          {
            id: 4,
            content: 'item <span class="large">4</span>',
            start: '2013-04-16',
            end: '2013-04-19'
          },
          {
            id: 5,
            content: '<div>item 5<br/><img src="bower_components/vis/examples/timeline/img/attachment-icon.png" style="width:48px; height:48px;" /></div>',
            start: '2013-04-25'
          },
          {
            id: 6,
            content: 'item6<br><img src="bower_components/vis/examples/timeline/img/comments-icon.png" style="width: 48px; height: 48px;">',
            start: '2013-04-27'
          },
          {
            id: 7,
            content: 'item7<br><a href="http://visjs.org" target="_blank">click here</a>',
            start: '2013-04-21'
          }
        ]);

        $scope.data = items;

        $scope.options = {};
        break;

      case 'eventListeners':
        items.clear();

        items.add([
          {id: 1, content: 'item 1', start: '2013-04-20'},
          {id: 2, content: 'item 2', start: '2013-04-14'},
          {id: 3, content: 'item 3', start: '2013-04-18'},
          {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
          {id: 5, content: 'item 5', start: '2013-04-25'},
          {id: 6, content: 'item 6', start: '2013-04-27'}
        ]);

        $scope.data = items;

        $scope.options = {
          editable: true
        };

        items.on('*', function (event, properties) {
          $timeout(function () {
            $scope.logged.items = {
              event: event,
              properties: properties
            };
          });
        });
        break;

      case 'customTimeBar':
        items.clear();
        items.add([]);
        $scope.data = items;

        $scope.options = {
          showCurrentTime: true,
          showCustomTime: true,
          start: new Date(Date.now() - 1000 * 60 * 60 * 24),
          end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6)
        };

        $scope.printCustomTime = function () {
          $scope.logged.customTime = $scope.timeline.methods.getCustomTime();
        };
        break;
    }
  };

  var view = ($location.hash()) ? ($location.hash()) : 'basicUsage';

  $scope.setExample(view);

  $scope.drawData = function () {
    $scope.data = createData($scope.count);
  };

  // $scope.methods = {}

  $scope.timeline = {
    events: {
      rangechange: function (properties) {
        $timeout(function () {
          $scope.logged.rangechange = properties;
        });
      },
      rangechanged: function (properties) {
        $timeout(function () {
          $scope.logged.rangechanged = properties;
        });
      },
      select: function (properties) {
        $timeout(function () {
          $scope.logged.select = properties;
        });
      },
      timechange: function (properties) {
        $timeout(function () {
          $scope.logged.timechange = properties;
        });
      },
      timechanged: function (properties) {
        $timeout(function () {
          $scope.logged.timechanged = properties;
        });
      }
    }
  }
});