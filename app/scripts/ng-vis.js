'use strict';

// 1. Make filters from range indicators
// 2. Implement a controller for directive
// 3. Take data processing functions into the controller
// 4. Implement $destroy event catchers for directive element and scope
// 5. Supply callbacks via their own functions
// 6. Give an object back which holds information about timeline itself

angular.module('ngVis', []).


  constant(
  'options', {

    orientation: 'bottom',
    direction: 'horizontal', // 'horizontal' or 'vertical'
    autoResize: true,
    stack: true,

    editable: {
      updateTime: false,
      updateGroup: false,
      add: false,
      remove: false
    },

    selectable: true,
    snap: null, // will be specified after timeaxis is created

    min: null,
    max: null,
    zoomMin: 10,                                // milliseconds
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 10000, // milliseconds
    // moveable: true, // TODO: option moveable
    // zoomable: true, // TODO: option zoomable

    showMinorLabels: true,
    showMajorLabels: true,
    showCurrentTime: false,
    showCustomTime: false,

    type: 'box',
    align: 'center',
    margin: {
      axis: 20,
      item: 10
    },
    padding: 5,


    debug: false,
    // align: 'center',
    // autoResize: true,
    // editable: true,
    start: null,
    end: null,
    height: null,
    width: '100%',
    //    margin: {
    //      axis: 20,
    //      item: 10
    //    },
    //    min: null,
    //    max: null,
    maxHeight: null,
    //    orientation: 'bottom',
    //    padding: 5,
    //    selectable: true,
    //    showCurrentTime: true,
    //    showCustomTime: true,
    //    showMajorLabels: true,
    //    showMinorLabels: true,
    //    type: 'box', // dot | point
    //    zoomMin: 1000,
    //    zoomMax: 1000 * 60 * 60 * 24 * 30 * 12 * 10,
    groupOrder: 'content'
  }).


  factory(
  'Moment',
  function ()
  {
    return vis.moment()
  }).


  factory(
  'process',
  [
    'options',
    function (options)
    {
      var items,
          groups;

      items = new vis.DataSet(
        {
          convert: {
            start: 'Date',
            end: 'Date'
          }
        }
      );

      groups = new vis.DataSet();

      return function (data)
      {
        items.clear();
        groups.clear();

        var _data = {};

        items.on(
          '*',
          function (event, properties)
          {
            if (options.debug)
            {
              console.log('event=' + angular.toJson(event) + ', ' + 'properties=' + angular.toJson(properties));
            }
          }
        );

        if (angular.isArray(data))
        {
          items.add(data);
        }
        else
        {
          var id = 0;

          angular.forEach(
            data,
            function (_items, _group)
            {
              groups.add(
                {
                  id: id,
                  content: _group
                }
              );

              angular.forEach(
                _items,
                function (item)
                {
                  var _item = {
                    id: item.id,
                    group: id,
                    content: item.content,
                    start: item.start
                  };

                  if (item.hasOwnProperty('end'))
                  {
                    _item.end = item.end;
                  }

                  items.add(_item);
                }
              );

              id ++;
            }
          );

          _data.groups = groups;
        }

        _data.items = items;

        return _data;
      }
    }
  ]).


  directive(
  'timeline',
  [
    'options',
    'process',
    function (options, process)
    {
      return {
        restrict: 'EA',
        replace: true,
        transclude: true,
//        scope: {
//          data: '=',
//          options: '=',
//          timeline: '='
//        },

        controller: function (Moment)
        {
          // console.log('Moment ->', Moment);
        },

        link: function (scope, element, attrs)
        {
          angular.element(element[0]).html('');

          var _timeline = {};

          //          var callbacks = {
          //            onAdd: scope.timeline.slot.add,
          //            onMove: scope.timeline.slot.move,
          //            onUpdate: scope.timeline.slot.update,
          //            onRemove: scope.timeline.slot.remove
          //          };
          //
          //          angular.extend(options, callbacks);

          _timeline = new vis.Timeline(element[0]);

          scope.$watch(
            'data',
            function (data)
            {
              // console.log('data changed!');

              _timeline.clear();

              var _data = process(data);

              if (_data.hasOwnProperty('groups'))
              {
                _timeline.setGroups(_data.groups);
              }
              else
              {
                _timeline.setGroups(null);
              }

              _timeline.setItems(_data.items);

              // console.log('timeline ->', _timeline);

            }, true);

          scope.$watch(
            'options',
            function (_options)
            {
              // console.log('options changed!');

              if (_options.defaults)
              {
                _timeline.clear({options: true});

                // _timeline.setOptions(options);
                // _timeline.setOptions({start: null, end: null});

                // console.log('coming to defaults!');
              }
              else
              {
                // var opts = angular.extend(angular.extend({}, _options), options);
                _timeline.setOptions(_options);
                // _timeline.setWindow(_options.start, _options.end);
                // console.log('setting custom options!');
              }
            }
          );

          angular.extend(
            scope.timeline,
            {
              customDate: _timeline.getCustomTime(),

              setOptions: function (options) { _timeline.setOptions(options) },

              getSelection: function () { return _timeline.getSelection() },

              setSelection: function (selection) { return _timeline.setSelection(selection) },

              getWindow: function () { return _timeline.getWindow() },

              setWindow: function (start, end) { return _timeline.setWindow(start, end) },

              getCustomTime: function () { return _timeline.getCustomTime() },

              setCustomTime: function (time)
              {
                _timeline.setCustomTime(time);

                this.customDate = _timeline.getCustomTime();
              }
            });

          _timeline.on('rangechange', function (period) { scope.timeline.rangeChange(period) });
          _timeline.on('rangechanged', function (period) { scope.timeline.rangeChanged(period) });
          _timeline.on('select', function (selected) { scope.timeline.select(selected) });
          _timeline.on('timechange', function (period) { scope.timeline.timeChange(period) });
          _timeline.on('timechanged', function (period) { scope.timeline.timeChanged(period) });
        }
      }
    }
  ]).


  directive(
  'timeNav', [
    function ()
    {
      return {
        restrict: 'E',
        replace: false,
//        scope: {
//          timeline: '='
//        },
        controller: function ($scope)
        {
          var start = 0;

          $scope.timeline.setScope = function (scope)
          {
            $scope.timeline.scope = {
              day: false,
              week: false,
              month: false,
              year: false,
              custom: false
            };

            $scope.timeline.scope[scope] = true;

            if (scope != 'custom')
            {
              $scope.timeline.setWindow(
                vis.moment().startOf(scope),
                vis.moment().endOf(scope)
              );

              $scope.timeline.setOptions(
                {
                  min: vis.moment().startOf(scope).valueOf(),
                  start: vis.moment().startOf(scope).valueOf(),
                  max: vis.moment().endOf(scope).valueOf(),
                  end: vis.moment().endOf(scope).valueOf()
                });
            }
            else
            {
              $scope.timeline.setOptions(
                {
                  min: null,
                  max: null
                });
            }

            start = 0;
          };

          var scope;

          $scope.timeline.stepScope = function (direction)
          {
            start = start + direction;

            angular.forEach(
              $scope.timeline.scope, function (active, _scope)
              {
                if (active) scope = _scope;
              });

            $scope.timeline.setWindow(
              vis.moment().add(scope, start).startOf(scope),
              vis.moment().add(scope, start).endOf(scope)
            );

            $scope.timeline.setOptions(
              {
                min: vis.moment().add(scope, start).startOf(scope).valueOf(),
                start: vis.moment().add(scope, start).startOf(scope).valueOf(),
                max: vis.moment().add(scope, start).endOf(scope).valueOf(),
                end: vis.moment().add(scope, start).endOf(scope).valueOf()
              });
          };

//          setTimeout(
//            function () { $scope.timeline.setScope('month') },
//            25
//          );
        }
      }
    }
  ]).


  filter(
  'parseRange', [
    function ()
    {
      return function (period)
      {
        var range = {
          apart: function (date)
          {
            return {
              year: vis.moment(date).get('year'),
              month: {
                number: vis.moment(date).get('month'),
                name: vis.moment(date).format('MMMM')
              },
              week: vis.moment(date).format('w'),
              day: {
                number: vis.moment(date).get('date'),
                name: vis.moment(date).format('dddd')
              },
              hour: vis.moment(date).format('HH'),
              minute: vis.moment(date).format('mm'),
              second: vis.moment(date).format('ss'),
              milli: vis.moment(date).get('milliseconds')
            }
          },

          analyse: function (period)
          {
            var p = {
              s: this.apart(period.start),
              e: this.apart(period.end)
            };

            // TODO: Choose for a more sensible name
            var info = {
              first: '',
              second: '',
              third: ''
            };

            if (p.s.year == p.e.year)
            {
              info = {
                first: p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + '  -  ' +
                       p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name,
                second: p.s.year,
                third: ''
              };

              if (p.s.month.number == p.e.month.number)
              {
                info = {
                  first: p.s.day.name + ' ' + p.s.day.number + '  -  ' +
                         p.e.day.name + ' ' + p.e.day.number,
                  second: p.s.month.name + ' ' + p.s.year,
                  third: 'Month number: ' + Number(p.s.month.number + 1)
                };

                if (p.s.week == p.e.week)
                {
                  info.third += ', Week number: ' + p.s.week;
                }
                else
                {
                  info.third += ', Week numbers: ' + p.s.week + ' - ' + p.e.week;
                }

                if (p.s.day.number == p.e.day.number)
                {
                  if (p.e.hour == 23 &&
                      p.e.minute == 59 &&
                      p.e.second == 59 &&
                      p.e.milli == 999)
                  {
                    p.e.hour = 24;
                    p.e.minute = '00';
                    p.e.second = '00';
                    p.e.milli = '00';
                  }

                  info = {
                    first: p.s.hour + ':' + p.s.minute + '  -  ' +
                           p.e.hour + ':' + p.e.minute,
                    second: p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year,
                    third: 'Week number: ' + p.s.week
                  };

                  if (p.s.hour == p.e.hour)
                  {
                    info = {
                      first: p.s.hour + ':' + p.s.minute + ':' + p.s.second + '  -  ' +
                             p.e.hour + ':' + p.e.minute + ':' + p.e.second,
                      second: p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year,
                      third: 'Week number: ' + p.s.week
                    };

                    if (p.s.minute == p.e.minute)
                    {
                      info = {
                        first: p.s.hour + ':' + p.s.minute + ':' + p.s.second + '.' + p.s.milli + '  -  ' +
                               p.e.hour + ':' + p.e.minute + ':' + p.e.second + '.' + p.e.milli,
                        second: p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year,
                        third: 'Week number: ' + p.s.week
                      };
                    }
                  }
                }
              }
            }
            else
            {
              info = {
                first: p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + ', ' + p.s.year
                         + '  -  ' +
                       p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ', ' + p.e.year,
                second: '',
                third: 'Years: ' + p.s.year + ' - ' + p.e.year
              };
            }

            return info.first + ', ' + info.second + ', ' + info.third;
          }
        };

        return range.analyse(period);
      }
    }
  ]
);