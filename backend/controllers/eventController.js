const asyncHandler = require('../utils/asyncHandler');
const eventService = require('../services/eventService');
const { validateEventInput } = require('../validators/serviceValidator');

exports.createEvent = asyncHandler(async (req, res) => {
  const eventData = validateEventInput(req.body);
  const event = await eventService.createEvent(eventData);
  res.status(201).json({ success: true, data: event });
});

exports.getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({ success: true, data: event });
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getAllEvents(req.query);
  res.status(200).json({ success: true, data: events });
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const eventData = validateEventInput(req.body, true);
  const event = await eventService.updateEvent(req.params.id, eventData);
  res.status(200).json({ success: true, data: event });
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  res.status(200).json({ success: true, message: 'Event deleted' });
});
