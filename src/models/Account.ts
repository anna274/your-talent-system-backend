// import { DataTypes } from 'sequelize';
// import { db } from 'database';
// import { Role } from 'models'

// const Account = db.define('account', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true,
//     allowNull: false,
//   },
//   login: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// Account.belongsToMany(Role, { through: 'AccountRoles' });

// export { Account };
