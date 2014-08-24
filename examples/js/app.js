'use strict';

var ngVisApp = angular.module('ngVisApp', ['ngVis']);

ngVisApp.controller('appController', function ($scope, $location, $timeout) {

  $scope.count = 10000;

  function createData(value) {
    var count = parseInt(value) || 100;
    var newData = [];
    for (var i = 0; i < count; i++) {
      newData.push({
        id: i,
        content: 'item ' + i,
        start: now + 24 * 3600 * 1000 * i // much much faster than now.clone add days
      });
    }
    return newData;
  }

  $scope.customTime = '2014-02-07';

  $scope.logged = {};

  var now = moment().minutes(0).seconds(0).milliseconds(0);

//  items.on('*', function (event, properties) {
//    $timeout(function () {
//      $scope.logged.items = {
//        event: event,
//        properties: properties
//      };
//    });
//  });

  $scope.drawData = function () {
    $scope.data = createData($scope.count);
  };

  $scope.getCustomTime = function () {
    $scope.logged.customTime = $scope.timeline.methods.getCustomTime();
  };

  $scope.setCustomTime = function (time) {
    $scope.timeline.methods.setCustomTime(time);
  };

  $scope.setWindow = function (periods) {
    $scope.timeline.methods.setWindow(periods.start, periods.end);
  };

  function zoom(percentage) {
    var range = $scope.timeline.methods.getWindow();
    var interval = range.end - range.start;

    $scope.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end: range.end.valueOf() + interval * percentage
    });
  }

  $scope.zoomIn = function () {
    zoom(-0.2);
  };

  $scope.zoomOut = function () {
    zoom(0.2);
  };

  function move(percentage) {
    var range = $scope.timeline.methods.getWindow();
    var interval = range.end - range.start;

    $scope.setWindow({
      start: range.start.valueOf() - interval * percentage,
      end: range.end.valueOf() - interval * percentage
    });
  }

  $scope.moveLeft = function () {
    move(0.2);
  };

  $scope.moveRight = function () {
    move(-0.2);
  };

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
  };

  var data,
    options;

  $scope.setExample = function (example) {
    $scope.example = example;
    $location.hash(example);

    switch (example) {
      case 'basicUsage':
        data = [
          {id: 1, content: 'item 1', start: '2014-04-20'},
          {id: 2, content: 'item 2', start: '2014-04-14'},
          {id: 3, content: 'item 3', start: '2014-04-18'},
          {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
          {id: 5, content: 'item 5', start: '2014-04-25'},
          {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
        ];
        options = {};
        break;

      case 'interactive':
        data = [
          {id: 1, content: 'item 1<br>start', start: '2014-01-23'},
          {id: 2, content: 'item 2', start: '2014-01-18'},
          {id: 3, content: 'item 3', start: '2014-01-21'},
          {id: 4, content: 'item 4', start: '2014-01-19', end: '2014-01-24'},
          {id: 5, content: 'item 5', start: '2014-01-28', type: 'point'},
          {id: 6, content: 'item 6', start: '2014-01-26'}
        ];
        options = {
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
        data = createData();
        options = {
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
        data = [
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
        ];
        options = {};
        break;

      case 'eventListeners':
        data = [
          {id: 1, content: 'item 1', start: '2013-04-20'},
          {id: 2, content: 'item 2', start: '2013-04-14'},
          {id: 3, content: 'item 3', start: '2013-04-18'},
          {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
          {id: 5, content: 'item 5', start: '2013-04-25'},
          {id: 6, content: 'item 6', start: '2013-04-27'}
        ];
        options = {
          editable: true
        };
        break;

      case 'customTimeBar':
        data = [];
        options = {
          showCurrentTime: true,
          showCustomTime: true,
          start: new Date(Date.now() - 1000 * 60 * 60 * 24),
          end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6)
        };
        break;

      case 'editItems':
        data = [
          {id: 1, content: 'item 1', start: new Date(2013, 3, 20)},
          {id: 2, content: 'item 2', start: new Date(2013, 3, 14)},
          {id: 3, content: 'item 3', start: new Date(2013, 3, 18)},
          {id: 4, content: 'item 4', start: new Date(2013, 3, 16), end: new Date(2013, 3, 19)},
          {id: 5, content: 'item 5', start: new Date(2013, 3, 25)},
          {id: 6, content: 'item 6', start: new Date(2013, 3, 27)}
        ];
        options = {
          editable: true,

          onAdd: function (item, callback) {
            item.content = prompt('Enter text content for new item:', item.content);

            if (item.content != null) {
              callback(item); // send back adjusted new item
            }
            else {
              callback(null); // cancel item creation
            }
          },

          onMove: function (item, callback) {
            if (confirm('Do you really want to move the item to\n' +
              'start: ' + item.start + '\n' +
              'end: ' + item.end + '?')) {
              callback(item); // send back item as confirmation (can be changed
            }
            else {
              callback(null); // cancel editing item
            }
          },

          onUpdate: function (item, callback) {
            item.content = prompt('Edit items text:', item.content);

            if (item.content != null) {
              callback(item); // send back adjusted item
            }
            else {
              callback(null); // cancel updating the item
            }
          },

          onRemove: function (item, callback) {
            if (confirm('Remove item ' + item.content + '?')) {
              callback(item); // confirm deletion
            }
            else {
              callback(null); // cancel deletion
            }
          }
        };
        break;

      case 'limitMoveAndZoom':
        data = [
          {'start': new Date(2012, 4, 25), 'content': 'First'},
          {'start': new Date(2012, 4, 26), 'content': 'Last'}
        ];
        options = {
          height: '300px',
          min: new Date(2012, 0, 1),                // lower limit of visible range
          max: new Date(2013, 0, 1),                // upper limit of visible range
          zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
          zoomMax: 1000 * 60 * 60 * 24 * 31 * 3     // about three months in milliseconds
        };
        break;

      case 'points':
        data = [
          {start: new Date(1939, 8, 1), content: 'German Invasion of Poland'},
          {start: new Date(1940, 4, 10), content: 'Battle of France and the Low Countries'},
          {start: new Date(1940, 7, 13), content: 'Battle of Britain - RAF vs. Luftwaffe'},
          {start: new Date(1941, 1, 14), content: 'German Afrika Korps arrives in North Africa'},
          {start: new Date(1941, 5, 22), content: 'Third Reich Invades the USSR'},
          {start: new Date(1941, 11, 7), content: 'Japanese Attack Pearl Harbor'},
          {start: new Date(1942, 5, 4), content: 'Battle of Midway in the Pacific'},
          {start: new Date(1942, 10, 8), content: 'Americans open Second Front in North Africa'},
          {start: new Date(1942, 10, 19), content: 'Battle of Stalingrad in Russia'},
          {start: new Date(1943, 6, 5), content: 'Battle of Kursk - Last German Offensive on Eastern Front'},
          {start: new Date(1943, 6, 10), content: 'Anglo-American Landings in Sicily'},
          {start: new Date(1944, 2, 8), content: 'Japanese Attack British India'},
          {start: new Date(1944, 5, 6), content: 'D-Day - Allied Invasion of Normandy'},
          {start: new Date(1944, 5, 22), content: 'Destruction of Army Group Center in Byelorussia'},
          {start: new Date(1944, 7, 1), content: 'The Warsaw Uprising in Occupied Poland'},
          {start: new Date(1944, 9, 20), content: 'American Liberation of the Philippines'},
          {start: new Date(1944, 11, 16), content: 'Battle of the Bulge in the Ardennes'},
          {start: new Date(1944, 1, 19), content: 'American Landings on Iwo Jima'},
          {start: new Date(1945, 3, 1), content: 'US Invasion of Okinawa'},
          {start: new Date(1945, 3, 16), content: 'Battle of Berlin - End of the Third Reich'}
        ];
        options = {
          // Set global item type. Type can also be specified for items individually
          // Available types: 'box' (default), 'point', 'range', 'rangeoverflow'
          type: 'point',
          showMajorLabels: false
        };
        break;

      case 'pastAndFuture':
        data = [
          {
            id: 1,
            start: new Date((new Date()).getTime() - 60 * 1000),
            end: new Date(),
            content: 'Dynamic event'
          }
        ];
        options = {
          showCurrentTime: true,
          showCustomTime: true
        };

        $scope.timeline.events.timechange = function (event) {
          $scope.logged.timechange = event.time;

          var item = items.get(1);

          if (event.time > item.start) {
            item.end = new Date(event.time);

            var now = new Date();

            if (event.time < now) {
              item.content = "Dynamic event (past)";
              item.className = 'past';
            }
            else if (event.time > now) {
              item.content = "Dynamic event (future)";
              item.className = 'future';
            }
            else {
              item.content = "Dynamic event (now)";
              item.className = 'now';
            }

            console.log('items before ->', items);
            items.update(item);
            console.log('items after ->', items);
          }
        };

        $timeout(function () {
          // set a custom range from -2 minute to +3 minutes current time
          $scope.setWindow({
            start: new Date((new Date()).getTime() - 2 * 60 * 1000),
            end: new Date((new Date()).getTime() + 3 * 60 * 1000)
          });
        });
        break;

      case 'aLotOfGroupedData':
        data = {
          groups: [
            {id: 0, content: 'First', value: 1},
            {id: 1, content: 'Third', value: 3},
            {id: 2, content: 'Second', value: 2}
          ],
          items: [
            {id: 0, group: 0, content: 'item 0', start: new Date(2014, 3, 17), end: new Date(2014, 3, 21)},
            {id: 1, group: 0, content: 'item 1', start: new Date(2014, 3, 19), end: new Date(2014, 3, 20)},
            {id: 2, group: 1, content: 'item 2', start: new Date(2014, 3, 16), end: new Date(2014, 3, 24)},
            {id: 3, group: 1, content: 'item 3', start: new Date(2014, 3, 23), end: new Date(2014, 3, 24)},
            {id: 4, group: 1, content: 'item 4', start: new Date(2014, 3, 22), end: new Date(2014, 3, 26)},
            {id: 5, group: 2, content: 'item 5', start: new Date(2014, 3, 24), end: new Date(2014, 3, 27)}
          ]
        };

        options = {
          // option groupOrder can be a property name or a sort function
          // the sort function must compare two groups and return a value
          //     > 0 when a > b
          //     < 0 when a < b
          //       0 when a == b
          groupOrder: function (a, b) {
            return a.value - b.value;
          },
          editable: true
        };
        break;

      case 'itemClassNames':
        data = [
          {
            'start': new Date(2012, 7, 19),
            'content': 'default'
          },
          {
            'start': new Date(2012, 7, 23),
            'content': 'green',
            'className': 'green'
          },
          {
            'start': new Date(2012, 7, 29),
            'content': 'red',
            'className': 'red'
          },
          {
            'start': new Date(2012, 7, 27),
            'end': new Date(2012, 8, 1),
            'content': 'orange',
            'className': 'orange'
          },
          {
            'start': new Date(2012, 8, 2),
            'content': 'magenta',
            'className': 'magenta'
          }
        ];
        options = {
          editable: true
        };
        break;

      case 'navigationMenu':
        data = [
          {id: 1, content: 'item 1', start: '2014-04-20'},
          {id: 2, content: 'item 2', start: '2014-04-14'},
          {id: 3, content: 'item 3', start: '2014-04-18'},
          {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
          {id: 5, content: 'item 5', start: '2014-04-25'},
          {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
        ];
        options = {};
        break;

      case 'dataSerialization':
//        $scope.serialized = [
//          {"id": 1, "content": "item 1<br>start", "start": "2014-01-23"},
//          {"id": 2, "content": "item 2", "start": "2014-01-18"},
//          {"id": 3, "content": "item 3", "start": "2014-01-21"},
//          {"id": 4, "content": "item 4", "start": "2014-01-19", "end": "2014-01-24"},
//          {"id": 5, "content": "item 5", "start": "2014-01-28", "type": "point"},
//          {"id": 6, "content": "item 6", "start": "2014-01-26"}
//        ];
//
//        items.clear();
//        items.add($scope.serialized);
//        // $scope.data = items;
//
//        $scope.options = {
//          editable: true
//        };
//
//        $scope.loadData = function () {
//          var data = items.get({
//            type: {
//              start: 'ISODate',
//              end: 'ISODate'
//            }
//          });
//
//          $scope.serialized = JSON.stringify(data, null, 2);
//        };
//
//        $scope.saveData = function () {
//          var txtData = document.getElementById('data');
//          var data = JSON.parse(txtData.value);
//
//          items.clear();
//          items.update(data);
//
//          // adjust the timeline window such that we see the loaded data
//          // timeline.fit();
//
//          // items.clear();
//          // items.add($scope.serialized);
//          // $scope.data = items;
//        };
//
//        // $scope.loadData();
        break;
    }

    $scope.data = data;
    $scope.options = options;
  };

  $scope.setExample($location.hash() || 'basicUsage');
});