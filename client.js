const { rejects } = require('node:assert');
const net = require('node:net');
const { resolve } = require('node:path');
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, rejects) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

//create TCP client
const socket = net.createConnection(
  { host: '127.0.0.1', port: 3008 },
  async () => {
    console.log('Connected to the server');

    const ask = async () => {
      const message = await rl.question('Enter a message >');
      //move the cursor one line up
      await moveCursor(0, -1);
      //clear the cursor line that the cursor is in
      await clearLine(0);
      socket.write(message);
    };

    ask();

    socket.on('data', async (data) => {
      //log an empty line
      console.log();

      //move the cursor one line up
      await moveCursor(0, -1);

      //clear the current line that cursor just moved into
      await clearLine(0);
      console.log(data.toString('utf-8'));
      ask();
    });
  }
);

socket.on('end', () => {
  console.log('Connection was ended');
});
