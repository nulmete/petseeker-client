import { Box, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ButtonAdd from "../../../components/Button/ButtonAdd";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import Publication from "../../../components/Publication/Publication";
import PublicationService from "../../../services/publications";
// import { IPublication } from "../../../types/Publication";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await PublicationService.get();
      setPublications(response.data as any);
      console.log(response.data);
    })();
  }, []);

  const history = useHistory();

  const handlePublicationAdd = () => {
    history.push("/dashboard/publicaciones/agregar");
  };

  const handlePublicationDelete = async (id: number) => {
    const response = await PublicationService.remove(id);
    console.log({ response });

    // TODO: if status is 200, then remove publication from state

    // TODO: if status is 404, then publication was not found on DB
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>Publicaciones</h2>
          <ButtonAdd entity="Publicacion" onClick={handlePublicationAdd} />
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
              {/* TODO: I need publication.id field */}
              <Publication
                handlePublicationDelete={() => handlePublicationDelete(2)}
              />
            </Box>
          ))}
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Publications;
