


#!/usr/bin/env python

# import modules used here -- sys is a very standard one
import sys
import wg_utils
import wg_config
import http.client
import urllib
import ssl
import time

# Gather our code in a main() function
def main():
    print(sys.argv)
    host=wg_config.Auth_Login_Host()
    path="/auth/login"
    params = urllib.parse.urlencode({'username': wg_config.WG_Username(), 'password': wg_config.WG_Password(), 'from_page': '/'})
    wg_u=wg_utils.WG(host);
    wg_u.Auth_Login(path,params)
    link_paths = [
  '/',
  '/control/device',
  '/control/devices',
  '/log/log_groups',
  '/log/log_vpns',
  '/log/log_devices?_search=false&rows=10000&page=1&sidx=name&sord=asc',
  '/log/log_grid_columns?l_t=servers',
    ];
    for link_ in link_paths :
        wg_u.HttpGet( link_)
        time.sleep(3)
# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
    main()
