#!/usr/bin/env ruby
require 'net/http'
require 'json'

require_relative '../app/app'
require 'rack/test'

app = EventBookingApp.new
mock = Rack::MockRequest.new(app)

def pretty(resp)
  puts "Status: #{resp.status}"
  puts resp.body
  puts "---"
end

puts "Create event:"
resp = mock.post('/events', 'CONTENT_TYPE' => 'application/json', input: { title: 'Demo Concert', capacity: 2 }.to_json)
pretty(resp)

puts "List events:"
resp = mock.get('/events')
pretty(resp)

puts "Book seat:"
resp = mock.post('/events/1/book', 'CONTENT_TYPE' => 'application/json', input: { name: 'Alice' }.to_json)
pretty(resp)

puts "Cancel booking:"
resp = mock.delete('/events/1/bookings/1')
pretty(resp)

puts 'Demo complete'
exit 0
