routerApp.factory('$aggregator', function () {
    
    var AggBuilder = function (_agg) {
        this.agg = _agg;
    };
    
    AggBuilder.prototype = {
        setFilter: function (filter) {
            this.filter = filter;
        },

        calculate: function () {
            return this.agg.calculate();
        },

        filterFields: function () {
            return this.filter.filterFields();
        }
    };
    
    function AggBuilder(_agg) {
        this.agg = _agg;
        
        
//        return {
//            setAgg: function (agg) {
//                this.agg = agg;
//            },
//
//            calculate: function () {
//                alert('test');
//                return this.agg.calculate();
//            },
//
//            aggFields: function () {
//                return this.agg.aggFields();
//            }
//        };
    }
    
    
    return {
        getBuilder : function (agg) {
             return new AggBuilder(agg);
         }
    };
});