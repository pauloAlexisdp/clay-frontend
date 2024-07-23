import React, { useState, useEffect, useCallback,useLayoutEffect } from 'react'; 
import axios from 'axios'; 
import {
  Container, Typography, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Edit, Delete, Edit as EditIcon } from '@mui/icons-material';
import './App.css';

function App() {
 
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ section: '', text: '' });
  const [editSection, setEditSection] = useState({ section: '', text: '' });
  const [locale, setLocale] = useState('en');
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [openTitleEdit, setOpenTitleEdit] = useState(false);
  const [ buttonAddFields, setuttonAddFields] = useState({});


  const fetchSections = useCallback(async () => {
    try {
    
      const res = await axios.get('http://localhost:3900/api/page', { params: { locale } });
      console.log(res.data.page.home); 
      setSections(res.data.page.home.sections || []);
      setPageTitle(res.data.page.home.title); 
    } catch (error) {
      alert('Error fetching sections: ' + (error.response?.data?.message || error.message));
    }
  }, [locale]);

  useLayoutEffect(() => {
    fetchSections();
  }, [fetchSections]);


  const addSection = async () => {
    try {
     
      const res = await axios.post('http://localhost:3900/api/page/add-section', { ...newSection, locale });
      const addedSection = res.data.section || { section: newSection.section, text: newSection.text };
      setSections((prevSections) => [...prevSections, addedSection]);
      setNewSection({ section: '', text: '' });
      handleCloseAdd();

    } catch (error) {
      alert('Error adding section: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateSection = async () => {
    try {
    
      const res = await axios.put('http://localhost:3900/api/page/edit-section', { locale, section: editSection.section, text: editSection.text });
      setSections((prevSections) => prevSections.map((section) =>
        section.section === editSection.section ? { ...section, text: editSection.text } : section
      )); 
      handleCloseEdit();
    } catch (error) {
      alert('Error updating section: ' + (error.response?.data?.message || error.message));
    }
  };


  const deleteSection = async (section) => {
    try {
     
      const res = await axios.post('http://localhost:3900/api/page/delete-section', { locale, section });
      setSections((prevSections) => prevSections.filter((sec) => sec.section !== section)); 
    } catch (error) {
      alert('Error deleting section: ' + (error.response?.data?.message || error.message));
    }
  };


  const handleClickOpenAdd = () => {
    
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickOpenEdit = (section) => {
    setEditSection(section);
    setOpenEdit(true);
  };


  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenTitleEdit = () => {
    setNewTitle(pageTitle);
    setOpenTitleEdit(true);
  };

  
  const handleCloseTitleEdit = () => {
    setOpenTitleEdit(false);
  };


  const handleTitleChange = (event) => {
    setNewTitle(event.target.value); 
  };


  const saveTitle = async () => {
    try {
      await axios.put('http://localhost:3900/api/page/edit-title', { locale, title: newTitle });
      setPageTitle(newTitle);
      handleCloseTitleEdit();
    } catch (error) {
      alert('Error updating title: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="container"> 
      <div className="header"> 
        <Typography variant="h4" className="title">
          {pageTitle}
          <IconButton onClick={handleClickOpenTitleEdit}> 
            <EditIcon />
          </IconButton>
        </Typography>
        <Select value={locale} onChange={(e) => setLocale(e.target.value)} displayEmpty className="locale-select"> {/* Selector de locale */}
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="fr">Frances</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={handleClickOpenAdd} className="add-button">
          Add
        </Button>
      </div>
      <TableContainer component={Paper} className="table-container"> 
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Section</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Actions</TableCell>
          
            </TableRow>
          </TableHead>
          <TableBody>
            {sections && sections.map((sectionItem, index) => ( 
              <TableRow key={index}>
                <TableCell>{sectionItem.section}</TableCell> 
                <TableCell>{sectionItem.text}</TableCell> 
                <TableCell>
                  <IconButton onClick={() => handleClickOpenEdit(sectionItem)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteSection(sectionItem.section)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details for the new section.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Section"
            fullWidth
            value={newSection.section}
            onChange={(e) => setNewSection({ ...newSection, section: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Text"
            fullWidth
            value={newSection.text}
            onChange={(e) => setNewSection({ ...newSection, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={addSection} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the details for the section.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Section"
            fullWidth
            value={editSection.section}
            disabled 
          />
          <TextField
            margin="dense"
            label="Text"
            fullWidth
            value={editSection.text}
            onChange={(e) => setEditSection({ ...editSection, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={updateSection} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTitleEdit} onClose={handleCloseTitleEdit}>
        <DialogTitle>Edit Page Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the page title.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTitle}
            onChange={handleTitleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTitleEdit} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={saveTitle} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <footer className="footer">
        <Typography variant="body2" color="textSecondary" align="center">
          © 2024 CLAY
        </Typography>
      </footer>
    </Container>
  );
}

export default App;
