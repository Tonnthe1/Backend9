// src/controllers/eventController.ts
import { Request, Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../types';

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, dateTime, eventType, onlineSync } = req.body;
    const newEvent = new Event({
      name,
      address,
      dateTime,
      eventType,
      onlineSync: onlineSync === 'false',
      creator: req.user?.id,
      coverImage: req.file ? req.file.path : undefined
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, address, access } = req.body;
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, address, access },
      { new: true }
    );

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// You might want to add a function to get events for a specific user
export const getUserEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ creator: req.user?.id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};