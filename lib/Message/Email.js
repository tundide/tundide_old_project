let helper = require('sendgrid').mail;

module.exports = {
    send: function(mailbody, done) {
        from_email = new helper.Email(mailbody.from);
        to_email = new helper.Email(mailbody.to);
        subject = mailbody.subject;
        content = new helper.Content("text/html", mailbody.message);
        mail = new helper.Mail(from_email, subject, to_email, content);
        mail.personalizations[0].addSubstitution(
            new helper.Substitution('-userid-', mailbody.userid));
        mail.personalizations[0].addSubstitution(
            new helper.Substitution('-user-', mailbody.name));

        mail.setTemplateId('1f5eef00-edac-47f4-896d-5d3a9866d35b');

        let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        let request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function(error, response) {
            done(error, response);
        });
    }
};