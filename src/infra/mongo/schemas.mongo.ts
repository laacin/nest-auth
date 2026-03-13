import { ROLE, User } from '@domain/entities/user.entity';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model as MongooseModel } from 'mongoose';

// type used as injection
// e.g: Document<UserModel>
export type Document<Model> = MongooseModel<HydratedDocument<Model>>;

// -- model declarations

@Schema()
export class UserModel {
  // credentials
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  // security
  @Prop({ default: null })
  emailVerifiedAt?: Date;

  @Prop({ default: null })
  passwordChangedAt?: Date;

  @Prop({ default: null })
  lastLoginAt?: Date;

  // metadata
  @Prop({ required: true })
  role: ROLE;

  @Prop({ default: null })
  updatedAt?: Date;

  @Prop({ default: null })
  createddAt?: Date;

  @Prop({ default: null })
  deletedAt?: Date;

  static toEntity(this: UserModel): Partial<User> {
    return {
      id: this.id ?? undefined,
      email: this.email ?? undefined,
      username: this.username ?? undefined,
      password: this.password ?? undefined,

      emailVerifiedAt: this.emailVerifiedAt ?? undefined,
      passwordChangedAt: this.passwordChangedAt ?? undefined,
      lastLoginAt: this.lastLoginAt ?? undefined,

      role: this.role ?? undefined,
      createdAt: this.createddAt ?? undefined,
      updatedAt: this.updatedAt ?? undefined,
      deletedAt: this.deletedAt ?? undefined,
    };
  }
}

// export
const models = [UserModel];

export const loadModels = (): ModelDefinition[] => {
  return models.map((model) => {
    const schema = SchemaFactory.createForClass(model);
    return { name: model.name, schema };
  });
};
