'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add discountType and discountValue to Vouchers
    await queryInterface.addColumn('Vouchers', 'discountType', {
      type: Sequelize.ENUM('PERCENTAGE', 'FIXED'),
      allowNull: false,
      defaultValue: 'PERCENTAGE',
    });

    await queryInterface.addColumn('Vouchers', 'discountValue', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });

    // 2. Migrate existing discountPercent data to discountValue
    // Support for both SQLite and Postgres. Double quotes might fail in some MySQL. Let's use dialect specific or no quotes.
    // Let's check dialect. Assuming SQLite or MySQL/Postgres.
    await queryInterface.sequelize.query(
      'UPDATE Vouchers SET discountValue = discountPercent'
    );

    // Make discountValue required after data migration
    await queryInterface.changeColumn('Vouchers', 'discountValue', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });

    // 3. Drop discountPercent
    await queryInterface.removeColumn('Vouchers', 'discountPercent');

    // 4. Add voucherId and voucherDiscount to Orders
    await queryInterface.addColumn('Orders', 'voucherId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Vouchers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Orders', 'voucherDiscount', {
      type: Sequelize.DECIMAL(12, 0),
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Remove voucher columns from Orders
    await queryInterface.removeColumn('Orders', 'voucherDiscount');
    await queryInterface.removeColumn('Orders', 'voucherId');

    // 2. Add discountPercent back to Vouchers
    await queryInterface.addColumn('Vouchers', 'discountPercent', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });

    // 3. Revert data from discountValue to discountPercent
    await queryInterface.sequelize.query(
      'UPDATE Vouchers SET discountPercent = discountValue WHERE discountType = \'PERCENTAGE\''
    );

    await queryInterface.changeColumn('Vouchers', 'discountPercent', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });

    // 4. Remove discountType and discountValue
    await queryInterface.removeColumn('Vouchers', 'discountValue');
    await queryInterface.removeColumn('Vouchers', 'discountType');
  }
};
