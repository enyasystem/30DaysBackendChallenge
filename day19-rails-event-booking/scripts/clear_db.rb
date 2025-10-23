#!/usr/bin/env ruby
require 'fileutils'
require_relative '../lib/db'

puts "Opening DB at #{DB.opts[:database]}"

if Sequel::Model.db.table_exists?(:bookings)
  deleted = Sequel::Model.db[:bookings].delete
  puts "Deleted #{deleted} bookings"
else
  puts "No bookings table present"
end

if Sequel::Model.db.table_exists?(:events)
  deleted = Sequel::Model.db[:events].delete
  puts "Deleted #{deleted} events"
else
  puts "No events table present"
end

puts "Done."
