import nodemailer from 'nodemailer';
import CabRequest from '../models/cabRequest.js';
import fs from 'fs';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getRecentPosts = () => {
  const blogFilesPath = path.resolve(__dirname, '../blogdata');
  try {
    // Get a list of all Markdown files in the directory
    const fileNames = fs.readdirSync(blogFilesPath);

    // Retrieve metadata for each file
    const blogData = fileNames.map((fileName) => {
      const filePath = `${blogFilesPath}/${fileName}`;
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      return {
        metadata: data,
      };
    });

    return blogData;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
};


export const cabRequest = async (req, res) => {

  try {
    const formData = req.body;
    // console.log(formData);

    const resp = await sendEmail(formData);

    if (resp.success) {
      const newUser = new CabRequest({
        name: formData.name,
        head: formData.head,
        phoneno: formData.phoneNo,
        pickup: formData.pickup,
        drop: formData.drop,
        distance: formData.distance,
        pDate: formData.pDate,
        pTime: formData.pTime
      });

      await newUser.save();
      // console.log(formData, "formdata backend");
      res.status(201).send({ message: 'Form data saved and email sent successfully.' });

    } else {
      // If the email was not sent successfully, handle the error or send an appropriate response
      res.status(500).send({ error: 'Failed to send email.' });
    }

  } catch (err) {
    console.error(err);

    res.status(500).send({ error: 'Something went wrong!' });
  }
};


const sendEmail = async (data) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.SMTP_MAIL, // sender address
      to: process.env.TO_MAIL, // list of receivers
      subject: 'New Cab Request for you ', // Subject line
      html: `
      <p>GREETINGS from GoTravelBe</p>
        <p>Hello Charan You Have a New Cab Request</p>
        <p> ------   ----------   ------- </p>
        <p><b>Name:</b> ${data.head}</p>
        <p> ------   ----------   ------- </p>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Phone Number:</b> ${data.phoneNo}</p>
        <p><b>Pickup Location:</b> ${data.pickup}</p>
        <p><b>Drop Location:</b> ${data.drop}</p>
        <p><b>Distance:</b> ${data.distance}</p>
        <p><b>Pickup Date:</b> ${data.pDate}</p>
        <p><b>Pickup Time:</b> ${data.pTime}</p>

      ` // html body
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error sending email');
  }
}

export const allBlogs = async (req, res) => {

  const blogFilesPath = path.resolve(__dirname, '../blogdata');
  // console.log(blogFilesPath,"hiii")

  try {
    const blogData = getRecentPosts();

    res.json(blogData);
    // console.log(blogData,"blogdata")
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}




export const blogPost = async (req, res) => {
  const { slug } = req.params;
  // console.log(slug,"slug")
  const filePath = path.resolve(__dirname, `../BlogData/${slug}.md`);
  // console.log(filePath); // Log the resolved file path
  try {
    // Read and parse the Markdown file using gray-matter
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const blogData = getRecentPosts();

    const blog = {
      metadata: data,
      content: content,
      blogData,
    };
    // console.log(blog)
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}