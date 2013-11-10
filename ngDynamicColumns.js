angular.module("ngDynamicColumns", []);
angular.module("ngDynamicColumns").directive("columnHeader", function ($rootScope, dynamicColumnService) {
    "use strict";

    var columns;

    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            columns = $scope["column-header"];

            $rootScope.$on("columnToggled", function (event, columnId) {
                dynamicColumnService.toggleColumn($element, columnId);
            });

            $rootScope.$on("recreateColumns", function () {
                dynamicColumnService.renderColumn($scope, $element, $scope[$attrs.columnHeader]);
            });

            $rootScope.$on("columnOrderChanged", function(event, sourceId, destinationId) {
                dynamicColumnService.changeColumnOrder($element, sourceId, destinationId);
            });
        },
        link: function ($scope, $element, $attrs) {
            if (!$attrs.columnHeader) {
                throw new Error("columnHeader directive needs a column configuration object, but got " + $attrs.dynamicRow);
            }

            if (!$scope[$attrs.columnHeader]) {
                throw new Error("Can't find the column configuration object on the scope: " + $attrs.columnHeader);
            }

            columns = $scope[$attrs.columnHeader];
            dynamicColumnService.renderColumn($scope, $element, columns);
        }
    };
});
angular.module("ngDynamicColumns").factory("dynamicColumnService", function ($compile) {

    function getTh(options) {
        return '<table><tr><th data-col-id="' + options.id + '"' + options.directive + ' class="' + options.clazz + '"></th></tr></table>';
    }

    function getTd(options) {
        return '<table><tr><td data-col-id="' + options.id + '"' + options.directive + ' class="' + options.clazz + '"></td></tr></table>';
    }

    function createElement(elementName, options) {
        var element;

        if (elementName === "th") {
            element = getTh(options);
        } else if (elementName === "td") {
            element = getTd(options);
        }

        element = angular.element(element);

        return element.find(elementName);
    }

    function render(scope, element, columns, directiveName, elementName) {
        var column, i, html, options;

        if (element.children()) {
            element.children().remove();
        }

        for (i = 0; i < columns.length; i++) {
            column = columns[i];

            options = {
                directive: column[directiveName],
                clazz: column.clazz,
                id: column.id
            };

            if (!column.visible) {
                options.clazz = options.clazz + " ng-hide";
            }
            html = $compile(createElement(elementName, options))(scope);
            element.append(html);
        }
    }

    function renderRow(scope, element, columns) {
        render(scope, element, columns, "rowDirective", "td");
    }

    function renderColumn(scope, element, columns) {
        render(scope, element, columns, "columnDirective", "th");
    }

    function toggleColumn($element, toggledColumnId) {
        var i, columnElement, columnId;
        for (i = 0; i < $element.children().length; i++) {
            columnElement = $element.children()[i];
            columnId = columnElement.attributes["data-col-id"].nodeValue;

            if (columnId === toggledColumnId) {
                columnElement = angular.element(columnElement);
                if (columnElement.hasClass("ng-hide")) {
                    angular.element(columnElement).removeClass("ng-hide");
                } else {
                    angular.element(columnElement).addClass("ng-hide");
                }
                break;
            }
        }
    }

    function changeColumnOrder($element, source, dest) {
        var i,forward = false, temp, children = $element.children(),
            sourceElement, destElement, sourceIndex, destIndex;

        for (i=0;i<children.length;i++) {
            var child = children[i], columnId;
            columnId = child.attributes["data-col-id"].nodeValue;
            if (columnId === source) {
                sourceElement = angular.element(child);
                sourceIndex = i;
            } else if (columnId === dest) {
                destElement = angular.element(child);
                destIndex = i;
                if (!sourceElement) {
                    forward = true;
                }
            }

            if (sourceElement && destElement) {
                break;
            }
        }

        if (sourceElement && destElement) {
            if (forward) {
                temp = destElement.after(sourceElement);
                sourceElement.after(temp);

            } else {
                destElement.after(sourceElement);
            }
        }

        return {sourceIndex: sourceIndex, destIndex: destIndex};
    }

    return {
        renderRow: renderRow,
        renderColumn: renderColumn,
        toggleColumn: toggleColumn,
        changeColumnOrder: changeColumnOrder
    };
});
angular.module("ngDynamicColumns").directive("dynamicRow", function ($rootScope, dynamicColumnService) {
    "use strict";
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {

            $rootScope.$on("columnToggled", function (event, columnId) {
                dynamicColumnService.toggleColumn($element, columnId);
            });

            $rootScope.$on("recreateColumns", function () {
                dynamicColumnService.renderRow($scope, $element, $scope[$attrs.dynamicRow]);
            });

            $rootScope.$on("columnOrderChanged", function(event, sourceId, destinationId) {
                dynamicColumnService.changeColumnOrder($element, sourceId, destinationId);
            });
        },
        link: function ($scope, $element, $attrs) {
            if (!$attrs.dynamicRow) {
                throw new Error("dynamicRow direcive needs a column configuration object, but got " + $attrs.dynamicRow);
            }

            if (!$scope[$attrs.dynamicRow]) {
                throw new Error("Can't find the column configuration object on the scope: " + $attrs.dynamicRow);
            }
            dynamicColumnService.renderRow($scope, $element, $scope[$attrs.dynamicRow]);
        }
    };
});
