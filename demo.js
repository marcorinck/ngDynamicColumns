(function() {
    "use strict";

    var app = angular.module("demo", ["ngDynamicColumns"]);

    app.controller("demoCtrl", function demoCtrl($scope, $rootScope) {

        $scope.columns = [
            {"id": "manufacturer", rowDirective: "manufacturer", columnDirective: 'manufacturer-header', visible: true, clazz: 'manufacturerClass'},
            {"id": "model", rowDirective: "model", columnDirective: 'model-header', visible: true, clazz: 'modelClass'},
            {"id": "desc", rowDirective: "desc", columnDirective: 'desc-header', visible: true, clazz: 'descClass'},
            {"id": "ram", rowDirective: "ram", columnDirective: 'ram-header', visible: true, clazz: 'ramClass'},
            {"id": "cpu", rowDirective: "cpu", columnDirective: 'cpu-header', visible: false, clazz: 'cpuClass'},
            {"id": "year", rowDirective: "year", columnDirective: 'year-header', visible: true, clazz: 'yearClass'},
            {"id": "lte", rowDirective: "lte", columnDirective: 'lte-header', visible: true, clazz: 'lteClass'},
            {"id": "resolution", rowDirective: "resolution", columnDirective: 'resolution-header', visible: false, clazz: 'resolutionClass'}

        ];

        $scope.phones = [
            {id: 1, model: { manufacturer: "Apple", model: "iPhone 5s", desc: "the new top model", ram: "1GB", cpu: "A7", year: "2013", lte: true, resolution: "xxx" }},
            {id: 2, model: { manufacturer: "Apple", model: "iPhone 5c", desc: "The lesser new top model", ram: "1 GB", cpu: "A6", year: "2013", lte: true, resolution: "yyyy" }},
            {id: 3, model: { manufacturer: "Samsung", model: "Galaxy S4", desc: "The top android stuff only here", ram: "2 GB", cpu: "ARM 123", year: "2013", lte: true, resolution: "zzz" }},
            {id: 4, model: { manufacturer: "Google", model: "Nexus 5", desc: "Its shiny!", ram: "2 GB", cpu: "has one", year: "2013", lte: true, resolution: "aaaa" }},
            {id: 5, model: { manufacturer: "Nokia", model: "Lumia", desc: "tiles everywhere", ram: "1 GB", cpu: "yes", year: "2012", lte: false, resolution: "big!" }},
            {id: 6, model: { manufacturer: "HTC", model: "", desc: "", ram: "", cpu: "", year: "", lte: true, resolution: "" }},
            {id: 7, model: { manufacturer: "Apple", model: "iPhone 4", desc: "its too old!", ram: "512 MB", cpu: "A5", year: "2010", lte: false, resolution: "yep" }}
        ];

        $scope.columnChanged = function(column) {
            $rootScope.$emit("columnToggled", column.id);
        };

        $scope.moveFirstColumnToLast = function () {
            $rootScope.$emit("columnOrderChanged", $scope.columns[0].id, $scope.columns[7].id);
        };

        $scope.shuffleColumns = function() {
            $scope.columns.sort(function() {
                return 0.5 - Math.random();
            });

            $rootScope.$emit("recreateColumns");
        };

    });

    app.directive("manufacturer", function() {
        return {
            restrict: "A",
            template: "<div><strong>{{ phone.model.manufacturer }}</strong></div>"
        };
    });

    app.directive("model", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.model }}</div>"
        };
    });

    app.directive("desc", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.desc }}</div>"
        };
    });

    app.directive("ram", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.ram }}</div>"
        };
    });

    app.directive("cpu", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.cpu }}</div>"
        };
    });

    app.directive("year", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.year }}</div>"
        };
    });

    app.directive("lte", function() {
        return {
            restrict: "A",
            template: "<div><input type='checkbox' ng-disabled='true' ng-model='phone.model.lte' /></div>"
        };
    });

    app.directive("resolution", function() {
        return {
            restrict: "A",
            template: "<div>{{ phone.model.resolution }}</div>"
        };
    });


    app.directive("manufacturerHeader", function() {
        return {
            restrict: "A",
            template: "<div>Manufacturer</strong></div>"
        };
    });

    app.directive("modelHeader", function() {
        return {
            restrict: "A",
            template: "<div>Model</div>"
        };
    });

    app.directive("descHeader", function() {
        return {
            restrict: "A",
            template: "<div>Description</div>"
        };
    });

    app.directive("ramHeader", function() {
        return {
            restrict: "A",
            template: "<div>RAM</div>"
        };
    });

    app.directive("cpuHeader", function() {
        return {
            restrict: "A",
            template: "<div>CPU</div>"
        };
    });

    app.directive("yearHeader", function() {
        return {
            restrict: "A",
            template: "<div>Year</div>"
        };
    });

    app.directive("lteHeader", function() {
        return {
            restrict: "A",
            template: "<div>LTE</div>"
        };
    });

    app.directive("resolutionHeader", function() {
        return {
            restrict: "A",
            template: "<div>Resolution</div>"
        };
    });

})();
