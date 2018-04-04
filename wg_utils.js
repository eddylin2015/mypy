const https = require('https');
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
function html2txt(html)
{
	html = html.replace(/<!--([\w|\W|\s|\S]*?)-->/gi, '');					
			
html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
html = html.replace(/<\/div>/ig, '\n');
html = html.replace(/<\/li>/ig, '\n');
html = html.replace(/<li>/ig, '  *  ');
html = html.replace(/<\/ul>/ig, '\n');
html = html.replace(/<\/p>/ig, '\n');
html = html.replace(/<br\s*[\/]?>/gi, "\n");
html = html.replace(/<[^>]+>/ig, '');
html = html.replace(/&nbsp;/ig, ' ');
html = html.replace(/<!--([\w|\W|\s|\S]*?)-->/gi, '');	
	return html;
}
module.exports = class WG_STAT {
    constructor(repos_data_host_, repos_data_path_) {
        this.repos_data_host = repos_data_host_;
        this.repos_data_path = repos_data_path_;
        this.session_id = "session_id= " + "017827db403cbb7dcd76a54dcd3be6eb0fb1b70a";
    }
    HttpPost(param_host,param_path, param_o) {
        let param_postData = querystring.stringify(param_o);
        let options = {
            hostname: param_host,
            port: 80,
            path: param_path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(param_postData)
            }
        };
        let req = http.request(options, (res) => {
            //console.log(`STATUS: ${res.statusCode}`);
            //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            //res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.error(`BODY: ${chunk}`);
            });
            res.on('end', () => { });
        });
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        // write data to request body
        req.write(param_postData);
        req.end();
    }
    Auth_Login(host_, path_, param_postData) {
        const req = https.request(
            {
                hostname: host_,
                port: 443,
                path: path_,
                method: 'POST',
                headers: {
                    'Connection': 'keep-alive',
                    'Content-Length': Buffer.byteLength(param_postData),
                    'Cache-Control': 'max-age=0',
                    'Origin': 'https://' + host_,
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
                    'Cookie': 'session_id=714b232ee2cbdc32bf66ffff226b7b4388026a8c'
                }
            }
            , (res) => {
                var config = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    login: true
                };
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
                res.on('data', (d) => {
                    //process.stdout.write(d);
                    this.session_id = config.headers['set-cookie'][0].split(";")[0];
                    console.log(this.session_id);
                    //setTimeout(myFunc, 30000, session_id);
                });
            });
        req.write(param_postData);
        req.end();
    }
    HttpGet(host_, path_) {
        console.log("HttpGet", path_, this.session_id);
        https.get(
            {
                hostname: host_,
                port: 443,
                path: path_,
                method: 'GET',
                headers: { 'Cookie': this.session_id }
            },
            (res) => {
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
                res.on('data', (d) => {
                    // process.stdout.write(d);
                    if (d.toString().includes('grid_data')) {
                        let o = JSON.parse(d);
                        console.log(o);
                        let jres = { 'incoming': o["grid_data"][1]['count'], 'outgoing': o["grid_data"][2]['count'], 'stime': o["earliest_record"], 'etime': o["latest_record"], 'reccnt': o["grid_data"][0]['count'] };
                        console.log(jres);
                        this.HttpPost(this.repos_data_host, this.repos_data_path, jres);
                    } else {
                        console.log(d.toString());
                    }
                });
            }).on('error', (e) => {
                console.log(e);
            });
    }
	
    NewsNodeGet(host_, path_,link_paths,date_) {
        console.log("HttpGet", path_, this.session_id);
        http.get(
            {
                hostname: host_,
                port: 80,
                path: path_,
                method: 'GET',
                headers: { 'Cookie': this.session_id }
            },
            (res) => {
               // console.log('statusCode:', res.statusCode);
                //console.log('headers:', res.headers);
                res.on('data', (d) => {
                    // process.stdout.write(d);
					var html=d.toString();
var pageLinka = html.match(/<a id=pageLink href=([\w|\W|\s|\S]*?)<\/a>/g);

if(pageLinka){
for(var i=0 ;i<pageLinka.length;i++)
{
	var url=pageLinka[i].replace("<a id=pageLink href=", '');
	url=url.replace(/>([\w|\W|\s|\S]*?)<\/a>/gi, '');	
	
	link_paths.push(date_+url);
}
}
                 
                });
            }).on('error', (e) => {
                console.log(e);
            });
    }	
	 NewsNodeContentGet(host_, path_,filename) {
        //console.log("HttpGet", path_, this.session_id);
        http.get(
            {
                hostname: host_,
                port: 80,
                path: path_,
                method: 'GET',
                headers: { 'Cookie': this.session_id }
            },
            (res) => {
               // console.log('statusCode:', res.statusCode);
                //console.log('headers:', res.headers);
                res.on('data', (d) => {
                    // process.stdout.write(d);
					 var html=d.toString();
var pageLinka = html.match(/<a href=content_([\w|\W|\s|\S]*?)<\/a>/g);

if(pageLinka){
for(var i=1 ;i<pageLinka.length;i++)
{

fs.appendFile(filename,html2txt(pageLinka[i]), (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
}
}
                 
                });
            }).on('error', (e) => {
                console.log(e);
            });
    }	
	NewsGet(host_, path_,filename) {
        console.log("HttpGet", path_, this.session_id);
        http.get(
            {
                hostname: host_,
                port: 80,
                path: path_,
                method: 'GET',
                headers: { 'Cookie': this.session_id }
            },
            (res) => {
               // console.log('statusCode:', res.statusCode);
                //console.log('headers:', res.headers);
                res.on('data', (d) => {
                    // process.stdout.write(d);
					var html=d.toString();

fs.appendFile(filename,html2txt(html), (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
                       
                 
                });
            }).on('error', (e) => {
                console.log(e);
            });
    }
}



