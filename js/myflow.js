$(document).ready(function () {
    /*
    var data = {
        operators: {
            operator: {
                top: 20,
                left: 20,
                properties: {
                    title: 'Operator',
                    inputs: {
                        input_1: {
                            label: 'Input 1',
                        },
                        input_2: {
                            label: 'Input 2',
                        }
                    },
                    outputs: {
                        output_1: {
                            label: 'Output 1',
                        },
                        output_2: {
                            label: 'Output 2',
                        },
                        output_3: {
                            label: 'Output 3',
                        }
                    }
                }
            }
        }
    };
    */
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });


    var data = {}

    // Apply the plugin on a standard, empty div...
    var $flowchart = $('#flowchartworkspace');
    var $container = $flowchart.parent();
    var $operatorProperties = $('#operator_properties');
    var $operatorTitle = $('#operator_title');
    $operatorProperties.hide();

    $flowchart.flowchart({
        data: data,
        multipleLinksOnInput: true,
        multipleLinksOnOutput: true,

        onOperatorSelect: function (operatorId) {
            $operatorProperties.show();
            $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));

            var operatorData = $flowchart.flowchart('getOperatorData', operatorId);
            console.log(operatorData);

            return true;
        },
        onOperatorUnselect: function () {
            $operatorProperties.hide();
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
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
    }
    window.addEventListener('beforeunload', unloadHandler);
    /*
    function forceNavigation(url) {
        window.removeEventListener('beforeunload', unloadHandler);
        window.location.href = url;
    }
    
    document.getElementById('no-warning').addEventListener('click', function() {
        forceNavigation('https://example.com');
    });
    */


    $operatorTitle.keyup(function () {
        var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
        if (selectedOperatorId != null) {
            $flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
        }
    });

    var $draggableOperators = $('.draggable_operator');
    function getOperatorData($element) {
        var nbInputs = parseInt($element.data('nb-inputs'), 10);
        var nbOutputs = parseInt($element.data('nb-outputs'), 10);
        // var nbInputs = 1;
        // var nbOutputs = 1;

        var data = {
            properties: {
                title: $element.text(),
                inputs: {},
                outputs: {},
                params: {}
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

});