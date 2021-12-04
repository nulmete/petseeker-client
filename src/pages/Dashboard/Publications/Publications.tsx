import React, { useEffect, useState } from "react";
import { Box, Grid, SelectChangeEvent } from "@mui/material";
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
import { useUserContext } from "../../../context/sessionContext";
import CustomSelectInput from "../../../components/Input/SelectInput";
import CustomButton from "../../../components/Button/CustomButton";
import { PUBLICATION_TYPES } from "../../../constants";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<IPublication[]>([]);
  const { currentLocation } = useLocationContext();
  const { currentUser } = useUserContext();

  // Filtering by user
  const userFilterOptions = [
    { label: "Todas las publicaciones", value: "ALL" },
    { label: "Mis publicaciones", value: "CURRENT_USER" },
  ];
  const [selectedUserFilter, setSelectedUserFilter] = useState(
    userFilterOptions[0].value
  );
  const handleUserFilterChange = (e: SelectChangeEvent) => {
    setSelectedUserFilter(e.target.value);
  };

  // Filtering by pub type
  const publicationTypeOptions = [
    { label: "Todas", value: "ALL" },
    { ...PUBLICATION_TYPES.MASCOTA_PERDIDA },
    { ...PUBLICATION_TYPES.MASCOTA_EN_TRANSITO },
    { ...PUBLICATION_TYPES.MASCOTA_EN_ADOPCION },
  ];
  const [selectedPublicationType, setSelectedPublicationType] = useState(
    publicationTypeOptions[0].value
  );
  const handlePublicationTypeChange = (e: SelectChangeEvent) => {
    setSelectedPublicationType(e.target.value);
  };

  // Filtering by proximity
  const proximityOptions = [
    { label: "Todos", value: "ALL" },
    { label: "5 km", value: "5" },
    { label: "10 km", value: "10" },
    { label: "15 km", value: "15" },
  ];
  const [selectedProximity, setSelectedProximity] = useState(
    proximityOptions[0].value
  );
  const handleProximityChange = (e: SelectChangeEvent) => {
    setSelectedProximity(e.target.value);
  };

  const isFromCurrentUser = (pub: IPublication) => {
    return pub.author_uuid === currentUser?.user_uuid;
  };

  const isOfType = (pub: IPublication, type: number) => {
    return pub.pub_type === type;
  };

  const isBetween = (pub: IPublication, lower: number, upper: number) => {
    const petLocation = deserializeLocation(pub.pet_location);
    if (!petLocation) return false;
    const distance = getDistanceFromLatLonInKm(
      petLocation?.lat,
      petLocation?.lng,
      currentLocation!.lat,
      currentLocation!.lng
    );
    return distance >= lower && distance <= upper;
  };

  const filteredPublications = publications.filter((publication) => {
    return (
      (selectedUserFilter === "CURRENT_USER"
        ? isFromCurrentUser(publication)
        : true) &&
      (selectedProximity !== "ALL"
        ? isBetween(publication, 0, +selectedProximity)
        : true) &&
      (selectedPublicationType !== "ALL"
        ? isOfType(publication, +selectedPublicationType)
        : true)
    );
  });

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
            <CustomButton onClick={handlePublicationAdd}>Agregar</CustomButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomSelectInput
                label="Tipo de publicación"
                options={publicationTypeOptions}
                value={selectedPublicationType}
                onChange={handlePublicationTypeChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelectInput
                label="Radio de proximidad"
                options={proximityOptions}
                value={selectedProximity}
                onChange={handleProximityChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelectInput
                label="Dueño de la mascota"
                options={userFilterOptions}
                value={selectedUserFilter}
                onChange={handleUserFilterChange}
              />
            </Grid>
          </Grid>
          {filteredPublications.length > 0 ? (
            <Grid container spacing={4}>
              {filteredPublications.map((publication) => {
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
