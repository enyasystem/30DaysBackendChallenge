# Event model
class Event < Sequel::Model
  one_to_many :bookings

  plugin :validation_helpers

  def validate
    super
    validates_presence [:title, :capacity]
    validates_integer :capacity
    errors.add(:capacity, 'must be positive') if capacity && capacity.to_i <= 0
  end
end
