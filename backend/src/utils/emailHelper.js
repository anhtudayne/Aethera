import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const hasEmailConfig =
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS;

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  : null;

export const sendCourseRejectionEmail = async (
  instructorEmail,
  courseName,
  reasons
) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'courseRejection.hbs'
    );

    let templateSource;

    if (fs.existsSync(templatePath)) {
      templateSource = fs.readFileSync(templatePath, 'utf8');
    } else {
      templateSource = `
        <h2>Course Revision Required: {{courseName}}</h2>

        <p>Hello,</p>

        <p>
          We have reviewed your course <strong>{{courseName}}</strong>.
          Before it can be approved, please address the following issues:
        </p>

        <ul>
          {{#each reasons}}
          <li style="margin-bottom: 12px;">
            <strong>{{this.label}}</strong><br>
            <span>{{this.description}}</span>
          </li>
          {{/each}}
        </ul>

        <p>
          Once the necessary changes have been made, please log in to the instructor dashboard and resubmit your course for review.
        </p>

        <p>
          Best regards,<br>
          Aethera Team
        </p>
      `;
    }

    const template = handlebars.compile(templateSource);

    const htmlToSend = template({
      courseName,
      reasons
    });

    const mailOptions = {
      from: `"Aethera Admin" <${process.env.EMAIL_USER}>`,
      to: instructorEmail,
      subject: `[Aethera] Course Revision Required: ${courseName}`,
      html: htmlToSend
    };

    if (hasEmailConfig) {
      await transporter.sendMail(mailOptions);

      console.log(
        `Course rejection email sent successfully to ${instructorEmail}`
      );
    } else {
      console.log(
        `[EMAIL SIMULATION] Course rejection email to ${instructorEmail}`
      );
      console.log(htmlToSend);
    }

    return true;
  } catch (error) {
    console.error(
      `Failed to send course rejection email to ${instructorEmail}:`,
      error
    );

    throw error;
  }
};