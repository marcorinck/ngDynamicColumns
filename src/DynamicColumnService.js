(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").factory("dynamicColumnService", ['$compile', function ($compile) {

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

			return angular.element(element).find(elementName);
		}

		function render(scope, element, columns, directiveName, elementName) {
			if (element.children()) {
				element.children().remove();
			}

			columns.forEach(function (column) {
				var options = {
					directive: column[directiveName],
					clazz: column.clazz || '',
					id: column.id
				};

				if (!column.visible) {
					options.clazz = options.clazz + " ng-hide";
				}

				element.append($compile(createElement(elementName, options))(scope));
			});
		}

		function renderRow(scope, element, columns) {
			render(scope, element, columns, "rowDirective", "td");
		}

		function renderColumn(scope, element, columns) {
			render(scope, element, columns, "columnDirective", "th");
		}

		function toggleColumn($element, toggledColumnId) {
			var columnElement, columnId, children = $element.children();

			Object.keys(children).some(function (key) {
				columnElement = children[key];
				columnId = columnElement.attributes["data-col-id"].value;

				if (columnId === toggledColumnId) {
					columnElement = angular.element(columnElement);
					if (columnElement.hasClass("ng-hide")) {
						angular.element(columnElement).removeClass("ng-hide");
					} else {
						angular.element(columnElement).addClass("ng-hide");
					}
					return true;
				}
			});
		}

		function changeColumnOrder($element, source, dest) {
			var forward = false, temp, children = $element.children(),
				sourceElement, destElement;

			Object.keys(children).some(function (key) {
				var columnId = children[key].attributes["data-col-id"].value;

				if (columnId === source) {
					sourceElement = angular.element(children[key]);
				} else if (columnId === dest) {
					destElement = angular.element(children[key]);

					if (!sourceElement) {
						forward = true;
					}
				}

				if (sourceElement && destElement) {
					return true;
				}
			});


			if (sourceElement && destElement) {
				if (forward) {
					temp = destElement.after(sourceElement);
					sourceElement.after(temp);

				} else {
					destElement.after(sourceElement);
				}
			}
		}

		return {
			renderRow: renderRow,
			renderColumn: renderColumn,
			toggleColumn: toggleColumn,
			changeColumnOrder: changeColumnOrder
		};
	}]);

})(angular);
