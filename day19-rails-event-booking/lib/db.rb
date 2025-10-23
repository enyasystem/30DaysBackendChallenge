require 'sequel'
require 'fileutils'

DB_DIR = File.expand_path('../../db', __dir__)
DB_FILE = File.join(DB_DIR, 'events.db')

# Use an on-disk DB for development/production, but in tests we prefer an
# in-memory DB to avoid side-effects. Tests set RACK_ENV=test and their
# spec helper configures Sequel::Model.db explicitly.
unless ENV['RACK_ENV'] == 'test'
  FileUtils.mkdir_p(DB_DIR)
  DB = Sequel.sqlite(DB_FILE)

  # Create tables if not present
  unless DB.table_exists?(:events)
    DB.create_table :events do
      primary_key :id
      String :title, null: false
      Integer :capacity, null: false
      DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    end
  end

  unless DB.table_exists?(:bookings)
    DB.create_table :bookings do
      primary_key :id
      foreign_key :event_id, :events, null: false, on_delete: :cascade
      String :name, null: false
      DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    end
  end

  Sequel::Model.db = DB
end
