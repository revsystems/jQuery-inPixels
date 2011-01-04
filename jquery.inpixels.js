/*
Copyright (c) 2010 RevSystems, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

The end-user documentation included with the redistribution, if any, must 
include the following acknowledgment: "This product includes software developed 
by RevSystems, Inc (http://www.revsystems.com/) and its contributors", in the 
same place and form as other third-party acknowledgments. Alternately, this 
acknowledgment may appear in the software itself, in the same form and location 
as other such third-party acknowledgments.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($) {

$.fn.margin = function( side ) {
    var $e = $(this).eq(0);
    
    // different methods for each browser type
    function shiftDiff( s ) {
        var cs = "margin" + s.substring(0,1).toUpperCase() + s.substring(1);
        if($e[0].currentStyle !== undefined) {
            // if we get auto back, do the offset diff trick
            var res = $e[0].currentStyle[cs];
            if(res === "auto") {
                var x = $e.offset()[s];
                $e[0].style[cs] = 0;
                res = x - $e.offset()[s];
                $e[0].style[cs] = "auto";
            }
            return parseFloat(res);
        }
        else if($.browser.mozilla) {
          if(s.match(/left|right/i) && $e.css("margin-" + s) === "0px") {
            // 0 could be 0 or auto. to find out, set it to 0 manually then do the offset diff trick
            // if it should be auto, make sure you set it back to that
            var x = $e.offset()[s];
            $e.css("margin-" + s, 0);
            var res = x - $e.offset()[s];
            if($e.offset()[s] !== x) { $e.css("margin-" + s, "auto"); }
            return res;
          }
          else {
            return parseFloat($e.css("margin-" + s));
          }
        }
        else if(window.getComputedStyle) {
          // webkit, just use getComputedStyle, it works
          return parseFloat(getComputedStyle($e[0], "")["margin-" + side]);
        }
        else {
          // unknown
          return parseFloat($e.css("margin-" + s));
        }
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
$.inPx = function( m, ctx ) {
    ctx = ctx ? $(ctx) : $("body");
    var rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/;
    if(!rnumpx.test(m) && rnum.test(m)) {
        var $e = $("<div style='left:0;position:absolute;top:0;'>");
        ctx.append($e);
        var t1 = $e.offset().top;
        $e.css("top", m);
        var t2 = $e.offset().top;
        $e.remove();
        return t2-t1;
    }
    return parseFloat(m);
};
})(jQuery);