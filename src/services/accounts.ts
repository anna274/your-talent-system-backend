// const Account = require('../models').Account;
// const Role = require('../models').Role;

import { Account, Role } from 'models/main';

export const getAccountByLogin = (login: string): any => {
  return Account.findOne({
    where: { login },
    include: {
      model: Role,
      attributes: ['name'],
      through: {
        attributes: []
      }
    },
  });
};

export const findById = (id: string): any => {
  return Account.findOne({
    where: { id },
    include: {
      model: Role,
      attributes: ['name'],
      through: {
        attributes: []
      }
    },
  });
};

export const createAccount = (login: string, password: string, roleId): any => {
  return Account.create({
    login,
    password,
    roles: [
      {
        account_role: [roleId],
      },
    ],
  });
};
