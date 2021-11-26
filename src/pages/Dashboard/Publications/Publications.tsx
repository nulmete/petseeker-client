import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import ButtonAdd from "../../../components/Button/ButtonAdd";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import Publication from "../../../components/Publication/Publication";
import PublicationService from "../../../services/publications";
import { IPublication } from "../../../types/Publication";
import PageHeader from "../../../components/Typography/PageHeader";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<IPublication[]>([]);

  useEffect(() => {
    (async () => {
      const response = await PublicationService.get();
      setPublications(response);
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

  const handlePublicationDetail = (id: number) => {
    history.push(`/dashboard/publicaciones/${id}`);
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
          <PageHeader>Publicaciones</PageHeader>
          <ButtonAdd entity="Publicacion" onClick={handlePublicationAdd} />
        </Box>
        <Grid container spacing={2}>
          {publications.map((publication) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={publication.publication_id}
            >
              <Publication
                publication={publication}
                handlePublicationDelete={() =>
                  handlePublicationDelete(publication.publication_id!)
                }
                handlePublicationDetail={() => {
                  handlePublicationDetail(publication.publication_id!);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Publications;
