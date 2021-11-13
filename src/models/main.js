// export * from './Role';
// export * from './Account';

import { DataTypes, Sequelize } from 'sequelize';
import { db } from 'database';
import { Role } from 'models/old/main';

const Account = db.define('account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.fn('uuid_generate_v4'),
    primaryKey: true,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:
      '$2a$10$i7vQtArcyjVIxyPLFQCBZ.mwQ9X8jt9QRbmOMIAgh7R7Wuz.RyKoi',
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

const Role = db.define('role', {
  id: {
    type: DataTypes.UUID,
    // defaultValue: DataTypes.UUIDV4,
    defaultValue: Sequelize.fn('uuid_generate_v4'),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

const Account_Role = db.define('account_role', {}, { timestamps: false });

Account.belongsToMany(Role, { through: Account_Role });
Role.belongsToMany(Account, { through: Account_Role });

export { Account, Role, Account_Role };
