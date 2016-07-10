// JavaScript Document
var canvas=document.getElementById('canvas');
var cxt=canvas.getContext('2d');

//获取工具按钮的标签
var Brush=document.getElementById('means_brush');
var Eraser=document.getElementById('means_eraser');
var Paint=document.getElementById('means_paint');
var Straw=document.getElementById('means_straw');
var Text=document.getElementById('means_text');
var Magnifier=document.getElementById('means_magnifier');
//获取形状按钮的标签
var Line=document.getElementById('shape_line');
var Arc=document.getElementById('shape_arc');
var Rect=document.getElementById('shape_rect');
var Poly=document.getElementById('shape_poly');
var ArcFill=document.getElementById('shape_arcfill');
var RectFill=document.getElementById('shape_rectfill');
//把12个工具和形状标签放到一个数组中
var actions=[Brush,Eraser,Paint,Straw,Text,Magnifier,Line,Arc,Rect,Poly,ArcFill,RectFill];

//获取线宽按钮
var Line_1=document.getElementById('width_1');
var Line_3=document.getElementById('width_3');
var Line_5=document.getElementById('width_5');
var Line_8=document.getElementById('width_8');
//把四种线宽对象放到一个数组中
var width=[Line_1,Line_3,Line_5,Line_8];

//获取颜色按钮
var ColorRed=document.getElementById('red');
var ColorGreen=document.getElementById('green');
var ColorBlue=document.getElementById('blue');
var ColorYellow=document.getElementById('yellow');
var ColorWhite=document.getElementById('white');
var ColorBlack=document.getElementById('black');
var ColorPink=document.getElementById('pink');
var ColorPurple=document.getElementById('purple');
var ColorCyan=document.getElementById('cyan');
var ColorOrange=document.getElementById('orange');
//把颜色对象放到一个数组中
var colors=[ColorRed,ColorGreen,ColorBlue,ColorYellow,ColorWhite,ColorBlack,ColorPink,ColorPurple,ColorCyan,ColorOrange];


//设置初始值  
	//默认选中画笔工具
	drawBrush(0);
	//默认设置颜色
	setColor(ColorRed,0);
	//设置默认线宽
	setLineWidth(0);


//状态设置函数
function setStatus(Arr,num,type)
{
	for(var i=0;i<Arr.length;i++)
	{
		if(i==num)
		{
			if(type==1)
				Arr[i].style.background="yellow";
			else
				Arr[i].style.border="1px solid #fff";
		}
		else
		{
			if(type==1)
				Arr[i].style.background="#ccc";
			else
				Arr[i].style.border="1px solid #000";
		}
	}
}

//设置图像功能函数   保存图片   清空画布
function saveimg()
{
	var imgdata=canvas.toDataURL();
	var b64=imgdata.substring(22);
	//给form表单中的隐藏表单赋值（值就是我们获取的b64）
	var data=document.getElementById('data');
	data.value=b64;
	//将表单提交到后台	//http://localhost:8888/down.php
	var form=document.getElementById('myForm');
	form.submit();
}

function clearimg()
{
	cxt.clearRect(0,0,880,400);
}

//列出所有的按钮对应的函数
function drawBrush(num)
{
	setStatus(actions,num,1);
	var flag=0;		//设置标志位，检测鼠标是否按下
	
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		var startX=evt.pageX-this.offsetLeft;
		var startY=evt.pageY-this.offsetTop;
		cxt.beginPath();
		cxt.moveTo(startX,startY);
		flag=1;
		//console.log("mousedown " + startX + " " + startY);
	};
			
	canvas.onmousemove=function(evt){
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		if(flag){
			cxt.lineTo(endX,endY);
			cxt.stroke();
			//console.log("mousemove " + endX + " " + endY);
		}
	};
			
	canvas.onmouseup=function(){
		flag=0;
	};
			
	canvas.onmouseout=function(){
		flag=0;
	};
}

var eraserFlag=0;	//设置橡皮擦的状态标志位
function drawEraser(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		var eraserX=evt.pageX-this.offsetLeft;
		var eraserY=evt.pageY-this.offsetTop;
		//canvas擦出方法  cxt.clearRect();
		cxt.clearRect(eraserX-cxt.lineWidth,eraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
		eraserFlag=1;
	};
	canvas.onmousemove=function(evt){
		evt=window.event||evt;
		var eraserX=evt.pageX-this.offsetLeft;
		var eraserY=evt.pageY-this.offsetTop;
		//canvas擦出方法  cxt.clearRect();
		if(eraserFlag)		//判断鼠标左键是否按下（按下的情况下拖动鼠标才能删除）
			cxt.clearRect(eraserX-cxt.lineWidth,eraserY-cxt.lineWidth,cxt.lineWidth*2,cxt.lineWidth*2);
	};
	canvas.onmouseup=function(){
		eraserFlag=0;
	};
	canvas.onmouseout=function(){
		eraserFlag=0;
	};
}
function drawPaint(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(){
		//把画布涂成指定的颜色
		cxt.fillRect(0,0,880,400);
	};
	canvas.onmouseup=null;
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}
function drawStraw(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		var strawX=evt.pageX-this.offsetLeft;
		var strawY=evt.pageY-this.offsetTop;
		//获取该点坐标处的颜色信息
		//获取图像信息的方法：getImageData(开始点x,开始点y,宽度,高度)
		//返回一个ImageData对象
		var obj=cxt.getImageData(strawX,strawY,1,1);
		//obj.data=[红,绿,蓝,透明度]					//1像素的数据
		//obj.data=[红,绿,蓝,透明度,红,绿,蓝,透明度]		//2像素的数据
		//每个数组元素的值的范围都是0~255
		var color='rgb('+obj.data[0]+','+obj.data[1]+','+obj.data[2]+')';
		//将吸管吸出的颜色设定到我们的应用中
		cxt.strokeStyle=color;
		cxt.fillStyle=color;
		//颜色吸取之后自动选中画笔工具
		drawBrush(0);
	};
	canvas.onmousemove=null;
	canvas.onmouseup=null;
	canvas.onmouseout=null;
}
function drawText(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		//获取鼠标点击时的位置
		var textX=evt.pageX-this.offsetLeft;
		var textY=evt.pageY-this.offsetTop;
		//获取用户输入的信息
		var userVal=window.prompt('请输入要插入的文字','');
		//将用户输入的文字写到画板中对应的坐标点上
		cxt.font="20px 微软雅黑";
		if(userVal!=null)
			cxt.fillText(userVal,textX,textY);
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
	canvas.onmouseup=null;
}
function drawMagnifier(num)
{
	setStatus(actions,num,1);
	//用户输入的数据大小
	var scale=window.prompt('请输入缩放百分比','');
	//把数据转化成对应canvas画布的大小
	var scaleW=880*scale/100;
	var scaleH=400*scale/100;
	//将数据设置到对应的html标签上
	canvas.style.width=parseInt(scaleW)+'px';
	canvas.style.height=parseInt(scaleH)+'px';
}

