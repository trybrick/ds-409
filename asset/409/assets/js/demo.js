// Initializing Plugins

//gmap3
$(document).ready(function() {

	function loadMap(){
		var address = "place de l'toile, paris";   
        $('#location').gmap3({ 
        	map:{
              address:address,
              options:{
                zoom: 14,
                opts:{
                  scrollwheel:true
                }
              }
            },
            infowindow:{
              address:address,
              options:{
                size: new google.maps.Size(50,50),
                content: 'Lorem Ipsum Company'
              },
              events:{
                closeclick: function(infowindow){
                  alert('closing : ' + $(this).attr('id') + ' : ' + infowindow.getContent());
                }
              }
            }
          }
        );
	}

  // check for the current width of the screen
		var width = $(window).outerWidth(); 
		if( width < 770 ){ 
  		$('#location').closest('.menu-el').find('a').click(function(){
  	  		loadMap();
  	  });
		} else {
			loadMap();
		}

    // fires when browser is resized
    $(window).resize(function(){
      // if it is below 770px hide the map
      if( $(window).outerWidth() < 770 ){
        $('#location').closest('div[class*="col"]').hide().addClass('hidden');
      } else { 
        // otherwise show the map, but first run quick check 
        // to make sure that this is done only once, by checking
        // for existence of .hidden class
        if( $('#location').closest('div[class*="col"]').hasClass('hidden') ){
           $('#location').closest('div[class*="col"]').show().removeClass('hidden')
        }
      }
    });

});//document.ready

//OWL CAROUSEL
$(document).ready(function() {
 
  //Sort random function
  function random(owlSelector){
    owlSelector.children().sort(function(){
        return Math.round(Math.random()) - 0.5;
    }).each(function(){
      $(this).appendTo(owlSelector);
    });
  }
 
  $(".tabs-demo").owlCarousel({
    navigation: true,
    navigationText: [
      "<i class='glyphicon glyphicon-chevron-left'></i>",
      "<i class='glyphicon glyphicon-chevron-right'></i>"
      ],
    beforeInit : function(elem){
      //Parameter elem pointing to $("#owl-demo")
      random(elem);
    }
 
  });
 
});