!function(e){function t(o){if(s[o])return s[o].exports;var i=s[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var s={};return t.m=e,t.c=s,t.p="",t(0)}([function(e,t,s){e.exports=s(9)},function(e,t){"use strict";!function(e,t,s,o){var i={autoplay:!1,pause:5e3,progressBar:!0,fourceAutoplay:!1,autoplayControls:!0,appendAutoplayControlsTo:".lg-toolbar"},l=function(t){return this.core=e(t).data("lightGallery"),this.$el=e(t),this.core.$items.length<2?!1:(this.core.s=e.extend({},i,this.core.s),this.interval=!1,this.fromAuto=!0,this.canceledOnTouch=!1,this.fourceAutoplayTemp=this.core.s.fourceAutoplay,this.core.doCss()||(this.core.s.progressBar=!1),this.init(),this)};l.prototype.init=function(){var e=this;e.core.s.autoplayControls&&e.controls(),e.core.s.progressBar&&e.core.$outer.find(".lg").append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>'),e.progress(),e.core.s.autoplay&&e.startlAuto(),e.$el.on("onDragstart.lg.tm touchstart.lg.tm",function(){e.interval&&(e.cancelAuto(),e.canceledOnTouch=!0)}),e.$el.on("onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm",function(){!e.interval&&e.canceledOnTouch&&(e.startlAuto(),e.canceledOnTouch=!1)})},l.prototype.progress=function(){var e,t,s=this;s.$el.on("onBeforeSlide.lg.tm",function(){s.core.s.progressBar&&s.fromAuto&&(e=s.core.$outer.find(".lg-progress-bar"),t=s.core.$outer.find(".lg-progress"),s.interval&&(t.removeAttr("style"),e.removeClass("lg-start"),setTimeout(function(){t.css("transition","width "+(s.core.s.speed+s.core.s.pause)+"ms ease 0s"),e.addClass("lg-start")},20))),s.fromAuto||s.core.s.fourceAutoplay||s.cancelAuto(),s.fromAuto=!1})},l.prototype.controls=function(){var t=this,s='<span class="lg-autoplay-button lg-icon"></span>';e(this.core.s.appendAutoplayControlsTo).append(s),t.core.$outer.find(".lg-autoplay-button").on("click.lg",function(){e(t.core.$outer).hasClass("lg-show-autoplay")?(t.cancelAuto(),t.core.s.fourceAutoplay=!1):t.interval||(t.startlAuto(),t.core.s.fourceAutoplay=t.fourceAutoplayTemp)})},l.prototype.startlAuto=function(){var e=this;e.core.$outer.find(".lg-progress").css("transition","width "+(e.core.s.speed+e.core.s.pause)+"ms ease 0s"),e.core.$outer.addClass("lg-show-autoplay"),e.core.$outer.find(".lg-progress-bar").addClass("lg-start"),e.interval=setInterval(function(){e.core.index+1<e.core.$items.length?e.core.index=e.core.index:e.core.index=-1,e.core.index++,e.fromAuto=!0,e.core.slide(e.core.index,!1,!1)},e.core.s.speed+e.core.s.pause)},l.prototype.cancelAuto=function(){clearInterval(this.interval),this.interval=!1,this.core.$outer.find(".lg-progress").removeAttr("style"),this.core.$outer.removeClass("lg-show-autoplay"),this.core.$outer.find(".lg-progress-bar").removeClass("lg-start")},l.prototype.destroy=function(){this.cancelAuto(),this.core.$outer.find(".lg-progress-bar").remove()},e.fn.lightGallery.modules.autoplay=l}(jQuery,window,document)},function(e,t){"use strict";!function(e,t,s,o){var i={fullScreen:!0},l=function(t){return this.core=e(t).data("lightGallery"),this.$el=e(t),this.core.s=e.extend({},i,this.core.s),this.init(),this};l.prototype.init=function(){var e="";if(this.core.s.fullScreen){if(!(s.fullscreenEnabled||s.webkitFullscreenEnabled||s.mozFullScreenEnabled||s.msFullscreenEnabled))return;e='<span class="lg-fullscreen lg-icon"></span>',this.core.$outer.find(".lg-toolbar").append(e),this.fullScreen()}},l.prototype.requestFullscreen=function(){var e=s.documentElement;e.requestFullscreen?e.requestFullscreen():e.msRequestFullscreen?e.msRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen()},l.prototype.exitFullscreen=function(){s.exitFullscreen?s.exitFullscreen():s.msExitFullscreen?s.msExitFullscreen():s.mozCancelFullScreen?s.mozCancelFullScreen():s.webkitExitFullscreen&&s.webkitExitFullscreen()},l.prototype.fullScreen=function(){var t=this;e(s).on("fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg",function(){t.core.$outer.toggleClass("lg-fullscreen-on")}),this.core.$outer.find(".lg-fullscreen").on("click.lg",function(){s.fullscreenElement||s.mozFullScreenElement||s.webkitFullscreenElement||s.msFullscreenElement?t.exitFullscreen():t.requestFullscreen()})},l.prototype.destroy=function(){this.exitFullscreen(),e(s).off("fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg")},e.fn.lightGallery.modules.fullscreen=l}(jQuery,window,document)},,,function(e,t){"use strict";!function(e,t,s,o){var i={thumbnail:!0,animateThumb:!0,currentPagerPosition:"middle",thumbWidth:100,thumbContHeight:100,thumbMargin:5,exThumbImage:!1,showThumbByDefault:!0,toogleThumb:!0,pullCaptionUp:!0,enableThumbDrag:!0,enableThumbSwipe:!0,swipeThreshold:50,loadYoutubeThumbnail:!0,youtubeThumbSize:1,loadVimeoThumbnail:!0,vimeoThumbSize:"thumbnail_small",loadDailymotionThumbnail:!0},l=function(t){return this.core=e(t).data("lightGallery"),this.core.s=e.extend({},i,this.core.s),this.$el=e(t),this.$thumbOuter=null,this.thumbOuterWidth=0,this.thumbTotalWidth=this.core.$items.length*(this.core.s.thumbWidth+this.core.s.thumbMargin),this.thumbIndex=this.core.index,this.left=0,this.init(),this};l.prototype.init=function(){var e=this;this.core.s.thumbnail&&this.core.$items.length>1&&(this.core.s.showThumbByDefault&&setTimeout(function(){e.core.$outer.addClass("lg-thumb-open")},700),this.core.s.pullCaptionUp&&this.core.$outer.addClass("lg-pull-caption-up"),this.build(),this.core.s.animateThumb?(this.core.s.enableThumbDrag&&!this.core.isTouch&&this.core.doCss()&&this.enableThumbDrag(),this.core.s.enableThumbSwipe&&this.core.isTouch&&this.core.doCss()&&this.enableThumbSwipe(),this.thumbClickable=!1):this.thumbClickable=!0,this.toogle(),this.thumbkeyPress())},l.prototype.build=function(){function s(e,t,s){var o,a=i.core.isVideo(e,s)||{},n="";a.youtube||a.vimeo||a.dailymotion?a.youtube?o=i.core.s.loadYoutubeThumbnail?"//img.youtube.com/vi/"+a.youtube[1]+"/"+i.core.s.youtubeThumbSize+".jpg":t:a.vimeo?i.core.s.loadVimeoThumbnail?(o="//i.vimeocdn.com/video/error_"+r+".jpg",n=a.vimeo[1]):o=t:a.dailymotion&&(o=i.core.s.loadDailymotionThumbnail?"//www.dailymotion.com/thumbnail/video/"+a.dailymotion[1]:t):o=t,l+='<div data-vimeo-id="'+n+'" class="lg-thumb-item" style="width:'+i.core.s.thumbWidth+"px; margin-right: "+i.core.s.thumbMargin+'px"><img src="'+o+'" /></div>',n=""}var o,i=this,l="",r="",a='<div class="lg-thumb-outer"><div class="lg-thumb group"></div></div>';switch(this.core.s.vimeoThumbSize){case"thumbnail_large":r="640";break;case"thumbnail_medium":r="200x150";break;case"thumbnail_small":r="100x75"}if(i.core.$outer.addClass("lg-has-thumb"),i.core.$outer.find(".lg").append(a),i.$thumbOuter=i.core.$outer.find(".lg-thumb-outer"),i.thumbOuterWidth=i.$thumbOuter.width(),i.core.s.animateThumb&&i.core.$outer.find(".lg-thumb").css({width:i.thumbTotalWidth+"px",position:"relative"}),this.core.s.animateThumb&&i.$thumbOuter.css("height",i.core.s.thumbContHeight+"px"),i.core.s.dynamic)for(var n=0;n<i.core.s.dynamicEl.length;n++)s(i.core.s.dynamicEl[n].src,i.core.s.dynamicEl[n].thumb,n);else i.core.$items.each(function(t){i.core.s.exThumbImage?s(e(this).attr("href")||e(this).attr("data-src"),e(this).attr(i.core.s.exThumbImage),t):s(e(this).attr("href")||e(this).attr("data-src"),e(this).find("img").attr("src"),t)});i.core.$outer.find(".lg-thumb").html(l),o=i.core.$outer.find(".lg-thumb-item"),o.each(function(){var t=e(this),s=t.attr("data-vimeo-id");s&&e.getJSON("//www.vimeo.com/api/v2/video/"+s+".json?callback=?",{format:"json"},function(e){t.find("img").attr("src",e[0][i.core.s.vimeoThumbSize])})}),o.eq(i.core.index).addClass("active"),i.core.$el.on("onBeforeSlide.lg.tm",function(){o.removeClass("active"),o.eq(i.core.index).addClass("active")}),o.on("click.lg touchend.lg",function(){var t=e(this);setTimeout(function(){(i.thumbClickable&&!i.core.lgBusy||!i.core.doCss())&&(i.core.index=t.index(),i.core.slide(i.core.index,!1,!0))},50)}),i.core.$el.on("onBeforeSlide.lg.tm",function(){i.animateThumb(i.core.index)}),e(t).on("resize.lg.thumb orientationchange.lg.thumb",function(){setTimeout(function(){i.animateThumb(i.core.index),i.thumbOuterWidth=i.$thumbOuter.width()},200)})},l.prototype.setTranslate=function(e){this.core.$outer.find(".lg-thumb").css({transform:"translate3d(-"+e+"px, 0px, 0px)"})},l.prototype.animateThumb=function(e){var t=this.core.$outer.find(".lg-thumb");if(this.core.s.animateThumb){var s;switch(this.core.s.currentPagerPosition){case"left":s=0;break;case"middle":s=this.thumbOuterWidth/2-this.core.s.thumbWidth/2;break;case"right":s=this.thumbOuterWidth-this.core.s.thumbWidth}this.left=(this.core.s.thumbWidth+this.core.s.thumbMargin)*e-1-s,this.left>this.thumbTotalWidth-this.thumbOuterWidth&&(this.left=this.thumbTotalWidth-this.thumbOuterWidth),this.left<0&&(this.left=0),this.core.lGalleryOn?(t.hasClass("on")||this.core.$outer.find(".lg-thumb").css("transition-duration",this.core.s.speed+"ms"),this.core.doCss()||t.animate({left:-this.left+"px"},this.core.s.speed)):this.core.doCss()||t.css("left",-this.left+"px"),this.setTranslate(this.left)}},l.prototype.enableThumbDrag=function(){var s=this,o=0,i=0,l=!1,r=!1,a=0;s.$thumbOuter.addClass("lg-grab"),s.core.$outer.find(".lg-thumb").on("mousedown.lg.thumb",function(e){s.thumbTotalWidth>s.thumbOuterWidth&&(e.preventDefault(),o=e.pageX,l=!0,s.core.$outer.scrollLeft+=1,s.core.$outer.scrollLeft-=1,s.thumbClickable=!1,s.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing"))}),e(t).on("mousemove.lg.thumb",function(e){l&&(a=s.left,r=!0,i=e.pageX,s.$thumbOuter.addClass("lg-dragging"),a-=i-o,a>s.thumbTotalWidth-s.thumbOuterWidth&&(a=s.thumbTotalWidth-s.thumbOuterWidth),0>a&&(a=0),s.setTranslate(a))}),e(t).on("mouseup.lg.thumb",function(){r?(r=!1,s.$thumbOuter.removeClass("lg-dragging"),s.left=a,Math.abs(i-o)<s.core.s.swipeThreshold&&(s.thumbClickable=!0)):s.thumbClickable=!0,l&&(l=!1,s.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab"))})},l.prototype.enableThumbSwipe=function(){var e=this,t=0,s=0,o=!1,i=0;e.core.$outer.find(".lg-thumb").on("touchstart.lg",function(s){e.thumbTotalWidth>e.thumbOuterWidth&&(s.preventDefault(),t=s.originalEvent.targetTouches[0].pageX,e.thumbClickable=!1)}),e.core.$outer.find(".lg-thumb").on("touchmove.lg",function(l){e.thumbTotalWidth>e.thumbOuterWidth&&(l.preventDefault(),s=l.originalEvent.targetTouches[0].pageX,o=!0,e.$thumbOuter.addClass("lg-dragging"),i=e.left,i-=s-t,i>e.thumbTotalWidth-e.thumbOuterWidth&&(i=e.thumbTotalWidth-e.thumbOuterWidth),0>i&&(i=0),e.setTranslate(i))}),e.core.$outer.find(".lg-thumb").on("touchend.lg",function(){e.thumbTotalWidth>e.thumbOuterWidth&&o?(o=!1,e.$thumbOuter.removeClass("lg-dragging"),Math.abs(s-t)<e.core.s.swipeThreshold&&(e.thumbClickable=!0),e.left=i):e.thumbClickable=!0})},l.prototype.toogle=function(){var e=this;e.core.s.toogleThumb&&(e.core.$outer.addClass("lg-can-toggle"),e.$thumbOuter.append('<span class="lg-toogle-thumb lg-icon"></span>'),e.core.$outer.find(".lg-toogle-thumb").on("click.lg",function(){e.core.$outer.toggleClass("lg-thumb-open")}))},l.prototype.thumbkeyPress=function(){var s=this;e(t).on("keydown.lg.thumb",function(e){38===e.keyCode?(e.preventDefault(),s.core.$outer.addClass("lg-thumb-open")):40===e.keyCode&&(e.preventDefault(),s.core.$outer.removeClass("lg-thumb-open"))})},l.prototype.destroy=function(){this.core.s.thumbnail&&this.core.$items.length>1&&(e(t).off("resize.lg.thumb orientationchange.lg.thumb keydown.lg.thumb"),this.$thumbOuter.remove(),this.core.$outer.removeClass("lg-has-thumb"))},e.fn.lightGallery.modules.Thumbnail=l}(jQuery,window,document)},,function(e,t){"use strict";!function(e,t,s,o){var i={scale:1,zoom:!0,enableZoomAfter:300},l=function(s){return this.core=e(s).data("lightGallery"),this.core.s=e.extend({},i,this.core.s),this.core.s.zoom&&this.core.doCss()&&(this.init(),this.zoomabletimeout=!1,this.pageX=e(t).width()/2,this.pageY=e(t).height()/2+e(t).scrollTop()),this};l.prototype.init=function(){var s=this,o='<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';this.core.$outer.find(".lg-toolbar").append(o),s.core.$el.on("onSlideItemLoad.lg.tm.zoom",function(t,o,i){var l=s.core.s.enableZoomAfter+i;e("body").hasClass("lg-from-hash")&&i?l=0:e("body").removeClass("lg-from-hash"),s.zoomabletimeout=setTimeout(function(){s.core.$slide.eq(o).addClass("lg-zoomable")},l+30)});var i=1,l=function(o){var i,l,r=s.core.$outer.find(".lg-current .lg-image"),a=(e(t).width()-r.width())/2,n=(e(t).height()-r.height())/2+e(t).scrollTop();i=s.pageX-a,l=s.pageY-n;var d=(o-1)*i,u=(o-1)*l;r.css("transform","scale3d("+o+", "+o+", 1)").attr("data-scale",o),r.parent().css("transform","translate3d(-"+d+"px, -"+u+"px, 0)").attr("data-x",d).attr("data-y",u)},r=function(){i>1?s.core.$outer.addClass("lg-zoomed"):s.resetZoom(),1>i&&(i=1),l(i)},a=function(e,t,o){var l,a=t.width();l=s.core.s.dynamic?s.core.s.dynamicEl[o].width||t[0].naturalWidth||a:s.core.$items.eq(o).attr("data-width")||t[0].naturalWidth||a;var n;s.core.$outer.hasClass("lg-zoomed")?i=1:l>a&&(n=l/a,i=n||2),s.pageX=e.pageX||e.originalEvent.targetTouches[0].pageX,s.pageY=e.pageY||e.originalEvent.targetTouches[0].pageY,r(),setTimeout(function(){s.core.$outer.removeClass("lg-grabbing").addClass("lg-grab")},10)},n=!1;s.core.$el.on("onAferAppendSlide.lg.tm.zoom",function(e,t){var o=s.core.$slide.eq(t).find(".lg-image");o.on("dblclick",function(e){a(e,o,t)}),o.on("touchstart",function(e){n?(clearTimeout(n),n=null,a(e,o,t)):n=setTimeout(function(){n=null},300),e.preventDefault()})}),e(t).on("resize.lg.zoom scroll.lg.zoom orientationchange.lg.zoom",function(){s.pageX=e(t).width()/2,s.pageY=e(t).height()/2+e(t).scrollTop(),l(i)}),e("#lg-zoom-out").on("click.lg",function(){s.core.$outer.find(".lg-current .lg-image").length&&(i-=s.core.s.scale,r())}),e("#lg-zoom-in").on("click.lg",function(){s.core.$outer.find(".lg-current .lg-image").length&&(i+=s.core.s.scale,r())}),s.core.$el.on("onBeforeSlide.lg.tm",function(){i=1,s.resetZoom()}),s.core.isTouch||s.zoomDrag(),s.core.isTouch&&s.zoomSwipe()},l.prototype.resetZoom=function(){this.core.$outer.removeClass("lg-zoomed"),this.core.$slide.find(".lg-img-wrap").removeAttr("style data-x data-y"),this.core.$slide.find(".lg-image").removeAttr("style data-scale"),this.pageX=e(t).width()/2,this.pageY=e(t).height()/2+e(t).scrollTop()},l.prototype.zoomSwipe=function(){var e=this,t={},s={},o=!1,i=!1,l=!1;e.core.$slide.on("touchstart.lg",function(s){if(e.core.$outer.hasClass("lg-zoomed")){var o=e.core.$slide.eq(e.core.index).find(".lg-object");l=o.outerHeight()*o.attr("data-scale")>e.core.$outer.find(".lg").height(),i=o.outerWidth()*o.attr("data-scale")>e.core.$outer.find(".lg").width(),(i||l)&&(s.preventDefault(),t={x:s.originalEvent.targetTouches[0].pageX,y:s.originalEvent.targetTouches[0].pageY})}}),e.core.$slide.on("touchmove.lg",function(r){if(e.core.$outer.hasClass("lg-zoomed")){var a,n,d=e.core.$slide.eq(e.core.index).find(".lg-img-wrap");r.preventDefault(),o=!0,s={x:r.originalEvent.targetTouches[0].pageX,y:r.originalEvent.targetTouches[0].pageY},e.core.$outer.addClass("lg-zoom-dragging"),n=l?-Math.abs(d.attr("data-y"))+(s.y-t.y):-Math.abs(d.attr("data-y")),a=i?-Math.abs(d.attr("data-x"))+(s.x-t.x):-Math.abs(d.attr("data-x")),(Math.abs(s.x-t.x)>15||Math.abs(s.y-t.y)>15)&&d.css("transform","translate3d("+a+"px, "+n+"px, 0)")}}),e.core.$slide.on("touchend.lg",function(){e.core.$outer.hasClass("lg-zoomed")&&o&&(o=!1,e.core.$outer.removeClass("lg-zoom-dragging"),e.touchendZoom(t,s,i,l))})},l.prototype.zoomDrag=function(){var s=this,o={},i={},l=!1,r=!1,a=!1,n=!1;s.core.$slide.on("mousedown.lg.zoom",function(t){var i=s.core.$slide.eq(s.core.index).find(".lg-object");n=i.outerHeight()*i.attr("data-scale")>s.core.$outer.find(".lg").height(),a=i.outerWidth()*i.attr("data-scale")>s.core.$outer.find(".lg").width(),s.core.$outer.hasClass("lg-zoomed")&&e(t.target).hasClass("lg-object")&&(a||n)&&(t.preventDefault(),o={x:t.pageX,y:t.pageY},l=!0,s.core.$outer.scrollLeft+=1,s.core.$outer.scrollLeft-=1,s.core.$outer.removeClass("lg-grab").addClass("lg-grabbing"))}),e(t).on("mousemove.lg.zoom",function(e){if(l){var t,d,u=s.core.$slide.eq(s.core.index).find(".lg-img-wrap");r=!0,i={x:e.pageX,y:e.pageY},s.core.$outer.addClass("lg-zoom-dragging"),d=n?-Math.abs(u.attr("data-y"))+(i.y-o.y):-Math.abs(u.attr("data-y")),t=a?-Math.abs(u.attr("data-x"))+(i.x-o.x):-Math.abs(u.attr("data-x")),u.css("transform","translate3d("+t+"px, "+d+"px, 0)")}}),e(t).on("mouseup.lg.zoom",function(e){l&&(l=!1,s.core.$outer.removeClass("lg-zoom-dragging"),!r||o.x===i.x&&o.y===i.y||(i={x:e.pageX,y:e.pageY},s.touchendZoom(o,i,a,n)),r=!1),s.core.$outer.removeClass("lg-grabbing").addClass("lg-grab")})},l.prototype.touchendZoom=function(e,t,s,o){var i=this,l=i.core.$slide.eq(i.core.index).find(".lg-img-wrap"),r=i.core.$slide.eq(i.core.index).find(".lg-object"),a=-Math.abs(l.attr("data-x"))+(t.x-e.x),n=-Math.abs(l.attr("data-y"))+(t.y-e.y),d=(i.core.$outer.find(".lg").height()-r.outerHeight())/2,u=Math.abs(r.outerHeight()*Math.abs(r.attr("data-scale"))-i.core.$outer.find(".lg").height()+d),c=(i.core.$outer.find(".lg").width()-r.outerWidth())/2,h=Math.abs(r.outerWidth()*Math.abs(r.attr("data-scale"))-i.core.$outer.find(".lg").width()+c);(Math.abs(t.x-e.x)>15||Math.abs(t.y-e.y)>15)&&(o&&(-u>=n?n=-u:n>=-d&&(n=-d)),s&&(-h>=a?a=-h:a>=-c&&(a=-c)),o?l.attr("data-y",Math.abs(n)):n=-Math.abs(l.attr("data-y")),s?l.attr("data-x",Math.abs(a)):a=-Math.abs(l.attr("data-x")),l.css("transform","translate3d("+a+"px, "+n+"px, 0)"))},l.prototype.destroy=function(){var s=this;s.core.$el.off(".lg.zoom"),e(t).off(".lg.zoom"),s.core.$slide.off(".lg.zoom"),s.core.$el.off(".lg.tm.zoom"),s.resetZoom(),clearTimeout(s.zoomabletimeout),s.zoomabletimeout=!1},e.fn.lightGallery.modules.zoom=l}(jQuery,window,document)},function(e,t){"use strict";!function(e,t,s,o){function i(t,o){if(this.el=t,this.$el=e(t),this.s=e.extend({},l,o),this.s.dynamic&&"undefined"!==this.s.dynamicEl&&this.s.dynamicEl.constructor===Array&&!this.s.dynamicEl.length)throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.modules={},this.lGalleryOn=!1,this.lgBusy=!1,this.hideBartimeout=!1,this.isTouch="ontouchstart"in s.documentElement,this.s.slideEndAnimatoin&&(this.s.hideControlOnEnd=!1),this.s.dynamic?this.$items=this.s.dynamicEl:"this"===this.s.selector?this.$items=this.$el:""!==this.s.selector?this.s.selectWithin?this.$items=e(this.s.selectWithin).find(this.s.selector):this.$items=this.$el.find(e(this.s.selector)):this.$items=this.$el.children(),this.$slide="",this.$outer="",this.init(),this}var l={mode:"lg-slide",cssEasing:"ease",easing:"linear",speed:600,height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:150,hideBarsDelay:6e3,useLeft:!1,closable:!0,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimatoin:!0,hideControlOnEnd:!1,mousewheel:!0,appendSubHtmlTo:".lg-sub-html",preload:1,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:!1,iframeMaxWidth:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],galleryId:1};i.prototype.init=function(){var s=this;s.s.preload>s.$items.length&&(s.s.preload=s.$items.length);var o=t.location.hash;o.indexOf("lg="+this.s.galleryId)>0&&(s.index=parseInt(o.split("&slide=")[1],10),e("body").addClass("lg-from-hash"),e("body").hasClass("lg-on")||setTimeout(function(){s.build(s.index),e("body").addClass("lg-on")})),s.s.dynamic?(s.$el.trigger("onBeforeOpen.lg"),s.index=s.s.index||0,e("body").hasClass("lg-on")||setTimeout(function(){s.build(s.index),e("body").addClass("lg-on")})):s.$items.on("click.lgcustom",function(t){try{t.preventDefault(),t.preventDefault()}catch(o){t.returnValue=!1}s.$el.trigger("onBeforeOpen.lg"),s.index=s.s.index||s.$items.index(this),e("body").hasClass("lg-on")||(s.build(s.index),e("body").addClass("lg-on"))})},i.prototype.build=function(t){var s=this;s.structure(),e.each(e.fn.lightGallery.modules,function(t){s.modules[t]=new e.fn.lightGallery.modules[t](s.el)}),s.slide(t,!1,!1),s.s.keyPress&&s.keyPress(),s.$items.length>1&&(s.arrow(),setTimeout(function(){s.enableDrag(),s.enableSwipe()},50),s.s.mousewheel&&s.mousewheel()),s.counter(),s.closeGallery(),s.$el.trigger("onAfterOpen.lg"),s.$outer.on("mousemove.lg click.lg touchstart.lg",function(){s.$outer.removeClass("lg-hide-items"),clearTimeout(s.hideBartimeout),s.hideBartimeout=setTimeout(function(){s.$outer.addClass("lg-hide-items")},s.s.hideBarsDelay)})},i.prototype.structure=function(){var s,o="",i="",l=0,r="",a=this;for(e("body").append('<div class="lg-backdrop"></div>'),e(".lg-backdrop").css("transition-duration",this.s.backdropDuration+"ms"),l=0;l<this.$items.length;l++)o+='<div class="lg-item"></div>';if(this.s.controls&&this.$items.length>1&&(i='<div class="lg-actions"><div class="lg-prev lg-icon">'+this.s.prevHtml+'</div><div class="lg-next lg-icon">'+this.s.nextHtml+"</div></div>"),".lg-sub-html"===this.s.appendSubHtmlTo&&(r='<div class="lg-sub-html"></div>'),s='<div class="lg-outer '+this.s.addClass+" "+this.s.startClass+'"><div class="lg" style="width:'+this.s.width+"; height:"+this.s.height+'"><div class="lg-inner">'+o+'</div><div class="lg-toolbar group"><span class="lg-close lg-icon"></span></div>'+i+r+"</div></div>",e("body").append(s),this.$outer=e(".lg-outer"),this.$slide=this.$outer.find(".lg-item"),this.s.useLeft?(this.$outer.addClass("lg-use-left"),this.s.mode="lg-slide"):this.$outer.addClass("lg-use-css3"),a.setTop(),e(t).on("resize.lg orientationchange.lg",function(){setTimeout(function(){a.setTop()},100)}),this.$slide.eq(this.index).addClass("lg-current"),this.doCss()?this.$outer.addClass("lg-css3"):(this.$outer.addClass("lg-css"),this.s.speed=0),this.$outer.addClass(this.s.mode),this.s.enableDrag&&this.$items.length>1&&this.$outer.addClass("lg-grab"),this.s.showAfterLoad&&this.$outer.addClass("lg-show-after-load"),this.doCss()){var n=this.$outer.find(".lg-inner");n.css("transition-timing-function",this.s.cssEasing),n.css("transition-duration",this.s.speed+"ms")}e(".lg-backdrop").addClass("in"),setTimeout(function(){a.$outer.addClass("lg-visible")},this.s.backdropDuration),this.s.download&&this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'),this.prevScrollTop=e(t).scrollTop()},i.prototype.setTop=function(){if("100%"!==this.s.height){var s=e(t).height(),o=(s-parseInt(this.s.height,10))/2,i=this.$outer.find(".lg");s>=parseInt(this.s.height,10)?i.css("top",o+"px"):i.css("top","0px")}},i.prototype.doCss=function(){var e=function(){var e=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],t=s.documentElement,o=0;for(o=0;o<e.length;o++)if(e[o]in t.style)return!0};return e()?!0:!1},i.prototype.isVideo=function(e,t){var s;if(s=this.s.dynamic?this.s.dynamicEl[t].html:this.$items.eq(t).attr("data-html"),!e&&s)return{html5:!0};var o=e.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),i=e.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),l=e.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),r=e.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);return o?{youtube:o}:i?{vimeo:i}:l?{dailymotion:l}:r?{vk:r}:void 0},i.prototype.counter=function(){this.s.counter&&e(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">'+(parseInt(this.index,10)+1)+'</span> / <span id="lg-counter-all">'+this.$items.length+"</span></div>")},i.prototype.addHtml=function(t){var s,o=null;if(this.s.dynamic?this.s.dynamicEl[t].subHtmlUrl?s=this.s.dynamicEl[t].subHtmlUrl:o=this.s.dynamicEl[t].subHtml:this.$items.eq(t).attr("data-sub-html-url")?s=this.$items.eq(t).attr("data-sub-html-url"):o=this.$items.eq(t).attr("data-sub-html"),!s)if("undefined"!=typeof o&&null!==o){var i=o.substring(0,1);o="."===i||"#"===i?e(o).html():o}else o="";".lg-sub-html"===this.s.appendSubHtmlTo?s?this.$outer.find(this.s.appendSubHtmlTo).load(s):this.$outer.find(this.s.appendSubHtmlTo).html(o):s?this.$slide.eq(t).load(s):this.$slide.eq(t).append(o),"undefined"!=typeof o&&null!==o&&(""===o?this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html"):this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")),this.$el.trigger("onAfterAppendSubHtml.lg",[t])},i.prototype.preload=function(e){var t=1,s=1;for(t=1;t<=this.s.preload&&!(t>=this.$items.length-e);t++)this.loadContent(e+t,!1,0);for(s=1;s<=this.s.preload&&!(0>e-s);s++)this.loadContent(e-s,!1,0)},i.prototype.loadContent=function(s,o,i){var l,r,a,n,d,u,c=this,h=!1,g=function(s){for(var o=[],i=[],l=0;l<s.length;l++){var a=s[l].split(" ");""===a[0]&&a.splice(0,1),i.push(a[0]),o.push(a[1])}for(var n=e(t).width(),d=0;d<o.length;d++)if(parseInt(o[d],10)>n){r=i[d];break}};if(c.s.dynamic){if(c.s.dynamicEl[s].poster&&(h=!0,a=c.s.dynamicEl[s].poster),u=c.s.dynamicEl[s].html,r=c.s.dynamicEl[s].src,c.s.dynamicEl[s].responsive){var m=c.s.dynamicEl[s].responsive.split(",");g(m)}n=c.s.dynamicEl[s].srcset,d=c.s.dynamicEl[s].sizes}else{if(c.$items.eq(s).attr("data-poster")&&(h=!0,a=c.$items.eq(s).attr("data-poster")),u=c.$items.eq(s).attr("data-html"),r=c.$items.eq(s).attr("href")||c.$items.eq(s).attr("data-src"),c.$items.eq(s).attr("data-responsive")){var p=c.$items.eq(s).attr("data-responsive").split(",");g(p)}n=c.$items.eq(s).attr("data-srcset"),d=c.$items.eq(s).attr("data-sizes")}var f=!1;c.s.dynamic?c.s.dynamicEl[s].iframe&&(f=!0):"true"===c.$items.eq(s).attr("data-iframe")&&(f=!0);var b=c.isVideo(r,s);if(!c.$slide.eq(s).hasClass("lg-loaded")){if(f)c.$slide.eq(s).prepend('<div class="lg-video-cont" style="max-width:'+c.s.iframeMaxWidth+'"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="'+r+'"  allowfullscreen="true"></iframe></div></div>');else if(h){var v="";v=b&&b.youtube?"lg-has-youtube":b&&b.vimeo?"lg-has-vimeo":"lg-has-html5",c.$slide.eq(s).prepend('<div class="lg-video-cont '+v+' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="'+a+'" /></div></div>')}else b?(c.$slide.eq(s).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'),c.$el.trigger("hasVideo.lg",[s,r,u])):c.$slide.eq(s).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="'+r+'" /></div>');if(c.$el.trigger("onAferAppendSlide.lg",[s]),l=c.$slide.eq(s).find(".lg-object"),d&&l.attr("sizes",d),n){l.attr("srcset",n);try{picturefill({elements:[l[0]]})}catch(y){console.error("Make sure you have included Picturefill version 2")}}".lg-sub-html"!==this.s.appendSubHtmlTo&&c.addHtml(s),c.$slide.eq(s).addClass("lg-loaded")}c.$slide.eq(s).find(".lg-object").on("load.lg error.lg",function(){var t=0;i&&!e("body").hasClass("lg-from-hash")&&(t=i),setTimeout(function(){c.$slide.eq(s).addClass("lg-complete"),c.$el.trigger("onSlideItemLoad.lg",[s,i||0])},t)}),b&&b.html5&&!h&&c.$slide.eq(s).addClass("lg-complete"),o===!0&&(c.$slide.eq(s).hasClass("lg-complete")?c.preload(s):c.$slide.eq(s).find(".lg-object").on("load.lg error.lg",function(){c.preload(s)}))},i.prototype.slide=function(t,s,o){var i=this.$outer.find(".lg-current").index(),l=this;if(!l.lGalleryOn||i!==t){var r=this.$slide.length,a=l.lGalleryOn?this.s.speed:0,n=!1,d=!1;if(!l.lgBusy){if(this.s.download){var u;u=l.s.dynamic?l.s.dynamicEl[t].downloadUrl!==!1&&(l.s.dynamicEl[t].downloadUrl||l.s.dynamicEl[t].src):"false"!==l.$items.eq(t).attr("data-download-url")&&(l.$items.eq(t).attr("data-download-url")||l.$items.eq(t).attr("href")||l.$items.eq(t).attr("data-src")),u?(e("#lg-download").attr("href",u),l.$outer.removeClass("lg-hide-download")):l.$outer.addClass("lg-hide-download")}if(this.$el.trigger("onBeforeSlide.lg",[i,t,s,o]),l.lgBusy=!0,clearTimeout(l.hideBartimeout),".lg-sub-html"===this.s.appendSubHtmlTo&&setTimeout(function(){l.addHtml(t)},a),this.arrowDisable(t),s){var c=t-1,h=t+1;0===t&&i===r-1?(h=0,c=r-1):t===r-1&&0===i&&(h=0,c=r-1),this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"),l.$slide.eq(c).addClass("lg-prev-slide"),l.$slide.eq(h).addClass("lg-next-slide"),l.$slide.eq(t).addClass("lg-current")}else l.$outer.addClass("lg-no-trans"),this.$slide.removeClass("lg-prev-slide lg-next-slide"),i>t?(d=!0,0!==t||i!==r-1||o||(d=!1,n=!0)):t>i&&(n=!0,t!==r-1||0!==i||o||(d=!0,n=!1)),d?(this.$slide.eq(t).addClass("lg-prev-slide"),this.$slide.eq(i).addClass("lg-next-slide")):n&&(this.$slide.eq(t).addClass("lg-next-slide"),this.$slide.eq(i).addClass("lg-prev-slide")),setTimeout(function(){l.$slide.removeClass("lg-current"),l.$slide.eq(t).addClass("lg-current"),l.$outer.removeClass("lg-no-trans")},50);l.lGalleryOn?(setTimeout(function(){l.loadContent(t,!0,0)},this.s.speed+50),setTimeout(function(){l.lgBusy=!1,l.$el.trigger("onAfterSlide.lg",[i,t,s,o])},this.s.speed)):(l.loadContent(t,!0,l.s.backdropDuration),l.lgBusy=!1,l.$el.trigger("onAfterSlide.lg",[i,t,s,o])),l.lGalleryOn=!0,this.s.counter&&e("#lg-counter-current").text(t+1)}}},i.prototype.goToNextSlide=function(e){var t=this;t.lgBusy||(t.index+1<t.$slide.length?(t.index++,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.loop?(t.index=0,t.$el.trigger("onBeforeNextSlide.lg",[t.index]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-right-end"),setTimeout(function(){t.$outer.removeClass("lg-right-end")},400)))},i.prototype.goToPrevSlide=function(e){var t=this;t.lgBusy||(t.index>0?(t.index--,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.loop?(t.index=t.$items.length-1,t.$el.trigger("onBeforePrevSlide.lg",[t.index,e]),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(t.$outer.addClass("lg-left-end"),setTimeout(function(){t.$outer.removeClass("lg-left-end")},400)))},i.prototype.keyPress=function(){var s=this;this.$items.length>1&&e(t).on("keyup.lg",function(e){s.$items.length>1&&(37===e.keyCode&&(e.preventDefault(),s.goToPrevSlide()),39===e.keyCode&&(e.preventDefault(),s.goToNextSlide()))}),e(t).on("keydown.lg",function(e){s.s.escKey===!0&&27===e.keyCode&&(e.preventDefault(),s.$outer.hasClass("lg-thumb-open")?s.$outer.removeClass("lg-thumb-open"):s.destroy())})},i.prototype.arrow=function(){var e=this;this.$outer.find(".lg-prev").on("click.lg",function(){e.goToPrevSlide()}),this.$outer.find(".lg-next").on("click.lg",function(){e.goToNextSlide()})},i.prototype.arrowDisable=function(e){!this.s.loop&&this.s.hideControlOnEnd&&(e+1<this.$slide.length?this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-next").attr("disabled","disabled").addClass("disabled"),e>0?this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled"):this.$outer.find(".lg-prev").attr("disabled","disabled").addClass("disabled"))},i.prototype.setTranslate=function(e,t,s){this.s.useLeft?e.css("left",t):e.css({transform:"translate3d("+t+"px, "+s+"px, 0px)"})},i.prototype.touchMove=function(t,s){var o=s-t;Math.abs(o)>15&&(this.$outer.addClass("lg-dragging"),this.setTranslate(this.$slide.eq(this.index),o,0),this.setTranslate(e(".lg-prev-slide"),-this.$slide.eq(this.index).width()+o,0),this.setTranslate(e(".lg-next-slide"),this.$slide.eq(this.index).width()+o,0))},i.prototype.touchEnd=function(e){var t=this;"lg-slide"!==t.s.mode&&t.$outer.addClass("lg-slide"),this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity","0"),setTimeout(function(){t.$outer.removeClass("lg-dragging"),0>e&&Math.abs(e)>t.s.swipeThreshold?t.goToNextSlide(!0):e>0&&Math.abs(e)>t.s.swipeThreshold?t.goToPrevSlide(!0):Math.abs(e)<5&&t.$el.trigger("onSlideClick.lg"),t.$slide.removeAttr("style")}),setTimeout(function(){t.$outer.hasClass("lg-dragging")||"lg-slide"===t.s.mode||t.$outer.removeClass("lg-slide")},t.s.speed+100)},i.prototype.enableSwipe=function(){var e=this,t=0,s=0,o=!1;e.s.enableSwipe&&e.isTouch&&e.doCss()&&(e.$slide.on("touchstart.lg",function(s){
e.$outer.hasClass("lg-zoomed")||e.lgBusy||(s.preventDefault(),e.manageSwipeClass(),t=s.originalEvent.targetTouches[0].pageX)}),e.$slide.on("touchmove.lg",function(i){e.$outer.hasClass("lg-zoomed")||(i.preventDefault(),s=i.originalEvent.targetTouches[0].pageX,e.touchMove(t,s),o=!0)}),e.$slide.on("touchend.lg",function(){e.$outer.hasClass("lg-zoomed")||(o?(o=!1,e.touchEnd(s-t)):e.$el.trigger("onSlideClick.lg"))}))},i.prototype.enableDrag=function(){var s=this,o=0,i=0,l=!1,r=!1;s.s.enableDrag&&!s.isTouch&&s.doCss()&&(s.$slide.on("mousedown.lg",function(t){s.$outer.hasClass("lg-zoomed")||(e(t.target).hasClass("lg-object")||e(t.target).hasClass("lg-video-play"))&&(t.preventDefault(),s.lgBusy||(s.manageSwipeClass(),o=t.pageX,l=!0,s.$outer.scrollLeft+=1,s.$outer.scrollLeft-=1,s.$outer.removeClass("lg-grab").addClass("lg-grabbing"),s.$el.trigger("onDragstart.lg")))}),e(t).on("mousemove.lg",function(e){l&&(r=!0,i=e.pageX,s.touchMove(o,i),s.$el.trigger("onDragmove.lg"))}),e(t).on("mouseup.lg",function(t){r?(r=!1,s.touchEnd(i-o),s.$el.trigger("onDragend.lg")):(e(t.target).hasClass("lg-object")||e(t.target).hasClass("lg-video-play"))&&s.$el.trigger("onSlideClick.lg"),l&&(l=!1,s.$outer.removeClass("lg-grabbing").addClass("lg-grab"))}))},i.prototype.manageSwipeClass=function(){var e=this.index+1,t=this.index-1,s=this.$slide.length;this.s.loop&&(0===this.index?t=s-1:this.index===s-1&&(e=0)),this.$slide.removeClass("lg-next-slide lg-prev-slide"),t>-1&&this.$slide.eq(t).addClass("lg-prev-slide"),this.$slide.eq(e).addClass("lg-next-slide")},i.prototype.mousewheel=function(){var e=this;e.$outer.on("mousewheel.lg",function(t){t.deltaY&&(t.deltaY>0?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},i.prototype.closeGallery=function(){var t=this,s=!1;this.$outer.find(".lg-close").on("click.lg",function(){t.destroy()}),t.s.closable&&(t.$outer.on("mousedown.lg",function(t){s=e(t.target).is(".lg-outer")||e(t.target).is(".lg-item ")||e(t.target).is(".lg-img-wrap")?!0:!1}),t.$outer.on("mouseup.lg",function(o){(e(o.target).is(".lg-outer")||e(o.target).is(".lg-item ")||e(o.target).is(".lg-img-wrap")&&s)&&(t.$outer.hasClass("lg-dragging")||t.destroy())}))},i.prototype.destroy=function(s){var o=this;s||o.$el.trigger("onBeforeClose.lg"),e(t).scrollTop(o.prevScrollTop),s&&(o.s.dynamic||this.$items.off("click.lg click.lgcustom"),e.removeData(o.el,"lightGallery")),this.$el.off(".lg.tm"),e.each(e.fn.lightGallery.modules,function(e){o.modules[e]&&o.modules[e].destroy()}),this.lGalleryOn=!1,clearTimeout(o.hideBartimeout),this.hideBartimeout=!1,e(t).off(".lg"),e("body").removeClass("lg-on lg-from-hash"),o.$outer&&o.$outer.removeClass("lg-visible"),e(".lg-backdrop").removeClass("in"),setTimeout(function(){o.$outer&&o.$outer.remove(),e(".lg-backdrop").remove(),s||o.$el.trigger("onCloseAfter.lg")},o.s.backdropDuration+50)},e.fn.lightGallery=function(t){return this.each(function(){if(e.data(this,"lightGallery"))try{e(this).data("lightGallery").init()}catch(s){console.error("lightGallery has not initiated properly")}else e.data(this,"lightGallery",new i(this,t))})},e.fn.lightGallery.modules={}}(jQuery,window,document)},function(e,t,s){"use strict";s(8),s(2),s(5),s(1),s(7)}]);