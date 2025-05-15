import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormPage.css'; 


function FormPage() {
  const [formData, setFormData] = useState({ name: '', email: '', image: '' });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);  // Thêm state để biết đang sửa ai
  const [image, setFile] = useState(null)

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/product/gets');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files)
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("image", image);
    console.log(image);
    console.log(editingId)
    console.log(formData)
    if (editingId) {
      // Nếu đang sửa thì gọi PUT API
      try {
        await axios.put(`http://localhost:3002/product/update/${editingId}`, data);
        setEditingId(null); // reset trạng thái sửa
        setFormData({ name: '', email: '', image: '' });
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // Nếu không thì gọi POST API để thêm mới
      try {
        await axios.post('http://localhost:3002/product/add', formData);
        setFormData({ name: '', email: '', image: '' });
        fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, image: user.image });
    setEditingId(user.id); // Ghi nhớ đang sửa ai
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:3002/product/delete/${id}`);
    fetchUsers();  // Load lại danh sách sau khi xóa
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};


   return (
     <div>
      <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
      <form onSubmit={handleSubmit}>
         <input
           type="text"
          name="name"
         placeholder="Tên sản phẩm"
         value={formData.name}
         onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
           required
        />
           <input
           type="file"
         name="image"
         placeholder="file"
         onChange={handleFileChange}
         
       />  
   

























 


        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm sản phẩm'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', image: '' });
          }}>Hủy sửa</button>
        )}
      </form>

      <h2>Danh sách sản phẩm</h2>
      <table border="1" cellPadding="10" >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
      <tbody>
  {users.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>

      <td>
        {/* Kiểm tra nếu có ảnh */}
        {user.image ? (
          <img src={`http://localhost:3002/${user.image}`} alt={user.name} width="100" />
        ) : (
          <img src="path/to/default-image.jpg" alt="Default" width="100" />
        )}
      </td>
      <td>
        <button onClick={() => handleEdit(user)}>Sửa</button>
        <button onClick={() => handleDelete(user.id)}>Xóa</button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default FormPage;
