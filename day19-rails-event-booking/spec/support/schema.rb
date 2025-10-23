DB = Sequel::Model.db
DB.create_table :events do
  primary_key :id
  String :title, null: false
  Integer :capacity, null: false
  DateTime :created_at
end

DB.create_table :bookings do
  primary_key :id
  foreign_key :event_id, :events, null: false
  String :name, null: false
  DateTime :created_at
end

Sequel::Model.db = DB
