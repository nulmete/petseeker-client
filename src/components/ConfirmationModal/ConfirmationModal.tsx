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
  // content: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<Props> = ({
  title,
  // content,
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
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
