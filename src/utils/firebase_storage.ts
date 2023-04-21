import {getDownloadURL, getStorage, ref, StorageReference, uploadBytes, uploadBytesResumable} from "firebase/storage";
import {File} from "../components/file-dropzone";

export async function uploadFile(storageRef: StorageReference, file: File): Promise<string> {
    return await uploadBytes(storageRef, file).then(async (snapshot) => {
        return await getDownloadURL(snapshot.ref).then((downloadURL) => {
            return downloadURL;
        });
    });
}
