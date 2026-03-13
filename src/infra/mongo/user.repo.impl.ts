import { User, UserCred } from '@domain/entities/user.entity';
import { UserRepo } from '@domain/repos/user.repo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Document, UserModel } from './schemas.mongo';

@Injectable()
export class UserRepoImpl implements UserRepo {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Document<UserModel>,
  ) {}

  async store(user: User): Promise<void> {
    await this.userModel.create({ ...user });
  }

  async exists(cred: Partial<UserCred>): Promise<boolean> {
    const user = await this.userModel.findOne({ ...cred }).exec();
    return user !== undefined;
  }

  async get({
    id,
    email,
    username,
  }: Partial<UserCred>): Promise<User | undefined> {
    const query: Partial<UserCred> = {};
    if (id) query.id = id;
    if (email) query.email = email;
    if (username) query.username = username;

    const user = await this.userModel.findOne(query).exec();
    if (!user) return;
    return UserModel.toEntity.call(user) as User;
  }
}
