module.exports = (sequelize, DataTypes) => {
  const emailHash = sequelize.define('email_hashes', {
    uuid: {
      type: DataTypes.UUID,
      required: true,
    },
    hash: {
      type: DataTypes.STRING,
      required: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  });

  return emailHash;
};
