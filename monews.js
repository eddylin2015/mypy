'use strict';
//Watch Guard 工具箱
const WG = require('./wg_utils');
const fs = require('fs');
var wg_utils = new WG("", "");
//參數 input_sdate_str 始開時間
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var d = new Date();
	var y = d.getFullYear();
	var m =  d.getMonth()+1;
	var da = d.getDate()
	var date_ ="/html/"+y+"-";
	if(m<10) date_ +="0";
	date_+=m+"/";
	if(da<10) date_+="0";
	date_+=da+"/";
	var filename=date_.replace(/\//g,"");
	filename=filename.replace(/-/g,"")+".txt";
	console.log(filename);
	
fs.writeFile(filename,filename, (err) => {
  if (err) throw err;
  console.log(filename);
});	
wg_utils.NewsGet('www.tdm.com.mo','/global/xml/livenews_rss.php',filename);	
var index_ = 0;
var link_paths = [];
wg_utils.NewsNodeGet("www.macaodaily.com", date_+'node_2.htm',link_paths,date_);



let app =function (){}
app.vIntervalTimer = null;
app.GetWGLog = function () {
    console.error(index_);
    if (index_ >= link_paths.length) {
        clearInterval(app.vIntervalTimer);
        return;
    }
    var path_ = link_paths[index_];
    index_++;
    console.log(index_, path_);
fs.appendFile(filename,"\n\n"+path_+"\n\n", (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
        wg_utils.NewsNodeContentGet("www.macaodaily.com", path_,filename);
	
	
	
}

app.run = function () {
    app.vIntervalTimer = setInterval(app.GetWGLog, 1000);
}
app.run();
