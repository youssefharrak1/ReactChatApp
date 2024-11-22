import React, { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom';
import UsersList from './UsersList';
import { getRoomMessage } from './GetMessageApi';
import { postMessage } from './MessageApi';

const Room = () => {
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const token = sessionStorage.getItem('token');
    const [conversation, setConversation] = useState([])
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [conversation]);

    // Update message state when input changes  
    const handleSubmit = () => {
        if (message.trim() !== "") {
            postMessage(
                {
                    "message": message,
                    "roomId": id
                }, token,
                () => {

                    messages();
                    console.log("Message sent successfully");
                },
                (error) => {
                    console.error("Error sending message:", error);
                }
            );
            setMessage("")
        }


    };

    const messages = () => {
        getRoomMessage(id, token,
            (messages) => {
                const data = messages.messages;
                const messagesedited = data.map(jsonString => {
                    const { senderId, message, timestamp, username } = JSON.parse(jsonString); // Parse and destructure
                    return { senderId, message, timestamp, username }; // Return the extracted data
                });

                setConversation(messagesedited);

            },
            () => {
                console.log("failed")
            }

        );
    }

    useEffect(() => {
        messages();
    }, [])

    return (
        <div className='flex flex-row justify-between'>
            <UsersList />

            <div className='flex flex-col justify-between h-screen w-full sticky top-0'>

                <div className=" overflow-y-auto flex flex-grow flex-col gap-2 px-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`chat ${msg.username !== sessionStorage.getItem('username') ? 'chat-start ' : 'chat-end'}`}>
                            {console.log(msg.username)
                            }
                            <div className={`chat-bubble ${msg.username !== sessionStorage.getItem('username') ? 'bg-slate-300 text-black ' : 'chat-end'} flex flex-col`}> <small className='font-semibold'>{msg.username}</small>{msg.message} <small>{new Date(msg.timestamp).toLocaleTimeString()}</small></div>
                            {index === conversation.length - 1 && <div ref={scrollRef} />}
                        </div>

                    ))}

                </div>
                <div className='flex flex-row justify-between p-7 sticky'>
                    <input className="w-[85%] input input-bordered max-w-[85%]" type="text" name="message" value={message} onChange={(event) => { setMessage(event.target.value); }} placeholder="Type your message" />
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </div>



            </div>

        </div>



    );
};


export default Room
