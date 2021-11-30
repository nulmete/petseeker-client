import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { formatDate } from "../../utils/formatDate";

interface Props {
  isOwner: boolean;
  authorName: string;
  date: string;
  content: string;
}

const Comment: React.FC<Props> = ({ isOwner, authorName, date, content }) => {
  return (
    <Paper variant="outlined" sx={{ padding: 2, bgcolor: "secondary.main" }}>
      <Grid container spacing={1}>
        <Grid item container xs={12} alignItems="center">
          <Grid item>
            <Typography fontWeight="700">{authorName}</Typography>
          </Grid>
          {isOwner && (
            <Grid item sx={{ marginLeft: "8px", color: "primary.main" }}>
              <Typography>Dueño</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="caption">
              {formatDate(date || "2021-11-23T23:50:24.494+00:00")}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography>{content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Comment;
