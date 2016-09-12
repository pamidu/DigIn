/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('demoApp').service('BoardDataFactory', function () {

  return {
    kanban: {
      "name": "Kanban Board",
      "numberOfColumns": 4,
      "columns": [
        {"name": "Fields", "cards": [
           {"title": "Sales",
                  "details": "",
                  "status": ""},
                {"title": "Invoice Date",
                  "details": "",
                  "status": ""}
        ]},
            {"name": "Country", "cards": [
         
        ]},
        {"name": "Province", "cards": [
 
          
        ]},
           {"name": "State", "cards": [
 
          
        ]},
          {"name": "District", "cards": [
 
          
        ]},
        
         {"name": "City", "cards": [
       
        ]}
      ]
    }, 
       
  };
});
