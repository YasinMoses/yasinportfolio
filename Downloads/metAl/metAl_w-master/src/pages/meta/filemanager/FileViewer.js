import React, { Component } from 'react';
// import logger from 'logging-library';
import FileViewer from 'react-file-viewer-extended';
// import { CustomErrorComponent } from 'custom-error';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@material-ui/icons/Close';
import './fileViewer.scss'
import Slide from '@mui/material/Slide';
import Ticketprofile from '../FileViewer/fileviewer'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  
  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function FilesViewer(props) {
    const [open, setOpen] = React.useState(true);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const file = props.file
    let b  = file.split('.')
    const type = b[b.length-1]

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      props.closeFileViewer()
    };
    
    console.log(type,`https://backend.itransportindex.com/api${file}`)
  return <div>
       <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar style={{backgroundColor:'#2D353C',paddingRight:'0px'}}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              File Viewer
            </Typography>
          </Toolbar>
        </AppBar>
        <FileViewer
            fileType={type}
            filePath={`https://backend.itransportindex.com/api${file}`}
            // errorComponent={CustomErrorComponent}
            onError={(e)=>{console.log(e, 'error in file-viewer')}}
        />  
      </Dialog>
  </div>;
}
