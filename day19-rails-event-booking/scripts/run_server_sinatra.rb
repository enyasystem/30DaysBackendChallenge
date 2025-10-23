#!/usr/bin/env ruby
require_relative '../app/app'

port = ENV.fetch('PORT', '4567')
host = ENV.fetch('HOST', '127.0.0.1')

puts "Starting EventBookingApp (PID=#{Process.pid}) on #{host}:#{port}"

# run! will select a server (webrick by default in many Ruby versions) and block
EventBookingApp.run! host: host, port: port
