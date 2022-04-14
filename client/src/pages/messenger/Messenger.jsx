import React, { useContext, useState, useEffect, useRef } from 'react';
import "./messenger.css"

import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext'
import { axiosInstance } from '../../config';
import { io } from 'socket.io-client'


const Messenger = () => {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    const { user } = useContext(AuthContext)
    const scrollRef = useRef();
    const socket = useRef()

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })

        })
    }, [])

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", (users) => {
            // console.log(users);
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)));
        })
    }, [user])



    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axiosInstance.get('/conversations/' + user._id)

                // console.log(res);
                setConversations(res.data);

            } catch (error) {
                console.log(error);
            }
        };
        getConversations();
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axiosInstance.get('/message/' + currentChat?._id)
                setMessages(res.data);

            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
    }, [currentChat])

    // console.log(messages);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        };

        const receiverId = currentChat?.members.find(member => member !== user._id);

        if (socket.current) {
            socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId,
                text: newMessage
            });
        }

        try {
            const res = await axiosInstance.post('/message', message);
            setMessages([...messages, res.data])
            setNewMessage("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <Topbar />

            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for Friends" className="chatMenuInput" />

                        {
                            conversations.map((c) => (
                                <div onClick={() => setCurrentChat(c)}>
                                    <Conversation
                                        conversation={c}
                                        currentUser={user}
                                    />
                                </div>

                            ))
                        }
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">

                        {
                            currentChat ? (

                                <>
                                    <div className="chatBoxTop">

                                        {
                                            messages.map(m => (
                                                <div ref={scrollRef}>
                                                    <Message message={m}
                                                        own={m.sender === user._id}
                                                        currentUser={user} />
                                                </div>
                                            ))
                                        }


                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea placeholder='write something...' className="chatMessageInput"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>
                                        <button className="chatSubmitBtn"
                                            onClick={handleSubmit}>Send</button>
                                    </div>
                                </>) : (<span className='noConversationText'>Open a conversation to start a chat.</span>)}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Messenger
