import sys
import http.client
import urllib
import ssl

#Login Web Site: return Session-id
def Auth_Login(host, path, param):
   ssl._create_default_https_context=ssl._create_unverified_context
   headers = {
      'Connection': 'keep-alive',
      'Content-Length': len(param),
      'Cache-Control': 'max-age=0',
      'Origin': 'https://' + host,
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
      'Cookie': 'session_id=714b232ee2cbdc32bf66ffff226b7b4388026a8c'
    }
   conn = http.client.HTTPSConnection(host)
   conn.request("POST",path, param, headers)
   response = conn.getresponse()
   print( response.status, response.reason)
   print(response.headers)
   session_id=response.headers['set-cookie']
   print(session_id)
   data = response.read()
   print(data)
   conn.close()
   return session_id
#end auto_login
#HttpGet with Session_id
def HttpGet(host_, path_ , session_id):
   ssl._create_default_https_context=ssl._create_unverified_context
   headers ={ 'Cookie': session_id }
   conn = http.client.HTTPSConnection(host_)
   body=""
   conn.request("GET",str( path_), body, headers)
   response = conn.getresponse()
   print(response.status, response.reason)
   print(response.headers)
   data = response.read()
   print(data)
   conn.close()
#HttpGet End
