import fs from 'fs';

const dir = process.argv[2] || `dist`;

const readStream = fs.createReadStream(`package.json`);
const dotEnvReadStream = fs.createReadStream(`.env`);
const packageJsonWriteStream = fs.createWriteStream(`./${dir}/package.json`);
const procfigWriteStream = fs.createWriteStream(`./${dir}/Procfile`);
const dotEnvWriteStream = fs.createWriteStream(`./${dir}/.env`);
const gitIgnoreWriteStream = fs.createWriteStream(`./${dir}/.gitignore`);

dotEnvReadStream.on('data', (chunk) => {
  dotEnvWriteStream.write(chunk);
});

gitIgnoreWriteStream.write('.env');

readStream.on('data', (chunk) => {
  const packageJson = JSON.parse(chunk.toString());

  const { devDependencies, husky, ...prodPackageJson } = packageJson;

  prodPackageJson.scripts = {
    prod: packageJson.scripts['prod-test'],
  };

  packageJsonWriteStream.write(JSON.stringify(prodPackageJson));
  procfigWriteStream.write('web: npm run prod');
});
