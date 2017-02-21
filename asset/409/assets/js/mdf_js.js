
$(document).ready(function(){

	function megamenu(){
	var currWidth;
	var menu = document.getElementById('mdf_menu');
	var subMenu = document.querySelectorAll('.mdf_sub_wrap');
	var menuEl = menu.querySelectorAll('.menu-el'); 
	var dropdowns = menu.querySelectorAll('.dropdown');
	currWidth = menu.offsetWidth;

	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    }

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}

	if( dropdowns.length > 0 ){
		for( i = 0; dropdowns.length > i; i++ ){
			dropdowns[i].parentNode.style.position = 'relative';
		}
	}
	

	 $('.menu-el').each(function(){
	 	if( $(this).find('.mdf_sub_wrap') ){
	 		$(this).find('a').eq(0).addClass('has-sub');
	 	}
	 	if( $(this).find('.dropdown').length > 0 ){
	 		var li = $(this).find('.dropdown li');
	 		for( n = 0; li.length > n; n++ ){ 
     			if( li.eq(n).find('.mdf_child_menu').eq(0).length > 0 ){
		     		li.eq(n).find('a').eq(0).addClass('has-drop');
		     		w = $(this).find('.dropdown').attr('data-width');
		     		$(this).find('.dropdown').css('width', w);
		     	}
		     	var k = li.eq(n).find('.mdf_child_menu');
		     	for( g = 0; k.length > g; g++ ){ 
		     		k.eq(g).addClass('sub-'+ g );
		     		p = k.eq(g).closest('li').outerWidth(true);
		     		k.eq(g).css('left', p);
		     		k.eq(g).css('top', 0);
		     	}
		     }	
	 	}
	 })

	// $('.menu-el .mdf_sub_wrap').find('a').eq(0).addClass('has-sub');
	 if( $('.menu-el .dropdown').length > 0 ){
	 	$('.menu-el .dropdown li .mdf_child_menu').find('a').eq(0).addClass('has-drop');

	 }


	 var transitionEvent = whichTransitionEvent();
	 var idx;
	 $('.menu-el').hover(function(){ 
	 	$(this).addClass('active');
	 	$('.mdf_sub_wrap').addClass('wait');
	 	if( $(this).find('.mdf_sub_wrap').length > 0 ){
	 		var e = $(this).find('.mdf_sub_wrap');
	 		e.one(transitionEvent, function(event) { 
				$('.mdf_sub_wrap').addClass('wait');
			});
			if( idx != undefined ){
				var z = $('.menu-el').eq(idx);
			 	var e = z.find('.mdf_sub_wrap');
		 		e.one(transitionEvent, function(event) { 
					$('.mdf_sub_wrap').addClass('wait');
				});
			}
	 	}
	 }, function(){
	 	idx = $(this).index();
	 	$(this).removeClass('active');
	 	var z = $('.menu-el').eq(idx);
	 	var e = z.find('.mdf_sub_wrap');
 		e.one(transitionEvent, function(event) {
			$('.mdf_sub_wrap').removeClass('wait');
		});
	 });
	

	 $('#mdf_menu').mouseleave(function(){
	 	var flip = $('.mdf_sub_wrap'); 
		if( flip.length > 0 && flip.eq(0).hasClass('wait') ){
			for( i = 0; flip.length > i; i++ ){
			   flip.eq(i).removeClass('wait');
			}
		}
	 })


	// Contact Function
    $('#send').click(function(){
	    $('#success p').remove();
	    $.post('contact/contact.php', $('#contact-form').serialize(), function(response) {
	      $('#success').html(response).fadeIn(1000);
	      $('#success').hide(3500);
	    });

	    return false;

    });	

}

	var exist = 0;
	megamenu();
	resize();
	
	$(window).resize(function(){
		resize();
		megamenu();
	})

	function resize(){		
		var width = $(window).outerWidth(); 
		if( width < 1207 ){ 
			if( $('.right-nav li .search-box').length === 1 ) $('.search-box').detach().appendTo('.navbar-header');
			$('.mdf_sub_wrap, .mdf_child_menu .mdf_child_menu, .dropdown .mdf_child_menu, .mdf_child_menu.dropdown').css('display', 'none');
			$('.mdf_child_menu').addClass('bmt');
			$('.mdf_flip').addClass('bmt');
			if( $('.tabs-left').length > 0 ){ 
				$('.nav-tabs').removeClass('tabs-left');
				exist = 1;
			}
			$('#mdf_menu').unbind().on('click','.menu-el > a', function(){ console.log(13123)
				if( $(this).closest('.menu-el').find('.mdf_sub_wrap').length > 0 ){ 
					if( !$(this).closest('.menu-el').find('.mdf_sub_wrap').hasClass('active') ){
						$(this).closest('.menu-el').find('.mdf_sub_wrap').slideDown(160).addClass('active');
					} else {
						$(this).closest('.menu-el').find('.mdf_sub_wrap').slideUp(150).removeClass('active');
					}
				} else if( $(this).closest('.menu-el').find('.dropdown').length > 0 ){ 
					if( !$(this).closest('.menu-el').find('.dropdown').hasClass('active') ){
						$(this).closest('.menu-el').find('.dropdown').addClass('active').slideDown(150);
					} else {
						$(this).closest('.menu-el').find('.dropdown').slideUp(150).removeClass('active');
					}
				}
			});

			$('.mdf_child_menu .has-drop').unbind().click(function(){
				if( $(this).closest('li').find('.mdf_child_menu').length > 0 ){ 
					if( !$(this).closest('li').find('.mdf_child_menu, ul[class*=sub]').first().hasClass('active') ){ 
						$(this).closest('li').find('.mdf_child_menu, ul[class*=sub]').first().addClass('active').slideDown(150);
					} else {
						$(this).closest('li').find('.mdf_child_menu, ul[class*=sub]').first().slideUp(150).removeClass('active');
					}
				}
			});
		} else { 
			if( $('.navbar-header .search-box').length > 0 ){
				 $('.search-box').detach().appendTo('.right-nav li');
				 $('.search-box').not(':nth-child(1)').remove();
			}
			$('.mdf_sub_wrap, .mdf_child_menu').css('display', 'block');
			$('.mdf_child_menu,.mdf_sub_wrap').removeClass('bmt');
			if( exist === 1 ){
				$('.nav-tabs').addClass('tabs-left');
				exist = 0;
			}
			$('.mdf_child_menu:not(.dropdown)').each(function(){
				var width = $(this).data('width');
				var left = $(this).closest('li').outerWidth();
				$(this).css('width', width);
				$(this).css('left', left)
			});
		}
	} 

	if( $('#mdf_menu').find('.navbar-brand img').length > 0 ){
		$('#mdf_menu').find('.navbar-brand').css('padding', '0px');
	}
});

