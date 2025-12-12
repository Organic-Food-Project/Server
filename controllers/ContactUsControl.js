const { Contact } = require("../modles/ContactUs");
const AppError = require("../utils/AppError");

exports.createContactUs = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      throw new AppError(
        "Please Make Sure To add name, email, subject, message ",
        400
      );
    }
    await Contact.create({
      name,
      email,
      subject,
      message,
    });
    res.status(201).json({ data: "Message Sent Successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.getContactUs = async (req, res, next) => {
  try {
    if (req.user.role != "admin") {
      throw new AppError("You Are Not Allowed", 401);
    }
    const info = await Contact.find();
    res.status(200).json({ info });
  } catch (error) {
    next(error);
  }
};
