#ngDynamicColumns

License: The MIT License.

ngDynamicColumns is providing two angularJS directives to render a datatable with full dynamic columns. That means, that
the order of the columns in a datatable is not hard-coded but can be freely changed. A column can be toggled on and off
too.

The cell contents and the contents of the headers are defined with their own directives so that they can be as complex
and flexible as angularJS allows. You can use every angularJS feature in them as you like.

[See it in action on the Demo site](http://marcorinck.github.io/ngDynamicColumns/)

##Installation

* with bower: `bower install ngDynamicColumns` (not yet!)
* manual: download `ngDynamicColumns.js`

Inside your angularJS app define a dependency to 'ngDynamicColumns' like this: `angular.module("app", ["ngDynamicColumns"])`

##Configuration

Both directives need the same column configuration to render the columns. The configuration should be an array of objects
which need to have these mandatory properties:

>{String} id

  A unique id for the column

>{String} rowDirective

  The directive name used to render the cells (&lt;td&gt; tags). This directive is used to render your table data and you need
  to implement this directive yourself.

>{String} columnDirective (optional when not using column-header directive)

  The directive name used to render the header (&lt;th&gt; tags). This directive is used when you want to have a header in
   your table and you have to implement the directive yourself. If you don't use the column-header directive you can omit
   this property.

>{boolean} visible

  Indicates if this column is visible or not. Note, that the DOM elements for the column will be created even when
  currently not visible. This is done to speed up performance when the column will be displayed later.
  The class 'ng-hide' of angularJS is used to hide the column when not visible.


>{String} clazz (optional)

  If set, this class will be set on every element in your column (&lt;td&gt; __and__ &lt;th&gt; tags), so you can style
  your columns individually.


Example column configuration:

````javascript
$scope.columns = [
    {"id": "column1", rowDirective: "column1cell", columnDirective: 'column1header', visible: true, clazz: 'column1class'},
    {"id": "column2", rowDirective: "column2cell", columnDirective: 'column2header', visible: false, clazz: 'column2class'},
];

````

##Usage

ngDynamicColumns currently is specifically designed to render the &lt;td&gt; and &lt;th&gt; tags in complex and/or
huge html tables. If you only have small and simple tables, this module is probably not for you.

This is an example usage:

````html
<table>
  <thead>
    <tr column-header="columns"/>
  </thead>
  <tbody>
    <tr ng-repeat="item in items" dynamic-row="columns" />
  </tbody>
</table>
````

###dynamic-row directive

This directive should be used in conjunction with a ng-repeat on a tr element and renders for every repeat a set of
td elements in the desired order. This directive needs a column configurstion object to get the neccessary information
how to render the columns/td tags. See below for info about this configuration object.

###column-header directive

This directive should be used on a tr element in a thead section and renders th elements according to the column
configuration object.

###Events

As ngDynamicColumns was designed to be used with complex and huge tables in mind, it does not use any watchers by itself
to minimize impact on performance (though your column and row directives can use watchers of course).

So, to rerender the table after changes in the column configuration you have to emit events on the $rootScope.
ngDynamicColumns acts on these events:

* __columnToggled__ - this event expects a column ID as transmitted parameter and toggles visibility of said column ID.
 To toggle the visibility it sets and removes the ng-hide class on &lt;td&gt; and &lt;th&gt; elements
* __recreateColumns__ - this rerenders the whole &lt;table&gt; with all elements. Warning: this can have huge impact on
 rendering performance when your table has a lot of DOM elements, as all elements are deleted and recreated again. You
 can use this event, when column order has changed for instance. It does not need any parameters
* __columnOrderChanged__ - this event __moves__ one column to the place of another column. It expects two paramters: the
 source column ID and the destination column ID. This can be used for instance after a drag and drop action by the user
 who moves columns around. As this does not delete elements from the DOM but moves existing elements to another place, its
 very fast even in huge and complex tables. __Warning:__ This only moves the DOM elements around, but does not change the
 actual column configuration. To avoid getting out of sync, you have to move the corresponding columns in the column
 configuration too!

###Content directives

`insert more doc here`