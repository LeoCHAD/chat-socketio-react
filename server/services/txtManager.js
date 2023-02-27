import fs from "fs";
import readline from "readline";
import { DATA_PATH } from "../config.js";

// Función para escribir en el archivo
export const appendData = (data) => {
  // Escribimos el string en el archivo
  fs.appendFileSync(DATA_PATH, JSON.stringify(data) + "&sep&");
};

export const readData = () => {
  // Creamos el objeto de lectura de archivo
  const archivoStream = fs.createReadStream(DATA_PATH);
  // Creamos la interfaz readline
  const rl = readline.createInterface({
    input: archivoStream,
    crlfDelay: Infinity,
  });
  // variable para almacenar las cadenas de texto
  let cadenas;
  // Añadimos los elemtos de la linea a array cadenas
  rl.on("line", (line) => {
    const texts = line.split("&sep&").filter((text) => text !== "");
    cadenas = texts.map((cadena) => JSON.parse(cadena));
    if(cadenas){
      if(cadenas.length >= 20){
        cutData(cadenas);
        console.log('data reducida')
      }
    }
  });

  // Devolvemos una promesa que resuelve con el array de cadenas
  return new Promise((resolve, reject) => {
    // Cuando termina la lectura del archivo, resolvemos la promesa con el array de cadenas
    rl.on("close", () => {
      resolve(cadenas);
    });

    // Manejamos el evento de error en la lectura del archivo
    archivoStream.on("error", (error) => {
      reject(error);
    });
  });
};

const cutData = (data) => {
  const newData = data.slice(-10);
  newData.foreach((data) => {
    fs.writeFileSync(DATA_PATH, "");
    appendData(data);
  });
};
