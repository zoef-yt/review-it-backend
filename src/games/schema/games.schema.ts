import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Game extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  genre: string;

  @Prop()
  releaseDate: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
