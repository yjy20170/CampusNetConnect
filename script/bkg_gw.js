﻿//3 functions from gw.buaa.edu.cn:801/js/base64.js
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
		    out += str.charAt(i);
		} else if (c > 0x07FF) {
		    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
		    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
		    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
		    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
		    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
    }
    return out;
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
	 	c = str.charCodeAt(i++);
		switch(c >> 4)
		{
		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		    // 0xxxxxxx
		    out += str.charAt(i-1);
		    break;
		case 12: case 13:
		    // 110x xxxx   10xx xxxx
		    char2 = str.charCodeAt(i++);
		    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		    break;
		case 14:
		    // 1110 xxxx  10xx xxxx  10xx xxxx
		    char2 = str.charCodeAt(i++);
		    char3 = str.charCodeAt(i++);
		    out += String.fromCharCode(((c & 0x0F) << 12) |
		        ((char2 & 0x3F) << 6) |
		        ((char3 & 0x3F) << 0));
		    break;
		}
    }
    return out;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if(i == len)
		{
		    out += base64EncodeChars.charAt(c1 >> 2);
		    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
		    out += "==";
		    break;
		}
		c2 = str.charCodeAt(i++);
		if(i == len)
		{
		    out += base64EncodeChars.charAt(c1 >> 2);
		    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
		    out += "=";
		    break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
	while(i < len) {
		/* c1 */
		do {
		    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c1 == -1);
		if(c1 == -1)
		    break;
		/* c2 */
		do {
		    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c2 == -1);
		if(c2 == -1)
		    break;
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		/* c3 */
		do {
		    c3 = str.charCodeAt(i++) & 0xff;
		    if(c3 == 61)
		    	return out;
		    c3 = base64DecodeChars[c3];
		} while(i < len && c3 == -1);
		if(c3 == -1)
		    break;
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		/* c4 */
		do {
		    c4 = str.charCodeAt(i++) & 0xff;
		    if(c4 == 61)
		    	return out;
		    c4 = base64DecodeChars[c4];
		} while(i < len && c4 == -1);
		if(c4 == -1)
		    break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

//初始化信息
isLoggedin=false;//ture:连上，false:断开
NetError=false;//false:无法连接服务器
infError=false;//false:信息有误
userid=window.localStorage["ID"];
pw=window.localStorage["PW"];
if(window.localStorage["PW"]!=undefined){
	pwB=encodeURIComponent(base64encode(utf16to8(pw)));
}
else pwB="";
//绑定事件
chrome.browserAction.onClicked.addListener(
	function(tab) {
		if(!NetError){
	  		switchNet(0);
		}
  //console.log(sender.tab ?"from a content script:" + sender.tab.url : "from the extension");
	}
);
if(window.localStorage["auto"]=="true"){
	switchNet(1);
}
else check();

//控制显示
function showOn(){
	chrome.browserAction.setIcon({path:"../image/NetOn.png"});
	chrome.browserAction.setTitle({title:"已连上校园网"});
	isLoggedin=true;
}
function showOff(){
	chrome.browserAction.setIcon({path:"../image/NetOff.png"});
	chrome.browserAction.setTitle({title:"已断开校园网"});
	isLoggedin=false;
}
//判断状态
//每30秒查询一次
function check(){
	if(infError)return;
	//console.log("check");
	$.ajax({type: "post",
			url: "https://gw.buaa.edu.cn:801/beihangview.php", 
			data: {},
			//async : false,
			success: function(res) {
				console.log("\n----------regular check:----------\n"+res+'\n');
				NetError=false;
				//console.log(res);
				if(/自服务窗口/.test(res)){
					var getId;
					getId=res.split("user_name=",2)[1].substring(0,8);
					if(getId===userid) showOn();
					else{
						chrome.browserAction.setIcon({path:"../image/NetError.png"});
						chrome.browserAction.setTitle({title:"ERROR: 请在设置页正确填写信息"});
						infError=true;
						isLoggedin=false;
					}
				}
				else showOff();
				setTimeout(function(){check();},30000);
			},
			error:function(e){
				NetError=true;
				chrome.browserAction.setIcon({path:"../image/NetError.png"});
				chrome.browserAction.setTitle({title:"ERROR: 无法连接到服务器"});
				setTimeout(function(){check();},30000);
			}
	});
}
//仅在网络正常时执行,切换状态
function switchNet(isInit){//isInit->初次运行，在回调中开始check循环
	data={
			action: "login",
			username: userid,
			password: "{B}"+pwB,
			ajax: 1,
			ac_id: 1
		}
	if(isLoggedin){
		data.action="logout";
		data.password=pw;}
	$.ajax({type:"POST",
			url:"https://gw.buaa.edu.cn:801/include/auth_action.php",
			data:data,
			success:function(res){
				console.log(res);
				if(/(^E|请)/.test(res)){
					//在某处显示错误
					chrome.browserAction.setIcon({path:"../image/NetError.png"});
					chrome.browserAction.setTitle({title:"ERROR: 请在设置页正确填写信息"});
					infError=true;
					isLoggedin=false;
				}
				else{
					if(!isLoggedin)showOn();
					else showOff();
				}
				if(isInit)setTimeout(function(){check();},30000);
			},
			error:function(e){
				chrome.browserAction.setIcon({path:"../image/NetError.png"});
				chrome.browserAction.setTitle({title:"ERROR: 无法连接到服务器"});
				isLoggedin=false;
				if(isInit)setTimeout(function(){check();},30000);
			}
		}
	);
}