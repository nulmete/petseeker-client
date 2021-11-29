import React, { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import { useHistory } from "react-router-dom";
import ButtonAdd from "../../../components/Button/ButtonAdd";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import Publication from "../../../components/Publication/Publication";
import PublicationService from "../../../services/publications";
import { IPublication } from "../../../types/Publication";
import PageHeader from "../../../components/Typography/PageHeader";
import PageContainer from "../../../components/PageContainer/PageContainer";

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

  const handlePublicationDetail = (id: number) => {
    history.push(`/dashboard/publicaciones/${id}`);
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="spacing-sm">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <PageHeader>Publicaciones</PageHeader>
            <ButtonAdd entity="Publicación" onClick={handlePublicationAdd} />
          </Box>
          <Grid container spacing={4}>
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
                  handlePublicationDetail={() => {
                    handlePublicationDetail(publication.publication_id!);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Publications;
