// ==UserScript==
// @name         HVMarket Extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Всякие штуки для хвмаркета!
// @author       Sparroff
// @match        https://hvmarket.xyz/*
// @icon         https://www.google.com/s2/favicons?domain=hvmarket.xyz
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    ///////////////////////MAINPAGE///////////////////////
    if(document.location.pathname=='/') {
        // live search //
        let table=document.getElementsByClassName("itg")[0];
        var but=document.getElementById("search_form").children[2];
        but.addEventListener('input', function() {
            parseElements(this.value, table);
        })
        function parseElements(text, tabl) {
            for(let i=1;i<tabl.rows.length;i++){
                if((tabl.rows[i].children[1].children[0].innerHTML.toLowerCase() + "").indexOf(text.toLowerCase()) != -1){
                    tabl.rows[i].classList.remove('hide');
                } else {
                    tabl.rows[i].classList.add('hide');
                }
            }
        }
        // END live search//

        // copy prices for HVUtils //
        let space = document.getElementsByClassName("searchbox")[0];
        let button = document.createElement("div");
        button.id = "PriceUpd";
        button.innerHTML = "HVUtils | Copy price";
        space.appendChild(button);

        let list = [
            "Wispy Catalyst","Diluted Catalyst","Regular Catalyst","Robust Catalyst","Vibrant Catalyst","Coruscating Catalyst","Scrap Cloth","Scrap Leather",
            "Scrap Metal","Scrap Wood","Energy Cell","Low-Grade Cloth","Mid-Grade Cloth","High-Grade Cloth","Low-Grade Leather","Mid-Grade Leather","High-Grade Leather",
            "Low-Grade Metals","Mid-Grade Metals","High-Grade Metals","Low-Grade Wood","Mid-Grade Wood","High-Grade Wood","Crystallized Phazon","Shade Fragment","Repurposed Actuator",
            "Defense Matrix Modulator","Binding of Slaughter","Binding of Balance","Binding of Isaac","Binding of Destruction","Binding of Focus","Binding of Friendship","Binding of Protection",
            "Binding of Warding","Binding of the Fleet","Binding of the Barrier","Binding of the Nimble","Binding of Negation","Binding of the Ox","Binding of the Raccoon","Binding of the Cheetah",
            "Binding of the Turtle","Binding of the Fox","Binding of the Owl","Binding of Surtr","Binding of Niflheim","Binding of Mjolnir","Binding of Freyr","Binding of Heimdall","Binding of Fenrir",
            "Binding of the Elementalist","Binding of the Heaven-sent","Binding of the Demon-fiend","Binding of the Curse-weaver","Binding of the Earth-walker","Binding of Dampening","Binding of Stoneskin",
            "Binding of Deflection","Binding of the Fire-eater","Binding of the Frost-born","Binding of the Thunder-child","Binding of the Wind-waker","Binding of the Thrice-blessed","Binding of the Spirit-ward"
        ];
        button.onclick = function (event) {
            let clip = "// [Materials] price is used for calculating the profits in [Monster Lab], the total cost of upgrading equipment in [Upgrade] and what salvaging in [Equipment Shop] is worth\n\n";
            //let table = document.getElementsByClassName("itg")[0];
            let rows = table.rows.length;
            for (let s = 0; s < list.length; s++) {
                for (let t = 1; t < rows; t++) {
                    if (list[s] == table.rows[t].cells[1].children[0].innerHTML) {
                        clip += list[s] + " @ " + pricefix(table.rows[t].cells[3].innerHTML);
                        if (s != list.length - 1) clip += "\n";
                    }
                }
            }
            GM_setClipboard(clip);
            button.classList.add("PriceUpdK");
            button.innerHTML = "Done :)";
        };
        function pricefix(word) {
            let fixed = word.split("c")[0];
            fixed = fixed.replace(",", "");
            fixed = Math.round(fixed);
            return parseFloat(fixed);
        }
        // END prices for HVUtils //
    }
    ///////////////////////MANAGE PRICE///////////////////////
    else if(document.location.pathname=='/manage-prices/'){
        // colorized //
        let table=document.getElementById("tab_sp");
        let sts=GM_getValue('hidestatus');

        let dv = document.createElement('div');
        dv.id = "swhide";

        let sp = document.createElement('span');
        sp.className = "slider round";

        let chbox = document.createElement('input');
        chbox.type = "checkbox";
        chbox.className = "swsw";
        chbox.checked = sts;
        let label = document.createElement('label');
        label.className = "switch";
        label.appendChild(chbox);
        label.appendChild(sp);
        dv.appendChild(label);
        document.getElementsByClassName("main_content")[0].children[2].children[1].children[0].appendChild(dv);

        hidenone(table, chbox.checked);
        chbox.addEventListener('change', ()=>{
        hidenone(table, chbox.checked);
        GM_setValue("hidestatus", chbox.checked);
        })

        function hidenone(table, check){
            for(let i=0;i<table.rows.length;i++){
                table.rows[i].classList.add(colorized(table.rows[i].cells[1].innerHTML));
                if(i>0) console.log(table.rows[i].cells[1].children[0].innerHTML+'  '+Math.round((Number(table.rows[i].cells[4].getAttribute('data-low')) - Number(table.rows[i].cells[3].children[0].value))*10)/10);
                if(table.rows[i].cells[2].innerHTML=='None') {
                    if(check==1) table.rows[i].classList.add("custhide");
                    else if(check==0) table.rows[i].classList.remove("custhide");
                }
            }
        }

        function colorized(name){
            var filtr={
            consumables: {
                name:"Consumables",
                find:["Draught","Potion","Elixir","Energy Drink","Flower Vase","Bubble-Gum"]
            },
            infusion: {
                name:"Infusions",
                find:["Infusion of"]
            },
            scrolls: {
                name:"Scrolls",
                find:["Scroll of"]
            },
            trophy: {
                name:"Trophys",
                find:["ManBearPig Tail","Holy Hand Grenade of Antioch","Mithra's Flower","Dalek Voicebox","Lock of Blue Hair","Bunny-Girl Costume","Hinamatsuri Doll","Broken Glasses","Black T-Shirt","Sapling","Unicorn Horn","Noodly Appendage"]
            },
            monsters: {
                name:"Monsters",
                find:["Crystal of","Monster Chow","Monster Edibles","Monster Cuisine","Happy Pills"]
            },
            forges: {
                name:"Forges",
                find:["Low-Grade","Mid-Grade","High-Grade","Crystallized Phazon","Shade Fragment","Repurposed Actuator","Defense Matrix Modulator","Binding of "," Catalyst"]
            },
            repair: {
                name:"Repairs",
                find:["Scrap ","Energy Cell"]
            },
            shards: {
                name:"Shards",
                find:[" Shard"]
            },
            artifacts: {
                name:"Artifacts",
                find:["Figurine", "Precursor Artifact"]
            }
            };
        let clss="Obsoletes"
        for (var prop in filtr) {
            for(let i=0;i<filtr[prop].find.length;i++){
                if(name.indexOf(filtr[prop].find[i])!=-1) clss=filtr[prop].name;
            }
        }
    return clss;
    }
    // END colorized//
    }
    ///////////////////////EXCHANGE ITEM///////////////////////
    else if(document.location.pathname.indexOf('/exchange/')!=-1){
        let table=document.getElementsByClassName("main_content")[0].children[4].children[0].children[2].children[1];
        let place=document.getElementById("buy_count");
        let maxprice=document.getElementById("buy_price");
        let arr=[];
        for(let i=0;i<table.rows.length;i++){arr.push([clear(table.rows[i].cells[0].innerHTML),clear(table.rows[i].cells[2].innerHTML)]);}
        let calcl = document.createElement("div");
        calcl.id = "calcl";
        calcl.innerHTML=calc(Number(place.value), arr, table, Number(maxprice.value))+'c';
        clearcolor(table);
        document.getElementsByClassName("main_content")[0].children[3].appendChild(calcl);

        place.addEventListener('input', function() {
            if(calcl.innerHTML==0||calcl.innerHTML=="") clearcolor(table);
            else calcl.innerHTML = calc(Number(place.value), arr, table, Number(maxprice.value))+'c';
        })
        maxprice.addEventListener('input', function() {
            if(calcl.innerHTML==0||calcl.innerHTML=="") clearcolor(table);
            else calcl.innerHTML = calc(Number(place.value), arr, table, Number(maxprice.value))+'c';
        })

        if(document.location.search.indexOf('buyres')!=-1){
            let param = new URLSearchParams(document.location.search);
            if(param.get("buyres")!=0){
                if(buy(param.get("buyres"), arr, table)){
                    place.value=param.get("buyres");
                    maxprice.value=999999;
                    param.set("buyres","0");
                    let buybutton=document.getElementById("buyform").children[4].children[0];
                    history.pushState('', '', '?buyres=0');
                    buybutton.onclick();
                }
            } else if(param.get("buyres")==0) alert('Готово')
        }

        function calc(number, arr, table, maxprice) {
            clearcolor(table);
            let ret=0, count=number;
            let count1=0, price1=0, pricefix1=0, count2=0, price2=0, pricefix2=0;
            for(let i=0;i<arr.length;i++){
                if(count<=arr[i][0]){
                    ret+=count*arr[i][1];
                    if(arr[i][1]<=maxprice) {
                        table.rows[i].classList.add("colorized2");
                        count1+=count;
                        price1+=count*Number(arr[i][1]);
                        pricefix1=Number(arr[i][1]);
                    }
                    else {
                        table.rows[i].classList.add("colorized3");
                        count2+=count;
                        price2+=count*Number(arr[i][1]);
                        pricefix2=Number(arr[i][1]);
                    }
                    count=0;
                    break;
                }
                else if(count>arr[i][0]){
                    ret+=arr[i][0]*arr[i][1];
                    if(arr[i][1]<=maxprice) {
                        table.rows[i].classList.add("colorized1");
                        count1+=arr[i][0];
                        price1+=arr[i][0]*Number(arr[i][1]);
                        pricefix1=Number(arr[i][1]);
                    }
                    else {
                        table.rows[i].classList.add("colorized3");
                        count2+=arr[i][0];
                        price2+=arr[i][0]*Number(arr[i][1]);
                        pricefix2=Number(arr[i][1]);
                    }
                    count-=arr[i][0];
                }
            }
            console.log(count1+' за '+price1+' (avg: '+Math.round(price1/count1)+')(max: '+pricefix1+')  |  '+count2+' за '+price2+' (avg: '+Math.round(price2/count2)+')(max: '+pricefix2+')  |  осталось: '+count);
            return ret.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function clear(string){
            let str=string.split(" ");
            str[0]=str[0].replaceAll(",", "");
            str[0]=str[0].replace("c", "");
            return Number(str[0]);
        }

        function clearcolor(table) {
            for(let i=0;i<table.rows.length;i++){table.rows[i].classList.remove("colorized"); table.rows[i].classList.remove("colorized2");table.rows[i].classList.remove("colorized3");}
        }

        function buy(count, arr, table){
            var conf = confirm('Купить '+count+' штук за '+calc2(Number(count), arr, table, Number(999999999)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'c (avg: '+Math.floor(calc2(Number(count), arr, table, Number(999999999))/Number(count)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'c)  |  7 days avg: '+document.getElementsByClassName("split_inner")[0].children[1].children[2].innerHTML.replace(/<strong>Avg:<\/strong> (.*)c/g, "$1")+'c  ?');
            return conf;
        }

        function calc2(number, arr, table, maxprice) {
            var ret=0;
            var temp=number;
            for(let i=0;i<arr.length;i++){
                if(temp<=arr[i][0]){
                    ret+=temp*arr[i][1];
                    temp-=temp;
                    break;
                }
                else if(temp>arr[i][0]){
                    ret+=arr[i][0]*arr[i][1];
                    temp-=arr[i][0];
                }
            }
            if(temp>0) ret=ret+temp*arr[arr.length-1][1];
            return ret;
        }
    }
})();


const opacity="2F"; //hex
GM.addStyle(
".hide{display: none;} \
#calcl{width: 250px; text-align: center;color: #a00;padding: 4px 5px 5px;position: absolute; bottom:-18px; left: 86px;}\
.colorized1{background-color:#9affcc"+opacity+" !important;} \
.colorized2{background-color:#00ff2b"+opacity+" !important;} \
.colorized3{background-color:#888888"+opacity+" !important;} \
.custhide{display: none;} \
#customCbx{} \
#swhide{position: absolute; right: 38px;margin-top: -20px;} \
.Consumables{background-color:#fc4e4e"+opacity+" !important;} \
.Scrolls{background-color:#e78c1a"+opacity+" !important;} \
.Infusions{background-color:#dde500"+opacity+" !important;} \
.Shards{background-color:#1a9317"+opacity+" !important;} \
.Forges{background-color:#5dc13b"+opacity+" !important;} \
.Monsters{background-color:#0f9ebd"+opacity+" !important;} \
.Artifacts{background-color:#0000ff"+opacity+" !important;} \
.Trophys{background-color:#9755f5"+opacity+" !important;} \
.Repair{background-color:#fe93ff"+opacity+" !important;} \
.Obsoletes{background-color:#eaeaea"+opacity+" !important;} \
.switch{position:relative;display:inline-block;width:32px;height:16px}.switch .swsw{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#c1b8b8;-webkit-transition:.2s;transition:.2s}.slider:before{position:absolute;content:\"\";height:12px;width:12px;left:2px;bottom:2px;background-color:white;-webkit-transition:.2s;transition:.2s}.swsw:checked + .slider{background-color:#c7ac90}.swsw:focus + .slider{box-shadow:0 0 1px #c7ac90}.swsw:checked + .slider:before{-webkit-transform:translateX(16px);-ms-transform:translateX(16px);transform:translateX(16px)}.slider.round{border-radius:8px}.slider.round:before{background-color: #edebdf;border-radius:50%}\
#PriceUpd{text-align:center;background-color:#edebdf;color:#5c0d11;position:absolute;right:203px;top:118px;width:100px;height:10px;padding:2px 5px;border:solid 2px #5c0d11;border-radius:3px;font-size:9px;cursor:pointer}\
#PriceUpd:hover{background-color: #5c0d11;color: #edebdf;} \
.PriceUpdK{background-color: #5c0d11 !important;color: #edebdf !important;} \
");