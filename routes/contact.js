const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `[Contact] ${subject}`,
      html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Message:</b><br>${message}</p>`,
    });

    req.flash("success", "Thank you for contacting us! We'll get back soon.");
    res.redirect("/contact");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Try again later.");
    res.redirect("/contact");
  }
});

module.exports = router;