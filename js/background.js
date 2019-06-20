chrome.webRequest.onBeforeRequest.addListener(function (details) {
        let url = details.url;
        if (url.indexOf('ajax.googleapis.com/ajax/libs')>=0) {
        	url = details.url.replace('ajax.googleapis.com/ajax/libs', 'libs.cdnjs.net');
        	return {redirectUrl: url};
        } else {
        	let result = 0
	        result += url.indexOf('embed.twitch.tv') + 1
	    	result += url.indexOf('translate.google.com/translate_a/element.js') + 1
	    	result += url.indexOf('apis.google.com/js/platform.js') + 1
	    	result += url.indexOf('connect.facebook.net/en_US') + 1
	    	result += url.indexOf('platform.twitter.com/widgets.js') + 1
	    	result += url.indexOf('static.ads-twitter.com/uwt.js') + 1
	    	result += url.indexOf('data.adsrvr.org') + 1
	    	result += url.indexOf('match.adsrvr.org') + 1
	    	result += url.indexOf('.google.com') + 1
	    	result += url.indexOf('ib.adnxs.com') + 1
	    	if (result > 0) {
	    		return {cancel:true};
	    	}
        }
        return {cancel:false};
    },
    {urls: ["<all_urls>"]},
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