import React from "react";
import { useParams, useHistory } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import Carousel from "react-material-ui-carousel";
import { Box, TextField, Typography, Paper } from "@mui/material";
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
import CustomButton from "../../../components/Button/CustomButton";
import TextInput from "../../../components/Input/TextInput";
import { PUBLICATION_TYPES } from "../../../constants";
import { getPublicationType } from "../../../utils/getPublicationType";
import UserService from "../../../services/users";
import { formatDate } from "../../../utils/formatDate";

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

  const [selectedSighting, setSelectedSighting] =
    React.useState<{ content: string; date: string; author: string }>();

  const [publication, setPublication] = React.useState<IPublication>();

  const [phoneNum, setPhoneNum] = React.useState<string>("");

  const initialize = () => {
    return PublicationService.getById(params.id).then(async (pub) => {
      setPublication(pub);

      // initialize position
      const initialPos = deserializeLocation(pub.pet_location);
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
      setClickedPos((current) => [...current, ...allSightings]);

      // set author's phone number
      const author = await UserService.getUserByUUID(pub.author_uuid);
      setPhoneNum(author.phone_number);
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
        author_uuid: currentUser!.user_uuid,
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
        author_uuid: currentUser!.user_uuid,
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

  const onMarkerClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const stringifiedLocation = serializeLocation({ lat, lng });
      const sightings = publication?.sightings.filter((s) => {
        return s.location === stringifiedLocation;
      });
      if (sightings && sightings.length > 0) {
        // eslint-disable-next-line camelcase
        const { content, timestamp, author_name } = sightings[0];
        setSelectedSighting({
          content,
          author: author_name,
          date: formatDate(timestamp)!,
        });
      }
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

  const isPublicationOwner =
    publication?.author_uuid === currentUser?.user_uuid;

  if (!publication) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="spacing-lg">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <PageHeader>
              <span id="title">{publication?.title}</span> -{" "}
              <span id="pub_type">
                {getPublicationType(publication?.pub_type)}
              </span>
            </PageHeader>
          </Box>

          <section className="spacing-sm">
            <SectionHeader>Datos de la mascota</SectionHeader>
            <div className="spacing-sm">
              <Paper
                variant="elevation"
                elevation={2}
                sx={{
                  display: "inline-block",
                  minWidth: {
                    xs: "100%",
                    sm: "60%",
                    md: "30%",
                  },
                }}
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
                <Typography id="pet_name">
                  Nombre: {publication?.pet_name}
                </Typography>
                <Typography id="pet_race">
                  Raza: {publication?.pet_race}
                </Typography>
                <Typography id="additional_notes">
                  Notas adicionales: {publication?.description}
                </Typography>
              </div>
            </div>
          </section>

          <section className="spacing-sm">
            <SectionHeader>Dueño de la mascota</SectionHeader>
            <div>
              <Typography id="author_name">
                Nombre y apellido: {publication?.author_name}
              </Typography>
              <Typography id="phone_number">Teléfono: {phoneNum}</Typography>
            </div>
          </section>

          <section className="spacing-sm">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SectionHeader>
                {publication.pub_type ===
                +PUBLICATION_TYPES.MASCOTA_PERDIDA.value
                  ? "Avistamientos"
                  : "Ubicación"}
              </SectionHeader>
              {publication.pub_type ===
                +PUBLICATION_TYPES.MASCOTA_PERDIDA.value && (
                <CustomButton
                  onClick={enableMapInteraction}
                  disabled={isMapEnabled}
                >
                  Agregar
                </CustomButton>
              )}
            </Box>
            <CustomMap
              isEdit
              onMapClick={onMapClick}
              initialClickedPositions={clickedPos}
              onMarkerClick={onMarkerClick}
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
            {selectedSighting && (
              <ConfirmationModal
                title="Avistamiento"
                onClose={() => {
                  setSelectedSighting(undefined);
                }}
                onConfirm={() => {
                  setSelectedSighting(undefined);
                }}
              >
                <div className="spacing-sm">
                  <div>
                    <Typography>
                      <strong>{selectedSighting.author}</strong>
                    </Typography>
                    <Typography sx={{ fontSize: ".85rem" }}>
                      {selectedSighting.date}
                    </Typography>
                  </div>
                  <Typography>{selectedSighting.content}</Typography>
                </div>
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
                    isOwner={comment.author_uuid === publication.author_uuid}
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
              <TextInput
                multiline
                rows={4}
                id="comment"
                name="comment"
                placeholder="Escribí un comentario"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    md: "flex-end",
                  },
                }}
              >
                <CustomButton
                  type="submit"
                  sx={{
                    width: {
                      xs: "100%",
                      md: "auto",
                    },
                  }}
                >
                  Agregar
                </CustomButton>
              </Box>
            </Paper>
          </section>

          <section>
            {isPublicationOwner && (
              <>
                <CustomButton fullWidth color="error" onClick={openDeleteModal}>
                  Eliminar publicación
                </CustomButton>
                {isDeleting && (
                  <ConfirmationModal
                    title="¿Está seguro que desea eliminar la publicación?"
                    onClose={closeDeleteModal}
                    onConfirm={() => handlePublicationDelete(+params.id)}
                  >
                    Esta acción no se puede revertir.
                  </ConfirmationModal>
                )}
              </>
            )}
          </section>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PublicationDetail;
