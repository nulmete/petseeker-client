/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { AddAPhoto } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSnackbar } from "notistack";
import PublicationService from "../../../services/publications";
import CustomMap from "../../../components/CustomMap/CustomMap";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";
import PageHeader from "../../../components/Typography/PageHeader";
import { IPublication } from "../../../types/Publication";
import FilesService from "../../../services/files";
import { serializeLocation } from "../../../utils/locationParser";
import { publicationSchema } from "../../../utils/validationSchemas";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { ClickedPosition } from "../../../types/ClickedPosition";
import TextInput from "../../../components/Input/TextInput";
import FormWrapper from "../../../components/Form/FormWrapper";
import CustomButton from "../../../components/Button/CustomButton";

const PublicationAdd: React.FC = () => {
  const { currentUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [selectedImages, setSelectedImages] = React.useState<
    { preview: string; image: File }[]
  >([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      pet_name: "",
      pet_race: "",
      pet_location: "",
      pub_type: 0,
      comments: [],
      sightings: [],
    },
    validationSchema: publicationSchema,
    onSubmit: async (values) => {
      const images: string[] = [];
      try {
        if (selectedImages.length > 0) {
          const uploaders = selectedImages.map((image) => {
            const formData = new FormData();
            formData.append("file", image.image as Blob);
            formData.append("upload_preset", "c54c8msx");
            return FilesService.upload(formData);
          });

          await Promise.all(uploaders).then((res) => {
            const allURLs = res.map((r) => r!.secure_url);
            images.push(...allURLs);
          });
        }

        const response = await PublicationService.add({
          ...values,
          author_uuid: currentUser!.user_uuid,
          author_name: `${currentUser?.names} ${currentUser?.surnames}`,
          pet_pic_url: images,
        });

        // Should be status 200...
        if (response.status === 202) {
          const publicationData = response.data as IPublication;
          history.push(
            `/dashboard/publicaciones/${publicationData.publication_id}`
          );
          enqueueSnackbar("Publicación creada.", { variant: "success" });
        }
      } catch (error) {
        enqueueSnackbar("Error al crear la publicación. Intente nuevamente.", {
          variant: "error",
        });
      }
    },
  });

  // Map
  const [clickedPos, setClickedPos] = React.useState<ClickedPosition>(
    {} as ClickedPosition
  );
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const position = { lat, lng };
      setClickedPos({ position, type: "initial" });
      formik.setFieldValue("pet_location", serializeLocation(position));
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = e.target.files;
    // TODO: validate min 1 image - max 5 images.
    if (images && images.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < images.length; i++) {
        const preview = URL.createObjectURL(images[i]);
        const imageWithPreview = { preview, image: images[i] };
        setSelectedImages((current) => [...current, imageWithPreview]);
      }
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="spacing-md">
          <PageHeader>Agregar publicación</PageHeader>
          <FormWrapper onSubmit={formik.handleSubmit}>
            <TextInput
              id="title"
              name="title"
              label="Título"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextInput
              id="pet_name"
              name="pet_name"
              label="Nombre de la mascota"
              value={formik.values.pet_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pet_name && Boolean(formik.errors.pet_name)}
              helperText={formik.touched.pet_name && formik.errors.pet_name}
            />
            <TextInput
              id="pet_race"
              name="pet_race"
              label="Raza de la mascota"
              value={formik.values.pet_race}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pet_race && Boolean(formik.errors.pet_race)}
              helperText={formik.touched.pet_race && formik.errors.pet_race}
            />
            {/* TODO: make a dropdown */}
            <TextInput
              id="pub_type"
              name="pub_type"
              label="Tipo de publicación"
              value={formik.values.pub_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pub_type && Boolean(formik.errors.pub_type)}
              helperText={formik.touched.pub_type && formik.errors.pub_type}
            />
            <div className="spacing-sm">
              <Typography fontWeight={500}>Ubicación</Typography>
              <CustomMap
                onMapClick={onMapClick}
                initialClickedPositions={[clickedPos]}
              />
            </div>
            <TextInput
              multiline
              rows={4}
              id="description"
              name="description"
              label="Notas adicionales"
              placeholder="Tiene una cicatriz en la cola."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <label htmlFor="images" style={{ display: "inline-block" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography fontWeight={500}>Imágenes</Typography>
                <IconButton
                  color="primary"
                  aria-label="Agregar imágenes"
                  component="span"
                >
                  <AddAPhoto />
                </IconButton>
              </Box>
              <input
                id="images"
                style={{ display: "none" }}
                accept="image/*"
                type="file"
                multiple
                onChange={handleImageSelection}
              />
            </label>
            {selectedImages.length > 0 ? (
              <Grid container spacing={2}>
                {selectedImages.map((image) => (
                  <Grid item xs={12} md={3}>
                    <Paper variant="outlined" sx={{ position: "relative" }}>
                      <img
                        src={image.preview}
                        alt=""
                        style={{
                          display: "block",
                          height: "260px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          transform: "translate(50%, -50%)",
                          color: "primary.main",
                        }}
                        aria-label="Eliminar"
                        onClick={() => {
                          setSelectedImages((prev) =>
                            prev.filter((x) => x.preview !== image.preview)
                          );
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  height: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>No seleccionaste ninguna imagen.</Typography>
              </Paper>
            )}
            <div>
              <CustomButton
                sx={{
                  width: {
                    xs: "100%",
                    md: "auto",
                  },
                }}
                type="submit"
              >
                Crear
              </CustomButton>
            </div>
          </FormWrapper>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PublicationAdd;
