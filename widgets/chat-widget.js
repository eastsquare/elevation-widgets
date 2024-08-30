
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .chatbox {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            height: 600px;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            
        }
  
        .chatbox-header {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
        }
  
        .chatbox-body {
        margin-bottom: auto;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden; 
            padding: 10px;
            
        }
  
        .chatbox-form {
            display: flex;
            gap: 10px;
            padding: 10px;
            border-top: 1px solid #ccc;
        }
  
        .chatbox-input {
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
            width: 100%;
        }
  
        .chatbox-send, .chatbox-minimized {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
  
        .chatbox-minimized {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
  
        .chatbox-close {
            padding: 10px;
            float: right;
        }
  
        .chat-widget-response-message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 20px;
          max-width: 90%;
          background-color: #eaeaea;
          color: #333;
        }
  
        .chat-widget-user-message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 20px;
          max-width: 90%;
          background-color: #007bff;
          color: #fff;
          display: block;
        }
  
        .right {
          display: flex;
          flex-direction: row-reverse;
        }
  
        .left {
          display: flex;
        }
    `;
    document.head.prepend(style);
}

function createChatbox() {
    const uuid = uuidv4();  // Using uuid4 library

    const chatbox = document.createElement('div');
    chatbox.className = 'chatbox';

    const chatboxHeader = document.createElement('div');
    chatboxHeader.className = 'chatbox-header';
    chatboxHeader.innerHTML = `
        <button id="chatbox-close" class='chatbox-close'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
    `;

    const chatboxBody = document.createElement('div');
    chatboxBody.className = 'chatbox-body';

    const chatboxForm = document.createElement('form');
    chatboxForm.className = 'chatbox-form';
    chatboxForm.innerHTML = `
        <input type="text" class="chatbox-input" placeholder="Type a message..." required>
        <button type="submit" class="chatbox-send">Send</button>
    `;

    chatbox.appendChild(chatboxHeader);
    chatbox.appendChild(chatboxBody);
    chatbox.appendChild(chatboxForm);

    const chatboxToggle = document.createElement('button');
    chatboxToggle.id = 'chatbox-toggle';
    chatboxToggle.className = 'chatbox-minimized';
    chatboxToggle.textContent = 'Open Chat';

    document.body.appendChild(chatbox);
    document.body.appendChild(chatboxToggle);
    chatboxBody.style.display = 'block'

    document.getElementById('chatbox-close').addEventListener('click', () => {
        chatbox.style.display = 'none';
        chatboxToggle.style.display = 'block';
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    });

    chatboxToggle.addEventListener('click', () => {
        chatbox.style.display = 'flex';
        chatboxBody.style.display = 'block'
        chatboxToggle.style.display = 'none';
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    });


    let row = document.createElement('div');
    row.className = 'right';

    let responseMessage = document.createElement('div');
    responseMessage.innerText = 'Hello, how can I help you?'
    responseMessage.className = 'chat-widget-response-message';
    row.appendChild(responseMessage);
    chatboxBody.appendChild(row)

    chatboxForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageInput = document.querySelector('.chatbox-input');
        const message = messageInput.value.trim();
        if (message) {
            let row = document.createElement('div');
            row.className = 'left';

            let userMessageElement = document.createElement('div');
            userMessageElement.className = 'chat-widget-user-message';
            userMessageElement.innerText = message;
            row.appendChild(userMessageElement)
            chatboxBody.appendChild(row);

            chatboxBody.scrollTop = chatboxBody.scrollHeight;

            messageInput.value = ''
            try {
                let response = await axios.post(endpoint_url,
                    {
                        message: message,
                        session_uuid: uuid,
                        company_uuid: company_uuid,
                    },
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials': true,
                        },
                    }
                );

                let row = document.createElement('div');
                row.className = 'right';

                let responseMessage = document.createElement('div');
                responseMessage.innerText = response.data
                responseMessage.className = 'chat-widget-response-message';
                row.appendChild(responseMessage);
                chatboxBody.appendChild(row)

                chatboxBody.scrollTop = chatboxBody.scrollHeight;

            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    });
}

injectStyles();

createChatbox();