from http.server import SimpleHTTPRequestHandler
from io import StringIO
from urllib.parse import urlparse
from server import get_progress
from server import update_progress
import json
import setup
import traceback


class SetupHTTPRequestHandler(SimpleHTTPRequestHandler):
    """docstring for SetupHTTPRequestHandler"""
    def do_GET(self):
        try:
            parseresult = urlparse(self.path)
            if "=" in parseresult.query:
                query_dict = dict(qc.split("=") for qc in parseresult.query.split("&"))
                if 'update' in query_dict:
                    self.handle_update_request()
                elif 'start' in query_dict:
                    self.handle_start_setup(query_dict)
                elif 'couchdb' in query_dict:
                    self.handle_couchdb_login(query_dict)
                else:
                    super(SetupHTTPRequestHandler, self).do_GET()
            else:
                super(SetupHTTPRequestHandler, self).do_GET()
            pass
        except Exception:
            self.send_response(500, 'Internal Server Error')
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write("""
                Something went wrong :(
            """.encode())
            traceback.print_exc()

    def handle_update_request(self):
        progress = get_progress()
        body = json.dumps(progress).encode()
        self.send_response(200, 'OK')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(body)

    def handle_start_setup(self, query_dict):
        super(SetupHTTPRequestHandler, self).do_GET()
        if query_dict['start'].startswith('True'):
            setup.start_setup(update_progress)

    def handle_couchdb_login(self, query_dict):
        if "name" not in query_dict or "password" not in query_dict:
            self.send_response(403, 'FORBIDDEN')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"message": "Password or username not provided"}).encode())
        else:
            if setup.check_couchdb is not None:
                setup.check_couchdb.admin = query_dict['name']
                setup.check_couchdb.adminpass = query_dict['password']
                if setup.check_couchdb.verify_login():
                    self.send_response(200, "OK")
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"message": "Correct username and password"}).encode())
                else:
                    self.send_response(403, "FORBIDDEN")
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"message": "Incorrect username or password"}).encode())
            else:
                self.send_response(500, "Internal Server Error")
                self.end_headers()
                self.wfile.write(''.encode())
