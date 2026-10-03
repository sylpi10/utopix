-- Data: legal notice / privacy page, editable afterwards from /admin.
INSERT IGNORE INTO `Page` (`slug`, `order`, `updatedAt`)
VALUES ('mentions-legales', 100, CURRENT_TIMESTAMP(3));

INSERT IGNORE INTO `PageTranslation` (`pageId`, `locale`, `title`, `content`, `metaDescription`)
SELECT `id`, 'fr', 'Mentions légales', '<h3>Éditeur du site</h3>

<p>Le site utopix-lozere.fr est édité par [NOM DE L''ÉDITEUR — personne physique ou association],<br>[ADRESSE POSTALE], 48210 Sainte-Énimie, France.<br>Contact : via le <a href="/fr/contact">formulaire de contact</a>.</p>

<p>Directeur·rice de la publication : [NOM DU OU DE LA DIRECTEUR·RICE DE LA PUBLICATION].</p>

<h3>Hébergement</h3>

<p>o2switch, SAS au capital de 100 000 €, RCS Clermont-Ferrand 510 909 807,<br>222-224 boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.<br>Téléphone : 04 44 44 60 40 — <a href="https://www.o2switch.fr" target="_blank" rel="noopener">www.o2switch.fr</a></p>

<h3>Conception et réalisation</h3>

<p><a href="https://sylvainpillet.com" target="_blank" rel="noopener">Syl Pi</a></p>

<h3>Propriété intellectuelle</h3>

<p>L''ensemble des contenus de ce site (textes, photographies, œuvres reproduites, logo) est protégé par le droit d''auteur. Toute reproduction ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.</p>

<h3>Données personnelles</h3>

<p>Les informations saisies dans le formulaire de contact (nom, adresse email, message) sont uniquement utilisées pour répondre à votre demande. Elles sont transmises par email à l''éditeur du site, ne sont pas enregistrées dans une base de données et ne sont jamais cédées à des tiers.</p>

<p>Ce site utilise Google Analytics, un service de mesure d''audience fourni par Google, qui dépose des cookies afin d''établir des statistiques de fréquentation anonymes. Vous pouvez à tout moment refuser ces cookies en les bloquant dans les paramètres de votre navigateur.</p>

<p>Conformément au Règlement général sur la protection des données (RGPD) et à la loi « Informatique et Libertés », vous disposez d''un droit d''accès, de rectification et d''effacement des données vous concernant. Pour l''exercer, écrivez-nous via le <a href="/fr/contact">formulaire de contact</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>',
    'Mentions légales et politique de confidentialité du site Utopix.'
FROM `Page` WHERE `slug` = 'mentions-legales';

INSERT IGNORE INTO `PageTranslation` (`pageId`, `locale`, `title`, `content`, `metaDescription`)
SELECT `id`, 'en', 'Legal notice', '<h3>Publisher</h3>

<p>The website utopix-lozere.fr is published by [PUBLISHER NAME — individual or association],<br>[POSTAL ADDRESS], 48210 Sainte-Énimie, France.<br>Contact: through the <a href="/en/contact">contact form</a>.</p>

<p>Publication director: [PUBLICATION DIRECTOR NAME].</p>

<h3>Hosting</h3>

<p>o2switch, SAS with a share capital of €100,000, RCS Clermont-Ferrand 510 909 807,<br>222-224 boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.<br>Phone: +33 4 44 44 60 40 — <a href="https://www.o2switch.fr" target="_blank" rel="noopener">www.o2switch.fr</a></p>

<h3>Design and development</h3>

<p><a href="https://sylvainpillet.com" target="_blank" rel="noopener">Syl Pi</a></p>

<h3>Intellectual property</h3>

<p>All content on this website (texts, photographs, reproduced artworks, logo) is protected by copyright. Any full or partial reproduction or distribution without prior written permission is prohibited.</p>

<h3>Personal data</h3>

<p>The information entered in the contact form (name, email address, message) is only used to reply to your request. It is sent by email to the site publisher, is not stored in any database and is never shared with third parties.</p>

<p>This website uses Google Analytics, an audience measurement service provided by Google, which sets cookies to produce anonymous traffic statistics. You can refuse these cookies at any time by blocking them in your browser settings.</p>

<p>Under the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the right to access, rectify and erase your personal data. To exercise these rights, contact us through the <a href="/en/contact">contact form</a>. You may also lodge a complaint with the CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>',
    'Legal notice and privacy policy of the Utopix website.'
FROM `Page` WHERE `slug` = 'mentions-legales';
