const { AwsCdkTypeScriptApp } = require('projen');
const { ProjectType } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.109.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-serverless-phpmyadmin',
  stability: 'experimental',
  authorAddress: 'aaron@aaronbrighton.ca',
  authorName: 'Aaron Brighton',
  cdkDependencies: [
    '@aws-cdk/core',
  ],
  deps: [
    'cdk-serverless-php-mpa',
  ],
  projectType: ProjectType.APP
});

project.tasks.addTask('install-phpmyadmin', {
  name: 'install-phpmyadmin',
  description: 'Use composer to retrieve latest phpMyAdmin to src/phpmyadmin/ and configure config.inc.php.',
  exec: 'composer create-project phpmyadmin/phpmyadmin --repository-url=https://www.phpmyadmin.net/packages.json --no-dev --working-dir=src',
});
project.tasks.tryFind('install-phpmyadmin').exec('node src/config-phpmyadmin.js');

project.npmignore.removePatterns('!/src');
project.gitignore.removePatterns('!/src');
project.npmignore.exclude('src/phpmyadmin');
project.gitignore.exclude('src/phpmyadmin');

project.synth();