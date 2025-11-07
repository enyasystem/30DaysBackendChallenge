#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'ok')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # silence access logs
        return

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8081), H)
    print('Health server listening on http://127.0.0.1:8081/health')
    server.serve_forever()
