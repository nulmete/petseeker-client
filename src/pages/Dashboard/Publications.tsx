import { Box, Button, Container, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ButtonAdd from "../../components/Button/ButtonAdd";
import Publication from "../../components/Publication/Publication";
import useForm from "../../hooks/useForm";
import PublicationService from "../../services/publications";
import IPublication from "../../types/Publication";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await PublicationService.get();
      setPublications(response.data as any);
    })();
  }, []);

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
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Publicaciones</h2>
        <ButtonAdd entity="Publicacion" />
      </Box>
      <div>
        {publications.map((publication) => (
          <Box
            sx={{
              "&:not(:last-of-type)": {
                marginBottom: "1rem",
              },
            }}
          >
            <Publication />
          </Box>
        ))}
      </div>
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
    </Container>
  );
};

export default Publications;
