$(function(){
  var sampleSource = [
	    { title: "Folder 1", folder: true, expanded: true, children: [
	      { title: "Subnode 1.1"},
	      { title: "Subnode 1.2"},
	      { title: "Subnode 1.3"}
	      ]},
	    { title: "Folder 2", expanded: true, children: [
	      { title: "Subnode 2.1"},
	      { title: "Subnode 2.2"},
		  { title: "Subnode 2.3"},
		  { title: "Subnode 2.4"},
		  { title: "Subnode 2.5"},
		  { title: "Subnode 2.6"},
		  { title: "Subnode 2.7"},
		  { title: "Subnode 2.8"}
	      ]},
	    { title: "Lazy Folder", lazy: true }
    ];

	$("#tree").fancytree({
//	  extensions: ["childcounter"],
//    checkbox: true,
	  debugLevel: 0,
	  source: sampleSource,
	  lazyLoad: function(event, data) {
	    data.result = { url: "sample1.json" };
	  },
	  activate: function(event, data) {
		$("#status").text("Activate " + data.node);
		if (data.node.parent){
			console.log(data.node.parent.title);
		}
	  }
	});
	$(".fancytree-container").addClass("fancytree-connectors");
	
	$("#button1").click(function(event){
	  var tree = $("#tree").fancytree("getTree"),
	      node = tree.getActiveNode();
	  alert("Actie node " + node);
	});

	$("#button2").click(function(event){
		var myJsonSource = [
			{title: "Node 1", key: "1"},
			{title: "Folder 2", key: "2", folder: true, expanded: true, children: [
			  {title: "Node 2.1", key: "3", myOwnAttr: "abc"},
			  {title: "Node 2.2", key: "4"}
			]}
		  ];
		var tree = $("#tree").fancytree("getTree");
		tree.reload(myJsonSource);

	  });

	$("#version").text("Fancytree " + $.ui.fancytree.version 
    + " / jQuery " + $.fn.jquery);
});
