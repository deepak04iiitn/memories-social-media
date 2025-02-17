import React , { useState } from 'react';
import { Avatar , Button , Paper , Grid , Typography , Container } from '@material-ui/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { signin , signup } from '../../actions/auth';

const initialState = {firstName: '',lastName : '',email :'',password:'',confirmPassword:'',}

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup , setIsSignup] = useState(false);
    const [ formData , setFormData ] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {

        e.preventDefault();

        if(isSignup){
            dispatch(signup(formData , navigate))
        } else {
            dispatch(signin(formData , navigate))
        }
    };

    const handleChange = (e) => {

        setFormData( { ...formData , [e.target.name]: e.target.value });

    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const googleSuccess = async (res) => {
        console.log(res)
        const result = jwtDecode(res.credential);

        try {
            dispatch({ type: 'AUTH' , data: { result } });

            navigate('/');
            
        } catch (error) {
            console.log(error);
        }
    };

    const googleFailure = (error) => {
        console.log(error);
        console.log('Google Sign In was unsuccessfull. Try Again Later!')
    };

  return (
    <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />

                            </>
                        )
                    }

                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                    { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                </Grid>
                <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                    { isSignup ? "Sign Up" : "Sign In" }
                </Button>
                <GoogleOAuthProvider clientId='682527979530-dcqne1h5cq2k4c8ps5tcf81rhs3r8fus.apps.googleusercontent.com'>

                    <GoogleLogin 
                    
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                </GoogleOAuthProvider>
        
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            { isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up" }
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth;
