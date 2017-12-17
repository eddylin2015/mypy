
#!/usr/bin/env python

# import modules used here -- sys is a very standard one
import sys
import wg_utils
import http.client
import urllib
import ssl
import time

# Gather our code in a main() function
def main():
    print(sys.argv)
    host="127.0.0.1"
    path="/login"
    params = urllib.parse.urlencode({'@number': 12524, '@type': 'issue', '@action': 'show'})
    session_id=wg_utils.Auth_Login(host,path,params)
    print(session_id)
    link_paths = [
  '/',
  '/control/device',
  '/control/devices',
  '/log/log_groups',
  '/dashboard/executive?sn=2',
  '/report/get_daily_reports?sn=2'
    ];
    for link_ in link_paths:
        wg_utils.HttpGet(host,link_, session_id)
        time.sleep(3)

# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
    main()
