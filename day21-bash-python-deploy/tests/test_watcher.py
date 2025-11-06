import threading
import time
import http.server
import socketserver
import unittest
import os
import sys

# Ensure the watcher module in this folder can be imported despite the folder having a hyphen
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, HERE)
import watcher as watcher_mod


class SimpleHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"ok")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # silence logs during tests
        pass


class WatcherHealthTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.port = 57575
        cls.httpd = socketserver.TCPServer(("127.0.0.1", cls.port), SimpleHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        time.sleep(0.1)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.thread.join(timeout=1)

    def test_http_healthcheck_success(self):
        url = f"http://127.0.0.1:{self.port}/health"
        ok = watcher_mod.http_healthcheck(url, timeout=1.0)
        self.assertTrue(ok)

    def test_http_healthcheck_failure(self):
        url = f"http://127.0.0.1:{self.port}/missing"
        ok = watcher_mod.http_healthcheck(url, timeout=1.0)
        self.assertFalse(ok)


if __name__ == "__main__":
    unittest.main()
