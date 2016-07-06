/* use strict */

app.factory('dataHandler', function () {

    var GlobalNodes = [];
    var GlobalConnections = [];
    var GlobalIfConditions = [];
    var GlobalForloops = [];
    var currentState = "";
    var Arguments = [];
    var GlobalViews = ['drawboard'];

    function CheckIfAllReadyExists_node(schema_id) {
        var flag = false;
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].schema_id == schema_id) {
                flag = true;
                GlobalNodes.splice(i, 1);
                break;
            }
        }
        return flag;
    };

    function CheckIfAllReadyExists_connection(connection) {
        var flag = false;
        for (var i = 0; i < GlobalConnections.length; i++) {
            if (GlobalConnections[i].sourceId == connection.sourceId && GlobalConnections[i].targetId == connection.targetId) {
                flag = true;
                GlobalConnections.splice(i, 1);
            }
        }
        return flag;
    };

    function CheckIfAllReadyExists_argument(argument) {
        var flag = false;
        for (var i = 0; i < Arguments.length; i++) {
            if (Arguments[i].Key == argument) {
                flag = true;
            }
        }
        return flag;
    };

    function CheckIfAllReadyExists_ifconnection(id) {
        var flag = false;
        for (var i = 0; i < GlobalIfConditions.length; i++) {
            if (GlobalIfConditions[i].id == id) {
                flag = true;
            }
        }
        return flag;
    };

    function CheckIfAllReadyExists_view(id) {
        var flag = false;
        for (var i = 0; i < GlobalViews.length; i++) {
            if (GlobalViews[i] == id) {
                flag = true;
            }
        }
        return flag;
    };

    function RemoveGlobalNode(schema_id) {
        for (var i = 0; i < GlobalNodes.length; i++) {
            if (GlobalNodes[i].schema_id == schema_id) {
                GlobalNodes.splice(i, 1);
                break;
            }
        }
    };

    function RemoveGlobalConnection(id) {
        for (var i = 0; i < GlobalConnections.length; i++) {
            if (GlobalConnections[i].id == id) {
                GlobalConnections.splice(i, 1);
            }
        }
    };

    function RemoveGlobalIfConnection(id) {
        for (var i = 0; i < GlobalIfConditions.length; i++) {
            if (GlobalIfConditions[i].id == id) {
                GlobalIfConditions.splice(i, 1);
            }
        }
    };

    function RemoveGlobalView(id) {
        for (var i = 0; i < GlobalViews.length; i++) {
            if (GlobalViews[i] == id) {
                GlobalViews.splice(i, 1);
            }
        }
    };

    function CheckIfAllReadyExists_state(URL, states) {
        var flag = false;
        for (var i = 0; i < states.length; i++) {
            if (states[i].name == URL) {
                flag = true;
            }
        }
        return flag;
    };

    function sortArgumentTypes() {
        var argObj = Arguments;
        for (x = 0; x < argObj.length; x++) {
            var flag = checkType(argObj[x].Value);
            console.log(argObj[x].Value, x, flag);
            if (flag == true) {
                argObj[x].Type = 'dynamic';
            } else {
                argObj[x].Type = 'hardcoded';
            };
        };
        console.log(argObj);
        return argObj;
    };

    function sortVariableTypes() {
        var tempData = GlobalNodes;
        for (y = 0; y < tempData.length; y++) {
            var tempVariables = tempData[y].Variables;
            for (z = 0; z < tempVariables.length; z++) {
                var flag = checkType(tempVariables[z].Value);
                if (flag == true) {
                    tempVariables[z].Type = 'dynamic';
                } else {
                    tempVariables[z].Type = 'hardcoded';
                };
            };
        };
        console.log(tempData);
        return tempData;
    };

    function checkType(value) {
        var argObj = Arguments;
        var flag = false;
        for (i = 0; i < argObj.length; i++) {
            if (argObj[i].Key == value) {
                flag = true;
            };
            if (value == "") {
                flag = true
            };
            if (value == undefined) {
                flag = true
            };
        };

        return flag;
    };

    function reformatArguments(data) {
        var arguments = data;
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i].Group == undefined) {
                arguments[i].Group = 'default';
            };
            if (arguments[i].Priority == undefined) {
                arguments[i].Priority = 'NotMandatory';
            };
            if (arguments[i].DataType == undefined) {
                arguments[i].DataType = 'String';
            };
        };
        console.log(arguments);
        return arguments;
    };

    function validateNumber(data) {
        var flag = false;
        //data = parseInt(data);
        console.log(data);

        if (isNaN(data)) {
            flag = false;
        } else {
            flag = true;
        };
        console.log(flag);
        return flag;
    };

    function validateDynamic(data) {
        console.log(data);
        var flag = false;
        for (i = 0; i < Arguments.length; i++) {
            if (Arguments[i].Key == data.Value) {
                if (data.DataType == Arguments[i].DataType) {
                    flag = true;
                } else {
                    flag = false;
                };
            };
        };
        return flag;
    };

    function validateIfCondition(data) {
        console.log(data);
        var flag = false;
        var msg = "";
        if (data[0].DataType == data[2].DataType) {
            flag = true;
            msg = 'no problem';
        } else {
            flag = false;
            msg = 'valueOne & valueTwo must have the same data type';
        };

        if (data[1].Type == 'hardcoded') {
            if (data[1].Value == '<' || data[1].Value == '>' || data[1].Value == '<=' || data[1].Value == '>=') {
                if (data[0].DataType == 'String' || data[2].DataType == 'String') {
                    flag = false;
                    msg = 'valueOne & valueTwo must be Int or float';
                };
            };
        } else {
            for (j = 0; j < Arguments.length; j++) {
                if (Arguments[j].Key == data[1].Value)
                    if (Arguments[j].Value == '<' || Arguments[j].Value == '>' || Arguments[j].Value == '<=' || Arguments[j].Value == '>=') {
                        if (data[0].DataType == 'String' || data[2].DataType == 'String') {
                            flag = false;
                            msg = 'valueOne & valueTwo must be Int or float';
                        };
                    };
            };
        };
        var obj = {
            flag: flag,
            msg: msg
        };
        return obj;
    };

    function validateHibernateNodes() {
        var final = [];
        console.log(GlobalNodes);
        for (a = 0; a < GlobalNodes.length; a++) {
            if (GlobalNodes[a].library_id == 3) {
                if (GlobalNodes[a].Variables[0].Value == "") {
                    var result = GlobalNodes[a].Variables[0].Key + " value cannot be null";
                    final.push(result);
                };
            };
        };


        return final;
    };

    function checkHibernateAvailability() {
        var flag = false;
        for (j = 0; j < GlobalNodes.length; j++) {

            if (GlobalNodes[j].library_id == "3") {
                flag = true;
            };
        };
        return flag;
    };

    function checkAvailability(key, array) {
        var result = true;
        for (d = 0; d < array.length; d++) {
            if (key == array[d].Key) {
                result = false;
            };
        };
        return result;
    };

    function addMandatoryInarguments() {
        var obj = [{
            Category: "InArgument",
            DataType: "String",
            Group: "default",
            Key: "InSessionID",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }, {
            Category: "InArgument",
            DataType: "String",
            Group: "default",
            Key: "InSecurityToken",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }, {
            Category: "InArgument",
            DataType: "String",
            Group: "default",
            Key: "InLog",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }, {
            Category: "InArgument",
            DataType: "String",
            Group: "default",
            Key: "InNamespace",
            Priority: "Mandatory",
            Type: "dynamic",
            Value: ""
        }];
        // var flag = checkHibernateAvailability();
        //console.log(flag);
        // if (flag) {
        for (b = 0; b < obj.length; b++) {
            if (checkAvailability(obj[b].Key, Arguments)) {
                Arguments.push(obj[b]);
            };
        };
        //};
        console.log(Arguments);
    };

    function removeHibernateAttributes(key) {
        //var tempArray = Arguments.length;
        for (h = 0; h < Arguments.length; h++) {
            console.log(h, Arguments[h].Key);
            if (Arguments[h].Key == key) {
                Arguments.splice(h, 1);
            };
        };
        console.log(Arguments);
    };

    return {

        checkFormat: function (data) {
            var obj = reformatArguments(data);
            return data;
        },
        setArguments: function (data) {
            Arguments = data || [];
        },
        retrieveArguments: function () {
            //            var temp_obj = JSON.parse(sessionStorage.getItem("arguments"));
            //            if (temp_obj !== null) {
            //                Arguments = temp_obj;
            //            };
            //
            //            for (i = 0; i < Arguments.length; i++) {
            //                if (Arguments[i].key == null) {
            //                    Arguments.splice(i, 1);
            //                };
            //            };
            var data = reformatArguments(Arguments);
            return data;
        },
        AddArguments: function (obj) {
            console.log(obj);
            var flag = CheckIfAllReadyExists_argument(obj.Key);
            if (flag == false) {
                Arguments.push(obj);
                //sessionStorage.setItem("arguments", JSON.stringify(Arguments));
            };
            return flag;
        },
        updateArguments: function (obj) {
            var flag = CheckIfAllReadyExists_argument(obj.Key);
            if (flag == false) {
                Arguments.push(obj);
                //sessionStorage.setItem("arguments", JSON.stringify(Arguments));
                for (i = 0; i < Arguments.length; i++) {
                    if (Arguments[i].Key == null) {
                        Arguments.splice(i, 1);
                    };
                };
            };
        },
        removeArguments: function () {
            Arguments = [];
        },
        removeArgument: function (key) {
            for (i = 0; i < Arguments.length; i++) {
                if (Arguments[i].Key == key) {
                    Arguments.splice(i, 1);
                    console.log(key);
                };
            };
        },
        setCurrentState: function (text) {
            currentState = text;
        },
        getCurrentState: function () {
            return currentState;
        },
        getSaveJson: function () {
            var flowChart = {};
            flowChart.nodes = sortVariableTypes();
            flowChart.connections = GlobalConnections;
            flowChart.ifconditions = GlobalIfConditions;
            flowChart.forloops = GlobalForloops;
            flowChart.arguments = sortArgumentTypes();
            flowChart.views = GlobalViews;
            //var data = sortArgumentTypes();
            return flowChart;
        },
        setFlowObject: function (savedata) {
            // add the nodes, connections and if conditions to the factory global variable. if already exists the schema_id remove it and add it again.
            $.each(savedata.nodes, function (idx, node) {
                if (CheckIfAllReadyExists_node(node.schema_id)) {
                    //RemoveGlobalNode(node.schema_idh);
                    GlobalNodes.push(node);
                } else {
                    GlobalNodes.push(node);
                }
            });
            $.each(savedata.connections, function (idx, con) {
                if (CheckIfAllReadyExists_connection(con)) {
                    //RemoveGlobalConnection(con.id);
                    GlobalConnections.push(con);
                } else {
                    GlobalConnections.push(con);
                }
            });
        },
        addtoNodes: function (data) {
            if (!CheckIfAllReadyExists_node(data.id)) {
                GlobalNodes.push(data);
            } else {
                GlobalNodes.push(data);
            }

            //            if (data.library_id == 3) {
            addMandatoryInarguments();
            //            };
        },
        addtoConnections: function (data) {
            if (!CheckIfAllReadyExists_connection(data)) {
                GlobalConnections.push(data);
            } else {
                GlobalConnections.push(data);
            }
        },
        removeConnection: function (data) {
            for (var i = 0; i < GlobalConnections.length; i++) {
                if (GlobalConnections[i].sourceId == data.sourceId && GlobalConnections[i].targetId == data.targetId) {
                    GlobalConnections.splice(i, 1);
                    break;
                }
            }
        },
        addToViews: function (data) {
            var flag = CheckIfAllReadyExists_view(data);
            if (flag == false) {
                GlobalViews.push(data);
            };
        },
        removeFromViews: function (data) {
            RemoveGlobalView(data);
        },
        getViews: function () {
            return GlobalViews;
        },
        addtoIfConnections: function (data) {
            if (CheckIfAllReadyExists_ifconnection(data.id)) {
                RemoveGlobalIfConnection(data.id);
                GlobalIfConditions.push(data);
            } else {
                GlobalIfConditions.push(data);
            }
        },
        addtoForloop: function (data) {
            GlobalForloops.push(data);
        },
        resetFactory: function () {
            GlobalNodes = [];
            GlobalConnections = [];
            GlobalIfConditions = [];
            GlobalForloops = [];
            GlobalViews = ['drawboard'];
        },
        removeFromSchema: function (module) {
            console.log("Remove state " + module.schema_id + " in array of length " + GlobalNodes.length);
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == module.schema_id) {
                    GlobalNodes.splice(i, 1);
                    break;
                }
            }
            if (module.library_id = "2") {
                for (var i = 0; i < GlobalIfConditions.length; i++) {
                    if (GlobalIfConditions[i].id == module.schema_id) {
                        GlobalIfConditions.splice(i, 1);
                        break;
                    }
                }
                RemoveGlobalView(module.OtherData.FalseStateUUID);
                RemoveGlobalView(module.OtherData.TrueStateUUID);
            }
            if (module.library_id = "5") {
                for (var i = 0; i < GlobalForloops.length; i++) {
                    if (GlobalForloops[i].id == module.schema_id) {
                        GlobalForloops.splice(i, 1);
                        break;
                    }
                }
                RemoveGlobalView(module.OtherData.ForeachUUID);
            }

            console.log(GlobalNodes.length);
            if (GlobalNodes.length == 0) {
                removeHibernateAttributes("InNamespace");
                removeHibernateAttributes("InSecurityToken");
                removeHibernateAttributes("InLog");
                removeHibernateAttributes("InSessionID");
                //addMandatoryInarguments();
                //addMandatoryInarguments();
                //console.log(Arguments);

            };
            console.log("Remove state at position " + i);

        },
        updateCollectionData: function (data) {
            var module;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == data.schema_id) {
                    module = GlobalNodes[i];
                    break;
                }
            }
            for (var property in data.data) {
                if (data.data.hasOwnProperty(property)) {
                    for (var i = 0; i < module.Variables.length; i++) {
                        if (module.Variables[i].Key == property) {
                            module.Variables[i].Value = data.data[property];
                        }
                    }
                }
            }
        },
        getNodesForState: function (parentView) {
            var returnNodes = [];
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].parentView == parentView) {
                    returnNodes.push(GlobalNodes[i]);
                }
            }
            return returnNodes;
        },
        getConnectionsForState: function (parentView) {
            var returnConnections = [];
            for (var i = 0; i < GlobalConnections.length; i++) {
                if (GlobalConnections[i].parentView == parentView) {
                    returnConnections.push(GlobalConnections[i]);
                }
            }
            return returnConnections;
        },
        getModuleByID: function (id) {
            var returnObj;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == id) {
                    returnObj = GlobalNodes[i];
                    break;
                }
            }
            return returnObj;
        },
        getEndpointsForItem: function (id, type, location) {
            var returnObj;
            var module;
            for (var i = 0; i < GlobalNodes.length; i++) {
                if (GlobalNodes[i].schema_id == id) {
                    module = GlobalNodes[i];
                    break;
                }
            }
            switch (location) {
                case "default":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            returnObj = module.SourceEndpoints[i].id;
                        }
                    }
                    if (type == "target") {
                        for (var j = 0; j < module.TargetEndpoints.length; j++) {
                            returnObj = module.TargetEndpoints[j].id
                        }
                    }
                    break;
                case "left":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            var sourceend = module.SourceEndpoints[i];
                            if (sourceend.location == "LeftMiddle") {
                                returnObj = module.SourceEndpoints[i].id;
                            }
                        }
                    }
                    break;
                case "right":
                    if (type == "source") {
                        for (var i = 0; i < module.SourceEndpoints.length; i++) {
                            var sourceend = module.SourceEndpoints[i];
                            if (sourceend.location == "RightMiddle") {
                                returnObj = module.SourceEndpoints[i].id;
                            }
                        }
                    }
                    break;
            }

            console.log("Get connections for '" + id + "' has completed.");
            return returnObj;
        },
        validateWorkflow: function () {
            Arguments = sortArgumentTypes();
            var flag = true;
            var errors = [];
            for (a = 0; a < Arguments.length; a++) {
                if (Arguments[a].DataType == 'Int') {
                    if (Arguments[a].Type == 'hardcoded') {
                        flag = validateNumber(Arguments[a].Value);
                        console.log(flag);
                        if (flag == false) {
                            var obj = Arguments[a].Key + ' Given value doesn\'t match with the Data type';
                            errors.push(obj);
                        };
                    } else {
                        console.log(Arguments[a], a);
                        flag = validateDynamic(Arguments[a]);
                        if (flag == false) {
                            console.log(a);
                            var obj =
                                Arguments[a].Key + ' Given variable\'s data type doesn\'t match with the Argument\'s Data type';

                            errors.push(obj);
                        };
                    };
                };
            };

            GlobalNodes = sortVariableTypes();
            for (b = 0; b < GlobalNodes.length; b++) {
                for (j = 0; j < GlobalNodes[b].Variables.length; j++) {
                    if (GlobalNodes[b].Variables[j].DataType == 'Int') {
                        if (GlobalNodes[b].Variables[j].Type == 'hardcoded') {
                            flag = validateNumber(GlobalNodes[b].Variables[j].Value);
                            console.log(flag);
                            if (flag == false) {
                                var obj = +GlobalNodes[b].Variables[j].Key + ' Given value doesn\'t match with the Data type';
                                errors.push(obj);
                            };
                        } else {
                            flag = validateDynamic(GlobalNodes[b].Variables[j]);
                            console.log(flag);
                            if (flag == false) {
                                var obj = GlobalNodes[b].Variables[j].Value + ' Given Argument\'s data type doesn\'t match with the Variable\'s Data type';

                                errors.push(obj);
                            };
                        };
                    };
                };
            };

            for (c = 0; c < GlobalNodes.length; c++) {

                if (GlobalNodes[c].library_id == '2') {
                    var result = validateIfCondition(GlobalNodes[c].Variables);
                    if (result.flag == false) {
                        var obj = result.msg;
                        errors.push(obj);
                    };
                };
            };

            for (d = 0; d < GlobalNodes.length; d++) {
                for (e = 0; e < GlobalNodes[d].Variables.length; e++) {
                    if (GlobalNodes[d].Variables[e].Priority == 'Mandatory') {
                        if (GlobalNodes[d].Variables[e].Value == '') {
                            var obj = GlobalNodes[d].Variables[e].Key + ' value cannot be null, Mandatory variable!';
                            errors.push(obj);
                        };
                    };
                };
            };

            var hibernateResult = validateHibernateNodes();
            addMandatoryInarguments();
            if (hibernateResult) {
                for (f = 0; f < hibernateResult.length; f++) {
                    errors.push(hibernateResult[f]);
                };
            }
            return errors;
        },
        addState: function (URL, state) {
            var states = state.get();
            if (!CheckIfAllReadyExists_state(URL, states)) {
                app.stateProvider.state(URL, {
                    url: "/" + URL
                });

            }
        }
    }
});
