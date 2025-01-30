import React from "react";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  colorOrange: {
    color: "#fe7a15 !important",
  },
});

const CommentsTable = ({ commentLists }) => {
  const history = useHistory();
  const classes = useStyles();
  const opencomment = (id) => {
    history.push(`/forum/${id}`);
    console.log(id);
  };
  
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell width="75%">Topic</TableCell>
            <TableCell align="center">Replies</TableCell>
            <TableCell align="center">Views</TableCell>
            <TableCell align="center">Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commentLists.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  onClick={() => opencomment(comment.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Box>{comment.content}</Box>
                  <Box>
                    <Avatar>A</Avatar>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">
                <p className={classes.colorOrange}>
                  {comment.replyComments.length}
                </p>
              </TableCell>
              <TableCell align="center">
                <p className={classes.colorOrange}>{comment?.stars?.length}</p>
              </TableCell>
              <TableCell align="center">{comment.stars.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommentsTable;
