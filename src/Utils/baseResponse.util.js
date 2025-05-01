// Fungsi untuk membuat response API standar
module.exports = (res, success, statusCode, message, payload = null) => {
    return res.status(statusCode).json({
      success,      // true atau false
      message,      // pesan sukses atau error
      payload       // data atau null
    });
  };
  