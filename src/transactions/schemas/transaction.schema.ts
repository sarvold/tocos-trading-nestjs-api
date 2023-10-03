import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type MdbTocosTransactionDocument = MdbTocosTransaction & Document;

@Schema()
export class MdbTocosTransaction {

  @Prop({ required: true })
  senderId: string;
  
  @Prop({ required: true })
  receiverId: string;
  
  @Prop({ required: true })
  amount: number;
  
  @Prop({ required: true })
  date: Date;
}

export const MdbTocosTransactionSchema = SchemaFactory.createForClass(MdbTocosTransaction);
