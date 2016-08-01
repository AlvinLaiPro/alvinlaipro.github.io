function ContentManager(){
	var ondownloadcompleted,
		numImagesLoaded = 0,
		NUM_ELEMENT_TO_DOWNLOAD = 0;

	this.SetDownloadCompleted = function(callbackMethod){
		ondownloadcompleted = callbackMethod;
	}

	this.path = 'images/';

	this.imgArray = [
		'barbg.png','ham.png','icon-logo.png','logo.png','logo-s.png','tip.png','verify.jpg',
		'close.png','closebtn.png','forum.png','news.png','wechat.png','weibo.png','disc.png','bar.png',
		'arrow.png','model-bg.png','btn1.png','btngroup.png','btn-blue.jpg'
	];

	this.imgGap1 = new Image;
	this.imgGap2 = new Image;
	this.imgIce = new Image;
	this.imgTriangle = new Image;
	this.imgBackground1 = new Image;
	this.imgBackground2 = new Image;


	this.StartDownload = function(){
		var l =NUM_ELEMENT_TO_DOWNLOAD= this.imgArray.length;
		for(var i=0; i<l;i++){
			var img = new Image(), src = this.path + this.imgArray[i];
			SetDownloadParameters(img,src,handleImageLoad,handleImageError);
		}
		SetDownloadParameters(this.imgGap1,'images/gap1.png',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
		SetDownloadParameters(this.imgGap2,'images/gap2.png',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
		SetDownloadParameters(this.imgIce,'images/ice.png',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
		SetDownloadParameters(this.imgTriangle,'images/tri.png',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
		SetDownloadParameters(this.imgBackground2,'images/bg2.jpg',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
		SetDownloadParameters(this.imgBackground1,'images/bg.jpg',handleImageLoad,handleImageError,NUM_ELEMENT_TO_DOWNLOAD++);
	}

	function SetDownloadParameters(imgElement, url, loadedHandler, errorHandler){
		// NUM_ELEMENT_TO_DOWNLOAD++;
		imgElement.src = url;
		imgElement.onload = loadedHandler;
		imgElement.onerror = errorHandler;
	}

	function handleImageLoad(e){
		numImagesLoaded++;
		var percent = document.querySelector('.percent');
		percent.innerHTML = parseInt(numImagesLoaded/NUM_ELEMENT_TO_DOWNLOAD*100) + '%';
		if(numImagesLoaded >= NUM_ELEMENT_TO_DOWNLOAD){
			numImagesLoaded = 0;
			ondownloadcompleted();
		}
	}

	function handleImageError(e){
		numImagesLoaded++;
	}
}