import React, {useContext, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {gql, useMutation, useQuery} from "@apollo/client";
import moment from "moment";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import {AuthContext} from "../context/auth-context";
import Card from "../UI/Card";

import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import {Button, TextField, CardActions} from "@mui/material";

import '../App.css'

const SinglePost = () => {
    const params = useParams()
    const navigate = useNavigate()
    const commentInputRef = useRef()
    const [comment, setComment] = useState('')

    const {user} = useContext(AuthContext)
    const postId = params.id

    const {data: {getPost} = {}} = useQuery(FETCH_POST_QUERY, {
        update(){
            setComment('')
            //input框失去焦点 out focus
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        variables: {
            postId,
            body: comment
        }
    })

    const deletePostCallback = () => {
        navigate('/home', {replace:true})
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const {id, body, createdAt, username, comments, commentCount} = getPost
        postMarkup = (
            <div className='single-page-container'>
                <div className='single-page-left'>用户头像</div>
                <div className='single-page-right'>
                    <Card>
                        {username}
                        <br/>
                        {createdAt}
                        <br/>
                        {body}
                        <br/>
                        <CardActions>
                            <LikeButton user={user} post={getPost}/>
                            <Button size="small" as={Link} to={`/post/${id}`}><ForumRoundedIcon/></Button>
                            {commentCount}
                            {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
                        </CardActions>
                    </Card>

                    {user && (<form noValidate autoComplete='off'>
                        <TextField
                            label="Create a comment:"
                            placeholder="Leave your comment.."
                            name="body"
                            type="text"
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            ref={commentInputRef}
                            fullWidth
                            id="body" variant="outlined"/>
                        <br/>
                        <br/>
                        <Button
                            disabled={comment.trim() === ''}
                            onClick={submitComment}
                            type="submit"
                            variant="contained">Submit</Button>
                        <br/>
                    </form>)}
                    <div>
                        {comments && comments.map(comment => (
                            <Card key={comment.id}>
                                {comment.username}
                                <br/>
                                {moment(comment.createdAt).fromNow(true)}
                                <br/>
                                {user && user.username === comment.username && (
                                    <DeleteButton postId={id} commentId={comment.id}/>
                                )}
                                {comment.body}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
        return postMarkup
    }

    return (
        <div>
            {postMarkup}
        </div>
    );
};

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments {
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId) {
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`
export default SinglePost;
