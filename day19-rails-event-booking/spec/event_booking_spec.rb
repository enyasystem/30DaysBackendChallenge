require 'spec_helper'

RSpec.describe 'Event booking API' do
  let(:headers) { { 'CONTENT_TYPE' => 'application/json', 'HTTP_HOST' => 'localhost' } }

  it 'creates and lists events' do
    post '/events', { title: 'Concert', capacity: 2 }.to_json, headers
    expect(last_response.status).to eq(201)

    get '/events', {}, headers
    expect(last_response.status).to eq(200)
    events = JSON.parse(last_response.body)
    expect(events.length).to eq(1)
    expect(events.first['title']).to eq('Concert')
  end

  it 'books and cancels seats' do
    post '/events', { title: 'Meetup', capacity: 1 }.to_json, headers
    event = JSON.parse(last_response.body)
    id = event['id']

    post "/events/#{id}/book", { name: 'Alice' }.to_json, headers
    expect(last_response.status).to eq(201)
    booking = JSON.parse(last_response.body)

    delete "/events/#{id}/bookings/#{booking['booking_id']}", {}, headers
    expect(last_response.status).to eq(204)
  end

  it 'prevents overbooking' do
    post '/events', { title: 'Workshop', capacity: 1 }.to_json, headers
    event = JSON.parse(last_response.body)
    id = event['id']

    post "/events/#{id}/book", { name: 'A' }.to_json, headers
    expect(last_response.status).to eq(201)

    post "/events/#{id}/book", { name: 'B' }.to_json, headers
    expect(last_response.status).to eq(422)
  end
end
