import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type MovieDocument = Movie & Document;

@Schema()
export class Movie extends Document {}

export const MovieSchema = SchemaFactory.createForClass(Movie);
