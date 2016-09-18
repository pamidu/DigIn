/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

routerApp.service('BoardDataFactory', function () {

  return {
    kanban: {
      "name": "Kanban Board",
      "numberOfColumns": 3,
      "columns": [
        {"name": "Fields", "cards": [
           {"title": "Sales",
                  "details": "",
                  "status": ""},
                {"title": "Region",
                  "details": "",
                  "status": ""},
                   {"title": "Province",
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
    }
       
  };
});
