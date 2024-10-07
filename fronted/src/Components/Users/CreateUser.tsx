import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks.ts";
import {UserMutation} from "../../Types.ts";
import {createUser} from "./UsersThunk.ts";


const emptyState:UserMutation = {
    username:"",
    password:"",
}

const CreateUser = () => {
    const [newUser, setNewUser] = useState<UserMutation>(emptyState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    const onSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createUser(newUser)).unwrap();
            navigate('/');
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h3 className="mt-5 text-center">Create a account</h3>
            <form onSubmit={onSend}>

                <h5 className="mt-5 text-center">your name</h5>
                <div className="input-group input-group-lg">
                    <input type="text"
                           className="form-control mt-5"
                           aria-label="Sizing example input"
                           aria-describedby="inputGroup-sizing-lg"
                           name="username"
                           id="username"
                           onChange={onChange}
                           value={newUser.username}
                           required
                    />
                </div>



                <h5 className="mt-5 text-center">create a new password</h5>
                <div className="input-group input-group-lg">
                    <input type="text"
                           className="form-control mt-5"
                           aria-label="Sizing example input"
                           aria-describedby="inputGroup-sizing-lg"
                           name="password"
                           id="password"
                           onChange={onChange}
                           value={newUser.password}
                           required
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-danger mt-5 mb-5">Create</button>
                </div>


            </form>
        </div>
    );
};

export default CreateUser;