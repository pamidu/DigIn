/**
 * Created by Damith on 1/5/2016.
 */

//parameter
//{source = search type ex:elastic }
//{table = table name}
//{filed = selected table filed}
//{filed = selected table filed}
//{eWrk = elasticWorker object}
//{bqWrk = bigQueryWorker object}
//

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