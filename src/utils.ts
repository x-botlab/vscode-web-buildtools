export const checkCommandExists = (command: string): boolean => {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    const result = require('child_process').execSync(`${which} ${command}`, { stdio: 'ignore' });
    return !!result;
  } catch (error) {
    return false;
  }
};

export const getPythonVersion = (): string | null => {
  try {
    const result = require('child_process').execSync('python --version', { encoding: 'utf8' });
    return result.trim();
  } catch (error) {
    return null;
  }
};

export const checkPythonSetupTools = (): boolean => {
  try {
    require('child_process').execSync('python -m pip show setuptools', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}
