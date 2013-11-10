/*global angular:true*/
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
