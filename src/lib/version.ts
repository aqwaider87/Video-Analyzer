import packageJson from '../package.json';

export const getVersion = (): string => {
  return packageJson.version;
};

export const getVersionDisplay = (): string => {
  return `v${packageJson.version}`;
};
