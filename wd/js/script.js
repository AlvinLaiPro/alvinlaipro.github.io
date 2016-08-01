/**
 * filename: script.js
 * @author Alvin Lai
 */
window.onload = function(){
	isIOS = /(iphone|ipad)/i.test(navigator.userAgent.toLowerCase());
	var canvas = document.getElementById('canvas'),
		winWidth = document.documentElement.clientWidth,
		winHeight = document.documentElement.clientHeight,
		clickCount = 0,
		context,
		contentmanager,
		imgArray = [],
		particles = [],
		getStyle = window.getComputedStyle,
		getId = document.getElementById.bind(document),
		music = document.getElementById('music'),
		link = document.getElementById('section1'),
		bgMusic = document.getElementById('bg-music'),
		music1 = document.getElementById('tick'),
		music2 = document.getElementById('tick-ta');

	function getParentNode(target, className) {
		try {
			var el = target;
			while(el.className.split(' ').indexOf(className) === -1) {
				el = el.parentNode;
			}
			return el;
		} catch(e) {
			return undefined;
		}
	}

	var localStore = function(){
		var  getItem, setItem, clearItem;
		if(window.Storage !== undefined){
			setItem = function(val){
				localStorage.setItem(val,1);
			}
			clearItem = function(val){
				localStorage.removeItem(val);
			}
			getItem = function(val){
				return localStorage.getItem(val);
			}
		}
		else{
			return;
		}
		return{
			setItem: setItem,
			getItem: getItem,
			clearItem: clearItem
		}

	}();


	function init(){
		canvas.width = winWidth;
		canvas.height = winHeight;
		context = new createjs.Stage(canvas);
		contentmanager = new ContentManager();
		contentmanager.SetDownloadCompleted(knockIce);
		contentmanager.StartDownload();

		var wechat = document.querySelector('.wechat'),
			news = getId('news'),
			close = getId('close'),
			buttonActive = document.querySelectorAll('.btn-active'),
			btnSubmit,
			closeBtn = getId('closebtn'),
			content = getId('section3'),
			model = getId('model'),
			dropdown = document.querySelector('.dropdown'),
			modelContent = getModelContent();

		function touchEvent(e){
			var target = e.target;
			if(target == music || getParentNode(target,'music') == music){
				target = getParentNode(target, 'music');
				e.preventDefault();
				if(target.className.indexOf('on')>-1){
					target.className = target.className.replace(' on','');
					bgMusic.pause();
				}else{
					target.className += ' on';
					bgMusic.play();
				}

			}
			else if(target == buttonActive[0] || target == buttonActive[1]){
				e.preventDefault();
				model.querySelector('.field').innerHTML = modelContent.modelForm();
				model.style.display = 'block';
				btnSubmit = document.querySelector('.btn-submit');
				var tel = getId('tel'),
					errMsg = model.querySelector('.error-msg'),
					reg = /^1\d{10}$/, trim = /^(\s)+|(\s)+$/g;

				tel.addEventListener('keyup',function(e){
					errMsg.style.display = 'none';
					var verifyCode = model.getElementsByTagName('img')[0],
						val = tel.value.replace(trim,''),
						verify = document.querySelector('.get-verify');
					if(reg.test(val)){
						if(!localStore.getItem(val)){
							localStore.setItem(val);
							verifyCode = model.getElementsByTagName('img')[0];
							verifyCode && (verifyCode.style.display = 'none');
							verify.style.display = 'block';
						}else{
							if(model.getElementsByTagName('img')[0]==null){
								var img = new Image;
								img.onload = function(){
									verify.style.display = 'none';
									img.className = 'verify-code';
									verify.parentNode.appendChild(img);
								}
								img.src = 'images/yzm.jpg';
							}else{
								verify.style.display = 'none';
								verifyCode.style.display = 'block';
							}
						}
					}
				})
				tel.addEventListener('blur',function(){	
					if(this.value.replace(trim,'')=='' || reg.test(this.value.replace(trim,''))){	
						errMsg.style.display = 'none';
					}else{
						errMsg.style.display = 'block';
					}		
				})

			}
			else if(target == news || getParentNode(target, 'news') == news){
				e.preventDefault();	
				content.className += ' active';
			}
			else if(target == close){
				content.className = content.className.replace(' active','');
			}
			else if(target == closeBtn){
				e.preventDefault();
				var parent = getParentNode(target, 'model');
				parent && (parent.style.display = 'none');
			}
			else if(target == btnSubmit){
				e.preventDefault();
				showResult(Math.random() > .5);
			}
			else if(target == wechat || getParentNode(target, 'wechat') == wechat){
				e.preventDefault();
				dropdown.className+=' active';
			}
			else if(target == dropdown.querySelector('.close')){
				dropdown.className = dropdown.className.replace(' active','');
			}
		}

		function showResult(b){
			var field = model.querySelector('.field'),
				content = modelContent.modelFormFeedback(b);

			field.innerHTML = content;

			// model.style.display = 'block';
		}

		document.addEventListener('touchend',touchEvent,false);

		function getModelContent(){
			return{
				modelForm: function(){
					var html = [
						'<div class="error-msg">错误提示区域</div>',
						'<div class="fieldset"><input type="tel" id="tel" placeholder="请输入手机号" /></div>',
						'<div class="fieldset"><input type="text" />',
						'<input type="button" value="获取验证码" class="get-verify" /></div>',
						'<a href="#" class="btn btn-submit">抢激活码</a>',
						'<div class="brief">即日起参与手机号绑定，就有机会获得《问道》手游测试的激活码，每个手机号每日均有一次抢激活码的机会！</div>'
					];
					return html.join('');
				},
				modelFormFeedback: function(s){
					var htmlSuccess = [
						'<div class="feed-msg success-msg">恭喜您获得首次测试的激活码</div>',
						'<div class="info">激活码会在游戏开测前以短信的形式发送至您的手机。</div>'
					],
						htmlFail = [						
						'<div class="feed-msg fail-msg">没运气，不要紧！明天继续努把力！</div>',
						'<div class="info">论坛大波活动，首测资格等你拿！</div>'
					];

					return s ? htmlSuccess.join('') : htmlFail.join('');
				}
			}
		}

	}

	function handleClick(e){
		link.removeEventListener('click',handleClick,false);
		e.preventDefault();
		switch(clickCount){
			case 0:
				music1.play();
				context.addChild(imgArray[1]);
				context.update();
				createScrap(imgArray[1].x, imgArray[1].y, imgArray[1].width*.6, imgArray[1].height, imgArray[3], .4);
			break;
			case 1:
				context.addChild(imgArray[2]);
				context.removeChild(imgArray[1]);
				context.update();				
				createScrap(imgArray[2].x, imgArray[2].y, imgArray[2].width*.8, imgArray[2].height, imgArray[3], .5);
			break;
			case 2:
				context.removeChild(imgArray[2]);
				context.removeChild(imgArray[0]);
				context.addChild(imgArray[5]);
				var el = getId('section1');
				el.parentNode.removeChild(el);
				getId('section2').className+=' active';
				music.className+=' up';
				scrapComplete();
				createScrap(0,0,winWidth,winHeight,imgArray[3],1);
				document.querySelector('.footer').style.display = 'block';
				document.body.style.overflowY = 'auto';
			break;
		}
		clickCount++;
	}

	function initImage(){

		var el1 = document.querySelector('.gap1'),
			el2 = document.querySelector('.gap2'),
			scale1 = (winWidth/contentmanager.imgIce.width).toFixed(20),
			scale2 = (parseInt(getStyle(el1).width)/contentmanager.imgGap1.width).toFixed(2),
			scale3 = (parseInt(getStyle(el2).width)/contentmanager.imgGap2.width).toFixed(2),
			gap1 = new createjs.Bitmap(contentmanager.imgGap1),
			gap2 = new createjs.Bitmap(contentmanager.imgGap2),
			backgroundIce = new createjs.Bitmap(contentmanager.imgIce),
			background1 = new createjs.Bitmap(contentmanager.imgBackground1),
			background2 = new createjs.Bitmap(contentmanager.imgBackground2),
			obj = {},
			arr = [];

		backgroundIce.scaleX = backgroundIce.scaleY = scale1;
		background1.scaleX = background1.scaleY = scale1;
		background2.scaleX = background2.scaleY = scale1;
		gap1.scaleX = gap1.scaleY = scale2;
		gap2.scaleX = gap2.scaleY = scale3;

		gap1.x = parseInt(getStyle(el1).left);
		gap1.y = parseInt(getStyle(el1).top);
		gap1.width = parseInt(getStyle(el1).width);
		gap1.height = parseInt(getStyle(el1).height);

		gap2.x = parseInt(getStyle(el2).left);
		gap2.y = parseInt(getStyle(el2).top);
		gap2.width = parseInt(getStyle(el2).width);
		gap2.height = parseInt(getStyle(el2).height);

		obj.img = contentmanager.imgTriangle;
		obj.width = contentmanager.imgTriangle.width*scale1;
		obj.height = contentmanager.imgTriangle.height*scale1;
		obj.scale = scale1;

		arr.push(backgroundIce);
		arr.push(gap1);
		arr.push(gap2);
		arr.push(obj);
		arr.push(background1);
		arr.push(background2);
		return arr;
	};

	function scrapComplete(){
		music.className.indexOf('on') > -1 ? bgMusic.play() : bgMusic.pause();
		link.addEventListener('click',handleClick,false);
	}

	function createScrap(l,t,w,h,obj,z){
		music2.play();
		var x = Math.floor(w/obj.width), y = Math.floor(h/obj.height), k = [];
		z = z || obj.scale;
		for(var i=0; i<x; i++){
			for(var j=0; j<y; j++){
				var tri = new createjs.Bitmap(obj.img);
				tri.regX = obj.width/2;
				tri.regY = obj.height/2;
			    tri.x = i*obj.width + l;
			    tri.y = j*obj.height + t;
			    context.addChild(tri);
			    initParticle(tri,z);
			    particles.push(tri);				
			}
		}

	    createjs.Ticker.useRAF = true;
	    createjs.Ticker.framerate = 60;
		createjs.Ticker.addEventListener('tick',particleTick);


		function particleTick() {
			if(k.length == particles.length){
				// particleStage.removeAllChildren();
				music1.pause();
				music2.pause();
				createjs.Ticker.removeEventListener('tick',particleTick);
				scrapComplete();
				// clickCount == 3 ? scrapComplete(): null;
			}
		  for(var i = 0, l = particles.length; i < l; i++) {
		    var p = particles[i];
		    p.y += p.vy;
		    p.vy += 0.9;
		    p.alpha = 0.95*p.alpha < .8 ? .8 : 0.95*p.alpha;
		    p.rotation = Math.atan2(p.vy, p.vx) * 180/Math.PI + 180;
		    if (p.y > winHeight) {
		    	k['a' + i] = k['a' + i] || (k.length++,i+1);
		    }
		  }

		  context.update();
		}
	}
	function initParticle(p,z) {
		// p.x = Math.random()*winWidth; p.y = Math.random()*winHeight;
		p.vx = Math.random() * 10 - 5;
		p.vy = Math.random() * 5;
		p.alpha = 1;
		p.scaleX =  z*Math.random();
		p.scaleY = z*Math.random();

		 p.x += (1 - p.scaleX)*imgArray[3].width + 10;
	}

	function knockIce(){
		imgArray = initImage();
		context.addChild(imgArray[4]);
		context.update();
		context.addChild(imgArray[0]);
		context.update();

		link.addEventListener('click',handleClick,false);
		getId('loading').parentNode.removeChild(getId('loading'));
	}
	init();
}