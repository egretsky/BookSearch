import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { LOGIN_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';
import type { User } from '../interfaces/User';

const LoginForm = ({}: { handleModalClose: () => void }) => {
    const [loginUser] = useMutation(LOGIN_USER);
    const [userFormData, setUserFormData] = useState<User>({ username: '', email: '', password: '', savedBooks: [] });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Handle changes to form input fields
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };
    
    // Handle form submission
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            // Attempt to log in the user with the provided email and password
            const response = await loginUser({
                variables: {
                    email: userFormData.email,
                    password: userFormData.password
                }
            })
            console.log(response);
            
            // Extract the token from the response and log in the user
            const { token } = response.data.loginUser
            Auth.login(token);

        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }
        
        // Reset the form data after submission     
        setUserFormData({
            username: '',
            email: '',
            password: '',
            savedBooks: [],
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your login credentials!
                </Alert>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Your email'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.email && userFormData.password)}
                    type='submit'
                    variant='success'>
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;