import { getChildren, getFile } from './google';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import config from '../config';

const extensions = ['.jpg', '.jpeg', '.png'];

function getExtension(fileName) {
  return path.extname(fileName);
}

function buildLocalFileName(id, fileName) {
  return `${id}${getExtension(fileName)}`.toLowerCase();
}

function getLocalPictures() {
  return new Promise((resolve, reject) => {
    fs.readdir(config.pictureDir, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  });
}

function containsDriveItem(itemId, localItems) {
  return localItems.some(localItem => (
    extensions.some(ext => (
      localItem.toLowerCase() === buildLocalFileName(itemId, `test${ext}`)
    ))
  ));
}

function filterFileList(driveItems, localItems) {
  return driveItems.filter(({ id }) => !containsDriveItem(id, localItems));
}

function downloadImage(downloadUrl, saveFilePath) {
  return new Promise((resolve, reject) => {
    axios
      .get(downloadUrl, { responseType: 'stream' })
      .then(response => {
        response.data
          .on('error', err => reject(err))
          .pipe(fs.createWriteStream(saveFilePath))
          .on('close', () => resolve());
      });
  });
}

function fetchImageAndDownload(fileSummary) {
  return getFile(fileSummary.id)
    .then(file => {
      const localFilePath = path.join(config.pictureDir, buildLocalFileName(file.id, file.title));
      return downloadImage(file.webContentLink, localFilePath);
    });
}

function fileProgressLogger(total, newFiles) {
  let completed = 0;
  return () => {
    completed = completed += 1;
    let msg = `Total Files: ${total} | NewFiles: ${newFiles} | Completed Files: ${completed}`;
    process.stderr.cursorTo(0);
    process.stderr.write(msg);
    if (completed >= newFiles) {
      process.stderr.write('\n');
    }
    process.stderr.clearLine(1);
  };
}

function chunkNewFilePromises(newFiles, totalFiles) {
  const chunkSize = 25;
  const chunkArray = [];
  const progressLogger = fileProgressLogger(totalFiles.length, newFiles.length);
  for (let i = 0; i < newFiles.length; i += chunkSize) {
    chunkArray.push(newFiles.slice(i, i + chunkSize));
  }

  return chunkArray.reduce((prevPromise, itemsChunk) => {
    return prevPromise.then(() => (
      Promise.all(
        itemsChunk.map(item => (
          fetchImageAndDownload(item)
            .catch()
            .then(() => progressLogger())
        ))
      )
    ));
  }, Promise.resolve());
}

export function getImages(folderId) {
  return Promise.all([
    getChildren(folderId),
    getLocalPictures()
  ])
  .then(([{ items: driveItems }, localFiles]) => {
    const newFiles = filterFileList(driveItems, localFiles);
    return chunkNewFilePromises(newFiles, driveItems);
  });
}
