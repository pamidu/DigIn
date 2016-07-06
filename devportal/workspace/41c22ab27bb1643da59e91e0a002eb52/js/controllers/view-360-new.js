angular
.module('mainApp', ['ngMaterial', 'ngScrollbars', 'directivelibrary', 'uiMicrokernel'])

.config(function($mdIconProvider) {
  $mdIconProvider
  .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
})

.controller('appctrl', function($scope, $http, $objectstore) {

  $scope.scrollbarConfig = {
    autoHideScrollbar: false,
    theme: 'minimal-dark',
    axis: 'y',
    advanced: {
        updateOnContentResize: true
    },
    scrollInertia: 300
}

// $scope.PreviewData=false;
    //$scope.nodata=false;
    $scope.enter = function(keyEvent,searchText){
        if (keyEvent.which === 13)
        {
            // var element = document.getElementById("SearchCard");
            // element.setAttribute("class", "movedPosition");

            $scope.customer = {};
            var client = $objectstore.getClient("customer");

            client.getByFiltering("select * from customer where CustomerFname='" + searchText + "'");

            client.onGetMany(function(data) {
                if (data) {
                    $scope.customer = data;

                    // $scope.PreviewData=true;

                    console.log(data);
                }
            });

            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('This is embarracing')
                    .content('There was an error retreving the data.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                    );
            });


            if($scope.tenant.length === 0) 
            {
                $scope.nodata=true;
                //$scope.loading=false;
                $scope.PreviewData=false;
            }
            else{
               $scope.PreviewData=true;
               $scope.nodata=false;
               //$scope.loading=false;
           }
       }
   }

   $scope.customer = {};
   var client = $objectstore.getClient("customer");

   client.onGetMany(function(data) {
    if (data) {
        $scope.customer = data;
    }
});
   client.getByFiltering("*");

   var imagePath = 'img/iphone.jpeg';

   $scope.phones = [
   { type: 'Home', number: '(555) 251-1234' },
   { type: 'Cell', number: '(555) 786-9841' },
   ];

   $scope.todos = [
   {
    face : imagePath,
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    when: '3:08PM',
    notes: " I'll be in your neighborhood doing errands"
},
{
    face : imagePath,
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    when: '3:08PM',
    notes: " I'll be in your neighborhood doing errands"
},
{
    face : imagePath,
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    when: '3:08PM',
    notes: " I'll be in your neighborhood doing errands"
},
{
    face : imagePath,
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    when: '3:08PM',
    notes: " I'll be in your neighborhood doing errands"
},
{
    face : imagePath,
    what: 'Brunch this weekend?',
    who: 'Min Li Chan',
    when: '3:08PM',
    notes: " I'll be in your neighborhood doing errands"
},
];

$(function () {
    $('#container').highcharts({
        chart: {

            type: 'column'
        },

        title: {
            text: ''
        },

        xAxis: {
            categories: [
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            labels:{
                formatter: function() {
                    return ' $' + this.value ;
                }
            }
        },
        tooltip: {
            headerFormat: '<span></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} $</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Invoices',
            data: [1500,1700,1000,550,3000,2500]

        }, {
            name: 'Paid Invoices',
            data: [900,1200,1000,550,2700,2500],
            color:"#00cc00"

        }]
    });
});

$scope.twethdoorInvoice = {};
var client = $objectstore.getClient("twethdoorInvoice");
client.onGetMany(function(data) {
    if (data) {
        $scope.twethdoorInvoice = data;
    }
});
client.getByFiltering("*");


$scope.ledgers = [{
    name: 'Date',
    field: 'Name'
}, {
    name: 'Invoice No',
    field: 'invoiceNo'
}, {
    name: 'Customer',
    field: 'Name'
}, {
    name: 'Amount',
    field: 'finalamount'
}, {
    name: 'Balance',
    field: 'total'
}, {
    name: 'Status',
    field: 'paymentMethod'
}
];

$scope.custom = {
    number: 'bold',
    date: 'black',
    last_modified: 'black'
};
$scope.sortable = ['date', 'number', 'address', 'customer.name', 'amount', 'balance', 'dueDate', 'status'];
$scope.thumbs = 'thumb';
$scope.count = 3;


});


