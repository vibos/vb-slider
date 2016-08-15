(function( $ ) {
	/**
	 *	vb-slider
	 *	Transforms a set of slides into a nice slider
	 *	Methods: init, destroy
	 */

	// create var to be used throughout the plugin
	var settings = {};
	var ii = 0;
	
	var methods = {
		/**
		 * Initialize
		 */
		init : function( options ) {
			$this = this;
			ii++;
			this.css("position","relative");
			
			// default settings
			var defaultSettings = {
				'slide'			: ".w-review__slide",
				'preview'		: "img",
				'preview_src'	: "src",
				'preview_name'	: "data-name"
			};
			settings = $.extend(defaultSettings, options);
			
			// add controls
			$(settings['slide']).css("position","absolute");
			$controls_block = $("<ul/>",{"data-transform" : 0});
			$(settings['slide']).each(function(){
				$controls_block.append($("<li/>").append($("<img />",{
					src : $(settings['preview'],this).attr(settings['preview_src']),
					alt : ""
				})).append(document.createTextNode( $(settings['preview'],this).attr( settings['preview_name'] ) ) ));
			});
			$controls_block = $("<div/>",{class : "vb-slider_wraper"}).append($controls_block);
			
			$slider_control = $("<div/>",{
				class : "vb-slider_previews"
			}).append($controls_block).append($("<a/>",{
				class : "vb-slider_nav vb-slider_back disabled"
			})).append($("<a/>",{
				class : "vb-slider_nav vb-slider_next disabled"
			}));
			
			this.append($slider_control);
			$(".vb-slider_previews li:first-child",this).addClass("selected");
			$(".vb-slider_previews ul",this).width($(".vb-slider_wraper li",this).outerWidth(true)*$(".vb-slider_wraper li",this).length);
			
			// check if next button aviable
			if ( $(".vb-slider_previews li",$this).outerWidth() * $(".vb-slider_previews li",$this).length > $(".vb-slider_previews",$this).width() ) {
				$(".vb-slider_next",$this).removeClass("disabled");
			}
			
			// hide unnecessary slides
			$(settings['slide']).hide();
			$(settings['slide']).first().show();
			this.css("height",$(settings['slide']).first().height(),400);

			/**
			 * set handlers
			 */
			
			// Select slide
			slide = settings['slide'];
			$(".vb-slider_previews li",this).bind("click.vbSlider",function($this,slide) {
				return function() {
					$(".vb-slider_previews li",$this).removeClass("selected");
					$(this).addClass("selected");
					n = $(this).index();
					$this.animate({"height" : $(slide,$this).eq(n).height()},500);
					$(slide,$this).animate({"opacity" : 0},400).css("display","none");
					$(slide,$this).eq(n).css("display","block").animate({"opacity" : 1},400).css("display","block");
				}
			}($this,slide));
			
			// List Next
			$(".vb-slider_next",this).bind("click.vbSlider",function($this) {
				return function() {
					move = parseInt($(".vb-slider_previews ul",$this).attr("data-transform")) - parseInt($(".vb-slider_wraper li",$this).outerWidth(true));
					if ( $(".vb-slider_previews ul",$this).width() + move >= $(".vb-slider_wraper",$this).width() ) {
						$(".vb-slider_previews ul",$this).css("transform", "translateX("+move+"px)");
						$(".vb-slider_previews ul",$this).attr("data-transform",move);
						$(".vb-slider_back",$this).removeClass("disabled");
					} 
					if ( $(".vb-slider_previews ul",$this).width() + move*2 < $(".vb-slider_wraper",$this).width() ) {
						$(this).addClass("disabled");
					}
				}
			}($this));
			
			// List back
			$(".vb-slider_back",this).bind("click.vbSlider",function($this) {
				return function() {
					move = parseInt($(".vb-slider_previews ul",$this).attr("data-transform")) + parseInt($(".vb-slider_wraper li",$this).outerWidth(true));
					if (move <= 0) {
						$(".vb-slider_previews ul",$this).css("transform", "translateX("+move+"px)");
						$(".vb-slider_previews ul",$this).attr("data-transform",move);
						$(".vb-slider_next",$this).removeClass("disabled");
					} 
					if (move + $(".vb-slider_wraper li",$this).outerWidth(true) > 0) {
						$(this).addClass("disabled");
					}
				}
			}($this));
			
			return this; // For chains
		},
		
		/**
		 * Destroy slider
		 */
		destroy : function( options ) {
			$(document).unbind('.vbSlider');
			
			this.css("height","auto");
			$(settings['slide']).css({
				"position"	: "static",
				"opacity"	: "1"
			}).show();
			$(".vb-slider_previews").remove();
			
			return this; // For chains
		}
	};
	
	$.fn.vbSlider = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method \'' +  method + '\' does not exist for jQuery.vbSlider' );
		}
	};
})(jQuery);