import React from 'react';

import APIService from '../services/APIService';

const DownloadFileButton: React.FC<{ uploadId: string, fileName: string }> = ({ uploadId, fileName }) => {
  const handleDownload = async () => {
    try {
      const res = await APIService.downlaodFile(uploadId);
      const blob = new Blob([res.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url
      link.setAttribute('download', fileName)
      link.click()
      link.remove()

      // const decryptedFileData = CryptoJS.AES.decrypt(
      //   CryptoJS.lib.WordArray.create(res.data),'key').toString(CryptoJS.enc.Utf8);

      // saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return <button onClick={handleDownload}>Download File</button>;
};

export default DownloadFileButton;