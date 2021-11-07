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
import PublicationService from "../../../services/publications";
import CustomMap from "../../../components/CurrentLocation/CustomMap";

const validationSchema = yup.object({
  title: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Regex does not match")
    .required("Requerido"),
  description: yup.string().required("Requerido"),
  location: yup.string().required("Requerido"),
});

const PublicationAdd: React.FC = () => {
  const dummyPublication = {
    author_id: 2,
    author_name: "author_name",
    comments: [],
    pet_name: "",
    pet_location: "",
    pet_pic_url: ["123"],
    pet_race: "",
    pub_type: 0,
    sightings: [],
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));

      const response = await PublicationService.add(dummyPublication);
      console.log({ response });
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
    formik.setFieldValue("location", location);
  };

  return (
    <Container maxWidth="xl">
      <h2>Agregar publicacion</h2>
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
          multiline
          rows={4}
          id="description"
          name="description"
          label="Descripcion"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          variant="outlined"
        />
        <div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Geolocalizacion"
                value={formik.values.location}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={handleOpenMap}>
                Elegir geolocalizacion
              </Button>
            </Grid>
          </Grid>
          <Dialog
            fullWidth
            maxWidth="lg"
            onClose={handleCloseMap}
            open={mapOpen}
          >
            <DialogTitle>Geolocalizacion</DialogTitle>
            <CustomMap getLocationCallback={getLocationCallback} />
          </Dialog>
        </div>
        <div>
          <Button type="submit" variant="outlined">
            Crear
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default PublicationAdd;
