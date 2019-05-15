chrome.webRequest.onBeforeRequest.addListener(function (details) {
        var url = details.url;
        if (url === 'https://embed.twitch.tv/embed/v1.js') {
			return {cancel: true};
        }
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