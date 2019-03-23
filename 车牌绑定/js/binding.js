var provinces = new Array("京","沪","浙","苏","粤","鲁","晋","冀",
		"豫","川","渝","辽","吉","黑","皖","鄂",
		"津","贵","云","桂","琼","青","新","藏",
		"蒙","宁","甘","陕","闽","赣","湘");

var keyNums = new Array("0","1","2","3","4","5","6","7","8","9",
		"Q","W","E","R","T","Y","U","I","O","P",
		"A","S","D","F","G","H","J","K","L",
		"OK","Z","X","C","V","B","N","M","Del");
var next=0;    
var num=0;     


function showProvince(){
	$("#pro").html("");
	var ss="";
	for(var i=0;i<provinces.length;i++){
		ss=ss+addKeyProvince(i)
	} 
	$("#pro").html("<ul class='clearfix ul_pro'>"+ss+
			"<li class='li_close' onclick='closePro();'><span>关闭</span></li>" +
	"<li class='li_clean' onclick='cleanPro();'><span>清空</span></li></ul>");
} 
function showKeybord(){
	$("#pro").html("");
	var sss="";
	for(var i=0;i<keyNums.length;i++){
		sss=sss+'<li class="ikey ikey'+i+' '+(i>9?"li_zm":"li_num")+' '+(i>28?"li_w":"")+'" ><span onclick="choosekey(this,'+i+');">'+keyNums[i]+'</span></li>'
	} 
	$("#pro").html("<ul class='clearfix ul_keybord'>"+sss+"</ul>");
}
function addKeyProvince(provinceIds){
	var addHtml = '<li>';
	addHtml += '<span onclick="chooseProvince(this);">'+provinces[provinceIds]+'</span>';
	addHtml += '</li>';
	return addHtml;
}

function chooseProvince(obj){
	$(".input_pro span").text($(obj).text());
	$(".input_pro").addClass("hasPro");
	$(".input_pp").find("span").text("");
	$(".ppHas").removeClass("ppHas");
	next=0;
	showKeybord();
	$(".car_input").attr("data-pai","");
	getpai($(obj).text());
}    


function choosekey(obj,jj){    
	//$("input[type=checkbox]").is(":checked");
	if(jj==29){
		if(confirm("车牌："+$(".car_input").attr("data-pai"))){
			//点击确定后操作
			$.ajax({
				url : 'addCar',
				type : "post",
				dataType : "json",
				data : {"carNo":$(".car_input").attr("data-pai"),
					"cid":localStorage.getItem("cid")},
					success : function(obj) {
						if (obj.success==true) {
							$("#jp_pro").html('<p>添加成功,正在跳转...</p>');
							if(obj.ajaxErrorCode == 200){
								setTimeout(function(){
									window.location.href = '/index';
								}, 2000);
							}
						}else{
							console.log("添加失败");
							layer.open({
								content: '车牌已被绑定过',
								skin: 'msg',
								time: 3
							});
						}
					}
			});
			layer.closeAll();
		}else{
//			window.location.reload();
		}

	}else if(jj==37){
		if($(".ppHas").length==0){
			$(".hasPro").find("span").text("");            
			$(".hasPro").removeClass("hasPro");    
			showProvince();
			next=0;
		}
		$(".ppHas:last").find("span").text("");            
		$(".ppHas:last").removeClass("ppHas");    
		next=next-1;
		if(next<1){
			next=0;
		}
		var str=$(".car_input").attr("data-pai");
		str=str.substring(0,str.length-1);
		$(".car_input").attr("data-pai",str);
	}else{
		if($("input[type=checkbox]").is(":checked")){
			num = 6;
		}else{
			num = 5;
		}
		if(next>num){
			return
		}
		console.log(next);
		if(next>5){
			$(".save_car").css("color","#3c3c3c");
			$(".save_car").css("background","#00bbff");	
		}
		if(next==5){
			$(".save_car").css("color","#3c3c3c");
			$(".save_car").css("background","#00bbff");	
		}
		for(var i = 0; i<$(".input_pp").length;i++){
			if(next==0 & jj<10 & $(".input_pp:eq("+next+")").hasClass("input_zim")){
				layer.open({
					content: '车牌第二位为字母',
					skin: 'msg',
					time: 1
				});
				return
			}
			$(".input_pp:eq("+next+")").find("span").text($(obj).text());
			$(".input_pp:eq("+next+")").addClass("ppHas");
			next=next+1;
			if(next>num){
				next=num+1;
			}
			getpai($(obj).text());
			return
		}
	}
}
function closePro(){
	layer.closeAll()
}        
function cleanPro(){
	$(".ul_input").find("span").text("");
	$(".hasPro").removeClass("hasPro");
	$(".ppHas").removeClass("ppHas");
	next=0;
}    
function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}

function getpai(ss){
	var s1 = $(".car_input").attr("data-pai");
	$(".car_input").attr("data-pai",s1+ss);

	//var pai=trimStr($(".car_input").text());
	//$(".car_input").attr("data-pai",pai);
}

$(document).ready(function(){
	$(".ul_input li:last-child span").bind("DOMNodeInserted",function(){
			$(".save_car").css("color","#3c3c3c");
			$(".save_car").css("background","#00bbff");			
	});
	$(".ul_input li:last-child span").bind("DOMNodeRemoved",function(){
		//灰
			$(".save_car").css("color","#ffffff");
			$(".save_car").css("background","#c0c0c0");
	});
})

window.onload = function() {

	$(".input_pro").click(function(){
		layer.open({
			type: 1
			,content: '<div id="pro"></div>'
				,anim: 'up'
					,shade :false 
					,style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; padding:0; border:none;'
		});
		showProvince()
	})
	$(".input_pp").click(function(){
		if($(".input_pro").hasClass("hasPro")){
			layer.open({
				type: 1
				,content: '<div id="pro"></div>'
					,anim: 'up'
						,shade :false 
						,style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; padding:0; border:none;'
			});
			showKeybord()
		}else{
			$(".input_pro").click()
		}
	})


	$(".save_car").click(function(obj){
		if($(".save_car").css("color")!="rgb(60, 60, 60)"){
			layer.open({
				content: '请输入正确车牌',
				skin: 'msg',
				time: 1
			});
		}else{
			
			choosekey(obj,29);
		}
	})

}