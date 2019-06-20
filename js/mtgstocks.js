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
		let names = $("interests-table-component table tbody tr td:eq(0) a");
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
		
		let sets = $("ng-component ul li a");
		for (let i = 0; i < sets.length; i++) {
			let cardname = sets[i].innerText.trim()
			if (cardname) {
				let flag = false;
				for (let j = 0; j < localres.length; j++) {
					if (cardname === localres[j].ename) {
						sets[i].innerText = localres[j].cname
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
					for (let i = 0; i < sets.length; i++) {
						let cardname = sets[i].innerText.trim()
						if (cardname) {
							for (let j = 0; j < res.data.length; j++) {
								if (res.data[j].ename === cardname) {
									sets[i].innerText = res.data[j].cname
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
let retryCount = 0
isWidgetLoaded = function () {
	clearTimeout(timer)
	retryCount++;
	let interests = $("interests-table-component");
	let sets = $("ng-component");
	if ((!interests || interests.length === 0) && (!sets || sets.length === 0)) {
		if (retryCount > 15) {
			return;
		}
		timer = setTimeout(function () {
			isWidgetLoaded()
		}, 1000)
	} else {
		loadTranslate();
	}
}

$(function() {
	isWidgetLoaded();
});
