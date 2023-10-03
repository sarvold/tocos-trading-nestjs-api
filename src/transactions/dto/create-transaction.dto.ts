import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
// We could have used the full object instead, but I prefer just IDs
// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
// sender: User
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  // Could have a description and other fields, but leaving as is for simplicity
}
