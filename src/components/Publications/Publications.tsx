import { Button, TextField } from "@mui/material";
import React from "react";
import useForm from "../../hooks/useForm";
import PublicationService from "../../services/publications";
import IPublication from "../../types/Publication";

const Publications: React.FC = () => {
  const cb = async (values: IPublication) => {
    const { nombre, otroString, unString } = values;

    alert(`Creando publicacion: ${nombre} - ${otroString} - ${unString}`);

    const response = await PublicationService.create({
      nombre,
      otroString,
      unString,
    });

    console.log({ response });
  };

  const { values, handleInputChange, handleSubmit } = useForm(cb, {
    nombre: "",
    otroString: "",
    unString: "",
  });

  return (
    <div>
      <h2>Publicaciones</h2>
      <br />
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          name="nombre"
          value={values.nombre}
          onChange={handleInputChange}
          id="outlined-basic"
          label="Nombre"
          variant="outlined"
        />
        <TextField
          name="otroString"
          value={values.otroString}
          onChange={handleInputChange}
          id="outlined-basic"
          label="OtroString"
          variant="outlined"
        />
        <TextField
          name="unString"
          value={values.unString}
          onChange={handleInputChange}
          id="outlined-basic"
          label="UnString"
          variant="outlined"
        />
        <div>
          <Button type="submit" variant="outlined">
            Crear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Publications;
