import React, { useEffect, useState } from "react";
import { Box, Grid, SelectChangeEvent } from "@mui/material";
import { useHistory } from "react-router-dom";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import Publication from "../../../components/Publication/Publication";
import PublicationService from "../../../services/publications";
import { IPublication } from "../../../types/Publication";
import PageHeader from "../../../components/Typography/PageHeader";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { deserializeLocation } from "../../../utils/locationParser";
import getDistanceFromLatLonInKm from "../../../utils/calculateDistance";
import { useLocationContext } from "../../../context/locationContext";
import NoResults from "../../../assets/emptystate.svg";
import { useUserContext } from "../../../context/sessionContext";
import CustomSelectInput from "../../../components/Input/SelectInput";
import CustomButton from "../../../components/Button/CustomButton";
import { PUBLICATION_TYPES } from "../../../constants";
import TextInput from "../../../components/Input/TextInput";

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<IPublication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<
    IPublication[]
  >([]);
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false);

  const { currentLocation } = useLocationContext();
  const { currentUser } = useUserContext();

  // Filtering by date
  const [startDateFilter, setStartDateFilter] = React.useState<Date | null>(
    new Date()
  );
  const handleStartDateChange = (newValue: Date | null) => {
    setStartDateFilter(newValue);
  };
  const [endDateFilter, setEndDateFilter] = React.useState<Date | null>(
    new Date()
  );
  const handleEndDateChange = (newValue: Date | null) => {
    setEndDateFilter(newValue);
  };

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

  const handleApplyFilters = () => {
    const filtered = publications.filter((publication) => {
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
    setFilteredPublications(filtered);
  };

  useEffect(() => {
    (async () => {
      const response = await PublicationService.get();
      // Newest publications first
      response.sort((a, b) => {
        // eslint-disable-next-line no-nested-ternary
        return a.created_date < b.created_date
          ? 1
          : a.created_date > b.created_date
          ? -1
          : 0;
      });
      setPublications(response);
      setFilteredPublications(response);
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
      <div
        style={{
          backgroundColor: "yellow",
          display: "flex",
          justifyContent: "space-between",
          padding: "12px",
        }}
      >
        <div>
          {filteredPublications.length}{" "}
          {filteredPublications.length === 1 ? "Resultado" : "Resultados"}
        </div>
        <button
          type="button"
          onClick={() => {
            setIsFiltering(true);
          }}
        >
          Filtrar
        </button>
        {isFiltering && (
          <ConfirmationModal
            title="Modificar foto de perfil"
            onClose={() => {
              setIsFiltering(false);
            }}
            onConfirm={() => {
              handleApplyFilters();
              setIsFiltering(false);
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <MobileDatePicker
                  label="Fecha de creación"
                  inputFormat="dd/MM/yyyy"
                  value={startDateFilter}
                  onChange={handleStartDateChange}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  renderInput={(params) => <TextInput {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <MobileDatePicker
                  label="Fecha de creación"
                  inputFormat="dd/MM/yyyy"
                  value={endDateFilter}
                  onChange={handleEndDateChange}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  renderInput={(params) => <TextInput {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelectInput
                  label="Tipo de publicación"
                  options={publicationTypeOptions}
                  value={selectedPublicationType}
                  onChange={handlePublicationTypeChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelectInput
                  label="Radio de proximidad"
                  options={proximityOptions}
                  value={selectedProximity}
                  onChange={handleProximityChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelectInput
                  label="Dueño de la mascota"
                  options={userFilterOptions}
                  value={selectedUserFilter}
                  onChange={handleUserFilterChange}
                />
              </Grid>
            </Grid>
          </ConfirmationModal>
        )}
      </div>
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
          {/* <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <MobileDatePicker
                label="Fecha de creación"
                inputFormat="dd/MM/yyyy"
                value={startDateFilter}
                onChange={handleStartDateChange}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextInput {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MobileDatePicker
                label="Fecha de creación"
                inputFormat="dd/MM/yyyy"
                value={endDateFilter}
                onChange={handleEndDateChange}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextInput {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelectInput
                label="Tipo de publicación"
                options={publicationTypeOptions}
                value={selectedPublicationType}
                onChange={handlePublicationTypeChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelectInput
                label="Radio de proximidad"
                options={proximityOptions}
                value={selectedProximity}
                onChange={handleProximityChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelectInput
                label="Dueño de la mascota"
                options={userFilterOptions}
                value={selectedUserFilter}
                onChange={handleUserFilterChange}
              />
            </Grid>
          </Grid> */}
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
                    lg={4}
                    xl={3}
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
