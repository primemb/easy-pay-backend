import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class AdminDocument extends AbstractDocument {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminDocument);
