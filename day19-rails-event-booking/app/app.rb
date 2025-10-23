require 'sinatra/base'
require 'json'
require_relative '../lib/db'
require_relative '../app/models/event'
require_relative '../app/models/booking'

# EventBookingApp is a tiny Sinatra application exposing a JSON API
class EventBookingApp < Sinatra::Base
  # ensure Sinatra finds our views directory
  set :views, File.expand_path('../../views', __FILE__)
  # enable method override for HTML forms (DELETE via _method)
  enable :method_override

  before do
    # Default to JSON for API clients; views will override to text/html when needed
    content_type :json
  end

  helpers do
    def wants_html?
      accept = request.env['HTTP_ACCEPT']
      # If Accept header is absent or empty, treat as a browser visit and prefer HTML
      return true if accept.nil? || accept.strip.empty?
      accept = accept.downcase
      # If client explicitly asks for JSON, prefer JSON. If they send a wildcard or html, prefer HTML.
      return false if accept.include?('application/json') && !accept.include?('*/*')
      accept.include?('text/html') || accept.include?('*/*') || params['format'] == 'html'
    end
    
    def json_request?
      ct = request.media_type
      ct == 'application/json'
    end

    # Safely parse JSON request body. If the body is empty, returns {}
    # On malformed JSON, halts with a 400 JSON error for API clients.
    def parse_json_body
      body = request.body.read
      return {} if body.nil? || body.strip.empty?
      JSON.parse(body)
    rescue JSON::ParserError
      halt 400, { error: 'invalid JSON payload' }.to_json
    end

    def wants_json?
      accept = request.env['HTTP_ACCEPT'] || ''
      accept.downcase.include?('application/json')
    end
  end

  # Root route shows the events list (HTML or JSON) to make the app browsable at '/'
  get '/' do
    events = Event.all.map do |e|
      { id: e.id, title: e.title, capacity: e.capacity, booked: e.bookings_dataset.count }
    end
    if wants_html?
      content_type 'text/html'
      erb :index, locals: { events: events }
    else
      events.to_json
    end
  end

  # List events with available seats
  get '/events' do
    events = Event.all.map do |e|
      { id: e.id, title: e.title, capacity: e.capacity, booked: e.bookings_dataset.count }
    end
    if wants_html?
      content_type 'text/html'
      erb :index, locals: { events: events }
    else
      events.to_json
    end
  end

  # Create event
  post '/events' do
    if wants_json?
      # client expressed Accept: application/json — require JSON content-type
      halt 400, { error: 'expected Content-Type: application/json' }.to_json unless json_request?
      payload = parse_json_body
      event = Event.create(title: payload['title'], capacity: payload['capacity'])
    elsif json_request?
      # content-type is JSON but client didn't explicitly ask for JSON — still parse safely
      payload = parse_json_body
      event = Event.create(title: payload['title'], capacity: payload['capacity'])
    else
      title = params['title']
      capacity = params['capacity'] && params['capacity'].to_i
      event = Event.create(title: title, capacity: capacity)
    end
    status 201
    if wants_html?
      redirect to('/events')
    else
      { id: event.id, title: event.title }.to_json
    end
  end

  # Book a seat
  post '/events/:id/book' do
    if wants_json?
      halt 400, { error: 'expected Content-Type: application/json' }.to_json unless json_request?
      payload = parse_json_body
      name = payload['name']
    elsif json_request?
      payload = parse_json_body
      name = payload['name']
    else
      name = params['name']
    end
    event = Event[params[:id]]
    halt 404, { error: 'event not found' }.to_json unless event

    if event.bookings_dataset.count >= event.capacity
      halt 422, { error: 'event is full' }.to_json
    end

    booking = Booking.create(event_id: event.id, name: name)
    status 201
    if wants_html?
      redirect to("/events/#{event.id}")
    else
      { booking_id: booking.id, name: booking.name }.to_json
    end
  end

  # Cancel a booking
  delete '/events/:id/bookings/:booking_id' do
    event = Event[params[:id]]
    halt 404, { error: 'event not found' }.to_json unless event

    booking = Booking[params[:booking_id]]
    halt 404, { error: 'booking not found' }.to_json unless booking && booking.event_id == event.id

    booking.delete
    status 204
    if wants_html?
      redirect to("/events/#{event.id}")
    else
      ''
    end
  end

  # Simple health check
  get '/health' do
    { status: 'ok' }.to_json
  end

  # Return JSON errors for API clients instead of HTML pages
  error do
    e = env['sinatra.error']
    if wants_json? || json_request?
      content_type :json
      status 500
      { error: e.message }.to_json
    else
      # Let Sinatra render the default HTML error page
      raise e
    end
  end

  # Show event details (HTML view)
  get '/events/:id' do
    event = Event[params[:id]]
    halt 404, { error: 'event not found' }.to_json unless event
    if wants_html?
      content_type 'text/html'
      bookings = event.bookings_dataset.all
      booked = bookings.count
      erb :show, locals: { event: event, bookings: bookings, booked: booked }
    else
      { id: event.id, title: event.title, capacity: event.capacity }.to_json
    end
  end

  # Start the server if ruby file executed directly
  run! if app_file == $PROGRAM_NAME
end
