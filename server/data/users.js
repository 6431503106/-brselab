import bcrypt from "bcryptjs"

const users = [
  {
    name: "John Doe",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Jane Doe",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name:"SIRIKORN KHAMTHAI",
    email:"6431503106@lamduan.mfu.ac.th",
    password: bcrypt.hashSync("6431503106", 10),
    isAdmin:true,
  },
]

export default users
