import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { Code, Network, Database, Filesystem, Cdn } from 'cdk-serverless-php-mpa';

export class CdkServerlessPhpMyAdminStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const network = new Network(this, 'ServerlessPhpMyAdminNetwork');

    const database = new Database(this, 'ServerlessPhpMyAdminDatabase', {
      network: network,
      name: 'default_database',
    });

    const filesystem = new Filesystem(this, 'ServerlessPhpMyAdminFilesystem', {
      network: network,
    });

    const code = new Code(this, 'ServerlessPhpMyAdminCode', {
      src: 'src/phpmyadmin/',
      database: database,
      network: network,
      filesystem,
      injectCreds: true,
      databaseLoader: true,
    });

    const cdn = new Cdn(this, 'ServerlessPhpMyAdminCdn', {
      code,
      waf: {
        allowListIpsV4: [
          '192.0.2.0/32',
        ],
      },
    });

    new CfnOutput(this, 'PhpMpaCdnEndpoint', {
      description: 'CloudFront distribution endpoint for the phpMyAdmin deployment.',
      value: `https://${cdn.distribution.domainName}/`,
    });

    new CfnOutput(this, 'ServerlessPhpMyAdminDBCredentialsUserEndpoint', {
      description: 'AWS Console link to the Secrets Manager secret containing the generated MySQL credentials.',
      value: `https://console.aws.amazon.com/secretsmanager/home?region=${Stack.of(this).region}#!/secret?name=${database.serverlessCluster.secret?.secretName}`,
    });
  }
}

const app = new App();

new CdkServerlessPhpMyAdminStack(app, 'cdk-serverless-phpmyadmin');

app.synth();