ENV['RACK_ENV'] = 'test'

require 'sequel'
# Configure an in-memory DB for tests before loading app files
Sequel::Model.db = Sequel.sqlite
require_relative 'support/schema'

require 'rack/test'
# Ensure rack-test uses localhost by default (avoids host-authorisation middleware issues)
require 'rspec'
require_relative '../app/app'

RSpec.configure do |config|
  config.include Rack::Test::Methods

  def app
    EventBookingApp.new
  end

  config.before(:each) do
    # No per-test host setup required; specs set the Host header explicitly
  end
end
