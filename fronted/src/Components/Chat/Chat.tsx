import React, {useEffect, useRef, useState} from 'react';
import {ChatMessage, WsMessage} from "../../Types.ts";
import {useAppSelector} from "../../app/hooks.ts";
import {userState} from "../Users/UsersSlice.ts";

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const ws = useRef<WebSocket | null>(null);
    const [messageText, setMessageText] = useState("");
    const user = useAppSelector(userState);



    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');
        if ("onopen" in ws.current) {
            ws.current.onopen = () => {
                ws.current!.send(JSON.stringify({
                    type:"LOGIN",
                    payload:user.token,
                }))
            };
        }

        if ("onmessage" in ws.current) {
            ws.current.onmessage = event => {
                const decodedMessage = JSON.parse(event.data) as WsMessage;

                if (decodedMessage.type === 'NEW_MESSAGE') {
                    setMessages((prevMessages) => [...prevMessages, decodedMessage.payload]);
                }
                if (decodedMessage.type === 'LAST_MESSAGES') {
                    setMessages(decodedMessage.payload);
                }
                if (decodedMessage.type === "ERROR") {
                    window.alert(decodedMessage.payload);
                }
            };
        }

        if ("onclose" in ws.current) {
            ws.current.onclose = () => console.log("ws closed");
        }

        return () => {
            ws.current?.close();
        }

    }, []);





    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            window.alert("Вы должны быть авторизованы для отправки сообщений");
            return;
        }
        if (!ws.current) return;
        if ("send" in ws.current) {
            ws.current.send(JSON.stringify({
                type: 'SET_MESSAGE',
                payload: messageText
            }));
        }
    };

    const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };



    return (
        <div className='container-fluid mt-5'>
            <div className="d-flex justify-content-center" style={{height: "580px"}}>

                <div className="me-5">
                    <h4>Online</h4>
                    <div className="border" style={{padding: "18px", height: "500px"}}>
                            <div>
                                {
                                    user ? (
                                        <p style={{
                                            borderBottom: "1px solid grey",
                                            paddingBottom: "2px"
                                        }}>{user.username}</p>
                                    ) : (
                                        <p>there is not users</p>
                                    )
                                }

                            </div>

                    </div>
                </div>


                <div className="d-flex  flex-column">
                    <h4>Chat</h4>

                    <div className="d-flex border ps-3" style={{height: "500px", width: "400px", overflowY: "auto"}}>
                        <div className="d-flex flex-column justify-content-end">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    <p className="m-0"><b>{message.username}: </b>
                                        {message.text} <span style={{fontSize: "10px"}}>{message.createdAt}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex mt-auto">
                        <form onSubmit={sendMessage}>
                            <input
                                type="text"
                                name="username"
                                value={messageText}
                                onChange={changeMessage}
                                required
                            />
                            <button type="submit" className='btn btn-dark'>send</button>
                        </form>
                    </div>


                </div>


            </div>
        </div>

    );
};

export default Chat;