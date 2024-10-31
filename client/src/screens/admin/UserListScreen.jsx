import React, { useState, useEffect } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import TablePagination from '@mui/material/TablePagination';
import '../../Header.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from "axios"
import Swal from 'sweetalert2'


// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UserListScreen() {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { state } = useLocation();

  useEffect(() => {
    if (state?.refetch) {
      toast.success("Update User successfully");
      refetch();
    }
    if (state?.message) {
      toast.success(state.message);
    }
  }, [state, refetch]);

  const uploadFileHandler = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
  
    setUploading(true);
    try {
      const { data } = await axios.post('/api/admin/import-users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message);
      handleCloseModal();
      refetch(); // Refresh the users list after import
    } catch (error) {
      // Log the error to the console for debugging
      console.error('Error during user import:', error.response || error.message || error);
      
      // Display a user-friendly error message
      toast.error('Error importing users');
    } finally {
      setUploading(false);
    }
  };  

  useEffect(() => {
    if (!isLoading && users) {
      handleSearchFilter();
    }
  }, [keyword, users]);

  useEffect(() => {
    paginate(0);
  }, [filteredUsers]);

  const handleSearchFilter = () => {
    const searchValue = keyword.toLowerCase();
    const filteredUsers = users?.filter(user =>
      user.name.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filteredUsers || []);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginate = pageNumber => setPage(pageNumber);

  const onDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user has borrowing status or not!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,I was Checked it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id).unwrap();
          toast.success("User deleted successfully.");
          refetch();
        } catch (error) {
          toast.error(error?.data?.message || "Error deleting user.");
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your User has been deleted.",
          icon: "success"
        });
      }
    });
    /*if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully.");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Error deleting user.");
      }
    }*/
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    toast.error(error.message);
    return <div>Error loading users.</div>;
  }

  const indexOfLastUser = (page + 1) * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <div className="content-wrapper justify-start sidebar-open">
        <h2 className="text-3xl font-semibold mb-3">Users</h2>
      </div>
      <div className="content-menu flex justify-between mb-2 sidebar-open">
      <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search..User name, Product"
                        className="border border-gray-300 p-2 rounded-lg shadow-sm w-full md:w-60"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                    <button
                        onClick={handleSearchFilter}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                        Search
                    </button>
                </div>
        <div className="flex items-center space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleOpenModal}
          >
            Import Users
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => navigate("/admin/add")}
          >
            Create New User
          </button>
        </div>
      </div>
      <div className="content-table">
        <table className="min-w-full divide-y border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">ID</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Name</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Email</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Status</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user._id}</td>
                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.name}</td>
                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.email}</td>
                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">{user.isAdmin ? "Faculty Member" : "Student"}</td>
                <td className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">
                  <button className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Import Users from CSV
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'block', marginBottom: '20px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={uploadFileHandler}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}