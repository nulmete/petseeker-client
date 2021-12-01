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

const Profile: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      address: currentUser?.address || "",
      province: currentUser?.province || "",
      city: currentUser?.city || "",
      postalCode: currentUser?.postalCode || "",
      phoneNum: currentUser?.phoneNum || "",
    },
    validationSchema: userProfileSchema,
    onSubmit: async (values) => {
      console.log({ currentUser });
      // Also send email, id, uuid, names, surnames, picPath from currentUser
      const { id, user_uuid, names, surnames, email, picPath } = currentUser!;
      const allValues = {
        id,
        user_uuid,
        names,
        surnames,
        email,
        picPath,
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
      // Update user's picPath
      const updatedUser = await UserService.update({
        ...currentUser!,
        picPath: data.secure_url,
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
                  src={currentUser?.picPath || ImageNotFound}
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
                id="postalCode"
                name="postalCode"
                label="Código Postal"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.postalCode && Boolean(formik.errors.postalCode)
                }
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
              />
              <TextInput
                id="phoneNum"
                name="phoneNum"
                label="Teléfono"
                value={formik.values.phoneNum}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phoneNum && Boolean(formik.errors.phoneNum)
                }
                helperText={formik.touched.phoneNum && formik.errors.phoneNum}
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
        </Grid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default Profile;
