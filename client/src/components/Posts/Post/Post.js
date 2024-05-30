import React, {useState} from 'react'
import { Card , CardActions , CardContent , CardMedia , Button , Typography , ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt.js';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined.js'
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

import { deletePost , likePost } from '../../../actions/posts';

import useStyles from './styles';

const Post = ({ post , setCurrentId}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likeCount || []);

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    const navigate = useNavigate();

    const hasLikedPost = likes.find((like) => like === (user?.result?.googleId || user?.result?._id));

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if(hasLikedPost){
            setLikes(likes.filter((id) => id !== (user?.result?.googleId || user?.result?._id)))
        } else {
            setLikes([...likes,(user?.result?.googleId || user?.result?._id)])
        }
    }

    const openPost = () => {
        navigate(`/posts/${post._id}`)
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant='h6'>{post.name}</Typography>
                    {/* says 5sec ago 2 weeks ago etc */}
                    <Typography variant='h6'>{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <div className={classes.overlay2}>
                        <Button style={{ color: 'white' }} size='small' onClick={() => { setCurrentId(post._id) }}>
                            <MoreHorizIcon fontSize='default' />
                        </Button>
                    </div>
                )}
                <div className={classes.details}>
                    <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
                </div>
                <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
                <CardContent>
                    <Typography variant='body2' color='textSecondary' component="p" gutterBottom>{post.message}</Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={classes.cardActions}>
                <Button size='small' color='primary' disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (

                    <Button size='small' color='primary' onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize='small' />
                        Delete
                    </Button>
                )}
            </CardActions>

        </Card>
    )
}

export default Post;