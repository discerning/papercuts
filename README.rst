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
---------

The Certificates where obtained using this command::

    cern-get-certificate --autoenroll

and are stored under the paths printed to stdout. We copy the private key and cert files to the locations configured in the ``SSL_*`` config vars.

Schema
------

All of our schema is located in `public/js/schema/ <public/js/schema/>`_. Below, we describe some of the schema definitions in plaintext. Please refer to the specific documents if you are still confused.

If you wish to check that your JSON output conforms to our schema, try the online `JSON Schema Lint <http://jsonschemalint.com/draft4/#>`_ website which is a fantastic resource. Many thanks to the JSON Schema `Reference <http://spacetelescope.github.io/understanding-json-schema/>`_ which provided a lot of guidelines for defining our schema in a simple fashion.

Analysis Cutflow
~~~~~~~~~~~~~~~~

`See the schema definition for more information <public/js/schema/cutflow.json>`_. An analysis cutflow must be an array of keypairs of the form::

    {"cutflow_name": 123012.341}

For example, the following JSON is a valid cutflow::

    [
        {"duplicate_event": 200000},
        {"jet_multiplicity": 150000},
        {"bjet_multiplicity": 63000},
        {"dphimetmin_geq_0p4": 23000},
        {"lepton_veto": 1200}
    ]

Please remember that the order in the array will **always** be preserved. In particular, the cutflow name has a few requirements:

- starts with a non-numeric, non-underscore character
- at least one character
- at most 32 characters
- only alphanumeric and underscore characters are allowed

The value of the cutflow has a few requirements as well:

- must be numeric (a number inside a string does not count)
- must be non-negative (zero or greater-than-zero)

Lastly, there should not be two instances of the same cutflow inside the array. That means something like::

    [
        {"duplicate_event": 200000},
        {"jet_multiplicity": 150000},
        {"duplicate_event": 200000}
    ]

will be rejected.

Firebase Rules
==============

A `rules.yml <rules.yml>`_ is provided in the top-level which is meant to be compiled to ``json`` via `blaze <https://github.com/firebase/blaze_compiler>`_::

    blaze rules.yml

The rules enforce what we expect the structure of the database to look like at all times as well as strict access control. Note that in particular, the ``client_secret`` is something like::

    md5(FIREBASE_SECRET+$analysis)

which means that for the API to generate a token with the right authentication scheme, they must provide the correct secret. Note that by this method, the server has the ability to generate the correct secret for a user which provides access. This can be seen as a security flaw, but we are the server and all-powerful.
