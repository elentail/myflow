$(document).ready(function () {

    var operatorStruct = {}
    $.getJSON( "/static/js/functions.json", function( json ) {
        operatorStruct = json;
    });

    // Apply the plugin on a standard, empty div...
    var $flowchart = $('#flowchartworkspace');
    var $container = $flowchart.parent();
    var $operatorProperties = $('#operator_properties');
    var $operatorTitle = $('#operator_title');

    function Flow2Text() {
        var data = $flowchart.flowchart('getData');
        $('#flowchart_data').val(JSON.stringify(data, null, 2));
    }
    $('#get_data').click(Flow2Text);
    function Text2Flow() {
        var data = JSON.parse($('#flowchart_data').val());
        $flowchart.flowchart('setData', data);
    }
    $('#set_data').click(Text2Flow);    

    $flowchart.flowchart({
        data: {},
        // multipleLinksOnInput: true,
        multipleLinksOnInput: false,
        multipleLinksOnOutput: true,

        onOperatorSelect: function (operatorId) {
            $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
            var opertorData = $flowchart.flowchart('getOperatorData', operatorId);
            for(var i=0; i <opertorData.properties.params.length;++i){
                var myElement = document.createElement(opertorData.properties.params[i]['type']);
                $operatorProperties.append(myElement);
            }
            return true;
        },
        onOperatorUnselect: function () {
            return true;
        },
    });

    // Delete Key Event handler
    /*
    $(document).on('keyup', function(event) {
        if(event.keyCode == 46){
            $flowchart.flowchart('deleteSelected');
        }
    });
    */
    document.addEventListener("keyup", function (event) {
        if (event.keyCode == 46) {
            $flowchart.flowchart('deleteSelected');
        }
    });

    function unloadHandler(e) {
        e.preventDefault();
        e.returnValue = '';
    }
    window.addEventListener('beforeunload', unloadHandler);

    $operatorTitle.keyup(function () {
        var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
        if (selectedOperatorId != null) {
            $flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
        }
    });

    var sampleSource = [
        {
            "title": "Source",
            "folder": true,
            "expanded": true,
            "children": [
                {
                    "title": "image",
                    "folder": true,
                    "expanded": true,
                    "children": [
                        {
                            "title": "SOME1"
                        },
                        {
                            "title": "SOME2"
                        }
                    ]
                },
                {
                    "title": "spectrum",
                    "folder": true,
                    "expanded": true,
                    "children": [
                        {
                            "title": "SOME3"
                        },
                        {
                            "title": "SOME4"
                        }
                    ]
                }
            ]
        },
        {
            "title": "processing",
            "folder": true,
            "expanded": true,
            "children": [
                {
                    "title": "image",
                    "folder": true,
                    "expanded": true,
                    "children": [
                        {
                            "title": "Resize"
                        },
                        {
                            "title": "Padding"
                        },
                        {
                            "title": "Crop"
                        }
                    ]
                }
            ]
        }
    ]

	$("#tree_list").fancytree({
//	  extensions: ["childcounter"],
//    checkbox: true,
	  debugLevel: 0,
      source: sampleSource,
    //   source:{
    //       url : 'http://' + window.location.host + '/static/js/functions.json'
    //   },
	  activate: function(event, data) {
        // console.log(data);
		$("#tree_status").text("Activate " + data.node.title);
	  }
	});
    $(".fancytree-container").addClass("fancytree-connectors");

    
    // draggable 
    var $draggableOperators = $("#tree_list .fancytree-exp-n,.fancytree-exp-nl");
    
    function getOperatorData($element) {
        // console.log($element);
        
        var nbInputs = operatorStruct[$element.text()]["inputSize"];
        var nbOutputs = operatorStruct[$element.text()]["outputSize"];

        var data = {
            properties: {
                title: $element.text(),
                inputs: {},
                outputs: {},
                params: operatorStruct[$element.text()]["params"]
            }
        };

        var i = 0;
        for (i = 0; i < nbInputs; i++) {
            data.properties.inputs['input_' + i] = {
                label: 'Input ' + (i + 1)
            };
        }
        for (i = 0; i < nbOutputs; i++) {
            data.properties.outputs['output_' + i] = {
                label: 'Output ' + (i + 1)
            };
        }

        return data;
    }

    var operatorId = 0;

    $draggableOperators.draggable({
        cursor: "move",
        opacity: 0.7,

        helper: 'clone',
        appendTo: 'body',
        zIndex: 1000,

        helper: function (e) {
            var $this = $(this);
            var data = getOperatorData($this);
            return $flowchart.flowchart('getOperatorElement', data);
        },
        stop: function (e, ui) {
            var $this = $(this);
            var elOffset = ui.offset;
            var containerOffset = $container.offset();
            if (elOffset.left > containerOffset.left &&
                elOffset.top > containerOffset.top &&
                elOffset.left < containerOffset.left + $container.width() &&
                elOffset.top < containerOffset.top + $container.height()) {

                var flowchartOffset = $flowchart.offset();

                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;

                var positionRatio = $flowchart.flowchart('getPositionRatio');
                relativeLeft /= positionRatio;
                relativeTop /= positionRatio;

                var data = getOperatorData($this);
                data.left = relativeLeft;
                data.top = relativeTop;

                $flowchart.flowchart('addOperator', data);
            }
        }
    });

    $('#datepicker').datepicker({
        format: "yyyy-mm-dd",
        keyboardNavigation: false,
        forceParse: false
    });

});