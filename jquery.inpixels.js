(function($) {

$.fn.margin = function( side ) {
    var $e = $(this).eq(0);
    
    // if the return value is auto, find the offset 
    // difference when we set the margin to 0 and return that
    // otherwise return the value in px
    function shiftDiff( s ) {
        var cs = "margin" + s.substring(0,1).toUpperCase() + s.substring(1);
        if(window.getComputedStyle === undefined) {
            var res = $e[0].currentStyle[cs];
            if(res === "auto") {
                var x = $e.offset()[s];
                $e[0].style[cs] = 0;
                res = x - $e.offset()[s];
                $e[0].style[cs] = "auto";
            }
            return parseFloat(res);
        }
        return parseFloat(getComputedStyle($e[0])["margin-" + side]);
    }
    
    // if auto is working (centered), then left/right 
    // and top/bottom should return the same value
    if(side === "left" || side === "right") { return shiftDiff("left"); }
    if(side === "top" || side === "bottom") { return shiftDiff("top"); }
    
    // there are other tricks, but this takes auto into account
    if(side === "width") { return $e.margin("left") + $e.margin("right"); }
    if(side === "height") { return $e.margin("top") + $e.margin("bottom"); }
    return undefined;
};

$.fn.border = function( side ) {
    var $e = $(this);
    // just return default values based on what we know the browsers do
    if(side.match(/top|right|bottom|left/i)) {
        var b = $e.css("border-" + side + "-width").toString().toLowerCase();
        if(b.match(/^(thin|medium|thick)$/i)) {
            if($.browser.msie && $.browser.version <= 7) {
                if(b === "thin") { return 2; }
                if(b === "medium") { return 4; }
                if(b === "thick") { return 6; }
            }
            else {
                if(b === "thin") { return 1; }
                if(b === "medium") { return 3; }
                if(b === "thick") { return 5; }
            }
        }
        return parseFloat(b);
    }
    if(side === "width") { return $e.border("left") + $e.border("right"); }
    if(side === "height") { return $e.border("top") + $e.border("bottom"); }
    return undefined;
};

$.fn.padding = function( side ) {
    var $e = $(this).eq(0);
    // padding already works pretty well; just make it return 
    // a float by default
    if(side.match(/top|right|bottom|left/i)) { return parseFloat($e.css("padding-" + side)); }
    if(side === "width") { return $e.innerWidth() - $e.width(); }
    if(side === "height") { return $e.innerHeight() - $e.height(); }
    return undefined;
};

$.each(["Top", "Right", "Bottom", "Left", "Width", "Height"], function(index, value) {
    var lval = value.toLowerCase();
    $.fn["border" + value] = function() { return $(this).border(lval); };
    $.fn["padding" + value] = function() { return $(this).padding(lval); };
    $.fn["margin" + value] = function() { return $(this).margin(lval); };
});

// a dirty hack to figure out the px dimensions of any num/unit combo
$.inPx = function( m ) {
    var rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/;
    if(!rnumpx.test(m) && rnum.test(m)) {
        var $e = $("<div style='left:0;position:absolute;top:0;'>");
        $("body").append($e);
        var t1 = $e.offset().top;
        $e.css("top", m);
        var t2 = $e.offset().top;
        $e.remove();
        return t2-t1;
    }
    return parseFloat(m);
};
})(jQuery);