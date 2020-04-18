import fs from 'fs';
export const readWavFiles = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      const fileList = files.filter((file) => {
        return isExistFile(path + '/' + file) && /.*\.wav$/.test(file); //絞り込み
      });
      resolve(fileList);
    });
  });
};

const isExistFile = (file: string) => {
  try {
    fs.statSync(file).isFile();
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
};
