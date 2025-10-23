#!/usr/bin/env ruby
require 'webrick'
require 'rack'
require 'stringio'
require_relative '../app/app'

host = ENV.fetch('HOST', '127.0.0.1')
port = Integer(ENV.fetch('PORT', '4567'))

app = EventBookingApp.new

server = WEBrick::HTTPServer.new(Host: host, Port: port, AccessLog: [], Logger: WEBrick::Log.new($stdout))
trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

# Mount a Rack application using WEBrick::HTTPServer#mount_proc
server.mount_proc('/') do |req, res|
  env = req.meta_vars.dup
  # Fill in required Rack env entries
  env['rack.version'] = Rack::VERSION
  env['rack.input'] = StringIO.new(req.body || '')
  env['rack.errors'] = $stderr
  env['rack.multithread'] = false
  env['rack.multiprocess'] = false
  env['rack.run_once'] = false
  env['REQUEST_METHOD'] = req.request_method
  env['SCRIPT_NAME'] = ''
  env['PATH_INFO'] = req.path
  env['QUERY_STRING'] = req.query_string || ''
  env['SERVER_NAME'] = host
  env['SERVER_PORT'] = port.to_s

  status, headers, body = app.call(env)
  res.status = status
  headers.each { |k, v| res[k] = v }
  body.each { |part| res.body << part }
  body.close if body.respond_to?(:close)
end

puts "Starting WEBrick (direct) on http://#{host}:#{port}"
server.start
