angular.module('vis.graph2d', [
    'ui.router',
    'ngVis'
])

    .config(function config($stateProvider) {
        $stateProvider.state('graph2d', {
            url: '/graph2d',
            views: {
                "main": {
                    controller: 'Graph2dCtrl',
                    templateUrl: 'graph2d.tpl.html'
                }
            },
            data: {pageTitle: 'Graph2D'}
        });
    })

    .controller('Graph2dCtrl',
    function Graph2dCtrl($scope, $timeout, VisDataSet) {
        var graph2d;
        var dataItems;
        var dataGroups;


        // ------------------------------------------------
        // Event Handlers

        $scope.onLoaded = function (graphRef) {
            console.log("graph loaded callback", graphRef);
            graph2d = graphRef;
            graph2d.setWindow($scope.startTime, $scope.stopTime);
        };

        $scope.setWindow = function (window) {
            var periodStart = moment().subtract(1, window);
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow(periodStart, $scope.timeNow);
        };

        $scope.setNow = function (direction) {
            var range = graph2d.getWindow();
            var interval = range.end - range.start;
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow($scope.timeNow - interval, $scope.timeNow);
        };

        $scope.stepWindow = function (direction) {
            var percentage = (direction > 0) ? 0.2 : -0.2;
            var range = graph2d.getWindow();
            var interval = range.end - range.start;

            if (graph2d === undefined) {
                return;
            }

            graph2d.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() - interval * percentage
            });
        };

        $scope.zoomWindow = function (percentage) {
            var range = graph2d.getWindow();
            var interval = range.end - range.start;

            if (graph2d === undefined) {
                return;
            }

            graph2d.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() + interval * percentage
            });
        };

        $scope.setDateRange = function () {
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow($scope.startTime, $scope.stopTime);
        };

        /**
         * Callback from the chart whenever the range is updated
         * This is called repeatedly during zooming and scrolling
         * @param period
         */
        $scope.onRangeChange = function (period) {
            console.log("Range changing", period);
            function splitDate(date) {
                var m = moment(date);
                return {
                    year: m.get('year'),
                    month: {
                        number: m.get('month'),
                        name: m.format('MMM')
                    },
                    week: m.format('w'),
                    day: {
                        number: m.get('date'),
                        name: m.format('ddd')
                    },
                    hour: m.format('HH'),
                    minute: m.format('mm'),
                    second: m.format('ss')
                };
            }

            var p = {
                s: splitDate(period.start),
                e: splitDate(period.end)
            };

            // Set the window for so the appropriate buttons are highlighted
            // We give some leeway to the interval -:
            // A day, +/- 1 minutes
            // A week, +/- 1 hour
            // A month is between 28 and 32 days
            var interval = period.end - period.start;
            if (interval > 86340000 && interval < 86460000) {
                $scope.graphWindow = 'day';
            }
            else if (interval > 601200000 && interval < 608400000) {
                $scope.graphWindow = 'week';
            }
            else if (interval > 2419200000 && interval < 2764800000) {
                $scope.graphWindow = 'month';
            }
            else {
                $scope.graphWindow = 'custom';
            }

            if (p.s.year == p.e.year) {
                $scope.graphTimeline =
                    p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + '  -  ' +
                    p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ' ' + p.s.year;

                if (p.s.month.number == p.e.month.number) {
                    $scope.graphTimeline =
                        p.s.day.name + ' ' + p.s.day.number + '  -  ' +
                        p.e.day.name + ' ' + p.e.day.number + ' ' +
                        p.s.month.name + ' ' + p.s.year;

                    if (p.s.day.number == p.e.day.number) {
                        if (p.e.hour == 23 && p.e.minute == 59 && p.e.second == 59) {
                            p.e.hour = 24;
                            p.e.minute = '00';
                            p.e.second = '00';
                        }

                        $scope.graphTimeline =
                            p.s.hour + ':' + p.s.minute + '  -  ' +
                            p.e.hour + ':' + p.e.minute + ' ' +
                            p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year;
                    }
                }
            }
            else {
                $scope.graphTimeline =
                    p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + ', ' + p.s.year + '  -  ' +
                    p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ', ' + p.e.year;
            }

            // Call apply since this is updated in an event and angular may not know about the change!
            if (!$scope.$$phase) {
                $timeout(function () {
                    $scope.$apply();
                }, 0);
            }
        };

        /**
         * Callback from the chart whenever the range is updated
         * This is called once at the end of zooming and scrolling
         * @param period
         */
        $scope.onRangeChanged = function (period) {
            console.log("Range changed", period);
        };


        var dataGroups = new VisDataSet();
        var names = ['centripetal', 'chordal', 'uniform', 'disabled'];
        dataGroups.add({
            id: 0,
            content: names[0],
            options: {
                drawPoints: false,
                catmullRom: {
                    parametrization: 'centripetal'
                }
            }
        });

        dataGroups.add({
            id: 1,
            content: names[1],
            options: {
                drawPoints: false,
                catmullRom: {
                    parametrization: 'chordal'
                }
            }
        });

        dataGroups.add({
            id: 2,
            content: names[2],
            options: {
                drawPoints: false,
                catmullRom: {
                    parametrization: 'uniform'
                }
            }
        });

        dataGroups.add({
            id: 3,
            content: names[3],
            options: {
                drawPoints: {style: 'circle'},
                catmullRom: false
            }
        });


        var dataItems = new VisDataSet();

        for (var i = 0; i < names.length; i++) {
            dataItems.add([
                {x: '2014-06-12', y: 0, group: i},
                {x: '2014-06-13', y: 40, group: i},
                {x: '2014-06-14', y: 10, group: i},
                {x: '2014-06-15', y: 15, group: i},
                {x: '2014-06-15', y: 30, group: i},
                {x: '2014-06-17', y: 10, group: i},
                {x: '2014-06-18', y: 15, group: i},
                {x: '2014-06-19', y: 52, group: i},
                {x: '2014-06-20', y: 10, group: i},
                {x: '2014-06-21', y: 20, group: i}
            ]);
        }

        $scope.toggleLegend = function () {
            $scope.graphOptions.legend = !$scope.graphOptions.legend;
        }

        $scope.reset = function () {
            graph2d.fit();
        }

        $scope.graphEvents = {
            rangechange: $scope.onRangeChange,
            rangechanged: $scope.onRangeChanged,
            onload: $scope.onLoaded
        };

        $scope.graphData = {
            items: dataItems,
            groups: dataGroups
        };


        $scope.graphOptions = {
            height: '100%',
            width: '100%',
            dataAxis: {
                icons: true,
                showMajorLabels: true,
                showMinorLabels: false
            },
            showCurrentTime: false,
            legend: true
        };

        $scope.graphLoaded = true;
    })

;
