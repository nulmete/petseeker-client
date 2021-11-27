import React from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { IPublication } from "../../../types/Publication";
import PublicationService from "../../../services/publications";
import CommentsService from "../../../services/comments";
import { useUserContext } from "../../../context/sessionContext";
import PageHeader from "../../../components/Typography/PageHeader";
import SectionHeader from "../../../components/Typography/SectionHeader";
import Comment from "../../../components/Comment/Comment";
import CustomMap from "../../../components/CustomMap/CustomMap";

const validationSchema = yup.object({
  comment: yup.string().required("Requerido."),
});

interface ParamTypes {
  id: string;
}

const PublicationDetail: React.FC = () => {
  const { currentUser } = useUserContext();

  const params = useParams<ParamTypes>();

  const [publication, setPublication] = React.useState<IPublication>();
  const [isMapEnabled, setIsMapEnabled] = React.useState<boolean>(false);

  const getPublication = async () => {
    const response = await PublicationService.getById(params.id);
    setPublication(response);
  };

  React.useEffect(() => {
    getPublication();
  }, []);

  const getInitialPos = React.useCallback(() => {
    if (!publication) return undefined;
    const { pet_location: petLocation } = publication;
    const splittedPetLocation = petLocation.split(",");
    return {
      lat: +splittedPetLocation[0],
      lng: +splittedPetLocation[1],
    };
  }, [publication]);

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await CommentsService.add({
        content: values.comment,
        // TODO: should be currentUser.uuid
        author_id: 123,
        // TODO; should be currentUser.names + currentUser.surnames
        author_name: "author name",
        // TODO: actual date
        created_date: "2021-11-23T23:50:24.494+00:00",
        publication_id: +params.id,
      });
      formik.resetForm();
      await getPublication();
    },
  });

  const enableMapInteraction = () => {
    setIsMapEnabled(true);
  };

  if (!publication && !getInitialPos()) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <div className="spacing-md">
          <PageHeader>Tipo de publicacion: {publication?.pub_type}</PageHeader>

          <section className="spacing-sm">
            <SectionHeader>Datos de la mascota</SectionHeader>
            <div>
              <Typography>Nombre: {publication?.pet_name}</Typography>
              <Typography>Raza: {publication?.pet_race}</Typography>
            </div>
          </section>

          {/* TODO: fotos */}

          {/* TODO: map con marcadores */}
          <section>
            <SectionHeader>Avistamientos</SectionHeader>
            <button type="button" onClick={enableMapInteraction}>
              {isMapEnabled ? "disable" : "enable"}
            </button>
            <CustomMap
              getLocationCallback={(location) => {
                console.log("callback", location);
              }}
              isEdit
              initialPos={getInitialPos()}
              isEnabled={isMapEnabled}
            />
          </section>

          <section className="spacing-sm">
            <SectionHeader>Creador de la publicacion</SectionHeader>
            {/* TODO: matchear currentUser.names + currentUser.surnames */}
            <div>
              <Typography>
                Nombre y apellido: {publication?.author_name}
              </Typography>
              {/* TODO: currentUser.phoneNum */}
              <Typography>Telefono: {123456}</Typography>
            </div>
          </section>

          <section className="spacing-sm">
            <SectionHeader>Comentarios</SectionHeader>
            <div className="spacing-xs">
              {publication?.comments.map((comment) => {
                return (
                  <Comment
                    key={comment.created_date}
                    author={comment.author_name}
                    date={comment.created_date}
                    content={comment.content}
                  />
                );
              })}
            </div>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                multiline
                rows={4}
                fullWidth
                id="comment"
                name="comment"
                label="Agregar comentario"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
                variant="outlined"
              />
              <Button type="submit" variant="outlined">
                Agregar
              </Button>
            </form>
          </section>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default PublicationDetail;
