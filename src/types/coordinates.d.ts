import { z } from "zod";

export const CoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  geoHash: z.string(),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
