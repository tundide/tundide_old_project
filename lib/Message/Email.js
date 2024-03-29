let helper = require('sendgrid').mail;

module.exports = {
    signoutConfirmSend: function(mailbody, done) {
        from_email = new helper.Email(mailbody.from);
        to_email = new helper.Email(mailbody.to);
        subject = mailbody.subject;
        content = new helper.Content("text/html", '<p></p>');
        mail = new helper.Mail(from_email, subject, to_email, content);
        mail.personalizations[0].addSubstitution(
            new helper.Substitution('-userid-', mailbody.userid));
        mail.personalizations[0].addSubstitution(
            new helper.Substitution('-user-', mailbody.name));
        mail.personalizations[0].addSubstitution(
            new helper.Substitution('-SITE_URL-', process.env.SITE_URL));

        mail.setTemplateId('0968d15e-cfd7-4a8b-ad27-d80c57e7e5b5');

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