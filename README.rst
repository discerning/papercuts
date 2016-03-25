papercuts
=========

To get started::

    nvm use v5.5.0
    npm install
    npm start

To use on production, run::

    git pull
    npm install
    forever stop papercuts
    forever start --uid "papercuts" bin/www

Note: sometimes if you change the environment variable, the ``forever`` process won't see it. The easiest thing to do is exit the computer, log back in (after updating the env. variables), and then start the process again. It should pick up the new variable.

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

SSL Setup
--------------

The Certificates where obtained using this command

    cern-get-certificate --autoenroll
    
and are stored under the paths printed to stdout. We copy the private key and cert files to the locations configured in the `SSL_*` config vars