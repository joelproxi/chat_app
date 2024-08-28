import { ChangeEvent, useState } from "react"
import sha512 from 'crypto-js/sha512';
import APIService from "../services/APIService";


const FileUpload = ({ conversationId, senderId, receiverId }) => {
    const chunkSize = 1024*1024 //1M
    const [file, setFile] = useState(null);


    const handleFileChange = (e: ChangeEvent<HTMLFormElement>) => {
        setFile(e.target.files[0])
    }

    const uploadFile = async() => {
        if(!file) return ;

        const fileReader = new FileReader();
        const fileHash = sha512(file).toString();
        const totalChunks = Math.ceil(file.size() / chunkSize)
        
        for(let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++){
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, file.size)
          const chunk = file.slice(start, end);

          const formData = new FormData()
          formData.append('file', chunk);
          formData.append('file_name', file.name);
          formData.append('chunk_index', chunkIndex);
          formData.append('file_hash', fileHash);
          formData.append('conversation_id', conversationId);
          formData.append('sender_id', senderId);
          formData.append('receiver_id', receiverId);

          try {
            const resp = await APIService.uplaodFile(formData);
    
          } catch (error) {
            console.error(`Error uploading chunk ${chunkIndex}:`, error);
            chunkIndex--; // Retry the failed chunk
          }
        }
    }
  return (

    <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload File</button>
    </div>

  )
}

export default FileUpload