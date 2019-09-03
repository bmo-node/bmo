import fs from 'fs-extra';

const file = fs.readFileSync(`${__dirname}/rawJenkinsFile`);

export default () => file;
