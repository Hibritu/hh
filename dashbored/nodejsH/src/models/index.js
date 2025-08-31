const { sequelize } = require('../config/db');

// Model initializers
const User = require('./user')(sequelize);
const EmployerProfile = require('./employerProfile')(sequelize);
const Job = require('./job')(sequelize);
const Application = require('./application')(sequelize);
const Payment = require('./payment')(sequelize);
const Notification = require('./notification')(sequelize);
const Chat = require('./chat')(sequelize);
const Message = require('./message')(sequelize);
const Report = require('./report')(sequelize);

// Associations
// User 1-1 EmployerProfile
User.hasOne(EmployerProfile, { foreignKey: 'user_id', as: 'employerProfile', onDelete: 'CASCADE' });
EmployerProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// EmployerProfile 1-many Job
EmployerProfile.hasMany(Job, { foreignKey: 'employer_id', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(EmployerProfile, { foreignKey: 'employer_id', as: 'employer' });

// Job 1-many Application; Application belongsTo User
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

// Payments: Job and EmployerProfile
Job.hasMany(Payment, { foreignKey: 'job_id', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
EmployerProfile.hasMany(Payment, { foreignKey: 'employer_id', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(EmployerProfile, { foreignKey: 'employer_id', as: 'employer' });

// Notifications: User 1-many Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Chat relations
Job.hasMany(Chat, { foreignKey: 'job_id', as: 'chats', onDelete: 'CASCADE' });
Chat.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
EmployerProfile.hasMany(Chat, { foreignKey: 'employer_id', as: 'chats', onDelete: 'CASCADE' });
Chat.belongsTo(EmployerProfile, { foreignKey: 'employer_id', as: 'employer' });
User.hasMany(Chat, { foreignKey: 'candidate_id', as: 'chats', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'candidate_id', as: 'candidate' });

// Messages
Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Reports
User.hasMany(Report, { foreignKey: 'reported_by', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'reported_by', as: 'reporter' });
Job.hasMany(Report, { foreignKey: 'job_id', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
Chat.hasMany(Report, { foreignKey: 'chat_id', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

module.exports = {
  sequelize,
  User,
  EmployerProfile,
  Job,
  Application,
  Payment,
  Notification,
  Chat,
  Message,
  Report,
};
