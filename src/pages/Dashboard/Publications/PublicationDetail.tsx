import React from "react";
import { useParams, useHistory } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import Carousel from "react-material-ui-carousel";
import { Box, TextField, Typography, Paper, Button } from "@mui/material";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { IPublication } from "../../../types/Publication";
import PublicationService from "../../../services/publications";
import CommentsService from "../../../services/comments";
import PageHeader from "../../../components/Typography/PageHeader";
import SectionHeader from "../../../components/Typography/SectionHeader";
import Comment from "../../../components/Comment/Comment";
import CustomMap from "../../../components/CustomMap/CustomMap";
import PageContainer from "../../../components/PageContainer/PageContainer";
import ImageNotFound from "../../../assets/imageNotFound.png";
import ButtonAdd from "../../../components/Button/ButtonAdd";
import SightingsService from "../../../services/sightings";
import { useUserContext } from "../../../context/sessionContext";
import {
  deserializeLocation,
  serializeLocation,
} from "../../../utils/locationParser";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import {
  ClickedPosition,
  ClickedPositionType,
} from "../../../types/ClickedPosition";

const validationSchema = yup.object({
  comment: yup.string().required("Requerido."),
});
const validationSchema2 = yup.object({
  sighting: yup.string().required("Requerido."),
});

interface ParamTypes {
  id: string;
}

