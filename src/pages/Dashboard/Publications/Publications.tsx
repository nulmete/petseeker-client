import React, { useEffect, useState } from "react";
import { Box, Grid, SelectChangeEvent, Typography } from "@mui/material";
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

  // Filtering by name
  const [nameFilter, setNameFilter] = useState<string>("");
  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
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
        // owner
        (selectedUserFilter === "CURRENT_USER"
          ? isFromCurrentUser(publication)
          : true) &&
        // proximity
        (selectedProximity !== "ALL"
          ? isBetween(publication, 0, +selectedProximity)
          : true) &&
        // pub type
        (selectedPublicationType !== "ALL"
          ? isOfType(publication, +selectedPublicationType)
          : true) &&
        // date range
        startDateFilter &&
        startDateFilter <= new Date(publication.created_date) &&
        endDateFilter &&
        endDateFilter >= new Date(publication.created_date) &&
        // pet name
        (nameFilter.toLowerCase() !== ""
          ? publication.pet_name.includes(nameFilter.toLowerCase())
          : true)
      );
    });
    setFilteredPublications(filtered);
  };

  useEffect(() => {
    (async () => {
      const response = await PublicationService.get();
      // Newest publications first
      if (response && response.length > 0) {
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
        const oldestDate = new Date(response[response.length - 1].created_date);
        setStartDateFilter(oldestDate);
      }
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
        <div className="spacing-xs">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <PageHeader>Publicaciones</PageHeader>
            </Grid>
            <Grid item xs={4}>
              <CustomButton fullWidth onClick={handlePublicationAdd}>
                Agregar
              </CustomButton>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography>
                {filteredPublications.length}{" "}
                {filteredPublications.length === 1 ? "Resultado" : "Resultados"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CustomButton
                fullWidth
                onClick={() => {
                  setIsFiltering(true);
                }}
              >
                Filtrar
              </CustomButton>
            </Grid>
          </Grid>

          {/* Filtering modal */}
          {isFiltering && (
            <ConfirmationModal
              title="Filtrar publicaciones"
              onClose={() => {
                setIsFiltering(false);
              }}
              onConfirm={() => {
                handleApplyFilters();
                setIsFiltering(false);
              }}
            >
              <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <MobileDatePicker
                      label="Fecha creación (desde)"
                      inputFormat="dd/MM/yyyy"
                      value={startDateFilter}
                      onChange={handleStartDateChange}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      renderInput={(params) => <TextInput {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MobileDatePicker
                      label="Fecha creación (hasta)"
                      inputFormat="dd/MM/yyyy"
                      value={endDateFilter}
                      onChange={handleEndDateChange}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      renderInput={(params) => <TextInput {...params} />}
                    />
                  </Grid>
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
                <Grid item xs={12} md={3}>
                  <TextInput
                    label="Nombre de la mascota"
                    value={nameFilter}
                    onChange={handleNameFilterChange}
                  />
                </Grid>
              </Grid>
            </ConfirmationModal>
          )}
          {/* End filtering modal */}
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
