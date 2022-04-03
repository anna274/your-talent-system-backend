import { Account, Role } from 'models/main';
import { getSpecialistRole } from 'services/roles'
import { decode, isMatch } from 'helpers'
import { INCORRECT_PASSWORD_ERROR } from 'consts'

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

export const updateAccountPassword = async (userId, currentPassword, newPassword) => {
  const account = await Account.findOne({ where: { id: userId } });
  //@ts-ignore
  if (await isMatch(currentPassword, account.password)) {
    const decodedPsw = await decode(newPassword);
    return Account.update({ password: decodedPsw }, { where: { id: userId } });
  } else {
    throw Error(INCORRECT_PASSWORD_ERROR);
  }
}
