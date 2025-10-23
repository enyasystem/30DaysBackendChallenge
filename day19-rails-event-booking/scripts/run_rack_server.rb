#!/usr/bin/env ruby
require 'rack'
require_relative '../app/app'

host = ENV.fetch('HOST', '127.0.0.1')
port = ENV.fetch('PORT', '4567').to_i

options = {
  app: EventBookingApp.new,
  Host: host,
  Port: port,
  server: 'webrick'
}

puts "Starting Rack::Server on #{host}:#{port} (PID=#{Process.pid})"
Rack::Server.start(options)
