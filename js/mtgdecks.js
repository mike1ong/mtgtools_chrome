sendMessageBack = function(strAction, dicData, callback){
    chrome.extension.sendMessage({'action': strAction, 'data': dicData}, callback);
}

loadTranslate = function () {
	sendMessageBack('list', {}, function(local) {
		let localres = []
		if (local && local.status === 200 && local.data) {
			localres = local.data;
		}
		let titles = $("div.wholeDeck b.text-uppercase");
		if (titles && titles.length > 0) {
			titles = titles[0];
			titles.innerText = titles.innerText.replace(/Maindeck/, "主牌").trim();
		}
		
		let cardlist = []
		let names = $("div.tab-content div.wholeDeck div.cards table tr.cardItem td.number a");
		for (let i = 0; i < names.length; i++) {
			let cardname = names[i].innerText.trim()
			if (cardname) {
				let flag = false;
				for (let j = 0; j < localres.length; j++) {
					if (cardname === localres[j].ename) {
						names[i].innerText = localres[j].cname
						flag = true;
					}
				}
				if (!flag) {
					cardlist.push(cardname)
				}
			}
		}
		if (cardlist.length > 0) {
			sendMessageBack('post', cardlist, function(res) {
				if (res && res.code && res.code === 1) {
					for (let i = 0; i < names.length; i++) {
						let cardname = names[i].innerText.trim()
						if (cardname) {
							for (let j = 0; j < res.data.length; j++) {
								if (res.data[j].ename === cardname) {
									names[i].innerText = res.data[j].cname
									localres.push(res.data[j])
									break;
								}
							}
						}
					}
					sendMessageBack('save', localres, null);
				}
			});
		}
	});
}

$(function() {
	loadTranslate();
});
