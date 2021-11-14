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

const Technology = db.define('technology', {
  id: {
    type: DataTypes.UUID,
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

const Scope = db.define('scope', {
  id: {
    type: DataTypes.UUID,
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

const Project = db.define('project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.fn('uuid_generate_v4'),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  contact: {
    type: DataTypes.STRING,
  },
  startDate: {
    type: Sequelize.DATE,
  },
  endDate: {
    type: Sequelize.DATE,
  },
  headOffice: {
    type: Sequelize.STRING,
    defaultValue: 'Не указан',
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

const Project_Technology = db.define(
  'project_technology',
  {},
  { timestamps: false }
);

Project.belongsToMany(Technology, { through: Project_Technology });
Technology.belongsToMany(Project, { through: Project_Technology });

const Project_Scope = db.define('project_scope', {}, { timestamps: false });

Project.belongsToMany(Scope, { through: Project_Scope });
Scope.belongsToMany(Project, { through: Project_Scope });

// Project.belongsTo(Status);
// Status.hasMany(Project);

export { Account, Role, Account_Role, Project, Scope, Technology, Project_Scope, Project_Technology };
