let helper = require('sendgrid').mail;

module.exports = {
    send: function(mail, done) {
        from_email = new helper.Email(mail.from);
        to_email = new helper.Email(mail.to);
        subject = mail.subject;
        content = new helper.Content("text/html", mail.message);
        mail = new helper.Mail(from_email, subject, to_email, content);

        let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        let request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, done(error, response));
    }
};