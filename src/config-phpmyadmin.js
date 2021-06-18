const { existsSync, copyFileSync, appendFileSync } = require('fs');
const { randomBytes } = require('crypto');

const sampleConfigFile = 'src/phpmyadmin/config.sample.inc.php';
const targetConfigFile = 'src/phpmyadmin/config.inc.php';

const rBytes = randomBytes(32);
const alphabet = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
let blowfish_secret = '';
rBytes.forEach(function(rByte) {
    blowfish_secret += alphabet[rByte % alphabet.length];
});

const targetConfigAddition = `
$cfg['blowfish_secret'] = '${blowfish_secret.replace(new RegExp("'", 'g'), "\\'")}';
$cfg['Servers'][$i]['host'] = $GLOBALS['RDS_CREDS']['RDS_HOST'];
$cfg['TempDir'] = '/mnt/persistent/tmp';
$cfg['UploadDir'] = '/mnt/persistent/tmp';
$cfg['SaveDir'] = '/mnt/persistent/tmp';
$cfg['SessionSavePath'] = '/mnt/persistent/tmp';
`;

if (!existsSync(targetConfigFile))
{
    copyFileSync(sampleConfigFile, targetConfigFile);
    appendFileSync(targetConfigFile, targetConfigAddition);
    console.error('phpMyAdmin config file ('+targetConfigFile+') has been configured...');
}
else
{
    console.error('phpMyAdmin config file ('+targetConfigFile+') already exists, doing nothing...');
    process.exit(1);
}