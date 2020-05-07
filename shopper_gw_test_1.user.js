// ==UserScript==
// @name             [GW]Shopper 
// @namespace        http://www.gwars.ru
// @description      Расширенное управление магазинами
// @include          http://www.gwars.ru/objectedit.php*
// @version          2.1
// @author           unknown
// @editby           unknown
// ==/UserScript==

(function() {
var pid = 163347;
var params = '';
var paramsm = '';
var cnt;
var nf1=0;
var evmoney = false;
var oname = new Array()
var root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

var script = root.document.createElement('script');
script.id   = 'fwprototype';
script.type = 'text/javascript';
script.src = '//ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js';
root.document.body.appendChild(script);

var b = root.document.getElementsByTagName('b');
for (var i=0;i<b.length;i++)
{
	if(/^#/i.test(b[i].innerHTML))
	{
		var font = b[i].getElementsByTagName('FONT');
		var tmag = font[0].innerHTML;
		var newString = tmag.replace(/«/i, "&laquo;");
		tmag = newString.replace(/»/i, "&raquo;")
	}
	
}

var form = root.document.getElementsByTagName('form');

for (var i=0;i<form.length;i++)
{
	if((/Пополнить счет:/i.test(form[i].innerHTML)) || (/Управление счетом/i.test(form[i].innerHTML)))
	{
		nf1=i;
		evmoney = true;
	}
	if(/Настройки покупки-продажи предметов/i.test(form[i].innerHTML))
	var nf2=i;
	
}

var inp = form[nf2].getElementsByTagName('input');
var lengthimp = inp.length;

var inpm = form[nf1].getElementsByTagName('input');
var lenimpm = inpm.length;

var input = document.createElement('input');
input.setAttribute('type', 'button');
input.value = 'Загрузить список объектов';
input.onclick=function(){
load();}
form[nf2].appendChild(input);




function test3(checked)
{
	var t=0;
	while (root.document.getElementById('ob'+t))
	{
		root.document.getElementById('ob'+t).checked = checked;
		t++;
	}
}

function test4(checked)
{
	
	var t=0;
	while (root.document.getElementById('ob'+t))
	{
		if(tmag == oname[t])
		root.document.getElementById('ob'+t).checked = checked;
		t++;
	}
}

function load()
{	
	var div = document.createElement('div');
	
	
	ajax('http://www.gwars.ru/info.realty.php?id=' + pid, 'GET', function(req) 
	{
		var regexp=/<tr>\n<td class=wb><a href=\/object\.php\?id=(\d+)>([^<]+)<\/a>.+<\/td>\n<td class=wb><a href=\/map\.php\?sx=\d+&sy=\d+>([^<]+)<\/a><\/td>\n<td class=wb align=center><B>([^<]+)<\/b><\/td>\n<td class=wb align=center><\/td>\n<td class=wb >([^<]+)/igm
		var match = regexp.exec(req.responseText);
		var tbl='<table width=100%>';
		cnt=0;
		while (match != null) 
		{
			if((match[2] != 'Банк') && (match[2] != 'Склад') && (match[2] != 'Частный дом'))
			{
				var matches2 = match[4].match(/^(\d*),?(\d*).?(\d*).?(\d*)/);
                var money = '';
                for (var i = 1; i < matches2.length; i++)
                {
                    money += matches2[i];
                }
                money = parseInt(money);

				tbl+='<tr class=wb><td width=20px><span id=sp'+cnt+'><input type=checkbox id=\'ob'+cnt+'\' value='+match[1]+' checked></span></td><td class=wb>'+match[2]+ '(#' + match[1] + ')' +'</td><td class=wb>'+match[3]+'</td><td class=wb>'+match[4]+'<input type="hidden" id="money_obj' + cnt + '" style="display:none;" value="' + money + '" /></td><td class=wb>'+match[5]+'</td></tr>';
			}

			oname[cnt] = match[2];
			match = regexp.exec(req.responseText);
			cnt++;
		}
		cnt--;
		tbl+='</table>';
		div.innerHTML=tbl;
		form[nf2].appendChild(div);
		
	});	//end ajax

	var input = document.createElement('input');
	input.setAttribute('type', 'button');
	input.value = 'Поменять цены';
	input.onclick=function(){send();}
	form[nf2].appendChild(input);
	
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');	
	input.onclick=function(){test3(this.checked);}
	form[nf2].appendChild(input);
	input.checked = true;
	
	var span = document.createElement('span');
	span.innerHTML = 'Выделить все';
	form[nf2].appendChild(span);
	
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');	
	input.onclick=function(){test4(this.checked);}
	form[nf2].appendChild(input);
	
	var span = document.createElement('span');
	span.innerHTML = 'один тип';
	form[nf2].appendChild(span);
	
	var input = document.createElement('input');
	input.setAttribute('type', 'button');
	input.value = 'Перевод средств';
	input.onclick=function(){sendm();}
	if(evmoney)
		form[nf1].appendChild(input);
	
	var input = document.createElement('input');
	input.setAttribute('type', 'button');
	input.value = 'Снять все';
	input.onclick=function(){getm();}
	form[nf1].appendChild(input);

	
}

function send()
{
	
	for (var i=0;i<lengthimp-1;i++)
	{		
		if(i != lengthimp-4)
		{
			if (params.length) params+='&';
			params +=inp[i].name+'='+(inp[i].value);
		}
	}
	//form[nf2].innerHTML += '<br>' + params;
	MakeChanges(0, params);	
		
}

function sendm()
{
	
	for (var i=0;i<lenimpm;i++)
	{		
		if(i != 1)
		{
			if (paramsm.length) paramsm+='&';
			paramsm +=inpm[i].name+'='+(inpm[i].value);
		}
	}
	MakeChanges(0, paramsm);	
	//alert(paramsm);
		
}

function getm()
{
	WidthrawAll();
}

function WidthrawAll()
{
	var j = 1;
	for (var i = 0; i < cnt; i++)
	{
		if (!root.document.getElementById('ob'+i) || !root.document.getElementById('ob'+i).checked)
		{
			continue;
		}

		(function(){
			var which = i;
			var timeout = j * 300;
			root.setTimeout(function(){
				var id = root.document.getElementById('ob'+which).value;
				var money = root.document.getElementById('money_obj'+which).value;
				var par = 'id=' + id + '&money_action=1&money_out=' + money;
				postData('http://www.gwars.ru/objectedit.php', par);
			}, timeout);
			
		})();
		j++;
	}

	root.setTimeout(function(){
		alert('Сделано');
	}, j * 300);
}

function MakeChanges(i, par)
{
	while ((root.document.getElementById('ob'+i))&&(!root.document.getElementById('ob'+i).checked)){
			i++;
	}
	if (i<=cnt){

		root.setTimeout(function(){
			//par=params;
			par+='&id='+root.document.getElementById('ob'+i).value;
			postData('http://www.gwars.ru/objectedit.php',par);
			root.document.getElementById('sp'+i).innerHTML='OK';
			i++;
			MakeChanges(i, par);
		},5000);
	} else{
		alert('Сделано');
		root.document.body.innerHTML+='<br><a href="http://www.gwars.ru/info.realty.php?id=163347" target="_blank">К списку недвижимости</a>';
		//root.document.body.innerHTML+='<br><a href=http://www.gwars.ru/info.realty.php?id=163347 target=blank>К списку недвижимости</a>';
	}
}

function getParams(id)
{
	var s='';
		    var span = root.document.getElementsByTagName('input');
		    for (var i=0;i<span.length;i++){
				if (span[i].name=='newname'){
					break;
				}
//				if ((span[i].name!='id')&&(span[i].name!='save')&&(span[i].value)&&(span[i].type=='text')) span[i].value=span[i].value*1+1;
				if ((span[i].name!='id')&&(span[i].value)&&(span[i].type=='text')) {
					if (s.length) s+='&';
					s+=span[i].name+'='+(span[i].value);
				}
		    }
			s=s+"&save=1";
			return s;
}
function ajax(url, method, onload) {
    
    // только FF. Maxthon лесом.
    if (typeof GM_xmlhttpRequest != 'undefined'  && typeof document.all == 'undefined') {
        
        GM_xmlhttpRequest({
            
            method: method,
            url: url,
            onload: onload
            
        });
    // все остальное через Prototype
    } else if (typeof Ajax != 'undefined') {
        
        new Ajax.Request(url, {
            
            method: method,
            onComplete: onload
            
        });
    // ожидаем загрузки библиотеки        
    } else if (root.document.getElementById('fwprototype') == null) {
        
        var script = root.document.createElement('script');
        script.id   = 'fwprototype';
        script.type = 'text/javascript';
        //script.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js';
        script.src = 'https://ajax.googleapis.com/ajax/libs/prototype/1.7.3.0/prototype.js';
        root.document.body.appendChild(script);
        
        root.setTimeout(function() { ajax(url, method, onload); }, 100);
        
    } else {
        
        root.setTimeout(function() { ajax(url, method, onload); }, 100);
        
    }
}

function AJAX()
{

	var xmlHttp;
	try{
	xmlHttp=new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari
	return xmlHttp;
	}
	catch (e)
	{
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); // Internet Explorer
			return xmlHttp;
		}
		catch (e)
		{
			try{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				return xmlHttp;
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
}
function postData(url, parameters, callback)
{

	var xmlHttp = AJAX();

	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.setRequestHeader("Content-length", parameters.length);

	xmlHttp.setRequestHeader("Connection", "close");
	xmlHttp.onreadystatechange = function() {
			  if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					if (typeof(callback) == 'function')
					{
						callback();
					}
				} else {
				}
			  }
			};
	xmlHttp.send(parameters);
}
})();
