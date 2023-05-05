const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '6170993746:AAFAXR3U-thd8UqEJnO6F1BtRkTsRZ2SB_o';

const bot = new TelegramApi(token, { polling: true });


const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Хочешь сыграть? Окей, я загадаю цифру от 0 до 9, а ты должен ее угадать!')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай.', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Что ты за бот' },
    { command: '/game', description: 'Отгадать число' },
  ]);
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/2.webp');
      return bot.sendMessage(chatId, `Здравствуйте, сер`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId,`Приятно познакомиться, ${msg.from.username}, я обычный очередной бот, непонятно зачем созданный`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Такой команде меня не обучали, попробуй использовать то, что доступно в меню.')
  });
};

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === '/again') {
    return startGame(chatId);
  }
  if (data == chats[chatId]) {
    return bot.sendMessage(chatId, `это была цифра ${chats[chatId]}, верно!`, againOptions)
  } else {
    return bot.sendMessage(chatId, `Ты не угадал, цифра была ${chats[chatId]}`, againOptions)
  }
})

start()

