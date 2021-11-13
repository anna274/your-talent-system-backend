'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [admin, manager, specialist] = await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'admin',
        },
        {
          name: 'manager',
        },
        {
          name: 'specialist',
        },
      ],
      { returning: true }
    );
    const [adminAccount, managerAccount, hannaAccount] =
      await queryInterface.bulkInsert(
        'Accounts',
        [
          {
            login: 'admin',
            password:
              '$2a$10$i7vQtArcyjVIxyPLFQCBZ.mwQ9X8jt9QRbmOMIAgh7R7Wuz.RyKoi',
          },
          {
            login: 'manager',
            password:
              '$2a$10$i7vQtArcyjVIxyPLFQCBZ.mwQ9X8jt9QRbmOMIAgh7R7Wuz.RyKoi',
          },
          {
            login: 'hanna',
            password:
              '$2a$10$i7vQtArcyjVIxyPLFQCBZ.mwQ9X8jt9QRbmOMIAgh7R7Wuz.RyKoi',
          },
        ],
        { returning: true }
      );
    await queryInterface.bulkInsert('account_roles', [
      {
        AccountId: adminAccount.id,
        RoleId: admin.id,
      },
      {
        AccountId: managerAccount.id,
        RoleId: manager.id,
      },
      {
        AccountId: hannaAccount.id,
        RoleId: specialist.id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('account_roles', null, {});
  },
};
