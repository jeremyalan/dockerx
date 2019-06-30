#!/usr/bin/env node

const fs = require('fs');
const child_process = require('child_process');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

async function execute() {
   try {
      console.log('Running in DockerX');

      const config = await getConfig();
      const [ , , command, ...args ] = process.argv;

      const commandConfig = config.commands[command];
   
      if (commandConfig == undefined) {
         console.log(`The command [${ command }] has not been configured.`);
         return;
      }
  
      const cwd = `/code/${ path.basename(process.cwd()) }`;
      try {
         const cli = [
            `docker run`,
            `--rm`,
            `-t`,
            `$(tty &>/dev/null && echo "-i")`,
            `-v ${ process.cwd() }:${ cwd }`,
            (commandConfig.volumes || []).map((volumeConfig) => {
               return `-v ${ volumeConfig.source }:${ volumeConfig.dest }`
            }).join(' '),
            `-w ${ cwd }`,
            commandConfig.image,
            commandConfig.command,
            args.join(' ')
         ].join(' ');

         child_process.execSync(cli, { stdio: 'inherit' });
      }
      catch (err) {
         // do nothing
      }
      
   }
   catch (err) {
      console.log(err);
      return;
   }
}

async function getConfig() {
   return await new Promise((resolve, reject) => {
      const configPath = path.join(os.homedir(), '.dockerx', 'config.yml');
      
      fs.readFile(configPath, 'utf8', function (err, data) {
         if (err) {
            reject(err);
            return;
         }

         const config = yaml.safeLoad(data);
   
         resolve(config);
      });
   })
   
}

execute();

