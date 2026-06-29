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

export const sendCourseSuspensionEmail = async (
  instructorEmail,
  courseName,
  reasons
) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'courseSuspension.hbs'
    );

    let templateSource;

    if (fs.existsSync(templatePath)) {
      templateSource = fs.readFileSync(templatePath, 'utf8');
    } else {
      templateSource = `
        <h2>Course Suspended: {{courseName}}</h2>

        <p>Hello,</p>

        <p>
          We regret to inform you that your course <strong>{{courseName}}</strong> has been suspended from the marketplace due to the following reasons:
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
          Your course is no longer visible to new students. Existing students who have purchased the course may still have access.
        </p>
        <p>
          Please contact support if you believe this is an error or if you wish to appeal this decision.
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
      subject: `[Aethera] Action Required: Course Suspended - ${courseName}`,
      html: htmlToSend
    };

    if (hasEmailConfig) {
      await transporter.sendMail(mailOptions);

      console.log(
        `Course suspension email sent successfully to ${instructorEmail}`
      );
    } else {
      console.log(
        `[EMAIL SIMULATION] Course suspension email to ${instructorEmail}`
      );
      console.log(htmlToSend);
    }

    return true;
  } catch (error) {
    console.error(
      `Failed to send course suspension email to ${instructorEmail}:`,
      error
    );

    throw error;
  }
};

export const sendUserSuspensionEmail = async (
  userEmail,
  userName,
  reason
) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'userSuspension.hbs'
    );

    let templateSource;

    if (fs.existsSync(templatePath)) {
      templateSource = fs.readFileSync(templatePath, 'utf8');
    } else {
      templateSource = `
        <h2>Account Suspended</h2>

        <p>Hello {{userName}},</p>

        <p>
          We regret to inform you that your account on Aethera has been suspended for the following reason:
        </p>

        <div style="background-color: #f9fafb; border-left: 4px solid #f87171; padding: 12px; margin: 16px 0;">
          {{reason}}
        </div>

        <p>
          While your account is suspended, you will not be able to log in or access our services.
        </p>
        <p>
          If you believe this is an error or if you wish to appeal this decision, please contact our support team.
        </p>

        <p>
          Best regards,<br>
          Aethera Team
        </p>
      `;
    }

    const template = handlebars.compile(templateSource);

    const htmlToSend = template({
      userName,
      reason
    });

    const mailOptions = {
      from: `"Aethera Admin" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `[Aethera] Action Required: Account Suspended`,
      html: htmlToSend
    };

    if (hasEmailConfig) {
      await transporter.sendMail(mailOptions);
      console.log(`User suspension email sent successfully to ${userEmail}`);
    } else {
      console.log(`[EMAIL SIMULATION] User suspension email to ${userEmail}`);
      console.log(htmlToSend);
    }

    return true;
  } catch (error) {
    console.error(`Failed to send user suspension email to ${userEmail}:`, error);
    throw error;
  }
};