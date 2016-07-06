 

routerApp.factory('getTableDataFactories', function () {
    return {
        getData: function (source, table, filed, state, eWrk, bqWrk) {
            switch (source) {
                case 'biqQuery':

                case 'elastic':
                    eWrk.postMessage(table + "," + filed + "," + state);
                    return eWrk.addEventListener('message', function (event) {
                        return JSON.parse(event.data);
                    });
                //TODO
                //services expand
                default:
                    return {}
            }
        }
    }

});