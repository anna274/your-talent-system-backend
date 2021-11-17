import { Account, Role } from 'models/main';
import { getSpecialistRole } from 'services/roles'
import { decode } from 'helpers'

export const getAccountByLogin = (login: string): any => {
  return Account.findOne({
    where: { login },
    include: {
      model: Role,
      attributes: ['name'],
      through: {
        attributes: [],
      },
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
        attributes: [],
      },
    },
  });
};

export const createAccount = async (login: string, password: string, roleId?: string) => {
  if(!roleId) {
    const specialistRole = await getSpecialistRole();
    roleId = specialistRole.dataValues.id;
  }
  const decodedPsw = await decode(password);
  return (
    Account.create({ login, password: decodedPsw })
      .then(async (account) => {
        // @ts-ignore
        await account.setRoles([roleId]);
        return account;
      })
      // @ts-ignore
      .then((account) => findById(account.id))
  );
};
