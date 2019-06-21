chrome.webRequest.onBeforeRequest.addListener(function (details) {
		let url = details.url;
		let flag = false;
	    if (url.indexOf('ajax.googleapis.com/ajax/libs')>=0) {
	        url = details.url.replace('ajax.googleapis.com/ajax/libs', 'libs.cdnjs.net');
	        flag = true;
	    } else if (url.indexOf('themes.googleusercontent.com')>=0) {
	        url = details.url.replace('themes.googleusercontent.com', 'themes.loli.net');
	        flag = true;
	    } else if (url.indexOf('secure.gravatar.com')>=0) {
	        url = details.url.replace('secure.gravatar.com', 'gravatar.loli.net');
	        flag = true;
	    }
	    if (flag) {
	    	return {redirectUrl: url};
	    } else {
	    	return {cancel:false};
	    }
	},
	{urls: ["<all_urls>"],
	 types: [
        "main_frame", 
        "sub_frame", 
        "stylesheet", 
        "script", 
        "image", 
        "object", 
        "xmlhttprequest", 
        "other"
    ]},
    ["blocking"]
);
chrome.webRequest.onBeforeRequest.addListener(function (details) {
        let url = details.url;
        let result = 0
        result += url.indexOf('embed.twitch.tv') + 1
        result += url.indexOf('translate.google.com/translate_a/element.js') + 1
        result += url.indexOf('googlesyndication.com') + 1
        result += url.indexOf('apis.google.com/js/platform.js') + 1
        result += url.indexOf('connect.facebook.net/en_US') + 1
        result += url.indexOf('platform.twitter.com/widgets.js') + 1
        result += url.indexOf('static.ads-twitter.com/uwt.js') + 1
        result += url.indexOf('data.adsrvr.org') + 1
        result += url.indexOf('match.adsrvr.org') + 1
        result += url.indexOf('.google.com') + 1
        result += url.indexOf('ib.adnxs.com') + 1
        return {cancel:result > 0};
    },
    {urls: ["https://www.mtggoldfish.com/*",
            "https://www.mtgstocks.com/*",
            "https://www.hareruyamtg.com/*",
            "https://mtgdecks.net/*",
            "https://www.mtgtop8.com/*",
        	"https://gatherer.wizards.com/*"]},
    ["blocking"]
);
    
/**
 * 监听content_script发送的消息
 */
chrome.extension.onMessage.addListener(function(request, _, sendResponse){
    // 返回数据
    var dicReturn;

    // 读取已存数据
    if(request.action == 'list'){
        // 从localstorage中读取数据
        var strList = localStorage['list'];
        if(strList){
            // 将json字符串转为对象
            var dicList = JSON.parse(strList)
            dicReturn = {'status': 200, 'data': dicList}
        }else{
            dicReturn = {'status': 404}
        }

        // 向content_script返回信息
        sendResponse(dicReturn);
    }

    // 保存
    if(request.action == 'save'){
        // content_script传来message
        var dicList = request.data;
        localStorage['list'] = JSON.stringify(dicList);

        dicReturn = {'status': 200, 'data': dicList};
        // 向content_script返回信息
        sendResponse(dicReturn);
    }

    // 删除
    if(request.action == 'clear'){
        delete localStorage['list']
    }
})