import { AbstractRepository } from 'src/database/abstract.repository';
import { AdminDocument } from './models/admin.schema';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class AdminRepository extends AbstractRepository<AdminDocument> {
  protected readonly logger = new Logger(AdminDocument.name);

  constructor(
    @InjectModel(AdminDocument.name) adminModel: Model<AdminDocument>,
  ) {
    super(adminModel);
  }
}
