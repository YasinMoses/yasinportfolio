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
  Typography,
  Breadcrumbs,
} from "@material-ui/core";
//import Image from 'mui-image' module not found (it is not even being used)
//import avatar from '../../assets/Icons/avatar.png'
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Link, useHistory } from "react-router-dom";
import HeaderTables from "./HeaderTables";
import "./categoryTable.css";
import { Pagination } from "@mui/material";

const useStyles = makeStyles({
  table: {

    width: '100%',
    border: "2px solid transparent",


  },
  colorOrange: {
    color: "#fe7a15 !important",
  },
  container: {
    marginTop: "2rem",
    border: "none",



  },
  container2: {

    border: "none",


  },
});

const CommentsTable = ({ commentLists, latestData }) => {
  const history = useHistory();
  const classes = useStyles();
  const opencomment = (id) => {
    console.log(id);
  };

  return (
    <Box backgroundColor="red" >
            <div className="breadcrumbContainer">
      <Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" className="linkStyle" onClick={()=>history.push("/forum-front1/TaskA")} >
  <Typography color="text.primary" und >Forum</Typography>
  </Link>
  <Link
    underline="hover"
    className="linkStyle"
    onClick={()=>history.push("/forum-front1/forums")}
  >
      <Typography color="text.primary" und >Category</Typography>
  </Link>
  <Link
    underline="hover"
    className="linkStyle"
    onClick={()=>history.push("/forum-front1/forums")}
  >
      <Typography color="text.primary" und >Topic</Typography>
  </Link>
</Breadcrumbs>
</div>
      <HeaderTables />
      <Box marginLeft='1%'>

        <TableContainer className={classes.container} component={Paper}  >
          <Table className={classes.table}>
            <TableHead >
              <TableRow style={{ borderBottom: '3px solid lightgray', borderLeft: "none", }} >
                <TableCell width="75%" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '1rem' }}>Category</TableCell>
                <TableCell  align="center" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '1rem' }}>Users</TableCell>
                <TableCell align="center" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '1rem' }}>Topics</TableCell>
                <TableCell align="center" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '1rem' }}>Views</TableCell>
                <TableCell align="center" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '1rem' }}>Replies</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {commentLists.map((comment, index) => (
                <TableRow key={comment.id}>
                  <TableCell style={{ borderLeft: `solid 7px ${comment.color}` }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      style={{ cursor: "pointer" }}
                    >
                      <Typography variant="h4">{comment.title}</Typography>
                      <Typography variant="body1">{comment.conent}</Typography>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        {comment.tags.map((tag) => (
                          <>
                            <span
                              style={{
                                backgroundColor: tag.color,
                                width: "9px",
                                height: "9px",
                              }}
                            ></span>
                            <span
                              style={{
                                marginLeft: ".25rem",
                                marginRight: ".5rem",
                              }}
                            >
                              {tag.title}
                            </span>
                          </>
                        ))}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell style={{ borderLeft: "none", }} >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                    >
                      <Avatar style={{ width: '25px', hight: '20px', marginRight: '5px' }} >A</Avatar>
                      <Avatar style={{ width: '25px', hight: '20px', marginRight: '5px' }} >F</Avatar>
                      <Avatar style={{ width: '25px', hight: '20px', marginRight: '5px' }} >A</Avatar>
                    </Box>
                  </TableCell>
                  <TableCell ><div style={{ color: "#fe7a15", fontWeight: "600" }} > 10</div></TableCell>
                  <TableCell  ><div style={{ color: "#fe7a15", fontWeight: "600" }} >75K</div></TableCell>
                  <TableCell ><div style={{ color: "lightgray", fontWeight: "600" }} >29 min</div></TableCell>
                </TableRow>


              ))}


<TableRow>
                <TableCell >

                  <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" minHeight='70px' height='fit-content' >
                    <div className="person_info" >
                      <img src="/assets/img/user/user-12.jpg" className='avatar' />
                      <div className="username">
                        username
                      </div>
                    </div>
                    <Box width="80%" height='100%' display='flex' justifyContent='space-between' alignItems='center' >
                      <Box width="80%" >
                        <div className='titre'>title</div>
                        <div className='paragraph'>B.  implement the next hear into Forum as well
                          The header with back-button to forum, search-icon and + for create Topic can be taken over from Calendar/Agenda
                        </div>
                      </Box>
                      <Box  >
                        <div className='week'>0</div>
                        <span className='week'>Jun 17</span>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  Views
                </TableCell >
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  Replies
                </TableCell>
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  
                  </TableCell>
                  <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  
                  </TableCell>
              </TableRow>
              <TableRow>
                <TableCell >

                  <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" minHeight='70px' height='fit-content' >
                    <div className="person_info" >
                      <img src="/assets/img/user/user-12.jpg" className='avatar' />
                      <div className="username">
                        username
                      </div>
                    </div>
                    <Box width="80%" height='100%' display='flex' justifyContent='space-between' alignItems='center' >
                      <Box width="80%" >
                        <div className='titre'>title</div>
                        <div className='paragraph'>B.  implement the next hear into Forum as well
                          The header with back-button to forum, search-icon and + for create Topic can be taken over from Calendar/Agenda
                        </div>
                      </Box>
                      <Box  >
                        <div className='week'>0</div>
                        <span className='week'>Jun 17</span>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  Views
                </TableCell >
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  Replies
                </TableCell>
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  
                </TableCell>
                <TableCell style={{ color: "#a9a9a9", fontWeight: '500', fontSize: '1rem' }}>
                  
                  </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>


     


         
          <div className="paginationContainer" >
          <Pagination count={4} color="primary"   />
          </div>

        
      </Box>
    </Box>
  );
};

export default CommentsTable;
