sendMessageBack = function(strAction, dicData, callback){
    chrome.extension.sendMessage({'action': strAction, 'data': dicData}, callback);
}

loadTranslate = function () {
	console.log("hareruya loadTranslate");
	sendMessageBack('list', {}, function(local) {
		let localres = []
		if (local && local.status === 200 && local.data) {
			localres = local.data;
		}

		let titles = $("div.deckSearch-deckList__deckList__container__text--main");
		if (titles && titles.length >= 1) {
			titles = titles[0];
			titles.innerText = titles.innerText.trim().replace(/Mainboard Cards/, "主牌").trim();
		}
		titles = $("a.deckSearch-deckList__deckList__downloadButton");
		if (titles && titles.length >= 1) {
			titles = titles[0];
			titles.innerText = titles.innerText.trim().replace(/Download List/, "套牌下载").trim();
		}
		titles = $("div.deckSearch-deckList__deckList__totalNumber");
		for (let i = 0; i < titles.length; i++) {
			let name = titles[i].innerText;
			if (name) {
				if (name.indexOf("套牌下载") < 0){
					name = name.replace(/Lands/, "地");
					name = name.replace(/Creatures/, "生物");
					name = name.replace(/Spells/, "咒语");
					name = name.replace(/Sideboard Cards/, "备牌");
					titles[i].innerText = name.trim();
				}
			}
		}

		let cardlist = []
		let names = $("div.deckSearch-deckList__deckList__container__text a");
		for (let i = 0; i < names.length; i++) {
			let cardname = names[i].innerText;
			if (cardname) {
				cardname = cardname.replace(/《/,"").replace(/》/,"").trim();
				let flag = false;
				for (let j = 0; j < localres.length; j++) {
					if (cardname === localres[j].ename) {
						names[i].innerText = " 《" + localres[j].cname + "》 "
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
						let cardname = names[i].innerText;
						if (cardname) {
							cardname = cardname.replace(/《/,"").replace(/》/,"").trim();
							for (let j = 0; j < res.data.length; j++) {
								if (res.data[j].ename === cardname) {
									names[i].innerText = " 《" + res.data[j].cname + "》 ";
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
