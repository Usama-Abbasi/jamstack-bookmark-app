  
import React, { useState, useEffect } from 'react'
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import styles from './bookmarkList.module.css';
import Swal from 'sweetalert2';
import {useQuery,useMutation} from '@apollo/client';
import gql from 'graphql-tag';
const deleteBook=gql`
  mutation DeleteATodo($id:String!) {
    deleteBookmark(id:$id){
    name
  }
}
`
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
const BookmarkList=({id,name,url,description})=> {
    const [deleteBookmark] = useMutation(deleteBook)
    return (
        <ul className={styles.list} key={id}>
        <li>
          <div className={styles.title}>
            <h3>{name} </h3>
            <a href={`https://${url}`} target="_blank">{url} </a>
            <p>{description} </p>
          </div>

          <div>
            <Button onClick={()=>{ deleteBookmark({
                                                variables:{
                                                    id:id
                                                },
                                                refetchQueries: [{ query: getBookmarks }]
                                            })
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'A Bookmark is deleted',
                                                showConfirmButton: false,
                                                timer: 1500
                                              })
                                            }}>
              <DeleteIcon />
            </Button>
            {/* <Button onClick={() => updateNote(id, input)}>
              <UpdateIcon />
            </Button> */}
          </div>
        </li>
      </ul>
    )
}
export default BookmarkList