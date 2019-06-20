$(function() {
    console.log('popup ready')
    $("#cardName").keypress(function (e) {
        if (e.which == 13) {
            queryCard();
        }
    });
    $("#cardBtn").click(function(){
        queryCard();
    })
})

function queryCard() 
{
    let type = $('input:radio:checked').val();
    if (!type) {
        type = "1"
    }
    let q = $("#cardName").val()
    if (q) {
        let queryStr = "https://www.iyingdi.com/web/tools/mtg/cards?pagetype=inquire&name=";
        let tail = "";
        if (type === "2") {
            queryStr = "https://scryfall.com/search?q=";
        } else if (type === "3") {
            queryStr = "https://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[";
            tail = "]";
        } else if (type === "4") {
            queryStr = "http://ig2.cc/sch.php?n=";
        }
        q = queryStr + q.trim() + tail;
        window.open(q);
    }
}
