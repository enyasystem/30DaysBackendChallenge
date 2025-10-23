#!/usr/bin/env ruby
require 'rack'
# ensure the Rack handler for WEBrick is loaded so Rack::Handler::WEBrick is defined
require 'rack/handler/webrick'
require 'webrick'
require_relative '../app/app'

port = ENV.fetch('PORT', '4567').to_i
host = ENV.fetch('HOST', '127.0.0.1')

server = Rack::Handler::WEBrick
log_file = File.open('server.log', 'a')
log_file.sync = true
webrick_logger = WEBrick::Log.new(log_file)
options = {
  Host: host,
  Port: port,
  AccessLog: [],
  Logger: webrick_logger
}

puts "Starting WEBrick on #{host}:#{port} (PID=#{Process.pid})"
server.run(EventBookingApp, options) do |s|
  trap('INT') { s.shutdown }
  trap('TERM') { s.shutdown }
end
