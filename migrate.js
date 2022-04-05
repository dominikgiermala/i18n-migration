'use strict';

const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json'));
const keys = JSON.parse(fs.readFileSync(config.keysPath));
const migratedAssetsDir = config.eiUiI18nMessagesRepoPath + '/app/src/assets/';
const propertiesDir = config.eiI18nMessagesRepoPath + '/src/main/resources/';
let languagePostfix;
let migratedKeys;
let propertiesFile;
let key;
let splitProperty;
let formattedKeys;

fs.readdirSync(migratedAssetsDir).forEach(migratedFileName => {
  languagePostfix = migratedFileName.replace('.json', '.properties').replace('-us','_US');
  migratedKeys = JSON.parse(fs.readFileSync(migratedAssetsDir + migratedFileName));

  fs.readdirSync(propertiesDir).forEach(propertiesFileName => {
  	if (propertiesFileName.includes(languagePostfix)) {
  		propertiesFile = fs.readFileSync(propertiesDir + propertiesFileName).toString('utf-8');
  		propertiesFile.split('\n').forEach(property => {
  			splitProperty = property.split('=');
  			key = splitProperty.shift();
  			if (keys.includes(key)) {
  				migratedKeys[key] = splitProperty.join('=');
  			}
  		});
  	}
  });

  formattedKeys = JSON.stringify(migratedKeys, Object.keys(migratedKeys).sort(), 2);

  fs.writeFile(migratedAssetsDir + migratedFileName, formattedKeys, 'utf8', () => console.log(migratedFileName + ' updated'));

});

