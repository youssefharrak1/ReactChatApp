import React, { useEffect, useState } from 'react'
import { listUsers } from './UserListApi';
import { Link } from 'react-router-dom';
import { listRooms } from './RoomListApi';

const UsersList = () => {
    const connected_user = sessionStorage.getItem("username");
    const [users, setUsers] = useState([])
    const [rooms, setRooms] = useState([])
    const getUsers = () => {
        listUsers(
            (users) => {
                console.log("Users fetched successfully:", users);
                const filtred_users = users.filter(user => user.username != connected_user)
                console.log("filtred users", filtred_users);
                setUsers(filtred_users);
            },
            (error) => {
                console.error("Error fetching users:", error);
                
            }
        );
    }
    const getRooms = () => {
        listRooms(
            (rooms) => {
                console.log("Rooms fetched successfully:", rooms);
                setRooms(rooms)
            },
            (error) => {
                console.error("Error fetching users:", error);
            }
        );
    }


    useEffect(() => {
        getUsers();
        getRooms();
    }, []);



    return (
        <div className='flex flex-col gap-4 sticky top-0  shadow-md w-[30%] bg-white'>
            <h3 className='text-xl text-center font-bold sticky top-0  '>List Of Users </h3>
            <ul className='overflow-y-auto flex flex-col gap-2 px-10 py-4 bg-slate-50 w-full'>
                {users.map((user, index) => (
                    <div key={index} className='bg-white py-2 px-3 hover:shadow-md cursor-pointer rounded-md w-full '>
                        <Link to={`/messages/user/${user.user_id}`} >
                            <li>{user.username}</li>
                        </Link>
                    </div>

                ))}
            </ul>

            <h3 className='text-xl font-bold text-center'>List Of Rooms </h3>
            <ul className='flex flex-col gap-2 px-10 py-4 bg-slate-50 w-full'>

                {rooms.map((room, index) => (
                    <div key={index} className='bg-white py-2 px-3 hover:shadow-md cursor-pointer rounded-md '>

                        <Link to={`/messages/room/${room.room_id}`} >
                            <li>{room.name}</li>
                        </Link>
                    </div>
                ))}
            </ul>



        </div>

    );
}

export default UsersList;
