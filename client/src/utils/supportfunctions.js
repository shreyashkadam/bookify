import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

export const filters = [
  { id: 2, name: "Fantasy", value: "fantasy" },
  { id: 3, name: "Science Fiction", value: "science-fiction" },
  { id: 4, name: "Thriller", value: "thriller" },
  { id: 5, name: "Mystery", value: "mystery" },
  { id: 6, name: "Horror", value: "horror" },
  { id: 7, name: "Self-Help", value: "self-help" },
  { id: 8, name: "Educational", value: "educational" },
  { id: 9, name: "Crime", value: "crime"},
];

export const filterByLanguage = [
  { id: 1, name: "English", value: "english" },
  { id: 2, name: "Marathi", value: "tamil" },
  { id: 3, name: "Hindi", value: "hindi" },
  { id: 4, name: "Gujarati", value: "gujarati" },
];

export const deleteAnObject = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};
