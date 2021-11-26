import React from "react";
import { Grid, Typography } from "@mui/material";

interface Props {
  author: string;
  date: string;
  content: string;
}

const Comment: React.FC<Props> = ({ author, date, content }) => {
  return (
    <Grid container spacing={1}>
      <Grid item container spacing={1} xs={12} alignItems="center">
        <Grid item>
          <Typography fontWeight="700">{author || "Autor"}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle2">
            {date || "2021-11-23T23:50:24.494+00:00"}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography>{content || "Some content."}</Typography>
      </Grid>
    </Grid>
  );
};

export default Comment;
