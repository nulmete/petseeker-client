/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import {
  Grid,
  Box,
  IconButton,
  Typography,
  Avatar,
  Theme,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { PhotoCamera } from "@mui/icons-material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";
import { userProfileSchema } from "../../../utils/validationSchemas";
import FormWrapper from "../../../components/Form/FormWrapper";
import FilesService from "../../../services/files";
import UserService from "../../../services/users";
import { IUser } from "../../../types/User";
import ImagePreviewModal from "../../../components/ImagePreviewModal/ImagePreviewModal";
import PageContainer from "../../../components/PageContainer/PageContainer";
import ImageNotFound from "../../../assets/imageNotFound.png";
import TextInput from "../../../components/Input/TextInput";
import CustomButton from "../../../components/Button/CustomButton";
import SectionHeader from "../../../components/Typography/SectionHeader";
import { formatDate } from "../../../utils/formatDate";

const Profile: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      address: currentUser?.address || "",
      province: currentUser?.province || "",
      city: currentUser?.city || "",
      postal_code: currentUser?.postal_code || "",
      phone_number: currentUser?.phone_number || "",
    },
    validationSchema: userProfileSchema,
    onSubmit: async (values) => {
      // Also send email, id, uuid, names, surnames, pic_path from currentUser
      const {
        id,
        user_uuid,
        names,
        surnames,
        email,
        pic_path,
        events,
        enabled,
      } = currentUser!;
      const allValues = {
        id,
        user_uuid,
        names,
        surnames,
        email,
        pic_path,
        events,
        enabled,
        ...values,
      };
      try {
        const response = await UserService.update(allValues);
        if (response.status === 200) {
          enqueueSnackbar("Su información fue actualizada con éxito.", {
            variant: "success",
          });
          setCurrentUser(response.data as IUser);
        }
      } catch (error) {
        enqueueSnackbar(
          "Hubo un error actualizando su información,por favor reintente más tarde.",
          {
            variant: "error",
          }
        );
      }
    },
  });

  // Image upload
  const [selectedImage, setSelectedImage] = React.useState<File>();

  const [selectedImagePreview, setSelectedImagePreview] =
    React.useState<string>();

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img != null) {
      setSelectedImage(img);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage as Blob);
    formData.append("upload_preset", "c54c8msx");
    const data = await FilesService.upload(formData);
    // TODO: improve error handling here
    if (data) {
      // Update user's pic_path
      const updatedUser = await UserService.update({
        ...currentUser!,
        pic_path: data.secure_url,
      });
      if (updatedUser) {
        setCurrentUser(updatedUser.data as IUser);
        enqueueSnackbar("Su foto de perfil fue actualizada con éxito", {
          variant: "success",
        });
      }
    }
  };

  React.useEffect(() => {
    if (!selectedImage) {
      setSelectedImagePreview(undefined);
      return;
    }

    const objectURL = URL.createObjectURL(selectedImage);
    setSelectedImagePreview(objectURL);

    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedImage]);

  function createData(time: string, eventType: string, publicationId: number) {
    const eventText =
      eventType === "COMMENT_ADDED"
        ? "Comentario agregado"
        : "Avistamiento agregado";
    const timeText = time.replace("ART ", "");
    const parsedTime = formatDate(timeText);
    return { time: parsedTime, eventType: eventText, publicationId };
  }

  const rows = React.useMemo(() => {
    if (!currentUser || !currentUser.events) return [];
    return currentUser.events.map((event) => {
      return createData(
        event.timestamp,
        event.event_type,
        event.publication_id
      );
    });
  }, [currentUser]);

  return (
    <DashboardLayout>
      <PageContainer>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {selectedImagePreview && (
                <ImagePreviewModal
                  image={selectedImagePreview}
                  modalTitle="Modificar foto de perfil"
                  onClose={handleImageUpload}
                />
              )}
              <div
                style={{
                  position: "relative",
                }}
              >
                <Avatar
                  src={currentUser?.pic_path || ImageNotFound}
                  alt="Foto de perfil"
                  sx={{
                    height: "240px",
                    width: "100%",
                    borderRadius: "50%",
                    border: (theme: Theme) =>
                      `1px solid ${theme.palette.primary.light}`,
                  }}
                />
                <label
                  title="Modificar foto de perfil"
                  style={{
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    bottom: "-2%",
                    right: "-2%",
                    zIndex: 1,
                    borderRadius: "50%",
                  }}
                >
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageSelection}
                  />
                  <IconButton
                    aria-label="Modificar foto de perfil"
                    component="span"
                    sx={{
                      color: "#fff",
                      bgcolor: "primary.main",
                      "&:hover, &:active": {
                        bgcolor: "primary.main",
                      },
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
              <div>
                <Typography fontWeight="bold">
                  {`${currentUser?.names}
                  ${currentUser?.surnames}`}
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormWrapper onSubmit={formik.handleSubmit}>
              <TextInput
                id="address"
                name="address"
                label="Dirección"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
              <TextInput
                id="province"
                name="province"
                label="Provincia"
                value={formik.values.province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.province && Boolean(formik.errors.province)
                }
                helperText={formik.touched.province && formik.errors.province}
              />
              <TextInput
                id="city"
                name="city"
                label="Ciudad"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
              <TextInput
                id="postal_code"
                name="postal_code"
                label="Código Postal"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.postal_code &&
                  Boolean(formik.errors.postal_code)
                }
                helperText={
                  formik.touched.postal_code && formik.errors.postal_code
                }
              />
              <TextInput
                id="phone_number"
                name="phone_number"
                label="Teléfono"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone_number &&
                  Boolean(formik.errors.phone_number)
                }
                helperText={
                  formik.touched.phone_number && formik.errors.phone_number
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <CustomButton
                  disabled={!formik.dirty}
                  onClick={formik.handleReset}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  Guardar
                </CustomButton>
              </Box>
            </FormWrapper>
          </Grid>
          <Grid item xs={12} className="spacing-sm">
            <SectionHeader>Historial de actividad</SectionHeader>
            {rows.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="Historial de actividad"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Horario</TableCell>
                      <TableCell>Evento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        onClick={() => {
                          history.push(
                            `/dashboard/publicaciones/${row.publicationId}`
                          );
                        }}
                        key={row.time}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.eventType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div>No se encontraron eventos.</div>
            )}
          </Grid>
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Profile;
