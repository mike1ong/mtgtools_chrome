sendMessageBack = function(strAction, dicData, callback){
    chrome.extension.sendMessage({'action': strAction, 'data': dicData}, callback);
}

loadTranslate = function () {
	console.log("loadTranslate");
	sendMessageBack('list', {}, function(local) {
		let localres = []
		if (local && local.status === 200 && local.data) {
			localres = local.data;
		}
		
		let cardlist = []
		let names = $("interests-table-component table tbody tr");
		console.log("names", names);
		for (let i = 0; i < names.length; i++) {
			let node = $(names[i]).find("td:first a");
			console.log("node", node);
			if (node && node.length >= 1) {
				node = node[0];
				let cardname = node.innerText.trim()
				if (cardname) {
					let flag = false;
					for (let j = 0; j < localres.length; j++) {
						if (cardname === localres[j].ename) {
							node.innerText = localres[j].cname
							flag = true;
						}
					}
					if (!flag) {
						cardlist.push(cardname)
					}
				}
			}
		}
		
		let sets = $("ng-component div.row ul.columns li a");
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
						let node = $(names[i]).find("td:first a");
						if (node && node.length >= 1) {
							node = node[0];
							let cardname = node.innerText.trim()
							if (cardname) {
								for (let j = 0; j < res.data.length; j++) {
									if (res.data[j].ename === cardname) {
										node.innerText = res.data[j].cname
										localres.push(res.data[j])
										break;
									}
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
	let interests = $("interests-table-component table tbody tr");
	let sets = $("ng-component div.row ul.columns li a");
	if ((!interests || interests.length === 0) && (!sets || sets.length === 0)) {
		if (retryCount > 15) {
			return;
		}
		timer = setTimeout(function () {
			isWidgetLoaded()
		}, 1000)
	} else {
		console.log(interests, sets);
		loadTranslate();
	}
}

$(function() {
	isWidgetLoaded();
});
