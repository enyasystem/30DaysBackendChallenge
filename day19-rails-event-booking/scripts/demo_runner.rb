#!/usr/bin/env ruby
require 'bundler/setup'
require 'net/http'
require 'json'
require 'webrick'
require 'rack/handler'
require_relative '../app/app'

PORT = 4567
HOST = '127.0.0.1'

server_thread = Thread.new do
  Rack::Handler.get('webrick').run(EventBookingApp.new, Host: HOST, Port: PORT)
end

# wait for server to boot
sleep 0.6

def post(path, body)
  uri = URI("http://#{HOST}:#{PORT}#{path}")
  req = Net::HTTP::Post.new(uri)
  req['Content-Type'] = 'application/json'
  req.body = body.to_json
  Net::HTTP.start(uri.hostname, uri.port) do |http|
    http.request(req)
  end
end

def get(path)
  uri = URI("http://#{HOST}:#{PORT}#{path}")
  Net::HTTP.get_response(uri)
end

def delete(path)
  uri = URI("http://#{HOST}:#{PORT}#{path}")
  req = Net::HTTP::Delete.new(uri)
  Net::HTTP.start(uri.hostname, uri.port) do |http|
    http.request(req)
  end
end

puts "CREATE"
res = post('/events', { title: 'Demo Concert', capacity: 2 })
puts res.code
puts res.body

puts "\nLIST"
res = get('/events')
puts res.code
puts res.body

puts "\nBOOK"
res = post('/events/1/book', { name: 'Alice' })
puts res.code
puts res.body

puts "\nCANCEL"
res = delete('/events/1/bookings/1')
puts res.code
puts res.body

# shutdown server thread by exiting process (thread will be killed on exit)
exit
