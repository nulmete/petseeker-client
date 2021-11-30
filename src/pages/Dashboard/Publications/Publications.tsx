import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import ButtonAdd from "../../../components/Button/ButtonAdd";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import Publication from "../../../components/Publication/Publication";
import PublicationService from "../../../services/publications";
import { IPublication } from "../../../types/Publication";
import PageHeader from "../../../components/Typography/PageHeader";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { deserializeLocation } from "../../../utils/locationParser";
import getDistanceFromLatLonInKm from "../../../utils/calculateDistance";
import { useLocationContext } from "../../../context/locationContext";
import NoResults from "../../../assets/emptystate.svg";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<IPublication[]>([]);
  const { currentLocation } = useLocationContext();

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
          {publications.length > 0 ? (
            <Grid container spacing={4}>
              {publications.map((publication) => {
                const petLocation = deserializeLocation(
                  publication.pet_location
                );
                const distance = +getDistanceFromLatLonInKm(
                  petLocation.lat,
                  petLocation.lng,
                  currentLocation!.lat,
                  currentLocation!.lng
                ).toFixed(2);
                return (
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
                      distance={distance}
                      handlePublicationDetail={() => {
                        handlePublicationDetail(publication.publication_id!);
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={NoResults}
                style={{ display: "block", maxWidth: "100%" }}
                alt=""
              />
            </Box>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Publications;