const PublicationDetail: React.FC = () => {
  const params = useParams<ParamTypes>();
  const history = useHistory();
  const { currentUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  // Map
  const [clickedPos, setClickedPos] = React.useState<ClickedPosition[]>(
    [] as ClickedPosition[]
  );

  const [publication, setPublication] = React.useState<IPublication>();

  const initialize = () => {
    return PublicationService.getById(params.id).then((pub) => {
      setPublication(pub);

      // initialize position
      const initialPos = deserializeLocation(pub.pet_location);
      // setInitialPosition(initialPos);
      setClickedPos((current) => [
        ...current,
        { position: initialPos, type: "initial" },
      ]);

      // initialize sightings
      const sightings = pub.sightings.map((s) => {
        return deserializeLocation(s.location);
      });
      const allSightings = sightings.map((s) => ({
        position: s,
        type: "sighting" as ClickedPositionType,
      }));
      // setInitialSightings(allSightings);
      setClickedPos((current) => [...current, ...allSightings]);
    });
  };

  React.useEffect(() => {
    initialize();
  }, []);

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await CommentsService.add({
        content: values.comment,
        author_uuid: currentUser!.uuid,
        author_name: `${currentUser!.names} ${currentUser!.surnames}`,
        created_date: new Date().toISOString(),
        publication_id: +params.id,
      });
      formik.resetForm();
      await initialize();
    },
  });

  const formik2 = useFormik({
    initialValues: {
      // TODO: change 'sighting' to 'content'
      sighting: "",
      location: "",
    },
    validationSchema: validationSchema2,
    onSubmit: async (values) => {
      const data = {
        author_uuid: currentUser!.uuid,
        author_name: `${currentUser!.names} ${currentUser!.surnames}`,
        content: values.sighting,
        location: values.location,
        // TODO: en el back la guarda como null
        publication_id: +params.id,
        timestamp: new Date().toISOString(),
      };
      await SightingsService.add(data);
      formik2.resetForm();
      await initialize();
    },
  });

  const [isMapEnabled, setIsMapEnabled] = React.useState<boolean>(false);
  const [isAddingSighting, setIsAddingSighting] =
    React.useState<boolean>(false);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null && isMapEnabled) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const position = { lat, lng };
      setClickedPos((current) => [...current, { position, type: "sighting" }]);
      formik2.setFieldValue("location", serializeLocation(position));
      setIsMapEnabled(false);
      setIsAddingSighting(true);
    }
  };

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const enableMapInteraction = () => {
    setIsMapEnabled(true);
  };

  const openDeleteModal = () => {
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    setIsDeleting(false);
  };

  const closeSightingModal = () => {
    setIsAddingSighting(false);
  };

  const handlePublicationDelete = async (id: number) => {
    try {
      const response = await PublicationService.remove(id);
      if (response.status === 200) {
        enqueueSnackbar("Publicación eliminada.", { variant: "success" });
        history.push("/dashboard/publicaciones");
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const isPublicationOwner = publication?.author_id === currentUser?.uuid;

  if (!publication) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="spacing-lg">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <PageHeader>
              {publication?.title} ({publication?.pub_type})
            </PageHeader>
            {isPublicationOwner && (
              <>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={openDeleteModal}
                >
                  Finalizar publicación
                </Button>
                {isDeleting && (
                  <ConfirmationModal
                    title="¿Está seguro que desea finalizar la publicación?"
                    // content="Esta acción no se puede revertir."
                    onClose={closeDeleteModal}
                    onConfirm={() => handlePublicationDelete(+params.id)}
                  >
                    Esta acción no se puede revertir.
                  </ConfirmationModal>
                )}
              </>
            )}
          </Box>

          <section className="spacing-sm">
            <SectionHeader>Datos de la mascota</SectionHeader>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Paper
                variant="elevation"
                elevation={2}
                style={{ display: "inline-block", minWidth: "250px" }}
              >
                {publication.pet_pic_url.length > 0 ? (
                  <Carousel>
                    {publication?.pet_pic_url.map((pic) => {
                      return (
                        <img
                          src={pic}
                          alt=""
                          style={{
                            display: "block",
                            height: "250px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      );
                    })}
                  </Carousel>
                ) : (
                  <img
                    src={ImageNotFound}
                    alt=""
                    style={{ display: "block", maxHeight: "250px" }}
                  />
                )}
              </Paper>
              <div>
                <Typography>Nombre: {publication?.pet_name}</Typography>
                <Typography>Raza: {publication?.pet_race}</Typography>
              </div>
            </Box>
          </section>

          <section className="spacing-sm">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SectionHeader>Avistamientos</SectionHeader>
              <ButtonAdd
                entity="Avistamiento"
                onClick={enableMapInteraction}
                disabled={isMapEnabled}
              />
            </Box>
            <CustomMap
              isEdit
              onMapClick={onMapClick}
              initialClickedPositions={clickedPos}
            />
            {isAddingSighting && (
              <ConfirmationModal
                title="Notas adicionales"
                onClose={async () => {
                  // Remove last sighting from state
                  const clickedPositionsCopy = [...clickedPos];
                  clickedPositionsCopy.pop();
                  setClickedPos(clickedPositionsCopy);
                  closeSightingModal();
                  formik2.resetForm();
                }}
                onConfirm={() => {
                  formik2.handleSubmit();
                  closeSightingModal();
                }}
              >
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  id="sighting"
                  name="sighting"
                  value={formik2.values.sighting}
                  onChange={formik2.handleChange}
                  error={
                    formik2.touched.sighting && Boolean(formik2.errors.sighting)
                  }
                  helperText={
                    formik2.touched.sighting && formik2.errors.sighting
                  }
                  variant="standard"
                />
              </ConfirmationModal>
            )}
          </section>

          <section className="spacing-sm">
            <SectionHeader>Comentarios</SectionHeader>
            <div className="spacing-xs">
              {publication?.comments.map((comment) => {
                return (
                  <Comment
                    key={comment.created_date}
                    isOwner={comment.author_uuid === publication.author_id}
                    authorName={comment.author_name}
                    date={comment.created_date}
                    content={comment.content}
                  />
                );
              })}
            </div>
            <Paper
              component="form"
              variant="outlined"
              sx={{ padding: 2 }}
              className="spacing-sm"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                multiline
                rows={4}
                fullWidth
                id="comment"
                name="comment"
                placeholder="Escribí un comentario"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
                variant="standard"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    md: "flex-end",
                  },
                }}
              >
                <ButtonAdd
                  type="submit"
                  entity="Comentario"
                  sx={{
                    width: {
                      xs: "100%",
                      md: "auto",
                    },
                  }}
                />
              </Box>
            </Paper>
          </section>

          <section className="spacing-sm">
            <SectionHeader>Dueño de la publicación</SectionHeader>
            <div>
              <Typography>
                Nombre y apellido: {publication?.author_name}
              </Typography>
              {/* TODO: tendria que hacer GET /user/{uuid} y buscar el phoneNum */}
              <Typography>Telefono: {123456}</Typography>
            </div>
          </section>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PublicationDetail;
