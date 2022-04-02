// export * from './Role';
// export * from './Account';

import { DataTypes, Sequelize } from 'sequelize';
import { db } from 'database';
import { Role } from 'models/old/main';

const defaultFields = {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.fn('uuid_generate_v4'),
    primaryKey: true,
    allowNull: false,
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
};

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
    type: DataTypes.TEXT,
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

const Department = db.define('department', {
  ...defaultFields,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const JobFunction = db.define('job_function', {
  ...defaultFields,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Profile = db.define('profile', {
  ...defaultFields,
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patronymic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoLink: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  careerStartDate: {
    type: DataTypes.DATE,
  },
  companyStartDate: {
    type: DataTypes.DATE,
  },
  summary: {
    type: DataTypes.TEXT,
  },
});

Profile.belongsTo(Department);
Department.hasMany(Profile);

Profile.belongsTo(JobFunction);
JobFunction.hasMany(Profile);

Profile.belongsTo(Account, { onDelete: 'CASCADE', hooks: true });
Account.hasOne(Profile, {
  onDelete: 'RESTRICT',
});

const Level = db.define('level', {
  ...defaultFields,
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

const Skill = db.define('skill', {
  ...defaultFields,
});

Skill.belongsTo(Level);
Level.hasMany(Skill, { onDelete: 'SET NULL', hooks: true });

Skill.belongsTo(Technology);
Technology.hasMany(Skill, { onDelete: 'SET NULL', hooks: true });

Skill.belongsTo(Profile);
Profile.hasMany(Skill, { onDelete: 'cascade', hooks: true });

const Priority = db.define(
  'priority',
  {
    ...defaultFields,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deviation: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

const Requirement = db.define(
  'requirement',
  { ...defaultFields },
  { timestamps: false }
);

Requirement.belongsTo(Priority);
Priority.hasMany(Requirement, { onDelete: 'SET NULL', hooks: true });

Requirement.belongsTo(Technology);
Technology.hasMany(Requirement, { onDelete: 'SET NULL', hooks: true });

Requirement.belongsTo(Level);
Level.hasMany(Requirement, { onDelete: 'SET NULL', hooks: true });

const Duty = db.define('duty', {
  ...defaultFields,
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

const PositionStatus = db.define('position_status', {
  ...defaultFields,
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  ...defaultFields,
  label: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Position = db.define('position', {
  ...defaultFields,
  applicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  closeDate: {
    type: DataTypes.DATE,
  },
  deactivationDate: {
    type: DataTypes.DATE,
  }
});

Position.belongsTo(PositionStatus);
PositionStatus.hasMany(Position, { onDelete: 'SET NULL', hooks: true });

Position.belongsTo(JobFunction);
JobFunction.hasMany(Position, { onDelete: 'SET NULL', hooks: true });

Position.belongsTo(Project);
Project.hasMany(Position, { onDelete: 'SET NULL', hooks: true });

Requirement.belongsTo(Position, { onDelete: 'cascade', hooks: true });
Position.hasMany(Requirement, { onDelete: 'SET NULL', hooks: true });

Duty.belongsTo(Position, { onDelete: 'cascade', hooks: true });
Position.hasMany(Duty, { onDelete: 'SET NULL', hooks: true });

const Candidate = db.define(
  'candidate',
  {
    koef: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  { timestamps: false }
);

Position.belongsToMany(Profile, { through: Candidate });
Profile.belongsToMany(Position, { through: Candidate });

Position.belongsTo(Profile,  { onDelete: 'SET NULL', hooks: true });
Profile.hasMany(Position,  { onDelete: 'SET NULL', hooks: true });

const StatisticsType = db.define(
  'statistics_type',
  {
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
  },
  { timestamps: false }
);

const StatisticsInfo = db.define('statistics_info', {
  ...defaultFields,
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  additionalInfo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

StatisticsInfo.belongsTo(StatisticsType);
StatisticsType.hasMany(StatisticsInfo, { onDelete: 'SET NULL', hooks: true });

export {
  Account,
  Role,
  Account_Role,
  Project,
  Scope,
  Technology,
  Project_Scope,
  Project_Technology,
  Department,
  JobFunction,
  Profile,
  Level,
  Skill,
  Requirement,
  Priority,
  Position,
  Candidate,
  Duty,
  StatisticsType,
  TechnologiesStatistics,
  SkillsStatistics,
  StatisticsInfo,
  PositionStatus,
};
