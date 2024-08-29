import { toast } from "react-toastify";
import { END_POINT } from "../Redux/AdminReducer/action";

const DownloadFile=(path, id, name=(new Date().toISOString()))=>{
    toast.loading('downloading...')
    fetch(`${END_POINT}/${path}/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        toast.dismiss()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}`;
        a.click();
      })
      .catch((error) => {toast.dismiss(); console.error(error)});
}

export {DownloadFile}