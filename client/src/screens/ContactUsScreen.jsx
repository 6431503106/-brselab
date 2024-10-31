import { useState } from "react";
import { contactUs } from "../../../server/config/index2.js";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const ContactUs = () => {
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promise = contactUs({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
  
      await toast.promise(promise, {
        pending: "Sending...",
        success: {
          render: () => {
            setFormData({ ...formData, message: "" });
            setTimeout(() => {
              window.location.reload();  // Force a full page reload after successful submission
            }, 500); // Adding a slight delay to ensure the toast completes
            return "Message sent successfully.";
          }
        },
        error: "Invalid Email address or User name."
      });
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };  

  return (
    <div className="flex flex-col justify-center w-4/5 max-w-2xl mx-auto my-5 text-gray-700 contactus">
      <div className="heading mb-4">
        <h1 className="text-center font-medium text-2xl">Request From</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="form-control">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="form-control">
          <label htmlFor="email" className="block text-sm text-gray-700"><strong>Email: </strong><em>We will reply to the email you entered.</em></label>
          <input
            type="email"
            placeholder=" lamduan mail address."
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="form-control">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="6"
            placeholder="Try to request something"
            required
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md mx-auto">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default ContactUs;