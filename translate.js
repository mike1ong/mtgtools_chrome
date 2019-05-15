console.log('external scripts loaded.')
sendMessageBack = function(strAction, dicData, callback){
    chrome.extension.sendMessage({'action': strAction, 'data': dicData}, callback);
}

loadTranslate = function () {
	sendMessageBack('list', {}, function(local) {
		let localres = []
		if (local && local.status === 200 && local.data) {
			localres = local.data;
		}
		let cardlist = []
		let names = $("table.home-sidebar-table:gt(0) td:not(.text-right) a");		
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
		let cards = $("td.deck-col-card a")
		for (let i = 0; i < cards.length; i++) {
			let cardname = cards[i].innerText.trim()
			if (cardname) {
				let flag = false;
				for (let j = 0; j < localres.length; j++) {
					if (cardname === localres[j].ename) {
						cards[i].innerText = localres[j].cname
						flag = true;
					}
				}
				if (!flag) {
					cardlist.push(cardname)
				}
			}
		}		
		if (cardlist.length > 0) {
			$.post("https://www.mtgtools.cn/Chromeext/translate", { data: cardlist }, function (res) {
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
					for (let i = 0; i < cards.length; i++) {
						let cardname = cards[i].innerText.trim()
						if (cardname) {
							for (let j = 0; j < res.data.length; j++) {
								if (res.data[j].ename === cardname) {
									cards[i].innerText = res.data[j].cname
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

let timer = null
isWidgetLoaded = function () {
	clearTimeout(timer)
	if ($('ins div').length > 1) {
		loadTranslate()
	} else {
		timer = setTimeout(function () {
			isWidgetLoaded()
		}, 1000)
	}	
}

$(function() {
	if ($('ins').length > 0) {
		isWidgetLoaded()
	} else {
		loadTranslate()	
	}	
});
