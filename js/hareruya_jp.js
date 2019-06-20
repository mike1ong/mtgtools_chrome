loadTranslate = function () {
	console.log("hareruya loadTranslate");
	
	let titles = $("div.deckSearch-deckList__deckList__container__text--main");
	if (titles && titles.length >= 1) {
		titles = titles[0];
		titles.innerText = titles.innerText.trim().replace(/メインボード/, "主牌").trim();
	}
	titles = $("a.deckSearch-deckList__deckList__downloadButton");
	if (titles && titles.length >= 1) {
		titles = titles[0];
		titles.innerText = titles.innerText.trim().replace(/リストダウンロード/, "套牌下载").trim();
	}
	titles = $("div.deckSearch-deckList__deckList__totalNumber");
	for (let i = 0; i < titles.length; i++) {
		let name = titles[i].innerText;
		if (name) {
			if (name.indexOf("套牌下载") < 0){
				name = name.replace(/土地/, "地");
				name = name.replace(/クリーチャー/, "生物");
				name = name.replace(/呪文/, "咒语");
				name = name.replace(/サイドボード/, "备牌");
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
			cardlist.push(cardname)
		}
	}
	if (cardlist.length > 0) {
		$.post("https://www.mtgtools.cn/Chromeext/translatejp", { data: cardlist }, function (res) {
			if (res && res.code && res.code === 1) {
				for (let i = 0; i < names.length; i++) {
					let cardname = names[i].innerText;
					if (cardname) {
						cardname = cardname.replace(/《/,"").replace(/》/,"").trim();
						for (let j = 0; j < res.data.length; j++) {
							if (res.data[j].jname === cardname) {
								names[i].innerText = " 《" + res.data[j].cname + "》 ";
								break;
							}
						}
					}
				}
			}
		});
	}
}

$(function() {
	loadTranslate();
});
