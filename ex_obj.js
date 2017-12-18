'use strict';
//Watch Guard 工具箱
const WG = require('./wg_utils');
const cfg = require('./wg_config');
var wg_utils = new WG(cfg.repos_data_host, cfg.repos_data_path);
//參數 input_sdate_str 始開時間
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var input_sdate_Str = '2017-12-14 06:00:00 GMT';
if (process.argv.length >= 3) {
    input_sdate_Str = process.argv[2];
}
wg_utils.Auth_Login(cfg.Auth_Login_Host, cfg.Auth_Login_Path_, cfg.user_pwd);

var index_ = 0;
var link_paths = [
    '/',
    '/control/device',
    '/control/devices',
    '/log/log_groups'
];

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
    wg_utils.HttpGet(cfg.Auth_Login_Host, path_);
}
app.run = function () {
    app.vIntervalTimer = setInterval(app.GetWGLog, 2000);
}
app.run();
