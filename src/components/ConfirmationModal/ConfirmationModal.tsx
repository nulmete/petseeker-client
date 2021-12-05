import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  title,
  children,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={Boolean(onConfirm)}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent id="alert-dialog-description">{children}</DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {Boolean(onClose) && <Button onClick={onClose}>Cancelar</Button>}
        {Boolean(onConfirm) && (
          <Button onClick={onConfirm} autoFocus>
            Confirmar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
