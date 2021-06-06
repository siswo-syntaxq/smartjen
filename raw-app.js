import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
require('jcanvas')($, window);
require('jcanvas/dist/jcanvas-handles');

// Make sure Dropzone doesn't try to attach itself to the
// element automatically.
// This behaviour will change in future versions.
Dropzone.autoDiscover = false;

let myDropzone = new Dropzone("#upload", {
  	maxFilesize: 1, // MB
    init: function() {
        this.on("success", function(file, response) {
			response.images.forEach(loadCanvas);
			$(".save").show();
        });
    }
});

function loadCanvas(imageLink, index) {
	var id = "img_"+index;

	$(".body").append('<canvas class="canva" id="'+id+'" width="720" height="920"></canvas>');

	var canvas = document.getElementById(id);
	var image = new Image();
	image.src = imageLink;

	$('#'+id).drawImage({
		layer: true,
		source: imageLink,
		x: canvas.width / 2 - image.width / 2,
 		y: canvas.height / 2 - image.height / 2,
	});
	  loadSelectionTools(id);
}

function loadSelectionTools(id) {
	$(".canva").after("<div class='tools'><button class='questionSelector' data-id='"+id+"' type='button'>Question selector</button>"
	+"<button type='button' data-id='"+id+"' class='answerSelector'>Answer selector</button>"
	+"</div>");
}

$(function(){
	$(".save").hide();
	$(".body").on('click','.questionSelector',function(){
	  var id = $(this).data('id');
	  var label = prompt("Please enter your question order", "1");

	  if (label != null) {
		$('#'+id).addLayer({
			type: 'rectangle',
			draggable: true,
			name:'question_'+label,
			strokeStyle: '#c33',
			strokeWidth: 2,
			x: 160, y: 150,
			width: 150, height: 80,
			// Define handle properties
			handlePlacement: 'both',
			handle: {
			  type: 'arc',
			  fillStyle: '#fff',
			  strokeStyle: '#c33',
			  strokeWidth: 2,
			  radius: 4
			},
			click: function(layer) {
				
			}
		  })
		  // Redraw layers to ensure handles are on top of rectangle
		  .drawLayers();
	  }
	});

	$(".body").on('click','.answerSelector',function(){
		var id = $(this).data('id');
		var label = prompt("Please enter your answer order", "1");
  
		if (label != null) {
		  $('#'+id).addLayer({
			  type: 'rectangle',
			  draggable: true,
			  name:'answer_'+label,
			  strokeStyle: '#00ff00',
			  strokeWidth: 2,
			  x: 160, y: 150,
			  width: 150, height: 80,
			  // Define handle properties
			  handlePlacement: 'both',
			  handle: {
				type: 'arc',
				fillStyle: '#fff',
				strokeStyle: '#00ff00',
				strokeWidth: 2,
				radius: 4
			  },
			  click: function(layer) {
				  
			  }
			})
			// Redraw layers to ensure handles are on top of rectangle
			.drawLayers();
		}
	});

	$(".save").on('click', function(){
		var data = [],
			layers = [];
		$(".canva").each(function(index, canva) {
			data[index] = $(canva).attr("id");
			layers[index] = $("#"+data[index]).getLayers();
		});
		var processedLayer = getSelectionLayer(layers);
		var postData = {
			'layers' : JSON.stringify(processedLayer)
		}
		$.ajax({
			type:'post',
			url:'/save',
			data: postData,
			success:function(result){
				 alert(result);
			}
		});
	});
});


function getSelectionLayer(layers)
{
	var data = [],
		order = 0;
	layers.forEach(function(value, index) {
		data[index] = {};
		data[index]['rectangle'] = [];
		value.forEach(function(child_value, child_index) {
			if (child_index == 0) {
				data[index]['source'] = child_value.source;
			
			} else {
				if (child_value.type == 'rectangle') {
					data[index]['rectangle'][order] = {
						'name' : child_value.name,
						'height': child_value.height,
						'width' : child_value.width,
						'x'	: child_value.x,
						'y'	: child_value.y
					}
					order++;
				}
				
			}
		});
	});
	return data;
}


// var canvas = document.getElementById('a123');
// var image = new Image();
// image.src = "/temps/one.jpeg";
// $('canvas').drawImage({
// 	source: "/temps/one.jpeg",
// 	x: canvas.width / 2 - image.width / 2,
// 	y: canvas.height / 2 - image.height / 2,
// 	draggable: true
// });