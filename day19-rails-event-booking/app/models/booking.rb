# Booking model
class Booking < Sequel::Model
  many_to_one :event

  plugin :validation_helpers

  def validate
    super
    validates_presence [:name, :event_id]
  end
end
