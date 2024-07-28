import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  genre: string;

  @Prop()
  releaseDate: Date;

  @Prop()
  rating: number;

  @Prop()
  director: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
