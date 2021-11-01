import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import PublicationService from "../../services/publications";
import CurrentLocation from "../../components/CurrentLocation/CurrentLocation";

const center = {
  lat: -35.0,
  lng: -59.0,
};

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
      geolocalization: "some location",
      description: "some description",
    },
    validationSchema,
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));

      const response = await PublicationService.add(dummyPublication);
      console.log({ response });
    },
  });

  // Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
  });

  // Save map in ref to access the map later
  const mapRef = useRef<google.maps.Map | null>(null);

  // Handle clicked position in map
  const [clickedPos, setClickedPos] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral
  );

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null) {
      const latitude = e.latLng.lat();
      const longitude = e.latLng.lng();
      setClickedPos({ lat: latitude, lng: longitude });
    }
  };

  const moveTo = (position: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      console.log({ position });
      console.log(mapRef.current);
      mapRef.current.panTo({ lat: position.lat, lng: position.lng });
      mapRef.current.setZoom(12);
      setClickedPos(position);
    }
  };

  const onLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
  };

  const onUnMount = (): void => {
    mapRef.current = null;
  };

  if (!isLoaded) return <div>Map loading...</div>;

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
      <TextField
        fullWidth
        id="geolocalization"
        name="geolocalization"
        label="Geolocalizacion"
        value={formik.values.geolocalization}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.geolocalization &&
          Boolean(formik.errors.geolocalization)
        }
        helperText={
          formik.touched.geolocalization && formik.errors.geolocalization
        }
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
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        variant="outlined"
      />
      <div>
        <Button type="submit" variant="outlined">
          Crear
        </Button>
      </div>
      <div>
        <CurrentLocation moveTo={moveTo} />
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100vh",
          }}
          center={center}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnMount}
          onClick={onMapClick}
        >
          {clickedPos.lat ? <Marker position={clickedPos} /> : null}
        </GoogleMap>
      </div>
    </form>
  );
};

export default PublicationAdd;
