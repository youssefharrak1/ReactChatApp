import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { postMessage } from './MessageApi';
import { getMessage } from './GetMessageApi';
import UsersList from './UsersList';

const Chat = () => {
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
                    "receiverId": id
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
        getMessage(id, token,
            (messages) => {
                const data = messages.messages;
                const messagesedited = data.map(jsonString => {
                    const { senderId, message, timestamp } = JSON.parse(jsonString); // Parse and destructure
                    return { senderId, message, timestamp }; // Return the extracted data
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
    }, [id])

    return (
        <div className='flex flex-row justify-between'>
            <UsersList />

            <div className='flex flex-col justify-between h-screen w-full sticky top-0'>

                <div className=" overflow-y-auto flex flex-grow flex-col gap-2 px-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`chat ${Number(msg.senderId) === Number(id) ? 'chat-start ' : 'chat-end'
                            }`}>
                            <div className={`chat-bubble ${Number(msg.senderId) === Number(id) ? 'bg-slate-300 text-black ' : 'chat-end'} flex flex-col`}>{msg.message} <small>{new Date(msg.timestamp).toLocaleTimeString()}</small></div>
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

export default Chat;
