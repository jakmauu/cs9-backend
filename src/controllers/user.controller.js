const userRepository = require('../repositories/user.repository');
const baseResponse = require('../Utils/baseResponse.util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Gunakan req.body, bukan req.query

        // Validasi input
        if (!email || !password) {
            return baseResponse(res, false, 400, 'Email dan password wajib diisi', null);
        }

        // Cari pengguna berdasarkan email
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, 'User tidak ditemukan', null);
        }

        // Bandingkan password yang dimasukkan dengan hash yang tersimpan di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 401, 'Password salah', null);
        }

        // Jika password cocok, buat token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        // Hapus password dari objek user sebelum dikirim ke client
        const userResponse = { ...user };
        delete userResponse.password;

        return baseResponse(res, true, 200, 'Login berhasil', { user: userResponse, token });
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Terjadi kesalahan saat login', null);
    }
};

// GET BY EMAIL
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) return baseResponse(res, false, 404, 'User not found');
        return baseResponse(res, true, 200, 'User found', user);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to retrieve user');
    }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
    const { id, name, email, password } = req.body;
    if (!id || !name || !email || !password) {
        return baseResponse(res, false, 400, 'All fields are required');
    }
    try {
        const updatedUser = await userRepository.updateUser(id, name, email, password);
        if (!updatedUser) return baseResponse(res, false, 404, 'User not found');
        return baseResponse(res, true, 200, 'User updated successfully', updatedUser);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to update user');
    }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await userRepository.deleteUser(id);
        if (!deletedUser) return baseResponse(res, false, 404, 'User not found');
        return baseResponse(res, true, 200, 'User deleted successfully');
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to delete user');
    }
};

// Fungsi validasi dengan regex
const validateUserInput = (username, email, password) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Username: 3-20 karakter, hanya huruf, angka, dan underscore
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format email valid
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Min 8 karakter, kombinasi huruf dan angka

    if (!usernameRegex.test(username)) return { valid: false, message: "Username tidak valid" };
    if (!emailRegex.test(email)) return { valid: false, message: "Email tidak valid" };
    if (!passwordRegex.test(password)) return { valid: false, message: "Password harus minimal 8 karakter dengan kombinasi huruf dan angka" };

    return { valid: true };
};

// **REGISTER USER**
exports.registerUser = async (req, res) => {
    try {
        console.log('Data yang diterima:', req.body);
        
        // Ambil data dari body JSON (sesuai dengan yang dikirim dari frontend)
        const { username, email, password } = req.body;
        
        // Validasi input
        if (!username || !email || !password) {
            return baseResponse(res, false, 400, 'Username, email, dan password wajib diisi', null);
        }
        
        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, 'Email tidak valid', null);
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Periksa apakah user dengan email tersebut sudah ada
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 409, 'Email sudah digunakan', null);
        }

        // Simpan user ke database - PASTIKAN parameter sesuai dengan yang diharapkan oleh repository
        const newUser = await userRepository.registerUser(username, email, hashedPassword);

        // Hapus password dari response
        if (newUser && newUser.password) {
            delete newUser.password;
        }

        return baseResponse(res, true, 201, "User berhasil didaftarkan", newUser);
    } catch (error) {
        console.error('Error saat registrasi:', error);
        return baseResponse(res, false, 500, "Terjadi kesalahan saat registrasi", null);
    }
};


// **UPDATE USER**
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { id } = req.params;

        // Validasi regex
        const validation = validateUserInput(username, email, password);
        if (!validation.valid) {
            return baseResponse(res, false, 400, validation.message, null);
        }

        // Hash password baru jika ada perubahan
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update data user
        const updatedUser = await userRepository.updateUser(id, username, email, hashedPassword);

        return baseResponse(res, true, 200, "User berhasil diperbarui", updatedUser);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Terjadi kesalahan saat memperbarui user", null);
    }
};


const SECRET_KEY = process.env.JWT_SECRET || 'rahasia-jwt-shopeasy';

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Gunakan req.body, bukan req.query

        // Validasi input
        if (!email || !password) {
            return baseResponse(res, false, 400, 'Email dan password wajib diisi', null);
        }

        // Cari pengguna berdasarkan email
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, 'User tidak ditemukan', null);
        }

        // Bandingkan password yang dimasukkan dengan hash yang tersimpan di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 401, 'Password salah', null);
        }

        // Jika password cocok, buat token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        // Hapus password dari objek user sebelum dikirim ke client
        const userResponse = { ...user };
        delete userResponse.password;

        return baseResponse(res, true, 200, 'Login berhasil', { user: userResponse, token });
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Terjadi kesalahan saat login', null);
    }
};

exports.topUpUser = async (req, res) => {
  try {
    // Gunakan req.body alih-alih req.query
    const { id, amount } = req.body;

    // Validasi
    if (!id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'ID dan jumlah saldo wajib diisi'
      });
    }

    const amountInt = parseInt(amount);
    if (isNaN(amountInt) || amountInt <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah saldo harus berupa angka positif'
      });
    }

    // Ambil data user dan update saldo
    const user = await userRepository.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const newBalance = user.balance + amountInt;
    const updatedUser = await userRepository.updateUserBalance(id, newBalance);

    return res.status(200).json({
      success: true,
      message: 'Saldo berhasil ditambahkan',
      payload: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat top-up'
    });
  }
};

// Tambahkan fungsi ini di user controller
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    return baseResponse(res, true, 200, 'Users retrieved successfully', users);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to retrieve users', null);
  }
};

// Update fungsi directLogin untuk menerima permintaan dengan ID saja
exports.directLogin = async (req, res) => {
    try {
        const { email, id } = req.body;

        // Pastikan ID ada
        if (!id) {
            return baseResponse(res, false, 400, 'ID wajib diisi', null);
        }

        // Cari pengguna berdasarkan ID
        const user = await userRepository.getUserById(id);
        
        if (!user) {
            return baseResponse(res, false, 404, 'User tidak ditemukan', null);
        }

        // Verifikasi email jika disediakan (opsional)
        if (email && user.email !== email) {
            return baseResponse(res, false, 401, 'Email tidak sesuai dengan ID', null);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        // Hapus password dari objek user
        const userResponse = { ...user };
        delete userResponse.password;

        return baseResponse(res, true, 200, 'Login berhasil', { user: userResponse, token });
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Terjadi kesalahan saat login', null);
    }
};

// Update balance user (can add or subtract)
exports.updateBalance = async (req, res) => {
  try {
    const { id, amount } = req.body;
    
    if (!id || amount === undefined) {
      return baseResponse(res, false, 400, 'ID and amount are required', null);
    }
    
    // Get user data
    const user = await userRepository.getUserById(id);
    if (!user) {
      return baseResponse(res, false, 404, 'User not found', null);
    }
    
    // Calculate new balance
    const newBalance = user.balance + parseInt(amount);
    
    // Check if balance is sufficient for deduction
    if (amount < 0 && newBalance < 0) {
      return baseResponse(res, false, 400, 'Insufficient balance', null);
    }
    
    // Update user balance
    const updatedUser = await userRepository.updateUserBalance(id, newBalance);
    
    // Remove password from response
    const userResponse = { ...updatedUser };
    delete userResponse.password;
    
    return baseResponse(res, true, 200, 'Balance updated successfully', { user: userResponse });
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to update balance', null);
  }
};

