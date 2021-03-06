import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { CdkServerlessPhpMyAdminStack } from '../src/main';

test('Full stack', () => {
  const app = new App();
  const stack = new CdkServerlessPhpMyAdminStack(app, 'test');

  expect(stack).toHaveResource('AWS::Lambda::Function');
  expect(stack).toHaveResource('AWS::ApiGatewayV2::Api');
  expect(stack).toHaveResource('AWS::EC2::VPC');
  expect(stack).toHaveResource('AWS::EC2::VPCEndpoint');
  expect(stack).toHaveResource('AWS::EC2::SecurityGroup');
  expect(stack).toHaveResource('AWS::SecretsManager::Secret');
  expect(stack).toHaveResource('AWS::RDS::DBCluster');
  expect(stack).toHaveResource('AWS::EFS::FileSystem');
  expect(stack).toHaveResource('AWS::EFS::MountTarget');
  expect(stack).toHaveResource('AWS::WAFv2::IPSet');
  expect(stack).toHaveResource('AWS::WAFv2::WebACL');
  expect(stack).toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('Custom::CDKBucketDeployment');
  expect(stack).toHaveResource('AWS::CloudFront::CachePolicy');
  expect(stack).toHaveResource('AWS::CloudFront::OriginRequestPolicy');
  expect(stack).toHaveResource('AWS::CloudFront::Distribution');
});