const asyncHandler = require('../utils/asyncHandler');
const roomService = require('../services/roomService');
const { validateRoomInput } = require('../validators/serviceValidator');

exports.createRoom = asyncHandler(async (req, res) => {
  const roomData = validateRoomInput(req.body);
  const roomType = await roomService.createRoomType(roomData);
  res.status(201).json({ success: true, data: roomType });
});

exports.getAllRooms = asyncHandler(async (req, res) => {
  const roomTypes = await roomService.getAllRoomTypes();
  res.status(200).json({ success: true, data: roomTypes });
});
