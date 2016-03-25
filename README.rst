papercuts
=========

To get started::

    nvm use v5.5.0
    npm install
    npm start

To use on production, run::

    forever start bin/www

Configuration Variables
-----------------------

Other configuration variables can be found in `config/services.js <config/services.js>`_. The ``papercuts`` app should be entirely configurable using environment variables. In the following table, we provide a current list of what those are:

========================= ============================================
Variable                  Brief Description
------------------------- --------------------------------------------
``FIREBASE_SECRET``       Authorization secret for Firebase
``EXPRESSSESSION_SECRET`` Express-Session secret for encryption
``OAUTH2_SECRET``         OAuth2 client secret
``PAPERCUTS_SSL``         Set to ``"true"`` to enable SSL
``SSL_KEY``               The path to the SSL PEM key
``SSL_CERT``              The path to the SSL Host CERT
``NODE_ENV``              Set to ``"production"`` or ``"development"``
========================= ============================================
