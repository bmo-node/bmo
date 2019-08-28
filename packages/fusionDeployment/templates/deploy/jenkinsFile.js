import fs from 'fs-extra';
import { template } from 'lodash';

const file = fs.readFileSync(`${__dirname}/rawJenkinsFile`);
export default () => file;
