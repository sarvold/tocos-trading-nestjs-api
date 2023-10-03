import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MdbTocosUserDocument = HydratedDocument<MdbTocosUser>;

@Schema()
export class MdbTocosUser {

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({required: true})
  balance: number;
}

export const MdbTocosUserSchema = SchemaFactory.createForClass(MdbTocosUser);