//线形状函数
function drawLine(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		//获取起始点的坐标，相对于canvas画布的
		var startX=evt.pageX-this.offsetLeft;
		var startY=evt.pageY-this.offsetTop;
		//设置直线的开始点
		cxt.beginPath();
		cxt.moveTo(startX,startY);
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
	canvas.onmouseup=function(evt){
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		cxt.lineTo(endX,endY);
		cxt.closePath();
		cxt.stroke();
	};
}

var arcX=0;
var arcY=0;
function drawArc(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		//获取圆心位置
		evt=window.event||evt;
		arcX=evt.pageX-this.offsetLeft;
		arcY=evt.pageY-this.offsetTop;
	};
	canvas.onmouseup=function(evt){
		//获取半径
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		var radius=Math.sqrt((endX-arcX)*(endX-arcX)+(endY-arcY)*(endY-arcY));
		cxt.beginPath();
		cxt.arc(arcX,arcY,radius,0,360,false);
		cxt.closePath();
		cxt.stroke();
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}

var rectX=0;
var rectY=0;
function drawRect(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		rectX=evt.pageX-this.offsetLeft;
		rectY=evt.pageY-this.offsetTop;
	};
	canvas.onmouseup=function(evt){
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		var width=endX-rectX;
		var height=endY-rectY;
		cxt.strokeRect(rectX,rectY,width,height);
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}

var polyX=0;
var polyY=0;
function drawPoly(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		polyX=evt.pageX-this.offsetLeft;
		polyY=evt.pageY-this.offsetTop;
	};
	canvas.onmouseup=function(evt){
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		cxt.beginPath();
		//将画笔移动到右下角的点
		cxt.moveTo(endX,endY);
		//计算左下角顶点坐标
		var lbX=2*polyX-endX;
		var lbY=endY;
		cxt.lineTo(lbX,lbY);
		//设置第三个顶点的坐标
		var tmpC=2*(endX-polyX);
		var tmpA=endX-polyX;
		var tmpB=Math.sqrt(tmpC*tmpC-tmpA*tmpA);
		cxt.lineTo(polyX,endY-tmpB);
		cxt.closePath();
		cxt.stroke();
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}
function drawArcFill(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		//获取圆心位置
		evt=window.event||evt;
		arcX=evt.pageX-this.offsetLeft;
		arcY=evt.pageY-this.offsetTop;
	};
	canvas.onmouseup=function(evt){
		//获取半径
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		var radius=Math.sqrt((endX-arcX)*(endX-arcX)+(endY-arcY)*(endY-arcY));
		cxt.beginPath();
		cxt.arc(arcX,arcY,radius,0,360,false);
		cxt.closePath();
		cxt.fill();
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}
function drawRectFill(num)
{
	setStatus(actions,num,1);
	canvas.onmousedown=function(evt){
		evt=window.event||evt;
		rectX=evt.pageX-this.offsetLeft;
		rectY=evt.pageY-this.offsetTop;
	};
	canvas.onmouseup=function(evt){
		evt=window.event||evt;
		var endX=evt.pageX-this.offsetLeft;
		var endY=evt.pageY-this.offsetTop;
		var width=endX-rectX;
		var height=endY-rectY;
		cxt.fillRect(rectX,rectY,width,height);
	};
	canvas.onmousemove=null;
	canvas.onmouseout=null;
}


//线宽设置函数
function setLineWidth(num)
{
	setStatus(width,num,1);
	switch(num)
	{
		case 0:
			cxt.lineWidth=1;
			break;
		case 1:
			cxt.lineWidth=3;
			break;
		case 2:
			cxt.lineWidth=5;
			break;
		case 3:
			cxt.lineWidth=8;
			break;
		default:
			cxt.lineWidth=1;
	}
}

//颜色设置函数
function setColor(obj,num)
{
	setStatus(colors,num,2);
	//设置画笔颜色和填充颜色
	cxt.strokeStyle=obj.id;
	cxt.fillStyle=obj.id;
}







