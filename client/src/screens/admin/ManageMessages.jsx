import React, { useEffect, useState } from "react";
import { getMessages, handleMessages } from "../../../../server/config/index2.js";
import { toast } from 'react-toastify';

const Modal = ({ title, show, onClose, isLarge, children }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? "block" : "hidden"}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg ${isLarge ? "w-full max-w-3xl" : "w-full max-w-md"}`}>
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const ManageMessages = () => {
  const [messages, setMessages] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data?.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (action) => {
    const promise = handleMessages({
      action: action,
      _id: selectedMessage._id,
      replyMessage: replyMessage,
    });
  
    toast.promise(
      promise,
      {
        pending: "Sending...",
        success: {
          render: () => {
            // Assuming `refetch` is a function to refresh the messages list
            fetchMessages();
  
            // Assuming `closeModal` is a function to handle closing modals
            setShowReadModal(false);
            setShowReplyModal(false);
            setMessages(prevState =>
              prevState.filter(item => item._id !== selectedMessage._id)
            );
            setReplyMessage("");
  
            return "Your message was sent successfully.";
          }
        },
        error: {
          render: ({ data }) => {
            return data.message || "Something went wrong!";
          }
        }
      }
    );
  };
  

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <div className="content-wrapper">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      </div>
      <div className="content-menu">

      <span className="text-gray-600 mb-4">List of all unread messages</span>
      </div>
      <div className="content-table overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-2 px-4 text-left">No.</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages?.map((message, index) => (
              <tr key={message._id} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{message?.name}</td>
                <td className="py-2 px-4">{message?.email}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowReadModal(true);
                      }}
                    >
                      Read
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowReplyModal(true);
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* READ MODAL */}
      <Modal
        title="Message Details"
        show={showReadModal}
        onClose={() => setShowReadModal(false)}
      >
        <h4 className="text-lg font-semibold mb-4">
          From {selectedMessage?.name} &lt;{selectedMessage?.email}&gt;
        </h4>
        <p className="mb-4">Message: {selectedMessage?.message}</p>

        <div className="flex space-x-2">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleSubmit("read")}
          >
            Mark as Read
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShowReadModal(false);
              setShowReplyModal(true);
            }}
          >
            Reply
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowReadModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* REPLY MODAL */}
      <Modal
        title="Reply Message"
        show={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        isLarge
      >
        <textarea
          name="reply"
          id="reply"
          cols="30"
          rows="6"
          placeholder="Enter your reply here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          required
        ></textarea>

        <div className="flex space-x-2 mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            type="button"
            onClick={() => handleSubmit("reply")}
          >
            SEND
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowReplyModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageMessages;