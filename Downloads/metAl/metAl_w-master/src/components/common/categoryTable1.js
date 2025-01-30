import React, { useEffect, useState } from "react";
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
//import Image from 'mui-image' module not found ( it is not even being used )
//import avatar from '../../assets/Icons/avatar.png'
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Link, useHistory } from "react-router-dom";
//import HeaderTables1 from "./HeaderTables1";
import "./categoryTable1.css";
import { Pagination } from "@mui/material";

const useStyles = makeStyles({
  table: {

    width: '48%',
    border: "2px solid transparent",
marginRight:'4px'

  },
  colorOrange: {
    color: "#fe7a15 !important",
  },
  container: {
    marginTop: "2rem",
    border: "none",
    display:'flex'



  },
  container2: {

    border: "none",


  },
});

const CommentsTable = ({ commentLists, latestData }) => {
  const history = useHistory();
  const classes = useStyles();
  const opencomment = (id) => {
    history.push(`/forum/${id}`);
    console.log(id);
   
  };
  const [i,setI]=useState(0)
  const tags=["red","pink","yellow","lightblue","grey","orange","#6C3483","#76D7C4","#196F3D"]
  useEffect(()=>{
    
console.log("m")

  },[])
  

  return (
    <Box backgroundColor="red" >
      <div className="breadcrumbContainer">
      <Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" className="linkStyle" onClick={()=>history.push("/forum-front1/forums") } >
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
   { /*  <HeaderTables1 />*/}
      <Box marginLeft='1%'>

        <TableContainer className={classes.container} component={Paper}  >
          <Table className={classes.table}>
            <TableHead >
              <TableRow style={{ borderBottom: '3px solid lightgray', borderLeft: "none"}} >
                <TableCell width="75%" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '0.7rem' }}>Topics</TableCell>
                <TableCell align="center" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '0.7rem' }}>Latest</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {commentLists.length>0 && commentLists.map((comment, index) => (
                <TableRow key={comment._id}>
                  <TableCell style={{ borderLeft: `solid 7px ${comment.color}` }}>
                    <Box onClick={() => opencomment(comment._id)} >
                    
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      style={{ cursor: "pointer" }}
                      

                    >
                      <Typography variant="h4">{comment.name}</Typography>
                      <Typography variant="body1">{comment.description}</Typography>
                      <Box display="flex" flexDirection="row" alignItems="center">
                    {comment.forumSubcategories.map((tag,key) => (
                          <>
                            <span
                              style={{
                                backgroundColor: tags[key%9],
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
                              {tag.name}
                            </span>
                          </>
                        ))}
                      </Box>
                    </Box>
                    </Box>
                  </TableCell>
                
                  <TableCell align="center" ><div style={{ color: "lightgray", fontWeight: "600" }} >1/week</div></TableCell>
                </TableRow>


              ))}




            </TableBody>
          </Table>

          <Table className={classes.table}>
            <TableHead >
            <TableRow style={{ borderBottom: '3px solid lightgray', borderLeft: "none" }} >
                <TableCell width="80%" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '0.7rem' }}>Topics</TableCell>
                <TableCell width="5%" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '0.7rem' }}>Views</TableCell>
                <TableCell  width="15%" style={{ color: "#a9a9a9", fontWeight: '600', fontSize: '0.7rem' }}>Replies</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
            {latestData.length>0 && latestData.map((comment,key) => (
                
                   

              <TableRow>
              <TableCell  >

                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" minHeight='40px' height='fit-content' >
                    <img src={comment.attachments[0] || "/assets/img/user/user-12.jpg"} className='avatar1' />
                   
                  <Box width="90%" >
                      <div className='titre1'>{comment.title}</div>
                      <div   style={{display:"flex",alignItems:"center" }}>
                      <div
                            style={{
                              width: "9px",
                              height: "9px",
                              backgroundColor: tags[key%9],
                            }}
                          ></div>
                                <span
                            style={{
                              marginLeft: ".25rem",
                              marginRight: ".5rem",
                            }}
                          >
                          {comment.narrative}
                          </span>
                          </div>
                    </Box>
                 
                  
                </Box>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
              <div  >
                      <div className='week1'>0</div>
                      <span className='week1'>Jun 17</span>
                    </div>
              </TableCell>
            </TableRow>
          
                          
          ))         
             }





             
                            
                     
               
               
                
                           
                         
                
             


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
