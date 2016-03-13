(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").factory("personService", [function () {
		var persons;

		function randomize() {
			var _person = {
					"id": null,
					"lastName": "Colley",
					"firstName": "John",
					"contactNumber": "07747 618508",
					"medicalInfo": "Suffers with asthma"
				},
				startDate = 1439993379335, aDay = 1000 * 60 * 60 * 24,
				personCount = 10,
				dateCount, person, i, j, lastDate, date;

			persons = [];
			for (i = 0; i < personCount; i++) {
				person = angular.copy(_person);

				person.id = i+1;
				person.firstName = person.firstName + i;
				person.lastName = person.lastName + i;
				person.contactNumber = Math.floor(Math.random() * 9999999) + 1;

				dateCount = Math.floor(Math.random() * 3) + 1;
				lastDate = startDate;

				for (j = 0; j < dateCount; j++) {
					date = lastDate + (Math.floor(Math.random() * 8) + 1) * aDay;
					lastDate = date;

					person[date] = "Attending";
				}

				persons.push(person);
			}

		}

		function getAttendingPersonCountForColumn(_persons, column) {
			var attending = 0, colId = column.substr(4, column.length); //cut out 'date' string, e.g. "date1440425379335"

			if (_persons && _persons.length) {
				_persons.forEach(function (person) {
					if (person[colId] === 'Attending') {
						++attending;
					}

				});
			}

			return attending;
		}

		return {
			randomize: randomize,
			get persons() {
				return persons;
			},
			getAttendingPersonCountForColumn:getAttendingPersonCountForColumn
		};
	}]);

})(angular);
