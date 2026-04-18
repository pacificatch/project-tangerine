const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your password: ', (password) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('\nYour password hash:');
  console.log(hash);
  console.log('\nNow run:');
  console.log('  cd ~/projects/project-tangerine/worker && wrangler secret put PASSWORD_HASH');
  console.log('When prompted, paste the hash above.');
  rl.close();
});
