import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BookmarkList from './bookmarksList';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CircularProgress } from '@material-ui/core';
let TodoSchema = yup.object().shape({
    name: yup.string().required('This field is required.'),
    url:yup.string().required('This field is require')
    .matches(
        /((https):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url! https://www.name.domain'
    ),
    description:yup.string().required('This field is required'),
});
const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        width: '100%',
        margin: theme.spacing(2, 0, 3),
    },
}));
const getBookmarks = gql`
  {
    bookmarks{
        id
        name
        url
        description
      }
  }
`

const addBook = gql`
  mutation CreateABookmark($name:String,$url:String,$description:String) {
    addBookmark(name:$name,url:$url,description:$description){
    name
  }
}
`
const Bookmark = () => {
    const { loading, error, data, refetch } = useQuery(getBookmarks);
    const [fetchdata, setFetchData] = React.useState(data);
    const [addBookmark] = useMutation(addBook);
    const classes = useStyles();
    console.log(data);
    if (loading || data === undefined) {
        return <div style={{textAlign:'center'}}><CircularProgress /></div>
    }
    else {
        return (
            <>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Formik
                            initialValues={{
                                name: "",
                                url: "",
                                description: "",
                            }}
                            validationSchema={TodoSchema}
                            onSubmit={(values,{resetForm}) => {
                                
                                resetForm();
                                console.log(values.name,values.url,values.description);
                                addBookmark({ variables: { name: values.name,url:values.url,description:values.description}, refetchQueries: [{ query: getBookmarks }], })
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'A Bookmark is Added',
                                    showConfirmButton: false,
                                    timer: 1500
                                  })
                                
                            }}
                            
                        >
                            {({ errors, handleChange, touched }) => (
                                <Form className={classes.form}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <TextField
                                            style={{marginTop:'8px'}}
                                                autoComplete="name"
                                                name="name"
                                                variant="outlined"
                                                fullWidth
                                                onChange={handleChange}
                                                id="name"
                                                label="Enter Website Name"
                                                autoFocus
                                                helperText={
                                                    <span style={{ color: 'red' }}> {errors.name && touched.name
                                                        ? errors.name
                                                        : null}</span>
                                                }
                                            />
                                        </Grid>
                                        <br/>
                                        <br/>
                                        <Grid item xs={12}>
                                            <TextField
                                            style={{marginTop:'8px'}}
                                                autoComplete="url"
                                                name="url"
                                                variant="outlined"
                                                fullWidth
                                                onChange={handleChange}
                                                id="url"
                                                label="Enter Website Url"
                                                autoFocus
                                                helperText={
                                                    <span style={{ color: 'red' }}> {errors.url && touched.url
                                                        ? errors.url
                                                        : null}</span>
                                                }
                                            />
                                        </Grid>
                                      
                                        
                                      <Grid item xs={12}>
                                            <TextField
                                            style={{marginTop:'8px'}}
                                                autoComplete="description"
                                                name="description"
                                                variant="outlined"
                                                fullWidth
                                                onChange={handleChange}
                                                id="description"
                                                label="Enter Description"
                                                autoFocus
                                                helperText={
                                                    <span style={{ color: 'red' }}> {errors.description && touched.description
                                                        ? errors.description
                                                        : null}</span>
                                                }
                                            />
                                        </Grid>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Add Bookmark
                                </Button>
                                    </Grid>

                                </Form>

                            )}
                        </Formik>
                    </div>

                </Container>
                <Container >
                <Grid md={12} xs={12}>
                    <Accordion style={{background:'#00004b'}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading} style={{color:'white'}}>
                                Bookmarks List
          </Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ display: "block" }}>
                            {data.bookmarks.map((obj) => (
                                <BookmarkList
                                    id={obj.id}
                                    name={obj.name}
                                    url={obj.url}
                                    description={obj.description}
                                  
                                />
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                </Container>
            </>
        )
    }

}
export default Bookmark;