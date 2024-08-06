import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

const EventSchema = z.object({
  description: z.string(),
  eventCreatedById: z.string().cuid(),
  location: z.object({
    longitude: z.number(),
    latitude: z.number(),
    name: z.string().optional(),
  }),
  mapData: z.object({
    longitude: z.number(),
    latitude: z.number(),
    longitudeDelta: z.number(),
    latitudeDelta: z.number(),
  }),
  photos: z.array(
    z.object({
      url: z.string().url(),
      name: z.string(),
    })
  ),
  categories: z.array(z.string()),
  price: z.number().nonnegative(),
  title: z.string(),
});

type EventFormType = z.infer<typeof EventSchema>;

const defaultValues: EventFormType = {
  description: '',
  eventCreatedById: '',
  location: { longitude: 0, latitude: 0, name: '' },
  mapData: { longitude: 0, latitude: 0, longitudeDelta: 0, latitudeDelta: 0 },
  photos: [],
  price: 0,
  title: '',
  categories: [],
};

type EventFormContextType = {
  data: EventFormType;
  setData: React.Dispatch<React.SetStateAction<EventFormType>>;
};

const EventFormContext = createContext<EventFormContextType | undefined>(undefined);

export const EventFormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<EventFormType>(defaultValues);

  return (
    <EventFormContext.Provider value={{ data, setData }}>{children}</EventFormContext.Provider>
  );
};

export const useEventForm = () => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error('useEventForm must be used within an EventFormProvider');
  }
  return context;
};
