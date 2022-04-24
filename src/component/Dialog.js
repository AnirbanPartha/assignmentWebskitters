import React from "react";
import { Typography, DialogTitle, DialogContent, Dialog } from "@mui/material";

const DialogBox = ({ title, children, openPopup, handleClose }) => {
  return (
    <Dialog
      // classes={{ paper: classes.dialogWrapper }}
      open={openPopup}
      onClose={handleClose}
      maxWidth="xl"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll={"paper"}
    >
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>{children}</DialogContent>
    </Dialog>
  );
};

export default DialogBox;
