import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri: string, inviteId: string) => {
  const storage = getStorage();

  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `invites/${inviteId}/${Date.now()}.jpg`);

  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
