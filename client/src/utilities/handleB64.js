// función para codificar un string a Base64
export const base64Encode = (str)=> {
  return window.btoa(str);
}

// función para decodificar un string de Base64
export const base64Decode = (str) => {
  return window.atob(str);
}
