import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import moment from "moment";

import {Card, CardActions, CardContent, Button, Typography} from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';

import {AuthContext} from "../context/auth-context";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

import '../App.css'

export default function PostCard(props) {
    const {user} = useContext(AuthContext);
    const {id, username, createdAt, likeCount, likes, commentCount, body} = props.post
    return (
        <Card  className='post-card' sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {username}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {moment(createdAt).fromNow(true)}
                </Typography>
                <Typography variant="body2">
                    {body}
                    <br />
                </Typography>
            </CardContent>
            <CardActions>
                <LikeButton user={user} post={{id, likes, likeCount}}/>
                {/*<Button size="small">Likes {likeCount}</Button>*/}
                <Button size="small" as={Link} to={`/post/${id}`}><ForumRoundedIcon/></Button>
                {commentCount}
                {user && user.username === username && <DeleteButton postId={id}/>}
            </CardActions>
        </Card>
    );
}
