const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '6170993746:AAFAXR3U-thd8UqEJnO6F1BtRkTsRZ2SB_o';
const sequelize = require('./db.js');
const bot = new TelegramApi(token, { polling: true });
const UserModel = require('./models.js');

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Хочешь сыграть? Окей, я загадаю цифру от 0 до 9, а ты должен ее угадать!')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай.', gameOptions)
}

const start = async () => {

  try {
      await sequelize.authenticate()
      await sequelize.sync()
  } catch (e) {
    console.log('Подключение к БД сломалось', e)
  }

  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Что ты за бот' },
    { command: '/game', description: 'Отгадать число' },
  ]);
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    try {
      if (text === '/start') {
        await UserModel.create({chatId})
        await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/2.webp');
        return bot.sendMessage(chatId, `Здравствуйте, сер`);
      }
      if (text === '/info') {
        const user = await UserModel.findOne({chatId})
        return bot.sendMessage(chatId,`${msg.from.username}, из всех твоих попыток ты угадал ${user.right} раз, неудачных попыток ${user.wrong}`);
      }
      if (text === '/game') {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, 'Такой команде меня не обучали, попробуй использовать то, что доступно в меню.');
    } catch (e) {
      return bot.sendMessage(chatId, 'Произошла какая-то то ошибка');
    }

 
  });
};

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === '/again') {
    return startGame(chatId);
  }

  const user = await UserModel.findOne({chatId})

  if (data == chats[chatId]) {
    user.right =+ 1;
    await bot.sendMessage(chatId, `Верно, это была цифра ${chats[chatId]}!`, againOptions)
  } else {
    user.wrong =+ 1;
    await bot.sendMessage(chatId, `Ты не угадал, цифра была ${chats[chatId]}`, againOptions)
  }
  await user.save()
})

start()

