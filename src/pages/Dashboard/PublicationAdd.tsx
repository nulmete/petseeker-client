import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import PublicationService from "../../services/publications";
import CustomMap from "../../components/CurrentLocation/CustomMap";

const validationSchema = yup.object({
  title: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Regex does not match")
    .required("Title is required"),
  geolocalization: yup.string().required("Geolocalization is requred"),
  description: yup.string().required("description is required"),
});

const PublicationAdd: React.FC = () => {
  const dummyPublication = {
    author_id: 1,
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
      title: "placeholder title",
      description: "some description",
    },
    validationSchema,
    onSubmit: async (values) => {
      // TODO: also validate for clickedPos here, which is not inside formik
      alert(JSON.stringify(values, null, 2));

      const response = await PublicationService.add(dummyPublication);
      console.log({ response });
    },
  });

  // Handle clicked position in map
  const [clickedPos, setClickedPos] = React.useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral
  );

  const [mapOpen, setMapOpen] = React.useState<boolean>(false);

  const handleOpenMap = (): void => {
    setMapOpen(true);
  };

  const handleCloseMap = (): void => {
    setMapOpen(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
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
      <div>
        <Button variant="outlined" onClick={handleOpenMap}>
          Elegir geolocalizacion
        </Button>
        <div>Selected location: {JSON.stringify(clickedPos, null, 2)}</div>
        <Dialog fullWidth maxWidth="lg" onClose={handleCloseMap} open={mapOpen}>
          <DialogTitle>Geolocalizacion</DialogTitle>
          <CustomMap clickedPos={clickedPos} setClickedPos={setClickedPos} />
        </Dialog>
      </div>
      <TextField
        multiline
        rows={4}
        id="description"
        name="description"
        label="Descripcion"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        variant="outlined"
      />
      <div>
        <Button type="submit" variant="outlined">
          Crear
        </Button>
      </div>
    </form>
  );
};

export default PublicationAdd;
