// JavaScript Document
(function($) {
    $.fn.slides = function(option) {
        option = $.extend({}, $.fn.slides.option, option);
        return this.each(function() {
            this.animated = animate;
            $('.' + option.container, $(this)).children().wrapAll('<div class="slides-control"/>');
            var elem = $(this),
                control = $('.slides-control', elem),
                total = control.children().size(),
                width = control.children().outerWidth ? control.children().outerWidth() : control.children().width(),
                height = control.children().outerHeight ? control.children().outerHeight() : control.children().height(),
                start = option.start - 1,
                effect = option.effect.indexOf(',') < 0 ? option.effect : option.effect.replace(' ', '').split(',')[0],
                paginationEffect = option.effect.indexOf(',') < 0 ? effect : option.effect.replace(' ', '').split(',')[1],
                next = 0,
                prev = 0,
                number = 0,
                current = 0,
                loaded,
                active,
                clicked,
                position,
                direction;
            if (total < 2) {
                return;
            }
            if (start < 0) {
                start = 0;
            };
            if (start > total) {
                start = total - 1;
            };
            if (option.start) {
                current = start;
            };
            if (option.randomize) {
                control.randomize();
            }
            $('.' + option.container, elem).css({
                overflow: 'hidden',
                position: 'relative'
            });
            control.css({
                position: 'relative',
                left: -width
            });
            control.children().css({
                position: 'absolute',
                top: 0,
                left: width,
                zIndex: 0,
                display: 'none'
            });
            if (option.autoHeight) {
                control.animate({
                        height: control.children(':eq(' + start + ')').height()
                    },
                    option.autoHeightSpeed);
            }
            if (option.preload && control.children()[0].tagName == 'IMG') {
                elem.css({
                    background: 'url(' + option.preloadImage + ') no-repeat 50% 50%'
                });
                var img = $('img:eq(' + start + ')', elem).attr('src') + '?' + (new Date()).getTime();
                $('img:eq(' + start + ')', elem).attr('src', img).load(function() {
                    $(this).fadeIn(option.fadeSpeed,
                        function() {
                            $(this).css({
                                zIndex: 5
                            });
                            elem.css({
                                background: ''
                            });
                            loaded = true;
                        });
                });
            } else {
                control.children().eq(start).fadeIn(0,
                    function() {
                        loaded = true;
                    });
            }
            if (option.bigTarget) {
                control.children().css({
                    cursor: 'pointer'
                });
                control.children().on('tap click', function() {
                    animate('next', effect);
                    return false;
                });
            }
            if (option.hoverPause && option.play) {
                control.children().bind('mouseover',
                    function() {
                        stop();
                    });
                control.children().bind('mouseleave',
                    function() {
                        pause();
                    });
            }
			if (option.bindDirectionNav) {
				!option.navigationLoop && option.start == 1 ? $(option.bindDirectionNav).find('.prev').addClass('disabled') : !option.navigationLoop && option.start == total ? $(option.bindDirectionNav).find('.next').addClass('disabled') : null;
				$(option.bindDirectionNav).find('.prev').off('click').on('click', function(e) {
					e.preventDefault();
					if ($(this).hasClass('disabled')) {
						return
					};
					if (option.play) {
						pause();
					};
					animate('prev', effect);
				})
				$(option.bindDirectionNav).find('.next').off('click').on('click', function(e) {
					e.preventDefault();
					if ($(this).hasClass('disabled')) {
						return
					};
					if (option.play) {
						pause();
					};
					animate('next', effect);
				})

			}
            if (option.generateNextPrev) {
                $('.' + option.container, elem).after('<a href="#" class="' + option.prev + '">Prev</a>');
                $('.' + option.prev, elem).after('<a href="#" class="' + option.next + '">Next</a>');
                !option.navigationLoop && option.start == 1 ? $('.' + option.prev, elem).addClass('disabled') : !option.navigationLoop && option.start == total ? $('.' + option.next, elem).addClass('disabled') : null;

            }
            $('.' + option.next, elem).on('tap click', function(e) {
                e.preventDefault();
                if (option.play) {
                    pause();
                };
                animate('next', effect);
            });
            $('.' + option.prev, elem).on('tap click', function(e) {
                e.preventDefault();
                if (option.play) {
                    pause();
                };
                animate('prev', effect);
            });
            if (option.generatePagination) {
                elem.append('<ul class=' + option.paginationClass + '></ul>');
                control.children().each(function() {
                    $('.' + option.paginationClass, elem).append('<li><a href="#' + number + '" data-slide="' + number + '">' + (number + 1) + '</a></li>');
                    number++;
                });
            } else {
                $('.' + option.paginationClass + ' li a', elem).each(function() {
                    $(this).attr('href', '#' + number);
                    number++;
                });
            }
            $('.' + option.paginationClass + ' li', elem).eq(start).find('a').addClass('cur').find("span").fadeIn();
            $('.' + option.paginationClass + ' li a', elem).on('tap click', function() {
                if (option.play) {
                    pause();
                };
                // clicked = $(this).attr('href').replace('#', '');
                clicked = $(this).attr('data-slide');
                if (current != clicked) {
                    animate('pagination', paginationEffect, clicked);
                }
                return false;
            });
            $('a.link', elem).on('tap click', function() {
                if (option.play) {
                    pause();
                };
                // clicked = $(this).attr('href').replace('#', '') - 1;
                clicked = $(this).attr('data-slide') - 1;
                if (current != clicked) {
                    animate('pagination', paginationEffect, clicked);
                }
                return false;
            });
            if (option.play) {
                playInterval = setInterval(function() {
                        animate('next', effect);
                    },
                    option.play);
                elem.data('interval', playInterval);
            };

            function stop() {
                clearInterval(elem.data('interval'));
            };

            function pause() {
                if (option.pause) {
                    clearTimeout(elem.data('pause'));
                    clearInterval(elem.data('interval'));
                    pauseTimeout = setTimeout(function() {
                            clearTimeout(elem.data('pause'));
                            playInterval = setInterval(function() {
                                    animate("next", effect);
                                },
                                option.play);
                            elem.data('interval', playInterval);
                        },
                        option.pause);
                    elem.data('pause', pauseTimeout);
                } else {
                    stop();
                }
            };

            function animate(direction, effect, clicked) {
                if (!active && loaded) {
                    active = true;
                    switch (direction) {
                        case 'next':
                            prev = current;
                            next = current + 1;
                            next = total === next ? 0 : next;
                            position = width * 2;
                            direction = -width * 2;
                            current = next;
                            !option.navigationLoop ? option.bindDirectionNav ? (next == total - 1 ? $(option.bindDirectionNav).find('.next').addClass('disabled').siblings().removeClass('disabled') : $(option.bindDirectionNav).find('a').removeClass('disabled')) : (next == total - 1 ? $('.' + option.next, elem).addClass('disabled') : $('.' + option.next + ',.' + option.prev, elem).removeClass('disabled')) : null;

                            !option.navigationLoop && option.bindDirectionNav ? (next == 0 ? $(option.bindDirectionNav).find('.prev').addClass('disabled').siblings().removeClass('disabled') : null) : null;
                            break;
                        case 'prev':
                            prev = current;
                            next = current - 1;
                            next = next === -1 ? total - 1 : next;
                            position = 0;
                            direction = 0;
                            current = next;
                            !option.navigationLoop ? option.bindDirectionNav ? (next == 0 ? $(option.bindDirectionNav).find('.prev').addClass('disabled').siblings().removeClass('disabled') : $(option.bindDirectionNav).find('a').removeClass('disabled')) : (next == 0 ? $('.' + option.prev, elem).addClass('disabled') : $('.' + option.prev + ',.' + option.next, elem).removeClass('disabled')) : null;
                            break;
                        case 'pagination':
                            next = parseInt(clicked, 10);
                            option.paginationPosition == 'inner' ? prev = $('.' + option.paginationClass + ' li a.cur', elem).parent().index() : prev = $(elem).next().find('li a.cur').parent().index();
                            // prev = $('.' + option.paginationClass + ' li a.cur', elem).attr('href').replace('#', '');
                            if (next > prev) {
                                position = width * 2;
                                direction = -width * 2;
                            } else {
                                position = 0;
                                direction = 0;
                            }
                            current = next;
                            break;
                    }
                    if (current == 0) {
                        $('.roleList li').eq(1).find('a').trigger('tap click');
                    }
                    if (effect === 'fade') {
                        option.animationStart();
                        if (option.crossfade) {
                            control.children(':eq(' + next + ')', elem).css({
                                zIndex: 10
                            }).fadeIn(option.fadeSpeed,
                                function() {
                                    control.children(':eq(' + prev + ')', elem).css({
                                        display: 'none',
                                        zIndex: 0
                                    });
                                    $(this).css({
                                        zIndex: 0
                                    });
                                    option.animationComplete(next + 1);
                                    active = false;
                                });
                        } else {
                            option.animationStart();
                            control.children(':eq(' + prev + ')', elem).fadeOut(option.fadeSpeed,
                                function() {
                                    if (option.autoHeight) {
                                        control.animate({
                                                height: control.children(':eq(' + next + ')', elem).height()
                                            },
                                            option.autoHeightSpeed,
                                            function() {
                                                control.children(':eq(' + next + ')', elem).fadeIn(option.fadeSpeed);
                                            });
                                    } else {
                                        control.children(':eq(' + next + ')', elem).fadeIn(option.fadeSpeed,
                                            function() {
                                                if ($.browser.msie) {
                                                    $(this).get(0).style.removeAttribute('filter');
                                                }
                                            });
                                    }
                                    option.animationComplete(next + 1);
                                    active = false;
                                });
                        }
                    } 
                    else if (effect == 'mix') {
                        prev == 0 && next == total - 1 ? position = width * 2 : null;
                        prev == total - 1 && next == 0 ? position = 0 : null;
                        control.children(':eq(' + next + ')').css({
                            left: position,
                            display: 'block',
                            opacity: 0
                        });

                        option.animationStart();
                        var distance = next > prev ? 0 : '2000px';
                        control.children(':eq(' + prev + ')').animate({
                                left: distance,
                                opacity: 0
                            },
                            /*  option.slideSpeed/2);
                        control.animate({
                            left: direction
                        },*/
                            option.slideSpeed / 2,
                            function() {
                                control.css({
                                    left: -width
                                });
                                /*control.children(':eq(' + next + ')').css({
                                left: width,
                                zIndex: 5,
                                opacity: 1
                            });*/
                                control.children(':eq(' + prev + ')').css({
                                    left: width,
                                    opacity: 0,
                                    display: 'none',
                                    zIndex: 0
                                });

                                control.children(':eq(' + next + ')').animate({
                                    left: width,
                                    zIndex: 5,
                                    opacity: 1
                                }, option.slideSpeed / 2);
                                option.animationComplete(next + 1);
                                active = false;
                            });
                    } 
                    else {
                        control.children().eq(next).css({
                            left: position,
                            display: 'block'
                        });
                        if (option.autoHeight) {
                            option.animationStart();
                            control.animate({
                                    left: direction,
                                    height: control.children(':eq(' + next + ')').height()
                                },
                                option.slideSpeed,
                                function() {
                                    control.css({
                                        left: -width
                                    });
                                    control.children(':eq(' + next + ')').css({
                                        left: width,
                                        zIndex: 5
                                    });
                                    control.children(':eq(' + prev + ')').css({
                                        left: width,
                                        display: 'none',
                                        zIndex: 0
                                    });
                                    option.animationComplete(next + 1);
                                    active = false;
                                });
                        } else {
                            option.animationStart();
                            control.animate({
                                    left: direction
                                },
                                option.slideSpeed,
                                function() {
                                    control.css({
                                        left: -width
                                    });
                                    control.children().eq(next).css({
                                        left: width,
                                        zIndex: 5
                                    });
                                    control.children().eq(prev).css({
                                        left: width,
                                        display: 'none',
                                        zIndex: 0
                                    });
                                    option.animationComplete(next + 1);
                                    active = false;
                                });
                        }
                    }
                    if (option.pagination) {
                        $('.' + option.paginationClass + ' li a.cur', elem).removeClass('cur').find("span").fadeOut();
                        $('.' + option.paginationClass + ' li ', elem).eq(next).find('a').addClass('cur').find("span").fadeIn();
                        // $('.' + option.paginationClass + ' li a[href=#' + next + ']', elem).addClass('cur').find("span").fadeIn();
                    }
                }
            };
            // $.fn.slides.slideWay = animate;
        });
    };

    $.fn.slides.option = {
        preload: false,
        preloadImage: '../images/loading.gif',
        container: 'sliderContainer',
        generateNextPrev: false,
        next: 'next',
        prev: 'prev',
        pagination: true,
        generatePagination: true,       
        bindDirectionNav: false, //detect if there is an element to bind the direction
        paginationPosition: 'inner',
        paginationClass: 'pageNav',
        fadeSpeed: 350,
        slideSpeed: 350,
        start: 1,
        effect: 'slide',
        crossfade: false,
        randomize: false,
        play: 0,
        pause: 0,
        hoverPause: false,
        autoHeight: false,
        autoHeightSpeed: 350,
        bigTarget: false,
        overflowToggle: false,
        animationStart: function() {},
        animationComplete: function() {}
    };

    $.fn.randomize = function(callback) {
        function randomizeOrder() {
            return (Math.round(Math.random()) - 0.5);
        }
        $(this).each(function() {
            var $this = $(this);
            var $children = $this.children();
            var childCount = $children.length;
            $children.hide();
            var indices = [];
            for (i = 0; i < childCount; i++) {
                indices[indices.length] = i;
            }
            indices = indices.sort(randomizeOrder);
            $.each(indices,
                function(j, k) {
                    var $child = $children.eq(k);
                    var $clone = $child.clone(true);
                    $clone.show().appendTo($this);
                    if (callback !== undefined) {
                        callback($child, $clone);
                    }
                    $child.remove();
                });
        });
    };
})(window.jQuery || window.Zepto);