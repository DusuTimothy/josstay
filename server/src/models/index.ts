import { AvailabilityHold } from "./availability-hold.model";
import { BlockedDate } from "./blocked-date.model";
import { Booking } from "./booking.model";
import { Hotel } from "./hotel.model";
import { HotelImage } from "./hotel-image.model";
import { Payment } from "./payment.model";
import { Review } from "./review.model";
import { Room } from "./room.model";
import { User } from "./user.model";

/**
 * Associations. Import models from this file (not the model files directly) so
 * the associations are always registered before a query runs.
 */

User.hasMany(Hotel, { foreignKey: "managerId", as: "hotels" });
Hotel.belongsTo(User, { foreignKey: "managerId", as: "manager" });

Hotel.hasMany(HotelImage, {
  foreignKey: "hotelId",
  as: "images",
  onDelete: "CASCADE",
});
HotelImage.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

Hotel.hasMany(Room, {
  foreignKey: "hotelId",
  as: "rooms",
  onDelete: "CASCADE",
});
Room.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "guest" });

Hotel.hasMany(Booking, { foreignKey: "hotelId", as: "bookings" });
Booking.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

Room.hasMany(Booking, { foreignKey: "roomId", as: "bookings" });
Booking.belongsTo(Room, { foreignKey: "roomId", as: "room" });

Booking.hasMany(Payment, {
  foreignKey: "bookingId",
  as: "payments",
  onDelete: "CASCADE",
});
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

Booking.hasOne(Review, { foreignKey: "bookingId", as: "review" });
Review.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });
Hotel.hasMany(Review, { foreignKey: "hotelId", as: "reviews" });
Review.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "author" });

Room.hasMany(AvailabilityHold, {
  foreignKey: "roomId",
  as: "holds",
  onDelete: "CASCADE",
});
AvailabilityHold.belongsTo(Room, { foreignKey: "roomId", as: "room" });

Room.hasMany(BlockedDate, {
  foreignKey: "roomId",
  as: "blockedDates",
  onDelete: "CASCADE",
});
BlockedDate.belongsTo(Room, { foreignKey: "roomId", as: "room" });

export {
  AvailabilityHold,
  BlockedDate,
  Booking,
  Hotel,
  HotelImage,
  Payment,
  Review,
  Room,
  User,
};
