/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Theme,
} from "@mui/material";
import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import PublicationService from "../../../services/publications";
import CustomMap from "../../../components/CustomMap/CustomMap";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";
import PageHeader from "../../../components/Typography/PageHeader";
import { IPublication } from "../../../types/Publication";

const validationSchema = yup.object({
  title: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "No puede contener numeros o simbolos.")
    .required("Requerido."),
  pet_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  // TODO: validate is one of dropdown values
  pet_race: yup.string().required("Requerido."),
  pet_location: yup.string().required("Requerido."),
  // TODO: validate is one of dropdown values
  pub_type: yup.string().required("Requerido."),
  description: yup
    .string()
    .min(10, "Debe tener una longitud de entre 10 y 3000 caracteres.")
    .max(3000, "Debe tener una longitud de entre 10 y 3000 caracteres."),
});

const PublicationAdd: React.FC = () => {
  const { currentUser } = useUserContext();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      // esto no esta en los campos del caso de uso
      title: "",
      // description = "notas adicionales", tmp esta en caso de uso
      description: "",
      pet_name: "",
      pet_race: "",
      pet_location: "",
      // pet_pic_url: [],
      // TODO: map with an enum
      pub_type: 0,
      comments: [],
      sightings: [],
      // TODO: should be current user fetched from API (match with auth0 also)
      // eslint-disable-next-line radix
      // author_id: parseInt(currentUser!.uuid),
      author_id: 99,
      author_name: currentUser!.names,
    },
    validationSchema,
    onSubmit: async (values) => {
      // TODO: handle image upload
      try {
        const response = await PublicationService.add({
          ...values,
          // TODO: pet pic url
          pet_pic_url: [],
        });

        // Should be status 200...
        if (response.status === 202) {
          const publicationData = response.data as IPublication;
          history.push(
            `/dashboard/publicaciones/${publicationData.publication_id}`
          );
        }
      } catch (error) {
        // TODO: handle errors
        console.error({ error });
      }
    },
  });

  const [mapOpen, setMapOpen] = React.useState<boolean>(false);

  const handleOpenMap = (): void => {
    setMapOpen(true);
  };

  const handleCloseMap = (): void => {
    setMapOpen(false);
  };

  const getLocationCallback = (location: string): void => {
    formik.setFieldValue("pet_location", location);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <div className="spacing-md">
          <PageHeader>Agregar publicacion</PageHeader>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              "& > *:not(:last-child)": {
                marginBottom: (theme: Theme) => theme.spacing(2),
              },
            }}
          >
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Titulo"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              variant="outlined"
            />
            <TextField
              fullWidth
              id="pet_name"
              name="pet_name"
              label="Nombre de la mascota"
              value={formik.values.pet_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pet_name && Boolean(formik.errors.pet_name)}
              helperText={formik.touched.pet_name && formik.errors.pet_name}
              variant="outlined"
            />
            <TextField
              fullWidth
              id="pet_race"
              name="pet_race"
              label="Raza"
              value={formik.values.pet_race}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pet_race && Boolean(formik.errors.pet_race)}
              helperText={formik.touched.pet_race && formik.errors.pet_race}
              variant="outlined"
            />
            {/* TODO: make a dropdown */}
            <TextField
              fullWidth
              id="pub_type"
              name="pub_type"
              label="Tipo de publicacion"
              value={formik.values.pub_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pub_type && Boolean(formik.errors.pub_type)}
              helperText={formik.touched.pub_type && formik.errors.pub_type}
              variant="outlined"
            />
            <div>
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={8} sm={9} md={10}>
                  <TextField
                    fullWidth
                    id="pet_location"
                    name="pet_location"
                    label="Ubicacion"
                    value={formik.values.pet_location}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.pet_location &&
                      Boolean(formik.errors.pet_location)
                    }
                    helperText={
                      formik.touched.pet_location && formik.errors.pet_location
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4} sm={3} md={2}>
                  <Button
                    sx={{ height: "100%" }}
                    fullWidth
                    variant="outlined"
                    onClick={handleOpenMap}
                  >
                    Elegir ubicacion
                  </Button>
                </Grid>
              </Grid>
              <Dialog
                fullWidth
                maxWidth="lg"
                onClose={handleCloseMap}
                open={mapOpen}
              >
                <DialogTitle>Ubicacion</DialogTitle>
                <CustomMap getLocationCallback={getLocationCallback} />
              </Dialog>
            </div>
            <TextField
              multiline
              rows={4}
              fullWidth
              id="description"
              name="description"
              label="Notas adicionales"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              variant="outlined"
            />
            <div>
              <Button type="submit" variant="outlined">
                Crear
              </Button>
            </div>
          </Box>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default PublicationAdd;
